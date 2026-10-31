<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';
import Select from 'primevue/select';
import AppButton from '@/components/common/AppButton.vue';
import { employeeService } from '@/services/modules/employee.service';
import { usePermissionStore } from '@/stores/permission.store';
import { listPeriods } from '@/modules/attendance-periods/period.service';
import { periodStatuses, type AttendancePeriod } from '@/modules/attendance-periods/period.types';
import { getApiErrorMessage } from '@/utils/error-message';
import AttendanceCalendar from './AttendanceCalendar.vue';
import AttendanceMonthGrid from './AttendanceMonthGrid.vue';
import {
  executeCalculation,
  exportMonthlyAttendance,
  getDailyAttendance,
  getMonthlyAttendance,
  prepareCalculation,
  validateFilter,
} from './monthly.service';
import {
  columns,
  displayDate,
  fullName,
  numberText,
  statisticLabels,
  cellMenuActions,
} from './monthly.utils';
import type {
  Calculation,
  CalculationResult,
  DayRow,
  Employee,
  Filter,
  MonthRow,
  PreparedCalculation,
} from './monthly.types';
import printStyles from './monthly.css?raw';
import './monthly.css';
const nowParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Bangkok',
  year: 'numeric',
  month: '2-digit',
}).formatToParts(new Date());
const draft = reactive<Filter>({
  thang: Number(nowParts.find((p) => p.type === 'month')!.value),
  nam: Number(nowParts.find((p) => p.type === 'year')!.value),
  maBoPhan: null,
  maNhanVien: null,
});
const applied = ref<Filter>({ ...draft });
const exporting = ref(false),
  exportError = ref('');
const tab = ref<'summary' | 'daily'>('summary');
const permission = usePermissionStore();
const canCalculate = computed(() => permission.can('attendance', 'update'));
const employees = ref<Employee[]>([]),
  catalogError = ref(''),
  catalogLoading = ref(false);
const departments = computed(() =>
  [
    ...new Map(
      employees.value
        .filter((e) => e.maBoPhan)
        .map((e) => [e.maBoPhan!, { code: e.maBoPhan!, label: e.tenBoPhan || e.maBoPhan! }]),
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label, 'vi')),
);
const employeeOptions = computed(() =>
  employees.value
    .filter((e) => !draft.maBoPhan || e.maBoPhan === draft.maBoPhan)
    .map((e) => ({ ...e, label: e.maNhanVien + ' · ' + fullName(e) })),
);
const chosenEmployee = computed(() =>
  employees.value.find((e) => e.maNhanVien === applied.value.maNhanVien),
);
const monthRows = ref<MonthRow[]>([]),
  dayRows = ref<DayRow[]>([]),
  loading = ref(false),
  error = ref(''),
  period = ref<AttendancePeriod | null>(null),
  periodError = ref('');
const summaryKey = ref(''),
  dailyKey = ref('');
const visibleRows = computed(() =>
  monthRows.value.filter(
    (e) => !applied.value.maNhanVien || e.maNhanVien === applied.value.maNhanVien,
  ),
);
const columnOptions = reactive(columns.map((c) => ({ ...c })));
const visibleColumns = computed(() => columnOptions.filter((c) => c.visible));
const title = computed(
  () => String(applied.value.thang).padStart(2, '0') + '/' + applied.value.nam,
);
const busy = ref(false),
  preparing = ref(false),
  notice = ref(''),
  staleMonths = ref(new Set<string>());
const monthKey = (filter: Filter) => filter.nam + '-' + filter.thang;
const monthNeedsCalculation = computed(() => staleMonths.value.has(monthKey(applied.value)));
const requiresVerification = ref(false);
const canUseCellActions = computed(
  () => canCalculate.value && !busy.value && !preparing.value && period.value?.trangThai === 'O',
);
const reportOpen = ref(false),
  reportLoading = ref(false),
  reportError = ref(''),
  reportRows = ref<DayRow[]>([]),
  reportEmployee = ref<Employee>(),
  reportFilter = ref<Filter>({ ...applied.value }),
  reportElement = ref<HTMLElement>();
const menu = ref<{ row: DayRow; x: number; y: number } | null>(null),
  menuElement = ref<HTMLElement>();
const sidebar = ref(false),
  sidebarDay = ref<DayRow>();
const calculationOpen = ref(false),
  plan = ref<PreparedCalculation>(),
  calculationError = ref(''),
  result = ref<CalculationResult>(),
  resultMessage = ref(''),
  acknowledged = ref(false);
let sequence = 0,
  periodSequence = 0,
  reportSequence = 0,
  disposed = false;
const frames = new Set<HTMLIFrameElement>();
const key = (f: Filter) => JSON.stringify(f);
async function loadCatalog() {
  catalogLoading.value = true;
  catalogError.value = '';
  try {
    const rows = await employeeService.list(null);
    if (!disposed)
      employees.value = rows.map((e) => ({
        maNhanVien: e.maNhanVien,
        ho: e.ho as string | null,
        tenDem: e.tenDem as string | null,
        ten: e.ten as string | null,
        hoTen: e.hoTen as string | null,
        maBoPhan: e.maBoPhan as string | null,
        tenBoPhan: e.tenBoPhan as string | null,
      }));
  } catch (e) {
    if (!disposed) catalogError.value = getApiErrorMessage(e);
  } finally {
    if (!disposed) catalogLoading.value = false;
  }
}
async function loadPeriod() {
  const seq = ++periodSequence;
  period.value = null;
  periodError.value = '';
  try {
    const rows = await listPeriods({
      nam: applied.value.nam,
      thang: applied.value.thang,
      trangThai: null,
    });
    if (seq !== periodSequence || disposed) return;
    if (rows.length === 1) period.value = rows[0];
    else
      periodError.value = rows.length
        ? 'Có nhiều kỳ cho tháng này.'
        : 'Chưa có kỳ chấm công cho tháng này.';
  } catch (e) {
    if (seq === periodSequence && !disposed) periodError.value = getApiErrorMessage(e);
  }
}
async function load(force = false) {
  const seq = ++sequence;
  const filter = { ...applied.value };
  const active = tab.value;
  const cacheKey = key(filter);
  error.value = '';
  if (!force && (active === 'summary' ? summaryKey.value : dailyKey.value) === cacheKey) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    if (active === 'summary') {
      const rows = await getMonthlyAttendance(filter);
      if (seq === sequence && !disposed) {
        monthRows.value = rows;
        summaryKey.value = cacheKey;
      }
    } else {
      const rows = await getDailyAttendance(filter);
      if (seq === sequence && !disposed) {
        dayRows.value = rows;
        dailyKey.value = cacheKey;
      }
    }
  } catch (e) {
    if (seq === sequence && !disposed) {
      error.value = getApiErrorMessage(e);
      if (active === 'summary') {
        monthRows.value = [];
        summaryKey.value = '';
      } else {
        dayRows.value = [];
        dailyKey.value = '';
      }
    }
  } finally {
    if (seq === sequence && !disposed) loading.value = false;
  }
}
function apply() {
  if (busy.value || preparing.value) return;
  try {
    validateFilter(draft);
    if (draft.maNhanVien && !employeeOptions.value.some((e) => e.maNhanVien === draft.maNhanVien))
      throw new Error('Nhân viên không thuộc bộ phận đã chọn.');
    applied.value = { ...draft };
    exportError.value = '';
    summaryKey.value = '';
    dailyKey.value = '';
    menu.value = null;
    reportOpen.value = false;
    sidebar.value = false;
    notice.value = '';
    void loadPeriod();
    void load(true);
  } catch (e) {
    error.value = getApiErrorMessage(e);
  }
}
async function exportExcel() {
  if (exporting.value || busy.value || preparing.value) return;
  exporting.value = true;
  exportError.value = '';
  try {
    const { blob, filename } = await exportMonthlyAttendance({ ...applied.value });
    if (disposed) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    try {
      link.click();
    } finally {
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  } catch (e) {
    if (!disposed) exportError.value = getApiErrorMessage(e);
  } finally {
    if (!disposed) exporting.value = false;
  }
}
watch(
  () => draft.maBoPhan,
  () => {
    if (draft.maNhanVien && !employeeOptions.value.some((e) => e.maNhanVien === draft.maNhanVien))
      draft.maNhanVien = null;
  },
);
watch(tab, () => {
  menu.value = null;
  sidebar.value = false;
  void load();
});
async function openReport(employee: Employee) {
  const seq = ++reportSequence;
  reportEmployee.value = employee;
  reportFilter.value = { ...applied.value, maNhanVien: employee.maNhanVien };
  reportOpen.value = true;
  reportLoading.value = true;
  reportError.value = '';
  reportRows.value = [];
  try {
    const rows = await getDailyAttendance({ ...reportFilter.value });
    if (seq === reportSequence && !disposed) reportRows.value = rows;
  } catch (e) {
    if (seq === reportSequence && !disposed) reportError.value = getApiErrorMessage(e);
  } finally {
    if (seq === reportSequence && !disposed) reportLoading.value = false;
  }
}
watch(reportOpen, (value) => {
  if (!value) ++reportSequence;
});
async function printReport() {
  if (!reportElement.value || reportLoading.value || reportError.value || !reportRows.value.length)
    return;
  const frame = document.createElement('iframe');
  frame.title = 'Bản in phiếu chấm công';
  frame.style.cssText = 'position:fixed;width:1px;height:1px;left:-10000px;top:0;border:0;';
  document.body.append(frame);
  frames.add(frame);
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    frame.remove();
    frames.delete(frame);
    return;
  }
  doc.open();
  doc.write(
    '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu chấm công tháng</title></head><body></body></html>',
  );
  doc.close();
  const style = doc.createElement('style');
  style.textContent = printStyles;
  doc.head.append(style);
  doc.body.append(doc.importNode(reportElement.value, true));
  const remove = () => {
    frame.remove();
    frames.delete(frame);
  };
  win.addEventListener('afterprint', remove, { once: true });
  try {
    await doc.fonts.ready;
    if (disposed) {
      remove();
      return;
    }
    win.focus();
    win.print();
  } catch (e) {
    notice.value = 'Không mở được hộp thoại in: ' + getApiErrorMessage(e);
    remove();
  }
  setTimeout(remove, 60000);
}
async function openMenu(row: DayRow, event: MouseEvent) {
  if (!cellMenuActions(row, canUseCellActions.value).length) return;
  const anchor =
    event.currentTarget instanceof HTMLElement ? event.currentTarget.getBoundingClientRect() : null;
  const x = event.type === 'click' && event.detail === 0 && anchor ? anchor.left : event.clientX;
  const y = event.type === 'click' && event.detail === 0 && anchor ? anchor.bottom : event.clientY;
  menu.value = {
    row,
    x: Math.max(10, Math.min(x, window.innerWidth - 270)),
    y: Math.max(10, Math.min(y, window.innerHeight - 270)),
  };
  await nextTick();
  menuElement.value?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
}
function showSidebar(row: DayRow) {
  sidebarDay.value = row;
  sidebar.value = true;
  menu.value = null;
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menu.value = null;
  if (menu.value && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const buttons = Array.from(
      menuElement.value?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || [],
    );
    if (!buttons.length) return;
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    buttons[
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? buttons.length - 1
          : (i + (event.key === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length
    ]?.focus();
  }
}
function dismiss() {
  menu.value = null;
}
async function openCalculation(kind: Calculation, day?: DayRow) {
  if (busy.value || preparing.value || !canCalculate.value) return;
  const employee = day
    ? employees.value.find((e) => e.maNhanVien === day.maNhanVien) || day
    : chosenEmployee.value;
  const context = { filter: { ...applied.value }, employee, day };
  menu.value = null;
  plan.value = undefined;
  result.value = undefined;
  requiresVerification.value = false;
  resultMessage.value = '';
  acknowledged.value = false;
  calculationError.value = '';
  calculationOpen.value = true;
  preparing.value = true;
  try {
    const prepared = await prepareCalculation(kind, context);
    if (!disposed) plan.value = prepared;
  } catch (e) {
    if (!disposed) calculationError.value = getApiErrorMessage(e);
  } finally {
    if (!disposed) preparing.value = false;
  }
}
async function calculate() {
  if (
    !plan.value ||
    requiresVerification.value ||
    busy.value ||
    !acknowledged.value ||
    result.value ||
    !canCalculate.value
  )
    return;
  const savedPlan = plan.value;
  busy.value = true;
  calculationError.value = '';
  try {
    const response = await executeCalculation(savedPlan);
    if (disposed) return;
    result.value = response.data;
    resultMessage.value = response.message;
    summaryKey.value = '';
    dailyKey.value = '';
    if (savedPlan.kind !== 'month') staleMonths.value.add(monthKey(savedPlan.context.filter));
    else if (!savedPlan.context.filter.maNhanVien && !savedPlan.context.filter.maBoPhan)
      staleMonths.value.delete(monthKey(savedPlan.context.filter));
    const skipped = Number(
      response.data.thongKe?.soDongBoQuaKhongCapNhat ??
        response.data.thongKe?.soNhanVienBoQuaDaKhoa ??
        0,
    );
    notice.value =
      skipped > 0
        ? 'Máy chủ trả kết quả có ' + skipped + ' dòng/nhân viên bị bỏ qua. Xem thống kê chi tiết.'
        : response.message;
    await Promise.allSettled([load(true), loadPeriod()]);
  } catch (e) {
    if (!disposed) {
      requiresVerification.value = true;
      calculationError.value =
        getApiErrorMessage(e) +
        ' Kết quả ghi có thể chưa xác định; hãy kiểm tra lại dữ liệu trước khi tính lại.';
    }
  } finally {
    if (!disposed) busy.value = false;
  }
}
async function verifyAfterFailure() {
  if (!plan.value || busy.value) return;
  busy.value = true;
  try {
    const context = plan.value.context;
    if (plan.value.kind === 'person')
      await getDailyAttendance({
        ...context.filter,
        maNhanVien: context.employee!.maNhanVien,
      });
    else await getMonthlyAttendance(context.filter);
    await load(true);
    requiresVerification.value = false;
    calculationError.value =
      'Đã tải lại dữ liệu. Kiểm tra kết quả trước khi quyết định gửi lại yêu cầu.';
  } catch (e) {
    calculationError.value = getApiErrorMessage(e);
  } finally {
    busy.value = false;
  }
}
onMounted(() => {
  void Promise.allSettled([loadCatalog(), loadPeriod(), load()]);
  document.addEventListener('click', dismiss);
  document.addEventListener('keydown', keydown);
  window.addEventListener('resize', dismiss);
  window.addEventListener('scroll', dismiss, true);
});
onBeforeUnmount(() => {
  disposed = true;
  ++sequence;
  ++reportSequence;
  ++periodSequence;
  document.removeEventListener('click', dismiss);
  document.removeEventListener('keydown', keydown);
  window.removeEventListener('resize', dismiss);
  window.removeEventListener('scroll', dismiss, true);
  frames.forEach((f) => f.remove());
});
</script>
<template>
  <section class="monthly-page" :aria-busy="busy">
    <header class="monthly-heading">
      <div>
        <h1>Bảng chấm công tháng</h1>
        <p>
          Tháng {{ title
          }}<template v-if="period">
            · {{ periodStatuses[period.trangThai] || period.trangThai }} ·
            {{ displayDate(period.tuNgay) }} – {{ displayDate(period.denNgay)
            }}<template v-if="period.ngayChot">
              · Chốt: {{ displayDate(period.ngayChot) }}</template
            ></template
          >
        </p>
      </div>
      <div class="monthly-actions">
        <AppButton
          label="Xuất Excel"
          icon="pi pi-file-excel"
          severity="success"
          outlined
          :loading="exporting"
          :disabled="exporting || busy || preparing"
          @click="exportExcel"
        />
        <AppButton
          label="Chấm công ngày hàng loạt"
          icon="pi pi-calendar"
          severity="secondary"
          outlined
          :disabled="!canCalculate || busy || preparing"
          @click="openCalculation('batch')"
        /><AppButton
          label="Chấm công tháng"
          icon="pi pi-calculator"
          :disabled="!canCalculate || busy || preparing"
          @click="openCalculation('month')"
        />
      </div>
    </header>
    <form class="monthly-filters" @submit.prevent="apply">
      <label
        >Tháng<select v-model.number="draft.thang" :disabled="busy || preparing">
          <option v-for="month in 12" :key="month" :value="month">Tháng {{ month }}</option>
        </select></label
      ><label
        >Năm<input
          v-model.number="draft.nam"
          type="number"
          min="100"
          max="9998"
          required
          :disabled="busy || preparing" /></label
      ><label
        >Bộ phận<select v-model="draft.maBoPhan" :disabled="busy || preparing || catalogLoading">
          <option :value="null">Tất cả bộ phận</option>
          <option v-for="dept in departments" :key="dept.code" :value="dept.code">
            {{ dept.label }}
          </option>
        </select></label
      ><label class="employee-filter"
        >Nhân viên<Select
          v-model="draft.maNhanVien"
          :options="employeeOptions"
          option-label="label"
          option-value="maNhanVien"
          filter
          show-clear
          placeholder="Tất cả / tìm mã hoặc họ tên"
          :disabled="busy || preparing || catalogLoading"
          :loading="catalogLoading"
          aria-label="Chọn nhân viên" /></label
      ><AppButton type="submit" label="Áp dụng" icon="pi pi-filter" :disabled="busy || preparing" />
    </form>
    <p v-if="exportError" class="monthly-error" role="alert">{{ exportError }}</p>
    <p v-if="catalogError" class="monthly-error" role="alert">
      Không tải được danh mục: {{ catalogError }}
      <button type="button" @click="loadCatalog">Thử lại</button>
    </p>
    <p v-if="periodError" class="monthly-notice">{{ periodError }}</p>
    <p v-if="notice" class="monthly-notice" role="status">{{ notice }}</p>
    <p v-if="monthNeedsCalculation" class="monthly-notice">
      Dữ liệu công ngày đã được xử lý. Cần chấm công tháng để cập nhật tổng hợp nếu backend không
      tổng hợp tự động.
    </p>
    <div class="monthly-sheet">
      <div class="monthly-tabs" role="tablist" aria-label="Bảng chấm công tháng">
        <button
          id="monthly-summary-tab"
          type="button"
          role="tab"
          :aria-selected="tab === 'summary'"
          aria-controls="monthly-summary-panel"
          @click="tab = 'summary'"
        >
          Tổng hợp công tháng</button
        ><button
          id="monthly-daily-tab"
          type="button"
          role="tab"
          :aria-selected="tab === 'daily'"
          aria-controls="monthly-daily-panel"
          @click="tab = 'daily'"
        >
          Chi tiết công tháng
        </button>
      </div>
      <div v-if="loading" class="monthly-loading" role="status">
        <span v-for="i in 4" :key="i" />
        <p>Đang tải dữ liệu công tháng…</p>
      </div>
      <div v-else-if="error" class="monthly-empty">
        <p class="monthly-error" role="alert">{{ error }}</p>
        <AppButton label="Thử lại" @click="load(true)" />
      </div>
      <section
        v-show="tab === 'summary' && !loading && !error"
        id="monthly-summary-panel"
        role="tabpanel"
        aria-labelledby="monthly-summary-tab"
      >
        <div class="monthly-toolbar">
          <div>
            <h2>Tổng hợp tháng {{ title }}</h2>
            <p class="monthly-subtitle">
              {{ visibleRows.length }} nhân viên · Nhấn họ tên để xem và in phiếu
            </p>
          </div>
          <details class="monthly-columns">
            <summary>Chọn cột hiển thị</summary>
            <div class="monthly-column-options">
              <label v-for="column in columnOptions" :key="column.key"
                ><input v-model="column.visible" type="checkbox" />{{ column.label }}</label
              >
            </div>
          </details>
        </div>
        <div
          class="monthly-table-scroll monthly-summary-scroll"
          role="region"
          aria-label="Bảng tổng hợp công tháng, cuộn ngang và dọc để xem đầy đủ"
          tabindex="0"
        >
          <table class="monthly-summary">
            <colgroup>
              <col class="summary-code-col" />
              <col class="summary-name-col" />
              <col class="summary-dept-col" />
              <col v-for="column in visibleColumns" :key="column.key" class="summary-data-col" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Mã nhân viên</th>
                <th scope="col">Họ và tên</th>
                <th scope="col">Bộ phận</th>
                <th v-for="column in visibleColumns" :key="column.key" scope="col">
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in visibleRows" :key="row.maNhanVien">
                <td>{{ row.maNhanVien }}</td>
                <td>
                  <button type="button" class="monthly-name" @click="openReport(row)">
                    {{ fullName(row) }}
                  </button>
                </td>
                <td>{{ row.tenBoPhan || row.maBoPhan || '—' }}</td>
                <td v-for="column in visibleColumns" :key="column.key">
                  {{ numberText(row[column.key], column.hours) }}
                </td>
              </tr>
              <tr v-if="!visibleRows.length">
                <td :colspan="visibleColumns.length + 3">
                  <div class="monthly-empty">Không có dữ liệu công tháng theo bộ lọc.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section
        v-show="tab === 'daily' && !loading && !error"
        id="monthly-daily-panel"
        role="tabpanel"
        aria-labelledby="monthly-daily-tab"
      >
        <div class="monthly-toolbar">
          <div>
            <h2>Chi tiết công tháng {{ title }}</h2>
            <p class="monthly-subtitle">
              Danh sách nhân viên · Các cột ngày 1–{{
                new Date(applied.nam, applied.thang, 0).getDate()
              }}
              · Ký hiệu công và nghỉ phép
            </p>
          </div>
        </div>
        <AttendanceMonthGrid
          :rows="dayRows"
          :employees="employees"
          :filter="applied"
          :allow-actions="canUseCellActions"
          @menu="openMenu"
          @detail="showSidebar"
        />
      </section>
    </div>
    <Teleport to="body"
      ><div
        v-if="menu && canUseCellActions"
        ref="menuElement"
        class="monthly-context-menu"
        role="menu"
        aria-label="Xử lý công ngày"
        :style="{ left: menu.x + 'px', top: menu.y + 'px' }"
        @click.stop
      >
        <p>{{ displayDate(menu.row.ngayChamCong) }} · {{ fullName(menu.row) }}</p>
        <button role="menuitem" type="button" @click="openCalculation('person', menu.row)">
          Tính lại công
        </button>
      </div></Teleport
    >
    <Dialog
      v-model:visible="reportOpen"
      modal
      header="Phiếu chấm công tháng"
      :style="{ width: '1080px', maxWidth: '96vw' }"
      ><div v-if="reportLoading" class="monthly-empty" role="status">Đang tải phiếu chấm công…</div>
      <p v-else-if="reportError" class="monthly-error" role="alert">
        {{ reportError }}
      </p>
      <div v-else ref="reportElement" class="monthly-report">
        <h2>
          PHIẾU CHẤM CÔNG THÁNG
          {{ String(reportFilter.thang).padStart(2, '0') }}/{{ reportFilter.nam }}
        </h2>
        <p>
          <strong>{{ fullName(reportEmployee) }}</strong> · {{ reportEmployee?.maNhanVien }} ·
          {{ reportEmployee?.tenBoPhan || reportEmployee?.maBoPhan || '—' }}
        </p>
        <p>
          Kỳ công: {{ displayDate(reportRows[0]?.tuNgay) }} –
          {{ displayDate(reportRows[0]?.denNgay) }}
        </p>
        <p v-if="!reportRows.length">Chưa có dữ liệu chấm công.</p>
        <AttendanceCalendar
          :rows="reportRows"
          :year="reportFilter.nam"
          :month="reportFilter.thang"
          readonly
        />
      </div>
      <template #footer
        ><AppButton
          label="Đóng"
          severity="secondary"
          outlined
          @click="reportOpen = false" /><AppButton
          label="In phiếu"
          icon="pi pi-print"
          :disabled="reportLoading || !!reportError || !reportRows.length"
          @click="printReport" /></template
    ></Dialog>
    <Dialog
      v-model:visible="calculationOpen"
      modal
      header="Xác nhận tính công"
      :closable="!busy && !preparing"
      :close-on-escape="!busy && !preparing"
      :style="{ width: '640px', maxWidth: '96vw' }"
      ><p v-if="preparing" role="status">Đang kiểm tra kỳ và phạm vi tính công…</p>
      <p v-if="calculationError" class="monthly-error" role="alert">
        {{ calculationError }}
      </p>
      <template v-if="plan"
        ><ul>
          <li v-for="line in plan.scope" :key="line">{{ line }}</li>
        </ul>
        <p v-if="!result" class="monthly-subtitle">
          Chỉ cập nhật phạm vi trên. Các dòng bị khóa có thể bị bỏ qua theo kết quả máy chủ.
        </p>
        <label v-if="!result"
          ><input v-model="acknowledged" type="checkbox" :disabled="busy" /> Tôi xác nhận phạm vi
          tính công.</label
        ></template
      >
      <section v-if="result" aria-live="polite">
        <h3>Kết quả máy chủ</h3>
        <p>{{ resultMessage }}</p>
        <p>Mã trả về: {{ result.returnCode ?? '—' }}</p>
        <dl class="monthly-stats">
          <div v-for="(value, field) in result.thongKe || {}" :key="field">
            <dt>{{ statisticLabels[String(field)] || field }}</dt>
            <dd>{{ value ?? '—' }}</dd>
          </div>
        </dl>
        <details v-if="result.resultSets?.length">
          <summary>Kết quả chi tiết</summary>
          <pre style="overflow: auto; max-height: 240px">{{
            JSON.stringify(result.resultSets, null, 2)
          }}</pre>
        </details>
      </section>
      <template #footer
        ><AppButton
          label="Đóng"
          severity="secondary"
          outlined
          :disabled="busy || preparing"
          @click="calculationOpen = false" /><AppButton
          v-if="requiresVerification"
          label="Kiểm tra lại dữ liệu"
          :loading="busy"
          @click="verifyAfterFailure" />
        <AppButton
          v-if="!result"
          label="Thực hiện tính công"
          icon="pi pi-calculator"
          :loading="busy"
          :disabled="
            requiresVerification || !plan || !acknowledged || preparing || busy || !canCalculate
          "
          @click="calculate" /></template
    ></Dialog>
    <Drawer
      v-model:visible="sidebar"
      position="right"
      header="Chi tiết công ngày"
      :style="{ width: '400px', maxWidth: '95vw' }"
      ><p v-if="sidebarDay">
        {{ fullName(sidebarDay) }} · {{ displayDate(sidebarDay.ngayChamCong) }}
      </p>
      <p class="monthly-notice">Nội dung chi tiết công ngày sẽ được phát triển sau.</p></Drawer
    >
  </section>
</template>
