<script setup lang="ts">
import { getApiErrorMessage } from '@/utils/error-message';
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import Select from 'primevue/select';
import AppButton from '@/components/common/AppButton.vue';
import { currentAdministrativePeriod } from '@/services/modules/schedule-administrative.service';
import {
  getMonthlyScheduleReport,
  type MonthlyScheduleReport,
} from '@/services/modules/schedule-report.service';
const current = currentAdministrativePeriod();
const month = ref(current.month),
  year = ref(current.year);
const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: 'Tháng ' + (i + 1) }));
const years = Array.from({ length: 101 }, (_, i) => ({ value: 2000 + i, label: String(2000 + i) }));
const report = ref<MonthlyScheduleReport>();
const loading = ref(false),
  error = ref('');
const hoveredDay = ref<number | null>(null);
const printable = ref<HTMLElement>();
const collapsedDepartments = ref(new Set<string>());
let sequence = 0;
async function load() {
  const request = ++sequence;
  loading.value = true;
  error.value = '';
  report.value = undefined;
  collapsedDepartments.value = new Set();
  try {
    const result = await getMonthlyScheduleReport(year.value, month.value);
    if (request === sequence) report.value = result;
  } catch (e) {
    if (request === sequence) error.value = getApiErrorMessage(e);
  } finally {
    if (request === sequence) loading.value = false;
  }
}
watch([month, year], load, { immediate: true });
onBeforeUnmount(() => ++sequence);
const rows = computed(() =>
  (report.value?.nhanVien || []).map((employee) => ({
    ...employee,
    days: new Map((employee.cacNgay || []).map((day) => [day.ngayTrongThang, day.giaTri])),
  })),
);
const departmentGroups = computed(() => {
  const groups = new Map<string, { key: string; label: string; employees: typeof rows.value }>();
  for (const employee of rows.value) {
    const code = employee.maBoPhan?.trim();
    const name = employee.boPhan?.trim();
    const key = code ? `code:${code}` : name ? `name:${name}` : 'unassigned';
    let group = groups.get(key);
    if (!group) {
      group = { key, label: name || code || 'Chưa có bộ phận', employees: [] };
      groups.set(key, group);
    }
    group.employees.push(employee);
  }
  return [...groups.values()];
});
function toggleDepartment(key: string) {
  const next = new Set(collapsedDepartments.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  collapsedDepartments.value = next;
  hoveredDay.value = null;
}
function expandAll() {
  collapsedDepartments.value = new Set();
}
function collapseAll() {
  collapsedDepartments.value = new Set(departmentGroups.value.map((group) => group.key));
  hoveredDay.value = null;
}
const totals = [
  { key: 'al', label: 'AL' },
  { key: 'do', label: 'DO' },
  { key: 'ph', label: 'PH' },
  { key: 'cl', label: 'CL' },
  { key: 'ul', label: 'UL' },
  { key: 'soNgayCongThucTe', label: 'Số ngày công thực tế' },
  { key: 'soNgayCongTieuChuan', label: 'Số ngày công tiêu chuẩn' },
  { key: 'soNgayPhep', label: 'Số ngày phép' },
  { key: 'soNgayCongHuongLuong', label: 'Số ngày công hưởng lương' },
] as const;
function weekend(day: number) {
  return [0, 6].includes(new Date(report.value!.nam, report.value!.thang - 1, day).getDay());
}
function printReport() {
  if (!printable.value || !report.value || loading.value) return;
  const frame = document.createElement('iframe');
  frame.title = 'In báo cáo ca làm việc';
  frame.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;';
  frame.onload = () => {
    const win = frame.contentWindow;
    if (!win) {
      frame.remove();
      return;
    }
    win.addEventListener('afterprint', () => frame.remove(), { once: true });
    win.focus();
    win.print();
    setTimeout(() => frame.remove(), 60000);
  };
  frame.srcdoc =
    '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo cáo ca làm việc</title><style>@page{size:A3 landscape;margin:10mm}body{font-family:Arial,sans-serif;color:#111}h2{font-size:16px}p{font-size:10px}col{width:auto!important}table{width:100%;border-collapse:collapse;table-layout:auto;font-size:7px}th,td{border:1px solid #777;padding:4px 2px;text-align:center}th{background:#eee}thead{display:table-header-group}tr{break-inside:avoid}.name,.department,.position{text-align:left}small{display:block}.employee-name{min-width:90px}.department-heading th{background:#e2efda;text-align:left}.department-toggle{border:0;background:transparent;font:inherit;color:inherit;text-align:left}.outline-icon{display:none}.department-count{margin-left:8px;font-weight:normal}.employee-row{display:table-row!important}</style></head><body>' +
    printable.value.innerHTML +
    '</body></html>';
  document.body.appendChild(frame);
}
</script>
<template>
  <section class="monthly-report">
    <div class="report-toolbar">
      <div>
        <h2>Báo cáo ca làm việc tháng</h2>
        <p>Chọn tháng và năm để xem lịch và tổng công.</p>
      </div>
      <div class="report-controls">
        <label
          >Tháng<Select v-model="month" :options="months" option-label="label" option-value="value"
        /></label>
        <label
          >Năm<Select
            v-model="year"
            :options="years"
            option-label="label"
            option-value="value"
            filter
        /></label>
        <AppButton
          label="In báo cáo"
          icon="pi pi-print"
          outlined
          :disabled="loading || !report || !rows.length"
          @click="printReport"
        />
      </div>
    </div>
    <div v-if="loading" class="report-status" role="status">
      <i class="pi pi-spin pi-spinner" /> Đang tải báo cáo tháng {{ month }}/{{ year }}...
    </div>
    <div v-else-if="error" class="report-status error" role="alert">
      {{ error }} <AppButton label="Thử lại" text @click="load" />
    </div>
    <template v-else-if="report">
      <div class="report-summary">
        <span>
          Tháng {{ report.thang }}/{{ report.nam }} · {{ report.soNgayTrongThang }} ngày ·
          {{ rows.length }} nhân viên · {{ departmentGroups.length }} bộ phận
        </span>
        <div v-if="rows.length" class="outline-controls" aria-label="Hiển thị nhóm bộ phận">
          <button type="button" :disabled="!collapsedDepartments.size" @click="expandAll">
            <i class="pi pi-plus" aria-hidden="true" /> Mở tất cả
          </button>
          <button
            type="button"
            :disabled="collapsedDepartments.size === departmentGroups.length"
            @click="collapseAll"
          >
            <i class="pi pi-minus" aria-hidden="true" /> Thu gọn tất cả
          </button>
        </div>
      </div>
      <div class="sheet-scroll" @mouseleave="hoveredDay = null">
        <div ref="printable">
          <div class="print-heading">
            <h2>Báo cáo ca làm việc tháng {{ report.thang }}/{{ report.nam }}</h2>
            <p>{{ rows.length }} nhân viên</p>
          </div>
          <table class="schedule-sheet">
            <colgroup>
              <col style="width: 44px" />
              <col style="width: 90px" />
              <col style="width: 180px" />
              <col style="width: 140px" />
              <col style="width: 140px" />
              <col v-for="day in report.cotNgay" :key="day.ngayTrongThang" style="width: 44px" />
              <col
                v-for="total in totals"
                :key="total.key"
                :style="{ width: total.key.startsWith('soNgay') ? '110px' : '56px' }"
              />
            </colgroup>
            <thead>
              <tr>
                <th class="frozen ordinal">TT</th>
                <th class="frozen employee-code">Mã NV</th>
                <th class="frozen employee-name">Họ và tên</th>
                <th>Bộ phận</th>
                <th>Chức vụ</th>
                <th
                  v-for="day in report.cotNgay"
                  :key="day.ngayTrongThang"
                  :title="day.ngay"
                  :class="{
                    weekend: weekend(day.ngayTrongThang),
                    highlight: hoveredDay === day.ngayTrongThang,
                  }"
                >
                  {{ String(day.ngayTrongThang).padStart(2, '0') }}
                </th>
                <th v-for="total in totals" :key="total.key" class="total">{{ total.label }}</th>
              </tr>
            </thead>
            <tbody v-for="group in departmentGroups" :key="group.key">
              <tr class="department-heading">
                <th colspan="3" scope="rowgroup" class="frozen department-label">
                  <button
                    type="button"
                    class="department-toggle"
                    :aria-expanded="!collapsedDepartments.has(group.key)"
                    :aria-label="`${collapsedDepartments.has(group.key) ? 'Mở' : 'Thu gọn'} bộ phận ${group.label}`"
                    @click="toggleDepartment(group.key)"
                  >
                    <span class="outline-icon" aria-hidden="true">{{
                      collapsedDepartments.has(group.key) ? '+' : '−'
                    }}</span>
                    <span class="department-title">{{ group.label }}</span>
                    <span class="department-count">{{ group.employees.length }} NV</span>
                  </button>
                </th>
                <th :colspan="2 + report.cotNgay.length + totals.length" class="department-fill" />
              </tr>
              <tr
                v-for="employee in group.employees"
                v-show="!collapsedDepartments.has(group.key)"
                :key="employee.maNhanVien"
                class="employee-row"
              >
                <td class="frozen ordinal">{{ employee.tt }}</td>
                <td class="frozen employee-code">{{ employee.maNhanVien }}</td>
                <td class="frozen employee-name name">{{ employee.hoVaTen }}</td>
                <td class="department">{{ employee.boPhan || employee.maBoPhan || '—' }}</td>
                <td class="position">{{ employee.chucVu || employee.maChucVu || '—' }}</td>
                <td
                  v-for="day in report.cotNgay"
                  :key="day.ngayTrongThang"
                  :class="{
                    weekend: weekend(day.ngayTrongThang),
                    highlight: hoveredDay === day.ngayTrongThang,
                  }"
                  :title="
                    employee.hoVaTen +
                    ' · ' +
                    day.ngay +
                    ' · ' +
                    (employee.days.get(day.ngayTrongThang) || 'Chưa phân công')
                  "
                  @mouseenter="hoveredDay = day.ngayTrongThang"
                >
                  {{ employee.days.get(day.ngayTrongThang) || '' }}
                </td>
                <td v-for="total in totals" :key="total.key" class="total">
                  {{ employee[total.key] ?? 0 }}
                </td>
              </tr>
            </tbody>
            <tbody v-if="!rows.length">
              <tr>
                <td :colspan="5 + report.cotNgay.length + totals.length" class="empty">
                  Chưa có dữ liệu báo cáo trong tháng này.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>
<style scoped>
.monthly-report {
  min-width: 0;
  border: 1px solid #dbe3ee;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}
.report-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  flex-wrap: wrap;
}
h2 {
  font-size: 17px;
  margin: 0;
}
p {
  font-size: 13px;
  color: #64748b;
  margin: 6px 0 0;
}
.report-controls {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}
.report-controls label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  min-width: 120px;
}
.report-summary {
  padding: 12px 20px;
  background: #f8fafc;
  border-block: 1px solid #e2e8f0;
  font-size: 13px;
}
.report-status {
  padding: 32px;
  text-align: center;
}
.error {
  color: #b42318;
}
.sheet-scroll {
  overflow: auto;
  max-height: 68vh;
}
.schedule-sheet {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
  font-size: 12px;
}
.schedule-sheet th,
.schedule-sheet td {
  height: 36px;
  box-sizing: border-box;
  padding: 7px 6px;
  border-right: 1px solid #dbe3ee;
  border-bottom: 1px solid #dbe3ee;
  text-align: center;
  white-space: nowrap;
  background: #fff;
}
.schedule-sheet thead th {
  position: sticky;
  top: 0;
  z-index: 3;
  background: #edf2f7;
  font-weight: 600;
  white-space: normal;
}
.schedule-sheet .frozen {
  position: sticky;
  z-index: 2;
}
.ordinal {
  left: 0;
}
.employee-code {
  left: 44px;
}
.employee-name {
  left: 134px;
}
.schedule-sheet thead .frozen {
  z-index: 4;
}
.schedule-sheet .name,
.schedule-sheet .department,
.schedule-sheet .position {
  text-align: left;
  white-space: normal;
  overflow-wrap: anywhere;
}
.schedule-sheet .employee-name {
  box-shadow: 2px 0 0 #cbd5e1;
}
.schedule-sheet .weekend {
  background: #f1f5f9;
}
.schedule-sheet .total {
  background: #f0fdf4;
  font-weight: 600;
}
.schedule-sheet tbody tr:hover td {
  background: #eaf4ff;
}
.schedule-sheet .highlight {
  background: #e0efff;
}
.schedule-sheet tbody td:hover {
  background: #bfdbfe;
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}
.empty {
  padding: 32px !important;
  color: #64748b;
}
.print-heading {
  display: none;
}
@media (max-width: 640px) {
  .report-toolbar {
    padding: 16px;
  }
  .report-controls {
    width: 100%;
  }
  .report-controls label {
    flex: 1;
  }
  .report-controls :deep(.p-select) {
    width: 100%;
  }
}
/* Spreadsheet outline: frozen identity columns and department bands. */
.report-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: #f3f7f3;
}
.outline-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.outline-controls button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid #b8cbbb;
  border-radius: 3px;
  background: #fff;
  color: #23633d;
  font: inherit;
  cursor: pointer;
}
.outline-controls button:disabled {
  opacity: 0.45;
  cursor: default;
}
.sheet-scroll {
  border-top: 2px solid #217346;
  scrollbar-color: #b7c7ba #f3f7f3;
}
.schedule-sheet {
  font-family: Calibri, 'Segoe UI', sans-serif;
  border-left: 1px solid #c9d5ca;
}
.schedule-sheet th,
.schedule-sheet td {
  border-color: #c9d5ca;
}
.schedule-sheet thead th {
  background: #e9efea;
  color: #294b34;
  border-bottom: 2px solid #8fac94;
}
.schedule-sheet thead th.total {
  background: #dcebdc;
}
.schedule-sheet .department-heading th,
.schedule-sheet .department-heading:hover th {
  background: #e2efda;
  border-top: 1px solid #a7c39b;
  border-bottom: 1px solid #a7c39b;
  color: #28542e;
  height: 38px;
}
.schedule-sheet .department-label {
  left: 0;
  padding: 0;
  text-align: left;
  white-space: normal;
}
.department-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 38px;
  padding: 7px 10px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}
.department-title {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.outline-icon {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border: 1px solid #7da475;
  background: #fff;
  color: #217346;
  font-size: 15px;
  line-height: 1;
}
.department-count {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 400;
  color: #4f7253;
}
.department-toggle:hover {
  background: #d4e7ca;
}
.department-toggle:focus-visible,
.outline-controls button:focus-visible {
  outline: 2px solid #217346;
  outline-offset: -2px;
}
.schedule-sheet .ordinal {
  background: #f2f5f2;
  color: #607765;
}
.schedule-sheet .weekend {
  background: #f3f5f3;
}
.schedule-sheet .total {
  font-variant-numeric: tabular-nums;
}
.schedule-sheet tbody .employee-row:hover td {
  background: #edf5ed;
}
.schedule-sheet .highlight {
  background: #e5f0e4;
}
.schedule-sheet tbody .employee-row td:hover {
  background: #d9ebd6;
  outline-color: #217346;
}
</style>
