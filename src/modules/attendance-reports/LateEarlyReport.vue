<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import ReportExportButtons from '@/components/common/ReportExportButtons.vue';
import ExcelReportSheet from './ExcelReportSheet.vue';
import {
  getLateEarlyReport,
  exportLateEarlyReport,
  normalizeLateEarlyFilter,
  type LateEarlyItem,
} from './late-early.service';
import { getLateEarlyColumns, lateEarlyRows } from './late-early.model';
import { numberLabel, type ReportRow } from './reports.model';
import {
  getScheduleDepartments,
  type ScheduleDepartment,
} from '@/services/modules/schedule-shift.service';
import { saveReportFile, type ReportExportFormat } from '@/services/api/report-download';
import { getApiErrorMessage } from '@/utils/error-message';

function currentPeriod() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());
  return (
    parts.find((p) => p.type === 'year')!.value + '-' + parts.find((p) => p.type === 'month')!.value
  );
}
const initialPeriod = currentPeriod();
const draft = reactive({ period: initialPeriod, department: '', name: '' });
const applied = ref({ ...draft });
const page = ref(1),
  pageSize = ref(20);
const metadata = reactive({ pageIndex: 1, pageSize: 20, totalRecords: 0, totalPages: 0 });
const items = ref<LateEarlyItem[]>([]);
const loading = ref(false),
  error = ref(''),
  filterError = ref('');
const departments = ref<ScheduleDepartment[]>([]),
  departmentsLoading = ref(false),
  departmentsError = ref('');
const exporting = ref<ReportExportFormat | null>(null),
  exportError = ref(''),
  feedback = ref('');
const selectedRowId = ref<string | null>(null);
const detailOpen = ref(false);
let sequence = 0,
  departmentSequence = 0,
  disposed = false;
function filterOf(value: typeof draft) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value.period))
    throw new Error('Vui lòng chọn tháng báo cáo hợp lệ.');
  const [nam, thang] = value.period.split('-').map(Number);
  return normalizeLateEarlyFilter({ thang, nam, ten: value.name, maBoPhan: value.department });
}
const filter = computed(() => filterOf(applied.value));
const periodLabel = computed(() => applied.value.period.split('-').reverse().join('/'));
const departmentLabel = computed(
  () =>
    departments.value.find((d) => d.code === applied.value.department)?.name ||
    applied.value.department ||
    'Tất cả bộ phận',
);
const rows = computed(() => lateEarlyRows(items.value, metadata.pageIndex, metadata.pageSize));
const columns = computed(() => getLateEarlyColumns());
const detail = computed(() => rows.value.find((row) => row.id === selectedRowId.value) || null);
const pages = computed(() => Math.max(1, metadata.totalPages));
const offset = computed(() => (metadata.pageIndex - 1) * metadata.pageSize);
const metrics = computed(() => [
  [
    'Tổng bản ghi',
    loading.value ? '—' : numberLabel(metadata.totalRecords),
    'pi-list',
    'Toàn bộ kết quả theo bộ lọc',
  ],
  [
    'Nhân viên / trang',
    loading.value ? '—' : String(new Set(items.value.map((item) => item.maNhanVien)).size),
    'pi-users',
    'Trong trang đang xem',
  ],
  [
    'Đi trễ (phút)',
    loading.value ? '—' : numberLabel(items.value.reduce((sum, row) => sum + row.diTre, 0)),
    'pi-sign-in',
    'Tổng trên trang đang xem',
  ],
  [
    'Về sớm (phút)',
    loading.value ? '—' : numberLabel(items.value.reduce((sum, row) => sum + row.veSom, 0)),
    'pi-sign-out',
    'Tổng trên trang đang xem',
  ],
]);
async function load() {
  const request = ++sequence;
  const requestedPage = page.value,
    size = pageSize.value,
    selected = { ...filter.value };
  loading.value = true;
  error.value = '';
  items.value = [];
  Object.assign(metadata, {
    pageIndex: requestedPage,
    pageSize: size,
    totalRecords: 0,
    totalPages: 0,
  });
  detailOpen.value = false;
  try {
    const result = await getLateEarlyReport(selected, requestedPage, size);
    if (request !== sequence || disposed) return;
    if (result.totalRecords > 0 && result.totalPages > 0 && requestedPage > result.totalPages) {
      page.value = result.totalPages;
      return;
    }
    items.value = result.items;
    Object.assign(metadata, {
      pageIndex: result.pageIndex,
      pageSize: result.pageSize,
      totalRecords: result.totalRecords,
      totalPages: result.totalPages,
    });
  } catch (e) {
    if (request === sequence && !disposed) error.value = getApiErrorMessage(e);
  } finally {
    if (request === sequence && !disposed) loading.value = false;
  }
}
async function loadDepartments() {
  const request = ++departmentSequence;
  departmentsLoading.value = true;
  departmentsError.value = '';
  try {
    const result = await getScheduleDepartments();
    if (request === departmentSequence && !disposed) departments.value = result;
  } catch (e) {
    if (request === departmentSequence && !disposed) departmentsError.value = getApiErrorMessage(e);
  } finally {
    if (request === departmentSequence && !disposed) departmentsLoading.value = false;
  }
}
function apply() {
  try {
    const normalized = filterOf(draft);
    applied.value = {
      period: draft.period,
      department: normalized.maBoPhan || '',
      name: normalized.ten || '',
    };
    page.value = 1;
    filterError.value = '';
    exportError.value = '';
    feedback.value = '';
  } catch (e) {
    filterError.value = getApiErrorMessage(e);
  }
}
function reset() {
  Object.assign(draft, { period: initialPeriod, department: '', name: '' });
  apply();
}
async function exportReport(format: ReportExportFormat) {
  if (exporting.value || loading.value || error.value || !metadata.totalRecords) return;
  const selected = { ...filter.value };
  exporting.value = format;
  exportError.value = '';
  feedback.value = '';
  try {
    const file = await exportLateEarlyReport(selected, format);
    if (disposed) return;
    saveReportFile(file);
    feedback.value = `Đã xuất ${format === 'pdf' ? 'PDF' : 'Excel'} theo bộ lọc tháng ${String(selected.thang).padStart(2, '0')}/${selected.nam}.`;
  } catch (e) {
    if (!disposed) exportError.value = getApiErrorMessage(e);
  } finally {
    if (!disposed) exporting.value = null;
  }
}
function openDetail(row: ReportRow) {
  selectedRowId.value = row.id;
  detailOpen.value = true;
}
watch(
  pageSize,
  () => {
    page.value = 1;
  },
  { flush: 'sync' },
);
watch([applied, page, pageSize], load, { immediate: true });
onMounted(loadDepartments);
onBeforeUnmount(() => {
  disposed = true;
  ++sequence;
  ++departmentSequence;
});
</script>
<template>
  <div class="late-early-report">
    <form class="report-filters report-live-filters" @submit.prevent="apply">
      <label
        ><span>Kỳ báo cáo <b>*</b></span
        ><input v-model="draft.period" type="month" min="1753-01" max="9998-12" required
      /></label>
      <label
        ><span>Bộ phận</span
        ><select v-model="draft.department" :disabled="departmentsLoading">
          <option value="">Tất cả bộ phận</option>
          <option v-for="department in departments" :key="department.code" :value="department.code">
            {{ department.name }} · {{ department.code }}
          </option>
        </select></label
      >
      <label
        ><span>Tên nhân viên</span
        ><input
          v-model="draft.name"
          type="search"
          maxlength="100"
          placeholder="Nhập tên nhân viên…"
          aria-label="Tên nhân viên báo cáo đi muộn về sớm"
      /></label>
      <div class="report-filter-actions">
        <AppButton type="submit" label="Xem báo cáo" icon="pi pi-filter" /><button
          class="report-reset"
          type="button"
          @click="reset"
        >
          <i class="pi pi-refresh" />Đặt lại
        </button>
      </div>
    </form>
    <p v-if="filterError" class="report-error" role="alert">{{ filterError }}</p>
    <p v-if="departmentsError" class="report-error" role="alert">
      Không tải được danh mục bộ phận: {{ departmentsError
      }}<AppButton
        type="button"
        label="Tải lại danh mục"
        text
        :loading="departmentsLoading"
        @click="loadDepartments"
      />
    </p>
    <div class="report-metrics">
      <article v-for="(metric, i) in metrics" :key="metric[0]" :class="'report-metric-' + i">
        <div>
          <span>{{ metric[0] }}</span
          ><strong>{{ metric[1] }}</strong
          ><small>{{ metric[3] }}</small>
        </div>
        <i :class="['pi', metric[2]]" />
      </article>
    </div>
    <section
      id="report-panel"
      class="report-panel"
      role="tabpanel"
      aria-labelledby="report-tab-late"
      :aria-busy="loading"
    >
      <div class="report-panel-heading">
        <div>
          <span class="report-sheet-label"><i class="pi pi-file-excel" /> BẢNG DỮ LIỆU</span>
          <h2>
            Đi muộn / Về sớm <span>/ {{ periodLabel }}</span>
          </h2>
          <p>
            {{ departmentLabel }}<span>·</span>{{ applied.name || 'Tất cả tên nhân viên'
            }}<span>·</span>{{ metadata.totalRecords }} bản ghi
          </p>
        </div>
        <ReportExportButtons
          :formats="['excel', 'pdf']"
          :busy="exporting"
          :disabled="loading || !!error || !metadata.totalRecords"
          @export="exportReport"
        />
      </div>
      <p v-if="feedback" class="report-feedback" role="status">
        <i class="pi pi-check-circle" /> {{ feedback }}
      </p>
      <p v-if="exportError" class="report-error" role="alert">{{ exportError }}</p>
      <p v-if="loading" class="report-loading" role="status">
        <i class="pi pi-spin pi-spinner" /> Đang tải báo cáo đi muộn / về sớm...
      </p>
      <p v-else-if="error" class="report-error" role="alert">
        {{ error }}<AppButton type="button" label="Tải lại báo cáo" text @click="load" />
      </p>
      <ExcelReportSheet
        v-else
        :columns="columns"
        :rows="rows"
        :all-rows="rows"
        :offset="offset"
        sort-key=""
        :sort-direction="1"
        :sortable="false"
        total-label="TỔNG TRANG"
        :record-count="metadata.totalRecords"
        @open="openDetail"
      />
      <div class="report-pagination">
        <span
          >Hiển thị
          <strong
            >{{ rows.length ? offset + 1 : 0 }}–{{ rows.length ? offset + rows.length : 0 }}</strong
          >
          / {{ metadata.totalRecords }} bản ghi</span
        >
        <div>
          <label
            >Số dòng<select v-model.number="pageSize" :disabled="loading">
              <option v-for="size in [10, 20, 50, 100]" :key="size" :value="size">
                {{ size }}
              </option>
            </select></label
          ><button
            type="button"
            aria-label="Trang trước"
            :disabled="loading || page <= 1"
            @click="page--"
          >
            <i class="pi pi-chevron-left" /></button
          ><span class="report-page-current">{{ metadata.pageIndex }}</span
          ><span>/ {{ pages }}</span
          ><button
            type="button"
            aria-label="Trang sau"
            :disabled="loading || page >= pages"
            @click="page++"
          >
            <i class="pi pi-chevron-right" />
          </button>
        </div>
      </div>
      <div class="report-sheet-footer">
        <span>Tổng phút tính trên trang đang xem.</span
        ><span>Excel/PDF xuất toàn bộ kết quả theo bộ lọc đã áp dụng.</span>
      </div>
    </section>
    <Dialog
      v-model:visible="detailOpen"
      modal
      header="Chi tiết đi muộn / về sớm"
      :style="{ width: '780px', maxWidth: '95vw' }"
      ><div v-if="detail" class="report-detail">
        <h3>{{ detail.code }} · {{ detail.name }}</h3>
        <dl class="report-detail-values">
          <div v-for="column in columns" :key="column.key">
            <dt>{{ column.label }}</dt>
            <dd>{{ detail[column.key] }}</dd>
          </div>
        </dl>
      </div>
      <template #footer
        ><AppButton
          label="Đóng"
          severity="secondary"
          outlined
          @click="detailOpen = false" /></template
    ></Dialog>
  </div>
</template>
