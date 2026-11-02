<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import ExcelReportSheet from './ExcelReportSheet.vue';
import LateEarlyReport from './LateEarlyReport.vue';
import ReportExportButtons from '@/components/common/ReportExportButtons.vue';
import {
  buildReport,
  monthDays,
  numberLabel,
  reportDepartments,
  reportTabs,
  type ReportKey,
  type ReportRow,
} from './reports.model';
import './reports.css';
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Bangkok',
  year: 'numeric',
  month: '2-digit',
}).formatToParts(new Date());
const initialPeriod =
  today.find((p) => p.type === 'year')!.value + '-' + today.find((p) => p.type === 'month')!.value;
const draft = reactive({ period: initialPeriod, department: '' });
const applied = ref({ ...draft });
const active = ref<ReportKey>('monthly');
const search = ref('');
const criterion = ref('');
const page = ref(1);
const pageSize = ref(20);
const sort = ref({ key: '', direction: 1 });
const detail = ref<ReportRow | null>(null);
const detailOpen = ref(false);
const filterError = ref('');
const feedback = ref('');
const report = computed(() => buildReport(active.value, applied.value.period));
const activeTab = computed(() => reportTabs.find((t) => t.key === active.value)!);
const periodLabel = computed(() => applied.value.period.split('-').reverse().join('/'));
const options = computed(
  () =>
    ({
      monthly: [{ value: 'issues', label: 'Có bất thường' }],
      late: [
        { value: 'late', label: 'Đi muộn' },
        { value: 'early', label: 'Về sớm' },
      ],
      overtime: [
        { value: 'pendingOt', label: 'Có giờ chờ duyệt' },
        { value: 'approved', label: 'Đã duyệt toàn bộ' },
      ],
      anomaly: [
        { value: 'Chờ xử lý', label: 'Chờ xử lý' },
        { value: 'Đã giải trình', label: 'Đã giải trình' },
      ],
      payroll: [
        { value: 'Cần đối soát', label: 'Cần đối soát' },
        { value: 'Đã đối soát', label: 'Đã đối soát' },
      ],
    })[active.value],
);
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLocaleLowerCase('vi');
const filtered = computed(() =>
  report.value.rows.filter((r) => {
    if (applied.value.department && r.department !== applied.value.department) return false;
    if (search.value && !normalize(r.name + ' ' + r.code).includes(normalize(search.value.trim())))
      return false;
    if (!criterion.value) return true;
    if (['issues', 'late', 'early', 'pendingOt'].includes(criterion.value))
      return Number(r[criterion.value]) > 0;
    if (criterion.value === 'approved') return r.pendingOt === 0;
    return r.status === criterion.value;
  }),
);
const sorted = computed(() =>
  [...filtered.value].sort((a, b) => {
    if (!sort.value.key) return 0;
    const x = a[sort.value.key],
      y = b[sort.value.key];
    return (
      (typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x).localeCompare(String(y), 'vi')) * sort.value.direction
    );
  }),
);
const pages = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize.value)));
const offset = computed(() => (page.value - 1) * pageSize.value);
const visibleRows = computed(() => sorted.value.slice(offset.value, offset.value + pageSize.value));
const metrics = computed(() => {
  const rows = filtered.value;
  const total = (key: string) => numberLabel(rows.reduce((s, r) => s + Number(r[key] || 0), 0));
  const employees = new Set(rows.map((r) => r.code)).size;
  const sets = {
    monthly: [
      ['Nhân viên', String(employees), 'pi-users', 'Theo phạm vi báo cáo'],
      ['Công thực tế', total('work'), 'pi-calendar-plus', 'Ngày công đã xác minh'],
      ['Giờ tăng ca', total('ot'), 'pi-moon', 'Tổng OT trong tháng'],
      ['Bất thường', total('issues'), 'pi-exclamation-triangle', 'Dòng cần kiểm tra'],
    ],
    late: [
      ['Lượt vi phạm', String(rows.length), 'pi-clock', `${employees} nhân viên có phát sinh`],
      ['Đi muộn', total('late'), 'pi-sign-in', 'Tổng số phút'],
      ['Về sớm', total('early'), 'pi-sign-out', 'Tổng số phút'],
      [
        'Bình quân / lượt',
        rows.length
          ? numberLabel(
              rows.reduce((s, r) => s + Number(r.late) + Number(r.early), 0) / rows.length,
            )
          : '0',
        'pi-chart-bar',
        'Phút chênh lệch',
      ],
    ],
    overtime: [
      ['Nhân viên có OT', String(employees), 'pi-users', 'Có phát sinh trong tháng'],
      ['Tổng giờ tăng ca', total('ot'), 'pi-moon', 'Ngày thường + ngày nghỉ'],
      ['Đã phê duyệt', total('approvedOt'), 'pi-check-circle', 'Giờ OT đã duyệt'],
      ['Chờ phê duyệt', total('pendingOt'), 'pi-hourglass', 'Giờ OT cần xác nhận'],
    ],
    anomaly: [
      [
        'Bản ghi bất thường',
        String(rows.length),
        'pi-exclamation-triangle',
        `${employees} nhân viên liên quan`,
      ],
      [
        'Thiếu giờ vào',
        String(rows.filter((r) => r.anomaly === 'Thiếu giờ vào').length),
        'pi-sign-in',
        'Chưa có log vào',
      ],
      [
        'Thiếu giờ ra',
        String(rows.filter((r) => r.anomaly === 'Thiếu giờ ra').length),
        'pi-sign-out',
        'Chưa có log ra',
      ],
      [
        'Chờ xử lý',
        String(rows.filter((r) => r.status === 'Chờ xử lý').length),
        'pi-hourglass',
        'Cần bổ sung / giải trình',
      ],
    ],
    payroll: [
      ['Công hưởng lương', total('paid'), 'pi-wallet', 'Công thực tế + phép có lương'],
      ['Phép đã sử dụng', total('usedLeave'), 'pi-calendar-minus', 'Ngày phép trong kỳ'],
      ['Quỹ phép còn lại', total('closingLeave'), 'pi-calendar', 'Tổng ngày phép cuối kỳ'],
      [
        'Cần đối soát',
        String(rows.filter((r) => r.status === 'Cần đối soát').length),
        'pi-exclamation-circle',
        'Nhân viên còn log bất thường',
      ],
    ],
  };
  return sets[active.value];
});
const detailRecords = computed(() =>
  report.value.records.filter(
    (r) =>
      r.code === detail.value?.code &&
      (!detail.value?.date || r.date.split('-').reverse().join('/') === detail.value.date),
  ),
);
const detailFields = computed(() =>
  report.value.columns.filter(
    (c) => !['code', 'name', 'department'].includes(c.key) && !/^d\d+$/.test(c.key),
  ),
);
function apply() {
  if (!monthDays(draft.period).length) {
    filterError.value = 'Vui lòng chọn tháng từ năm 2000 đến 2100.';
    return;
  }
  applied.value = { ...draft };
  filterError.value = '';
  feedback.value = '';
}
function reset() {
  Object.assign(draft, { period: initialPeriod, department: '' });
  search.value = '';
  criterion.value = '';
  sort.value = { key: '', direction: 1 };
  apply();
}
function sortBy(key: string) {
  sort.value = { key, direction: sort.value.key === key ? -sort.value.direction : 1 };
}
function openDetail(row: ReportRow) {
  detail.value = row;
  detailOpen.value = true;
}
function tabKey(event: KeyboardEvent, index: number) {
  const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
  if (!direction && event.key !== 'Home' && event.key !== 'End') return;
  event.preventDefault();
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? reportTabs.length - 1
        : (index + direction + reportTabs.length) % reportTabs.length;
  active.value = reportTabs[next].key;
  document.getElementById(`report-tab-${active.value}`)?.focus();
}
function download() {
  const escape = (value: string | number) => {
    let text = String(value ?? '');
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const cols = report.value.columns;
  const csv =
    '\ufeff' +
    [cols.map((c) => c.label), ...sorted.value.map((r) => cols.map((c) => r[c.key]))]
      .map((r) => r.map(escape).join(','))
      .join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `BaoCao_${active.value}_${applied.value.period}_mau.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  feedback.value = `Đã xuất ${sorted.value.length} bản ghi minh họa ra CSV.`;
}
watch([active, applied, search, criterion, pageSize], () => {
  page.value = 1;
  detailOpen.value = false;
});
watch(active, () => {
  criterion.value = '';
  sort.value = { key: '', direction: 1 };
  feedback.value = '';
});
watch(pages, (value) => {
  if (page.value > value) page.value = value;
});
</script>
<template>
  <section class="attendance-reports">
    <header class="reports-heading">
      <div>
        <div class="reports-eyebrow"><span /> ATTENDANCE REPORTS</div>
        <h1>Báo cáo chấm công</h1>
        <p>Theo dõi ngày công, kiểm soát biến động và đối soát dữ liệu tính lương.</p>
      </div>
      <span v-if="active !== 'late'" class="reports-prototype"
        ><i class="pi pi-sparkles" /> Prototype · Dữ liệu minh họa</span
      >
    </header>
    <div class="report-tabs" role="tablist" aria-label="Loại báo cáo chấm công">
      <button
        v-for="(item, i) in reportTabs"
        :id="`report-tab-${item.key}`"
        :key="item.key"
        type="button"
        role="tab"
        :tabindex="active === item.key ? 0 : -1"
        :aria-selected="active === item.key"
        aria-controls="report-panel"
        :class="{ active: active === item.key }"
        @click="active = item.key"
        @keydown="tabKey($event, i)"
      >
        <span class="report-tab-icon"><i :class="['pi', item.icon]" /></span
        ><span
          ><strong>{{ item.title }}</strong
          ><small>{{ item.subtitle }}</small></span
        ><span class="report-tab-number">0{{ i + 1 }}</span>
      </button>
    </div>
    <LateEarlyReport v-if="active === 'late'" />
    <template v-else>
      <form class="report-filters" @submit.prevent="apply">
        <label
          ><span>Kỳ báo cáo <b>*</b></span
          ><input v-model="draft.period" type="month" min="2000-01" max="2100-12" required
        /></label>
        <label
          ><span>Bộ phận</span
          ><select v-model="draft.department">
            <option value="">Tất cả bộ phận</option>
            <option v-for="department in reportDepartments" :key="department">
              {{ department }}
            </option>
          </select></label
        >
        <div class="report-filter-actions">
          <AppButton type="submit" label="Xem báo cáo" icon="pi pi-filter" /><button
            class="report-reset"
            type="button"
            title="Đặt lại bộ lọc"
            @click="reset"
          >
            <i class="pi pi-refresh" /><span>Đặt lại</span>
          </button>
        </div>
        <div class="report-period-note">
          <i class="pi pi-calendar" /><span
            >Kỳ đang xem<strong>Tháng {{ periodLabel }}</strong></span
          >
        </div>
      </form>
      <p v-if="filterError" class="report-error" role="alert">{{ filterError }}</p>
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
        :aria-labelledby="`report-tab-${active}`"
      >
        <div class="report-panel-heading">
          <div>
            <span class="report-sheet-label"><i class="pi pi-file-excel" /> BẢNG DỮ LIỆU</span>
            <h2>
              {{ activeTab.title }} <span>/ {{ periodLabel }}</span>
            </h2>
            <p>
              {{ applied.department || 'Tất cả bộ phận' }}<span>·</span
              >{{ new Set(filtered.map((r) => r.code)).size }} nhân viên<span>·</span
              >{{ filtered.length }} bản ghi
            </p>
          </div>
          <div class="report-heading-exports">
            <ReportExportButtons />
            <AppButton
              label="Xuất CSV mẫu"
              icon="pi pi-download"
              severity="secondary"
              outlined
              :disabled="!filtered.length"
              @click="download"
            />
          </div>
        </div>
        <div class="report-table-tools">
          <label class="report-search"
            ><i class="pi pi-search" /><input
              v-model="search"
              type="search"
              placeholder="Tìm mã hoặc tên nhân viên…"
              aria-label="Tìm nhân viên" /></label
          ><select v-model="criterion" aria-label="Lọc trạng thái báo cáo">
            <option value="">Tất cả trạng thái</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option></select
          ><span class="report-freeze-note"><i class="pi pi-lock" /> Cố định 2 cột nhân viên</span>
        </div>
        <p v-if="feedback" class="report-feedback" role="status">
          <i class="pi pi-check-circle" /> {{ feedback }}
        </p>
        <ExcelReportSheet
          :columns="report.columns"
          :rows="visibleRows"
          :all-rows="filtered"
          :offset="offset"
          :sort-key="sort.key"
          :sort-direction="sort.direction"
          @sort="sortBy"
          @open="openDetail"
        />
        <div class="report-pagination">
          <span
            >Hiển thị
            <strong
              >{{ filtered.length ? offset + 1 : 0 }}–{{
                Math.min(offset + pageSize, filtered.length)
              }}</strong
            >
            / {{ filtered.length }} bản ghi</span
          >
          <div>
            <label
              >Số dòng
              <select v-model.number="pageSize">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select></label
            ><button type="button" aria-label="Trang trước" :disabled="page === 1" @click="page--">
              <i class="pi pi-chevron-left" /></button
            ><span class="report-page-current">{{ page }}</span
            ><span>/ {{ pages }}</span
            ><button type="button" aria-label="Trang sau" :disabled="page >= pages" @click="page++">
              <i class="pi pi-chevron-right" />
            </button>
          </div>
        </div>
        <div class="report-sheet-footer">
          <span><i class="pi pi-check-circle" /> {{ activeTab.subtitle }}</span
          ><span>Σ Tổng cộng tính trên toàn bộ kết quả đã lọc</span>
        </div>
      </section>
      <div v-if="active === 'monthly'" class="report-legend">
        <strong>Ký hiệu công</strong
        ><span
          v-for="[symbol, label, tone] in [
            ['X', 'Đủ công', 'work'],
            ['M', 'Đi muộn', 'warn'],
            ['S', 'Về sớm', 'warn'],
            ['P', 'Phép năm', 'leave'],
            ['OFF', 'Ngày nghỉ', 'off'],
            ['V', 'Vắng không lương', 'danger'],
            ['?', 'Thiếu / lỗi log', 'danger'],
          ]"
          :key="symbol"
          ><b :class="'cell-' + tone">{{ symbol }}</b
          >{{ label }}</span
        >
      </div>
      <p v-if="active === 'overtime'" class="report-explanation">
        <i class="pi pi-info-circle" /> OT đêm là phần nằm trong tổng OT; không cộng thêm lần nữa.
      </p>
      <p v-if="active === 'payroll'" class="report-explanation">
        <i class="pi pi-info-circle" /> Mô phỏng: công hưởng lương = công thực tế + phép có lương.
        Phép còn lại = đầu kỳ + phát sinh − đã dùng. Công chưa xác minh được tách riêng để đối soát.
      </p>
      <p class="report-demo-note">
        Dữ liệu mẫu phục vụ duyệt giao diện · Chưa kết nối API báo cáo.
      </p>
      <Dialog
        v-model:visible="detailOpen"
        modal
        header="Chi tiết chấm công"
        :style="{ width: '780px', maxWidth: '95vw' }"
      >
        <div v-if="detail" class="report-detail">
          <div class="report-detail-person">
            <span>{{ detail.name.split(' ').at(-1)?.slice(0, 1) }}</span>
            <div>
              <h3>{{ detail.name }}</h3>
              <p>{{ detail.code }} · {{ detail.department }}</p>
            </div>
            <b>{{ periodLabel }}</b>
          </div>
          <dl class="report-detail-values">
            <div v-for="field in detailFields" :key="field.key">
              <dt>{{ field.label }}</dt>
              <dd>{{ detail[field.key] }}</dd>
            </div>
          </dl>
          <p class="report-detail-caption">
            Dữ liệu quẹt thẻ minh họa · {{ detailRecords.length }} ngày
          </p>
          <div class="report-detail-scroll">
            <table class="report-detail-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Ca</th>
                  <th>Giờ vào</th>
                  <th>Giờ ra</th>
                  <th>Ký hiệu</th>
                  <th>OT (giờ)</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="day in detailRecords" :key="day.date">
                  <td>{{ day.date.split('-').reverse().join('/') }}</td>
                  <td>{{ day.shift }}</td>
                  <td>{{ day.checkIn }}</td>
                  <td>{{ day.checkOut }}</td>
                  <td>{{ day.symbol }}</td>
                  <td>{{ numberLabel(day.ot) }}</td>
                  <td>{{ day.anomaly || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <template #footer
          ><AppButton label="Đóng" severity="secondary" outlined @click="detailOpen = false"
        /></template>
      </Dialog>
    </template>
  </section>
</template>
