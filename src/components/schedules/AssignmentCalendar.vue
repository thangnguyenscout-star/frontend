<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Dialog from 'primevue/dialog';
import { systemToday, isPastScheduleDate } from '@/utils/schedule-date';
import type { Shift } from '@/types/schedule';
export interface DayPlan {
  employeeId: string;
  date: string;
  shiftId: string;
  fullTime: boolean;
  note: string;
  startTime?: string;
  endTime?: string;
  crossDay?: boolean;
}
const props = defineProps<{
  employees: { code: string; name: string; department: string }[];
  shifts: Shift[];
  shiftsLoading?: boolean;
  shiftsError?: string;
  modelValue: DayPlan[];
  initialDate: string;
  viewMode: 'week' | 'month';
  anchorDate: string;
  fixedDate?: string;
  disabled?: boolean;
  administrative?: boolean;
  administrativeShiftId?: string;
}>();
const emit = defineEmits<{
  'request-shifts': [];
  'update:modelValue': [DayPlan[]];
  'update:viewMode': ['week' | 'month'];
  'update:anchorDate': [string];
}>();
const visible = ref(false),
  date = ref(''),
  shiftId = ref(''),
  fullTime = ref(true),
  note = ref(''),
  error = ref('');
const startTime = ref('');
const selectedShift = computed(() => props.shifts.find((s) => s.id === shiftId.value));
const flexibleShift = computed(
  () => !props.administrative && !!selectedShift.value?.code.endsWith('XX'),
);
const endTime = computed(() => {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime.value)) return '';
  const [hours, minutes] = startTime.value.split(':').map(Number);
  return `${String((hours + 8) % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});
const crossDay = computed(() => !!endTime.value && endTime.value <= startTime.value);
watch([shiftId, selectedShift], () => {
  startTime.value =
    plan(date.value)?.shiftId === shiftId.value
      ? plan(date.value)?.startTime || selectedShift.value?.startTime || ''
      : selectedShift.value?.startTime || '';
});
const currentDate = ref(systemToday());
let dateTimer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  dateTimer = setInterval(() => {
    currentDate.value = systemToday();
  }, 30000);
});
onBeforeUnmount(() => clearInterval(dateTimer));
const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const employeeId = ref('');
const currentEmployee = computed(() => props.employees.find((e) => e.code === employeeId.value));
const days = computed(() => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(props.anchorDate)) return [];
  const first = new Date(props.anchorDate + 'T12:00:00');
  if (Number.isNaN(first.getTime())) return [];
  if (props.viewMode === 'week') first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  else first.setDate(1);
  const count =
    props.viewMode === 'week'
      ? 7
      : new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(first);
    date.setDate(date.getDate() + index);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  });
});
function move(n: number) {
  const d = new Date(props.anchorDate + 'T12:00:00');
  if (props.viewMode === 'month') {
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
  } else d.setDate(d.getDate() + n * 7);
  setAnchorDate(d);
}
function setAnchorDate(date: Date) {
  emit(
    'update:anchorDate',
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
  );
}
function setMonth(value: string) {
  if (/^\d{4}-\d{2}$/.test(value)) setAnchorDate(new Date(`${value}-01T12:00:00`));
}
function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('vi-VN');
}
function plan(d: string, id = employeeId.value) {
  return props.modelValue.find((p) => p.date === d && p.employeeId === id);
}
function open(d: string, id: string) {
  if (isPastScheduleDate(d)) return;
  employeeId.value = id;
  const p = plan(d);
  date.value = d;
  shiftId.value = props.administrative ? props.administrativeShiftId || '' : p?.shiftId || '';
  fullTime.value = props.administrative ? p?.shiftId !== 'OFF' : (p?.fullTime ?? true);
  note.value = p?.note || '';
  error.value = '';
  startTime.value = p?.startTime || selectedShift.value?.startTime || '';
  visible.value = true;
  if (!props.administrative) emit('request-shifts');
}
function save() {
  if (isPastScheduleDate(date.value)) {
    error.value = 'Không được phân công ngày trong quá khứ.';
    return;
  }
  if (!props.administrative && (props.shiftsLoading || props.shiftsError)) return;
  if (flexibleShift.value && !endTime.value) {
    error.value = 'Vui lòng nhập giờ bắt đầu hợp lệ.';
    return;
  }
  if (
    (!props.administrative &&
      (!shiftId.value ||
        (shiftId.value !== 'OFF' && !props.shifts.some((s) => s.id === shiftId.value)))) ||
    (props.administrative && !props.administrativeShiftId)
  ) {
    error.value = 'Vui lòng chọn ca đang hoạt động.';
    return;
  }
  emit(
    'update:modelValue',
    [
      ...props.modelValue.filter((p) => p.date !== date.value || p.employeeId !== employeeId.value),
      {
        employeeId: employeeId.value,
        date: date.value,
        shiftId: props.administrative
          ? fullTime.value
            ? props.administrativeShiftId!
            : 'OFF'
          : shiftId.value,
        fullTime: shiftId.value === 'OFF' ? true : fullTime.value,
        note: props.administrative ? '' : note.value,
        ...(!props.administrative && shiftId.value !== 'OFF'
          ? {
              startTime: flexibleShift.value ? startTime.value : selectedShift.value?.startTime,
              endTime: flexibleShift.value ? endTime.value : selectedShift.value?.endTime,
              crossDay: flexibleShift.value ? crossDay.value : selectedShift.value?.crossDay,
            }
          : {}),
      },
    ].sort((a, b) => a.date.localeCompare(b.date)),
  );
  visible.value = false;
}
function remove() {
  emit(
    'update:modelValue',
    props.modelValue.filter((p) => p.date !== date.value || p.employeeId !== employeeId.value),
  );
  visible.value = false;
}
function text(d: string, id = employeeId.value) {
  const p = plan(d, id);
  return p?.shiftId === 'OFF'
    ? 'Nghỉ'
    : props.shifts.find((s) => s.id === p?.shiftId)?.name || (p ? '⚠ Chọn lại ca' : '');
}
</script>
<template>
  <section class="assignment-calendar">
    <div class="calendar-toolbar">
      <div>
        <h3>Lịch phân công theo nhân viên</h3>
        <p>
          Bấm ô ngày của nhân viên để chọn ca. {{ employees.length }} nhân viên ·
          {{ modelValue.length }} phân công đã chọn.
        </p>
      </div>
      <div class="calendar-navigation">
        <button
          type="button"
          :aria-label="viewMode === 'week' ? 'Tuần trước' : 'Tháng trước'"
          :disabled="!!fixedDate"
          @click="move(-1)"
        >
          ‹</button
        ><input
          v-if="viewMode === 'week'"
          :value="anchorDate"
          type="date"
          aria-label="Ngày trong tuần phân công"
          :disabled="!!fixedDate"
          @input="setAnchorDate(new Date(($event.target as HTMLInputElement).value + 'T12:00:00'))"
        /><input
          v-else
          :value="anchorDate.slice(0, 7)"
          type="month"
          aria-label="Tháng phân công"
          :disabled="!!fixedDate"
          @input="setMonth(($event.target as HTMLInputElement).value)"
        /><button
          type="button"
          :aria-label="viewMode === 'week' ? 'Tuần sau' : 'Tháng sau'"
          :disabled="!!fixedDate"
          @click="move(1)"
        >
          ›
        </button>
        <strong v-if="days.length"
          >{{ formatDate(days[0]) }} – {{ formatDate(days[days.length - 1]) }}</strong
        >
        <div class="view-toggle" role="group" aria-label="Phạm vi lịch phân công">
          <button
            type="button"
            :class="{ active: viewMode === 'week' }"
            :aria-pressed="viewMode === 'week'"
            @click="emit('update:viewMode', 'week')"
          >
            Tuần
          </button>
          <button
            type="button"
            :class="{ active: viewMode === 'month' }"
            :aria-pressed="viewMode === 'month'"
            @click="emit('update:viewMode', 'month')"
          >
            Tháng
          </button>
        </div>
      </div>
    </div>
    <div class="employee-calendar-wrap">
      <table class="employee-calendar">
        <thead>
          <tr>
            <th class="employee-column">Nhân viên</th>
            <th class="department-column">Bộ phận</th>
            <th
              v-for="d in days"
              :key="d"
              :class="{ weekend: [0, 6].includes(new Date(d + 'T12:00:00').getDay()) }"
            >
              {{ labels[(new Date(d + 'T12:00:00').getDay() + 6) % 7]
              }}<small>{{ Number(d.slice(-2)) }}/{{ Number(d.slice(5, 7)) }}</small>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in employees" :key="e.code">
            <th class="employee-column">
              <strong>{{ e.name }}</strong
              ><small>{{ e.code }}</small>
            </th>
            <td class="department-column">{{ e.department || 'Chưa có bộ phận' }}</td>
            <td
              v-for="d in days"
              :key="d"
              :class="{ weekend: [0, 6].includes(new Date(d + 'T12:00:00').getDay()) }"
            >
              <button
                type="button"
                :class="{ picked: !!plan(d, e.code) }"
                :disabled="disabled || d < currentDate || (!!fixedDate && d !== fixedDate)"
                :aria-label="e.name + ' · ' + d + ' · ' + text(d, e.code)"
                @click="open(d, e.code)"
              >
                <strong>{{ text(d, e.code) || '+ Chọn ca' }}</strong
                ><small v-if="plan(d, e.code) && plan(d, e.code)?.shiftId !== 'OFF'">{{
                  plan(d, e.code)?.fullTime ? 'Cả ca' : '1/2 ca'
                }}</small>
              </button>
            </td>
          </tr>
          <tr v-if="!employees.length">
            <td :colspan="days.length + 2" class="empty-state">
              Không tìm thấy nhân viên thuộc bộ phận hoặc từ khóa đã chọn.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Dialog
      v-model:visible="visible"
      modal
      :header="'Chọn ca · ' + date"
      :style="{ width: '480px', maxWidth: '95vw' }"
      ><div class="day-shift-dialog">
        <p>
          <strong>{{ currentEmployee?.name }}</strong> · {{ currentEmployee?.code }}<br />{{
            currentEmployee?.department
          }}
        </p>
        <template v-if="administrative">
          <label class="full-time"><input v-model="fullTime" type="checkbox" />Làm giờ</label>
        </template>
        <template v-else>
          <label
            >Ca làm việc *<select v-model="shiftId" :disabled="shiftsLoading || !!shiftsError">
              <option value="">Chọn ca</option>
              <option v-for="s in shifts" :key="s.id" :value="s.id">
                {{ s.name }} · {{ s.startTime }}–{{ s.endTime }}{{ s.crossDay ? ' (+1 ngày)' : '' }}
              </option>
              <option value="OFF">Nghỉ</option>
            </select></label
          ><label v-if="shiftId && shiftId !== 'OFF'" class="full-time"
            ><input v-model="fullTime" type="checkbox" />Toàn thời gian</label
          >
          <p v-if="shiftId && shiftId !== 'OFF'">
            {{ fullTime ? 'Làm cả ca đã chọn.' : 'Làm 1/2 ca đã chọn.' }} Khung giờ cụ thể của nửa
            ca chưa được xác định.
          </p>
          <p v-if="shiftsLoading">Đang tải danh sách ca...</p>
          <p v-if="shiftsError" role="alert">
            {{ shiftsError }} <button type="button" @click="emit('request-shifts')">Thử lại</button>
          </p>
          <template v-if="flexibleShift">
            <label>Giờ bắt đầu *<input v-model="startTime" type="time" required /></label>
            <label>Giờ kết thúc<input :value="endTime" type="time" readonly /></label>
            <p v-if="crossDay">Giờ kết thúc thuộc ngày hôm sau.</p>
          </template>
          <label>Ghi chú<textarea v-model="note" rows="3" /></label>
        </template>
        <p v-if="error" role="alert">{{ error }}</p>
        <div class="calendar-navigation">
          <button v-if="plan(date)" type="button" @click="remove">Bỏ ngày này</button
          ><button type="button" @click="visible = false">Hủy</button
          ><button
            type="button"
            class="primary"
            :disabled="!administrative && (shiftsLoading || !!shiftsError)"
            @click="save"
          >
            Chọn ca
          </button>
        </div>
      </div></Dialog
    >
  </section>
</template>
<style scoped>
.employee-calendar-wrap {
  overflow: auto;
  max-height: 65vh;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
.employee-calendar {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  font-size: 13px;
}
.employee-calendar th,
.employee-calendar td {
  padding: 10px;
  min-width: 130px;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #eef2f6;
  background: white;
  text-align: left;
}
.employee-calendar thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f8fafc;
  text-align: center;
}
.employee-calendar .employee-column {
  position: sticky;
  left: 0;
  min-width: 220px;
  width: 220px;
  max-width: 220px;
  z-index: 1;
}
.employee-calendar .department-column {
  position: sticky;
  left: 220px;
  min-width: 170px;
  width: 170px;
  max-width: 170px;
  z-index: 1;
}
.employee-calendar thead .employee-column,
.employee-calendar thead .department-column {
  z-index: 3;
  text-align: left;
}
.employee-calendar small {
  display: block;
  margin-top: 6px;
  color: #64748b;
  font-weight: 400;
}
.employee-calendar td button {
  width: 100%;
  min-height: 65px;
  text-align: left;
}
.employee-calendar .weekend {
  background: #f8fafc;
}
.employee-calendar button.picked {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}
@media (max-width: 600px) {
  .employee-calendar .employee-column {
    min-width: 150px;
    width: 150px;
    max-width: 150px;
  }
  .employee-calendar .department-column {
    position: static;
    min-width: 130px;
  }
  .employee-calendar th,
  .employee-calendar td {
    padding: 8px;
  }
}
.calendar-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px 0;
}
.calendar-toolbar h3 {
  margin: 0;
}
.calendar-toolbar p {
  color: #64748b;
  font-size: 13px;
}
.calendar-navigation {
  display: flex;
  gap: 8px;
  align-items: center;
}
.calendar-navigation input {
  max-width: 175px;
}
.view-toggle {
  display: flex;
  gap: 4px;
}
.view-toggle .active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}
.calendar-days > strong {
  text-align: center;
  padding: 8px;
  color: #64748b;
}
.calendar-days > button {
  min-height: 108px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  text-align: left;
}
.calendar-days .weekend {
  background: #f8fafc;
}
.calendar-days .picked {
  background: #eff6ff;
  border-color: #2563eb;
}
.calendar-days b {
  font-size: 15px;
}
.calendar-days span {
  font-weight: 600;
  color: #2563eb;
}
.calendar-days small {
  font-size: 12px;
  color: #64748b;
}
.selected-days {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0;
}
.selected-days span {
  padding: 7px 10px;
  background: #f1f5f9;
  border-radius: 7px;
  font-size: 12px;
}
.day-shift-dialog {
  display: grid;
  gap: 16px;
}
.day-shift-dialog label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.day-shift-dialog select,
.day-shift-dialog textarea,
.day-shift-dialog input[type='time'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}
.day-shift-dialog .full-time {
  flex-direction: row;
  align-items: center;
}
.day-shift-dialog p {
  font-size: 13px;
  color: #64748b;
}
.day-shift-dialog button {
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  background: white;
}
.day-shift-dialog .primary {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
@media (max-width: 600px) {
  .calendar-days {
    gap: 3px;
  }
  .calendar-days > button {
    padding: 6px !important;
    min-height: 92px;
  }
  .calendar-days span,
  .calendar-days small {
    font-size: 10px;
  }
  .calendar-navigation {
    flex-wrap: wrap;
  }
}
</style>
