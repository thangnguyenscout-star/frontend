<script setup lang="ts">
import { useToast } from '@/composables/useToast';
const toast = useToast();
import { getApiErrorMessage } from '@/utils/error-message';
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import AppButton from '@/components/common/AppButton.vue';
import './schedule-dialog.css';
import { systemToday, isPastScheduleDate } from '@/utils/schedule-date';
import type { Shift, Assignment } from '@/types/schedule';
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
  existingAssignments?: Assignment[];
  canEdit?: boolean;
  scheduledDates?: { employeeId: string; dates: string[] }[];
  shiftsLoading?: boolean;
  shiftsError?: string;
  modelValue: DayPlan[];
  createAssignment?: (plan: DayPlan) => Promise<void>;
  initialDate: string;
  viewMode: 'week' | 'month';
  anchorDate: string;
  fixedDate?: string;
  disabled?: boolean;
  administrative?: boolean;
  administrativeShiftId?: string;
}>();
const emit = defineEmits<{
  edit: [Assignment];
  'request-shifts': [];
  'update:modelValue': [DayPlan[]];
  'update:viewMode': ['week' | 'month'];
  'update:anchorDate': [string];
}>();
const saving = ref(false);
const confirmation = ref(false);
const pending = ref<DayPlan>();
const visible = ref(false),
  date = ref(''),
  shiftId = ref(''),
  fullTime = ref(true),
  note = ref(''),
  error = ref('');
const startTime = ref('');
const administrativeEndTime = ref('12:00');
watch(
  () => props.disabled,
  (value) => {
    if (value && !saving.value) {
      visible.value = false;
      confirmation.value = false;
    }
  },
);
const selectedShift = computed(() => props.shifts.find((s) => s.id === shiftId.value));
const flexibleShift = computed(
  () => !props.administrative && !!selectedShift.value?.code.endsWith('XX'),
);
const endTime = computed(() => {
  if (props.administrative && !fullTime.value) return administrativeEndTime.value;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime.value)) return '';
  const [hours, minutes] = startTime.value.split(':').map(Number);
  return `${String((hours + (fullTime.value ? 8 : 4)) % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});
const crossDay = computed(() => !!endTime.value && endTime.value <= startTime.value);
watch([shiftId, selectedShift], () => {
  if (props.administrative) {
    startTime.value = '08:00';
    return;
  }
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
function alreadyScheduled(d: string, id: string) {
  if (props.fixedDate === d) return false;
  return (
    props.scheduledDates?.some((item) => item.employeeId === id && item.dates.includes(d)) ||
    props.existingAssignments?.some((item) => item.employeeId === id && item.date === d)
  );
}
function isSourceS(d: string, id: string) {
  return (
    props.existingAssignments?.find((item) => item.employeeId === id && item.date === d)
      ?.assignmentSource === 'S'
  );
}
function isAdministrativeSunday(d: string) {
  return props.administrative && new Date(`${d}T12:00:00`).getDay() === 0;
}
function open(d: string, id: string) {
  if (saving.value || confirmation.value) return;
  const existing = props.existingAssignments?.find(
    (item) => item.employeeId === id && item.date === d,
  );
  if (existing && props.canEdit && !props.disabled && !isPastScheduleDate(d)) {
    emit('edit', existing);
    return;
  }
  if (props.administrative) return;
  if (
    props.disabled ||
    isAdministrativeSunday(d) ||
    isPastScheduleDate(d) ||
    alreadyScheduled(d, id)
  )
    return;
  employeeId.value = id;
  const p = plan(d);
  date.value = d;
  shiftId.value = props.administrative ? props.administrativeShiftId || '' : p?.shiftId || '';
  fullTime.value = props.createAssignment ? true : (p?.fullTime ?? true);
  note.value = p?.note || '';
  error.value = '';
  startTime.value = props.administrative
    ? '08:00'
    : p?.startTime || selectedShift.value?.startTime || '';
  administrativeEndTime.value = p?.fullTime === false ? p.endTime || '12:00' : '12:00';
  visible.value = true;
  if (!props.administrative) emit('request-shifts');
}
function save() {
  if (props.disabled || saving.value) return;
  if (
    props.administrative &&
    !fullTime.value &&
    (!/^([01]\d|2[0-3]):[0-5]\d$/.test(administrativeEndTime.value) ||
      administrativeEndTime.value <= '08:00' ||
      administrativeEndTime.value > '16:00')
  ) {
    error.value = 'Giờ kết thúc phải sau 08:00 và không quá 16:00.';
    return;
  }
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
  if (props.createAssignment) {
    const shift = selectedShift.value;
    if (!shift || !shift.active || shift.workType === '0') {
      error.value = 'Vui lòng chọn ca làm việc đang hoạt động.';
      return;
    }
    if (!fullTime.value) {
      error.value = 'Vui lòng chọn toàn thời gian để tạo phân công ca.';
      return;
    }
    pending.value = {
      employeeId: employeeId.value,
      date: date.value,
      shiftId: shift.id,
      fullTime: true,
      note: note.value,
      startTime: flexibleShift.value ? startTime.value : shift.startTime,
      endTime: flexibleShift.value ? endTime.value : shift.endTime,
      crossDay: flexibleShift.value ? crossDay.value : shift.crossDay,
    };
    confirmation.value = true;
    return;
  }
  emit(
    'update:modelValue',
    [
      ...props.modelValue.filter((p) => p.date !== date.value || p.employeeId !== employeeId.value),
      {
        employeeId: employeeId.value,
        date: date.value,
        shiftId: props.administrative ? props.administrativeShiftId! : shiftId.value,
        fullTime: shiftId.value === 'OFF' ? true : fullTime.value,
        note: props.administrative ? '' : note.value,
        ...(props.administrative && !fullTime.value
          ? { startTime: startTime.value, endTime: endTime.value, crossDay: crossDay.value }
          : {}),
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
async function confirmCreate() {
  if (!confirmation.value) return;
  if (
    !confirmation.value ||
    !pending.value ||
    !props.createAssignment ||
    saving.value ||
    props.disabled
  )
    return;
  if (
    isPastScheduleDate(pending.value.date) ||
    alreadyScheduled(pending.value.date, pending.value.employeeId)
  ) {
    confirmation.value = false;
    error.value =
      'Ngày phân công không còn hợp lệ hoặc nhân viên đã được phân ca. Vui lòng tải lại lịch.';
    return;
  }
  saving.value = true;
  error.value = '';
  try {
    await props.createAssignment({ ...pending.value });
    confirmation.value = false;
    visible.value = false;
    pending.value = undefined;
  } catch (e) {
    toast.error(e);
    confirmation.value = false;
    error.value = getApiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}
function remove() {
  emit(
    'update:modelValue',
    props.modelValue.filter((p) => p.date !== date.value || p.employeeId !== employeeId.value),
  );
  visible.value = false;
}
function text(d: string, id = employeeId.value) {
  const assigned = props.existingAssignments?.find((a) => a.employeeId === id && a.date === d);
  if (assigned) {
    return (
      assigned.shiftSymbol?.trim() ||
      props.shifts.find((s) => s.id === assigned.shiftId)?.code ||
      assigned.shiftId
    );
  }
  const p = plan(d, id);
  if (p) {
    return p.shiftId === 'OFF'
      ? 'Nghỉ'
      : props.shifts.find((s) => s.id === p.shiftId)?.code || p.shiftId;
  }
  if (alreadyScheduled(d, id)) {
    return props.administrative
      ? props.shifts.find((s) => s.id === props.administrativeShiftId)?.code ||
          props.administrativeShiftId ||
          'Đã xếp'
      : 'Đã xếp';
  }
  if (isAdministrativeSunday(d)) return 'Không xếp';
  return '';
}
function shiftTooltip(d: string, id: string) {
  const assigned = props.existingAssignments?.find((a) => a.employeeId === id && a.date === d);
  const selectedPlan = plan(d, id);
  if (!assigned && !selectedPlan) return undefined;
  const shift = props.shifts.find((s) => s.id === (assigned?.shiftId || selectedPlan?.shiftId));
  const employeeName =
    props.employees.find((e) => e.code === id)?.name || assigned?.employeeName || id;
  const shiftName = assigned?.shiftName || shift?.name || text(d, id);
  const start = assigned?.startTime || selectedPlan?.startTime || shift?.startTime;
  const end = assigned?.endTime || selectedPlan?.endTime || shift?.endTime;
  const overnight = assigned?.crossDay ?? selectedPlan?.crossDay ?? shift?.crossDay;
  return [
    `Họ tên: ${employeeName} (${id})`,
    `Ngày làm việc: ${formatDate(d)}`,
    `Ca làm việc: ${shiftName}`,
    `Thời gian làm việc: ${start || '—'}–${end || '—'}${overnight ? ' (+1 ngày)' : ''}`,
  ].join('\n');
}
</script>
<template>
  <section class="assignment-calendar">
    <div class="calendar-toolbar">
      <div>
        <h3>Lịch phân công theo nhân viên</h3>
        <p>
          {{
            administrative
              ? 'Lịch hành chính được sắp xếp sẵn.'
              : 'Bấm ô ngày của nhân viên để chọn ca.'
          }}
          {{ employees.length }} nhân viên · {{ modelValue.length }} phân công đã chọn.
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
              :title="shiftTooltip(d, e.code)"
              :class="{ weekend: [0, 6].includes(new Date(d + 'T12:00:00').getDay()) }"
            >
              <button
                type="button"
                :class="{
                  picked: !!plan(d, e.code),
                  assigned: alreadyScheduled(d, e.code),
                  'source-s': isSourceS(d, e.code),
                }"
                :disabled="
                  (administrative && !(canEdit && alreadyScheduled(d, e.code))) ||
                  disabled ||
                  d < currentDate ||
                  (!!fixedDate && d !== fixedDate) ||
                  isAdministrativeSunday(d) ||
                  (alreadyScheduled(d, e.code) && !canEdit)
                "
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
      class="schedule-dialog"
      v-model:visible="visible"
      modal
      :closable="!saving"
      :close-on-escape="!saving"
      :header="createAssignment ? 'Tạo phân công ca' : 'Chọn ca'"
      :style="{ width: '520px', maxWidth: '95vw' }"
      ><fieldset class="day-shift-dialog" :disabled="saving || confirmation">
        <p class="schedule-dialog-summary">
          <strong>{{ currentEmployee?.name }}</strong> · {{ currentEmployee?.code }}<br />{{
            formatDate(date)
          }}
          · {{ currentEmployee?.department }}
        </p>
        <template v-if="administrative">
          <label class="full-time"><input v-model="fullTime" type="checkbox" />Toàn ca</label>
          <template v-if="!fullTime">
            <label
              >Giờ kết thúc<InputText
                v-model="administrativeEndTime"
                type="time"
                min="08:01"
                max="16:00"
                required
            /></label>
          </template>
        </template>
        <template v-else>
          <label
            >Ca làm việc *<Select
              v-model="shiftId"
              :options="[
                ...shifts.map((s) => ({
                  value: s.id,
                  label:
                    s.code +
                    ' · ' +
                    s.name +
                    (s.startTime && s.endTime ? ' · ' + s.startTime + '–' + s.endTime : '') +
                    (s.crossDay ? ' (+1 ngày)' : ''),
                })),
                ...(!createAssignment ? [{ value: 'OFF', label: 'Nghỉ' }] : []),
              ]"
              option-label="label"
              option-value="value"
              placeholder="Chọn ca làm việc"
              :disabled="saving || confirmation || shiftsLoading || !!shiftsError" /></label
          ><label v-if="!createAssignment && shiftId && shiftId !== 'OFF'" class="full-time"
            ><input v-model="fullTime" type="checkbox" />Toàn thời gian</label
          >
          <p v-if="shiftId && shiftId !== 'OFF'">
            {{ fullTime ? 'Làm cả ca đã chọn.' : 'Làm 1/2 ca đã chọn.' }}
            <template v-if="!fullTime">Khung giờ cụ thể của nửa ca chưa được xác định.</template>
          </p>
          <p v-if="shiftsLoading">Đang tải danh sách ca...</p>
          <p v-if="shiftsError" role="alert">
            {{ shiftsError }}
            <AppButton
              type="button"
              label="Thử lại"
              text
              size="small"
              @click="emit('request-shifts')"
            />
          </p>
          <template v-if="flexibleShift">
            <label>Giờ bắt đầu *<InputText v-model="startTime" type="time" required /></label>
            <label>Giờ kết thúc<InputText :model-value="endTime" type="time" readonly /></label>
            <p v-if="crossDay">Giờ kết thúc thuộc ngày hôm sau.</p>
          </template>
          <label
            >Ghi chú<Textarea
              v-model="note"
              rows="3"
              auto-resize
              placeholder="Nhập ghi chú (nếu có)"
          /></label>
        </template>
        <p v-if="error" class="schedule-dialog-message error" role="alert">{{ error }}</p>
        <div class="schedule-dialog-actions">
          <AppButton
            v-if="plan(date)"
            type="button"
            label="Bỏ ngày này"
            severity="danger"
            text
            @click="remove"
          />
          <AppButton
            type="button"
            label="Hủy"
            severity="secondary"
            outlined
            @click="visible = false"
          />
          <AppButton
            type="button"
            :label="createAssignment ? 'Tạo ca' : 'Chọn ca'"
            icon="pi pi-check"
            :disabled="!administrative && (shiftsLoading || !!shiftsError)"
            @click="save"
          />
        </div></fieldset
    ></Dialog>
    <Dialog
      class="schedule-dialog"
      :visible="confirmation"
      modal
      header="Xác nhận tạo phân công ca"
      :closable="!saving"
      :close-on-escape="!saving"
      :style="{ width: '520px', maxWidth: '95vw' }"
      @update:visible="!saving && (confirmation = $event)"
    >
      <div class="schedule-dialog-body">
        <p class="schedule-dialog-summary">
          Xác nhận tạo ca cho
          <strong>{{ currentEmployee?.name }} ({{ pending?.employeeId }})</strong>.
        </p>
        <dl class="schedule-dialog-details">
          <dt>Ngày làm việc</dt>
          <dd>{{ pending?.date ? formatDate(pending.date) : '' }}</dd>
          <dt>Bộ phận</dt>
          <dd>{{ currentEmployee?.department || '—' }}</dd>
          <dt>Ca làm việc</dt>
          <dd>{{ selectedShift?.code }} · {{ selectedShift?.name }}</dd>
          <dt>Giờ làm</dt>
          <dd>
            {{ pending?.startTime || 'Theo cấu hình ca' }} –
            {{ pending?.endTime || 'Theo cấu hình ca' }}{{ pending?.crossDay ? ' (+1 ngày)' : '' }}
          </dd>
          <template v-if="pending?.note"
            ><dt>Ghi chú</dt>
            <dd>{{ pending.note }}</dd></template
          >
        </dl>
      </div>
      <template #footer>
        <AppButton
          type="button"
          label="Quay lại"
          severity="secondary"
          outlined
          :disabled="saving"
          @click="confirmation = false"
        />
        <AppButton
          type="button"
          label="Xác nhận tạo ca"
          icon="pi pi-check"
          :loading="saving"
          :disabled="saving"
          @click="confirmCreate"
        />
      </template>
    </Dialog>
  </section>
</template>
<style scoped>
fieldset.day-shift-dialog {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}
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
  font-size: 12px;
}
.employee-calendar th,
.employee-calendar td {
  padding: 6px 8px;
  min-width: 92px;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #eef2f6;
  background: white;
  text-align: left;
  vertical-align: middle;
}
.employee-calendar thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f8fafc;
  text-align: center;
  font-size: 11px;
  line-height: 1.2;
}
.employee-calendar .employee-column {
  position: sticky;
  left: 0;
  min-width: 180px;
  width: 180px;
  max-width: 180px;
  z-index: 1;
  padding: 8px 10px;
}
.employee-calendar .department-column {
  position: sticky;
  left: 180px;
  min-width: 130px;
  width: 130px;
  max-width: 130px;
  z-index: 1;
  padding: 8px 10px;
}
.employee-calendar thead .employee-column,
.employee-calendar thead .department-column {
  z-index: 3;
  text-align: left;
}
.employee-calendar small {
  display: block;
  margin-top: 4px;
  color: #64748b;
  font-weight: 400;
  font-size: 10px;
}
.employee-calendar td button {
  width: 100%;
  min-height: 52px;
  padding: 6px 8px;
  text-align: left;
}
.employee-calendar td button strong,
.employee-calendar th strong {
  font-size: 11px;
  line-height: 1.2;
}
.employee-calendar .weekend {
  background: #f8fafc;
}
.employee-calendar button.picked {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}
.employee-calendar button.source-s {
  background: #dcfce7;
  border-color: #16a34a;
  color: #166534;
}
@media (max-width: 600px) {
  .employee-calendar .employee-column {
    min-width: 150px;
    width: 150px;
    max-width: 150px;
  }
  .employee-calendar .department-column {
    position: static;
    min-width: 110px;
    width: 110px;
    max-width: 110px;
  }
  .employee-calendar th,
  .employee-calendar td {
    padding: 5px 6px;
  }
}
.calendar-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin: 14px 0;
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
.day-shift-dialog :deep(.p-select),
.day-shift-dialog :deep(.p-textarea),
.day-shift-dialog :deep(.p-inputtext) {
  width: 100%;
  min-width: 0;
}
.day-shift-dialog label {
  font-size: 13px;
}
.day-shift-dialog p {
  margin: 0;
  line-height: 1.6;
}
.day-shift-dialog .full-time {
  flex-direction: row;
  align-items: center;
}
.day-shift-dialog p {
  font-size: 13px;
  color: #64748b;
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
