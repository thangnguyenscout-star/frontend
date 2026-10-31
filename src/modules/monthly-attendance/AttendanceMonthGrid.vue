<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DayRow, Employee, Filter } from './monthly.types';
import {
  attendanceCellKey,
  monthDates,
  cellMenuActions,
  displayDate,
  fullName,
  indexAttendance,
  matrixEmployees,
  dailyTotalColumns,
  numberText,
  sumDailyAttendance,
  statuses,
  statusOf,
} from './monthly.utils';
const props = withDefaults(
  defineProps<{ rows: DayRow[]; employees: Employee[]; filter: Filter; allowActions?: boolean }>(),
  { allowActions: false },
);
const emit = defineEmits<{ menu: [row: DayRow, event: MouseEvent]; detail: [row: DayRow] }>();
const selected = ref('');
const index = computed(() => indexAttendance(props.rows));
const people = computed(() => matrixEmployees(props.employees, props.rows, props.filter));
const dates = computed(() => monthDates(props.filter.nam, props.filter.thang));
const totals = computed(() => sumDailyAttendance(props.rows, props.filter));
const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const weekday = (date: string) => weekdays[new Date(date + 'T12:00:00Z').getUTCDay()];
const rowAt = (id: string, date: string) => index.value.get(attendanceCellKey(id, date));
const tooltip = (person: Employee, date: string) => {
  const row = rowAt(person.maNhanVien, date);
  return (
    fullName(person) +
    ' · ' +
    displayDate(date) +
    ' · ' +
    (row?.hienThiCa || '—') +
    ' · ' +
    statusOf(row).label
  );
};
const colors = (row?: DayRow) => ({ background: statusOf(row).bg, color: statusOf(row).text });
function selectCell(person: Employee, date: string) {
  selected.value = attendanceCellKey(person.maNhanVien, date);
  const row = rowAt(person.maNhanVien, date);
  if (row && !statusOf(row).abnormal) emit('detail', row);
}
function context(person: Employee, date: string, event: MouseEvent) {
  const row = rowAt(person.maNhanVien, date);
  if (!cellMenuActions(row, props.allowActions).length || !row) return;
  event.preventDefault();
  selected.value = attendanceCellKey(person.maNhanVien, date);
  emit('menu', row, event);
}
</script>
<template>
  <div class="attendance-month-grid">
    <div
      class="excel-scroll"
      role="region"
      aria-label="Bảng chi tiết chấm công tháng, cuộn ngang để xem các ngày"
      tabindex="0"
    >
      <table class="excel-attendance" aria-label="Nhân viên và ký hiệu công từng ngày">
        <colgroup>
          <col class="excel-number-col" />
          <col class="excel-code-col" />
          <col class="excel-name-col" />
          <col class="excel-dept-col" />
          <col v-for="date in dates" :key="date" class="excel-day-col" />
          <col v-for="column in dailyTotalColumns" :key="column.key" class="excel-total-col" />
        </colgroup>
        <thead>
          <tr>
            <th rowspan="2" class="excel-sticky excel-stt" scope="col">STT</th>
            <th rowspan="2" class="excel-sticky excel-code" scope="col">Mã nhân viên</th>
            <th rowspan="2" class="excel-sticky excel-name" scope="col">Họ và tên</th>
            <th rowspan="2" class="excel-dept" scope="col">Bộ phận</th>
            <th :colspan="dates.length" scope="colgroup">
              Ngày công tháng {{ String(filter.thang).padStart(2, '0') }}/{{ filter.nam }}
            </th>
            <th :colspan="dailyTotalColumns.length" scope="colgroup">Tổng trong tháng</th>
          </tr>
          <tr>
            <th
              v-for="date in dates"
              :key="date"
              scope="col"
              :class="{
                'excel-weekend': weekday(date) === 'CN' || weekday(date) === 'T7',
              }"
            >
              <time :datetime="date">{{ Number(date.slice(-2)) }}</time
              ><small>{{ weekday(date) }}</small>
            </th>
            <th v-for="column in dailyTotalColumns" :key="column.key" scope="col">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(person, i) in people" :key="person.maNhanVien">
            <td class="excel-sticky excel-stt">{{ i + 1 }}</td>
            <td class="excel-sticky excel-code">{{ person.maNhanVien }}</td>
            <th class="excel-sticky excel-name" scope="row">{{ fullName(person) }}</th>
            <td class="excel-dept">{{ person.tenBoPhan || person.maBoPhan || '—' }}</td>
            <td
              v-for="date in dates"
              :key="date"
              class="excel-attendance-cell"
              :class="{
                'excel-selected': selected === attendanceCellKey(person.maNhanVien, date),
              }"
              :style="colors(rowAt(person.maNhanVien, date))"
              :title="tooltip(person, date)"
              @contextmenu="context(person, date, $event)"
            >
              <button
                type="button"
                class="excel-cell-symbol"
                :aria-label="tooltip(person, date)"
                @click="selectCell(person, date)"
              >
                {{ rowAt(person.maNhanVien, date)?.hienThiCa || '—' }}
              </button>
            </td>
            <td v-for="column in dailyTotalColumns" :key="column.key" class="excel-total">
              {{ numberText(totals.get(person.maNhanVien)?.[column.key] ?? 0) }}
            </td>
          </tr>
          <tr v-if="!people.length">
            <td :colspan="dates.length + 4 + dailyTotalColumns.length" class="excel-empty">
              Không có nhân viên theo bộ lọc.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="monthly-subtitle excel-help">
      {{ people.length }} nhân viên · Ô hiển thị ký hiệu công/nghỉ phép. Nhấn chuột phải vào ô công
      bất thường để xem chức năng có thể sử dụng.
    </p>
    <div class="monthly-legend" aria-label="Chú giải trạng thái">
      <span v-for="(status, key) in statuses" :key="key"
        ><i :style="{ background: status.bg, borderColor: status.border }" aria-hidden="true" />{{
          status.label
        }}</span
      ><span><i aria-hidden="true" />Chưa có dữ liệu</span>
    </div>
  </div>
</template>
