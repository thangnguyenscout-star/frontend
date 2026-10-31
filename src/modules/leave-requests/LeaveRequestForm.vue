<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import AppButton from '@/components/common/AppButton.vue';
import { useToast } from '@/composables/useToast';
import { getApiErrorMessage } from '@/utils/error-message';
import { systemToday } from '@/utils/schedule-date';
import {
  localLeaveDateTime,
  leaveRequestTimestamp,
  resolveLeaveRequestRange,
  validateLeaveRequestRange,
  type LeaveShiftPart,
  type LeaveWorkShift,
  type LeaveRequestRange,
} from '@/utils/leave-request';
import { getDepartmentShifts } from '@/services/modules/schedule-shift.service';
import {
  buildLeaveRequestInput,
  createLeaveRequest,
  getLeaveWorkShift,
  type LeaveRequestFormValues,
} from '@/services/modules/leave-request.service';
import type { Shift } from '@/types/schedule';

const props = defineProps<{ employeeId: string; employeeName: string }>();
const emit = defineEmits<{ close: []; saved: []; busy: [boolean] }>();
const toast = useToast();
const today = systemToday();
const form = reactive<
  Pick<LeaveRequestFormValues, 'fromDate' | 'toDate' | 'leaveTypeId' | 'reason'>
>({ fromDate: today, toDate: today, leaveTypeId: '', reason: '' });
const singleDay = ref(true);
const fromPart = ref<LeaveShiftPart>('full'),
  toPart = ref<LeaveShiftPart>('full');
const singleDayParts = [
  { value: 'full', label: 'Nguyên ca' },
  { value: 'first', label: 'Nửa ca đầu' },
  { value: 'last', label: 'Nửa ca cuối' },
];
const multipleDayParts = [
  { value: 'full', label: 'Nguyên ca' },
  { value: 'half', label: 'Nửa ca' },
];
const boundaries = ['from', 'to'] as const;
type Boundary = (typeof boundaries)[number];
const newBoundary = () => ({
  key: '',
  shift: null as LeaveWorkShift | null,
  ready: false,
  loading: false,
  error: '',
});
const workShifts = reactive({ from: newBoundary(), to: newBoundary() });
const shiftSequences = { from: 0, to: 0 };
const shifts = ref<Shift[]>([]);
const loading = ref(false),
  saving = ref(false),
  error = ref('');
let sequence = 0;
const leaveOptions = computed(() =>
  shifts.value
    .filter((item) => item.active && item.workType === '0')
    .map((item) => ({ ...item, label: `${item.id} · ${item.name}` })),
);
const endpointDate = (side: Boundary) => (side === 'from' ? form.fromDate : form.toDate);
const endpointKey = (side: Boundary) => JSON.stringify([props.employeeId, endpointDate(side)]);
function nextDay(date: string) {
  if (!date) return '';
  try {
    return localLeaveDateTime(leaveRequestTimestamp(date, '00:00') + 86400000).slice(0, 10);
  } catch {
    return '';
  }
}
const minimumEndDate = computed(() => nextDay(form.fromDate) || today);
const calculation = computed<{ range: LeaveRequestRange | null; error: string }>(() => {
  const from = workShifts.from,
    to = workShifts.to;
  if (
    !from.ready ||
    from.loading ||
    from.error ||
    from.key !== endpointKey('from') ||
    (!singleDay.value && (!to.ready || to.loading || to.error || to.key !== endpointKey('to')))
  )
    return { range: null, error: '' };
  try {
    const range = resolveLeaveRequestRange({
      singleDay: singleDay.value,
      fromDate: form.fromDate,
      toDate: form.toDate,
      fromPart: fromPart.value,
      toPart: toPart.value,
      fromShift: from.shift,
      toShift: to.shift,
    });
    validateLeaveRequestRange(range);
    return { range, error: '' };
  } catch (e) {
    return { range: null, error: getApiErrorMessage(e) };
  }
});
const cannotSubmit = computed(
  () =>
    saving.value ||
    loading.value ||
    !leaveOptions.value.length ||
    !calculation.value.range ||
    !form.leaveTypeId ||
    !form.reason.trim(),
);
watch(saving, (value) => emit('busy', value), { flush: 'sync' });
async function load() {
  const request = ++sequence;
  loading.value = true;
  error.value = '';
  shifts.value = [];
  try {
    const result = await getDepartmentShifts(null, 'ROTATING');
    if (request === sequence) shifts.value = result;
  } catch (e) {
    if (request === sequence) error.value = getApiErrorMessage(e);
  } finally {
    if (request === sequence) loading.value = false;
  }
}
async function loadWorkShift(side: Boundary) {
  const request = ++shiftSequences[side];
  const state = workShifts[side];
  Object.assign(state, newBoundary());
  if (side === 'to' && singleDay.value) return;
  const date = endpointDate(side),
    key = endpointKey(side);
  state.key = key;
  if (!props.employeeId || !date) return;
  state.loading = true;
  try {
    const shift = await getLeaveWorkShift(props.employeeId, date);
    if (request === shiftSequences[side] && key === endpointKey(side)) {
      state.shift = shift;
      state.ready = true;
    }
  } catch (e) {
    if (request === shiftSequences[side]) state.error = getApiErrorMessage(e);
  } finally {
    if (request === shiftSequences[side]) state.loading = false;
  }
}
watch(
  () => props.employeeId,
  () => {
    singleDay.value = true;
    fromPart.value = 'full';
    toPart.value = 'full';
    Object.assign(form, { fromDate: today, toDate: today, leaveTypeId: '', reason: '' });
    void load();
  },
  { immediate: true },
);
watch(singleDay, () => {
  fromPart.value = 'full';
  toPart.value = 'full';
});
watch(
  [singleDay, () => form.fromDate],
  () => {
    if (singleDay.value) form.toDate = form.fromDate;
    else if (!form.toDate || form.toDate <= form.fromDate) form.toDate = nextDay(form.fromDate);
  },
  { immediate: true },
);
watch([singleDay, fromPart], () => {
  if (singleDay.value) toPart.value = fromPart.value;
});
watch(
  [() => props.employeeId, () => form.fromDate],
  () => {
    void loadWorkShift('from');
  },
  { immediate: true },
);
watch(
  [() => props.employeeId, () => form.toDate, singleDay],
  () => {
    void loadWorkShift('to');
  },
  { immediate: true },
);
function setDate(side: Boundary, value: string) {
  if (side === 'from') form.fromDate = value;
  else if (!singleDay.value) form.toDate = value;
}
function setPart(side: Boundary, value: LeaveShiftPart) {
  if (side === 'from') fromPart.value = value;
  else if (!singleDay.value) toPart.value = value;
}
async function save() {
  if (saving.value || loading.value) return;
  error.value = '';
  if (!calculation.value.range) {
    error.value =
      calculation.value.error || 'Vui lòng chờ tải ca làm việc của các ngày đã chọn và thử lại.';
    return;
  }
  saving.value = true;
  try {
    const result = await createLeaveRequest(
      buildLeaveRequestInput(
        props.employeeId,
        { ...form, ...calculation.value.range },
        leaveOptions.value,
      ),
    );
    toast.success(result.message || 'Đăng ký nghỉ phép thành công.');
    emit('saved');
  } catch (e) {
    toast.error(e);
    error.value = getApiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}
onBeforeUnmount(() => {
  ++sequence;
  ++shiftSequences.from;
  ++shiftSequences.to;
});
</script>
<template>
  <form
    class="leave-request-form"
    :aria-busy="loading || workShifts.from.loading || workShifts.to.loading"
    @submit.prevent="save"
  >
    <p class="employee-summary">
      <strong>{{ employeeName }}</strong>
    </p>
    <label class="single-day-control"
      ><input v-model="singleDay" type="checkbox" :disabled="saving" />Nghỉ 1 ngày</label
    >
    <p v-if="loading" role="status">Đang tải loại nghỉ phép...</p>
    <div class="time-grid">
      <fieldset
        v-for="side in boundaries"
        :key="side"
        class="date-section"
        :disabled="saving || (singleDay && side === 'to')"
      >
        <legend>{{ side === 'from' ? 'Từ ngày' : 'Đến ngày' }}</legend>
        <label
          >Ngày nghỉ *<InputText
            :model-value="endpointDate(side)"
            type="date"
            :min="side === 'from' ? today : minimumEndDate"
            required
            :disabled="saving || (singleDay && side === 'to')"
            :aria-label="side === 'from' ? 'Từ ngày' : 'Đến ngày'"
            @update:model-value="setDate(side, String($event ?? ''))"
        /></label>
        <label
          >Phần ca nghỉ *<Select
            :model-value="side === 'from' ? fromPart : toPart"
            :options="singleDay ? singleDayParts : multipleDayParts"
            option-label="label"
            option-value="value"
            :disabled="saving || (singleDay && side === 'to') || workShifts[side].loading"
            :aria-label="side === 'from' ? 'Phần ca từ ngày' : 'Phần ca đến ngày'"
            @update:model-value="setPart(side, $event)"
        /></label>
        <label
          >{{ side === 'from' ? 'Giờ bắt đầu nghỉ' : 'Giờ kết thúc nghỉ'
          }}<InputText
            :model-value="
              side === 'from' ? calculation.range?.fromTime || '' : calculation.range?.toTime || ''
            "
            type="time"
            disabled
            :aria-label="side === 'from' ? 'Giờ bắt đầu nghỉ' : 'Giờ kết thúc nghỉ'"
        /></label>
        <template v-if="side === 'from' || !singleDay">
          <p v-if="workShifts[side].loading" class="hint" role="status">
            <i class="pi pi-spin pi-spinner" aria-hidden="true" /> Đang tải ca làm việc...
          </p>
          <p v-else-if="workShifts[side].error" class="error" role="alert">
            {{ workShifts[side].error
            }}<AppButton
              type="button"
              label="Tải lại ca"
              text
              :disabled="saving"
              @click="loadWorkShift(side)"
            />
          </p>
          <p
            v-else-if="workShifts[side].ready && !workShifts[side].shift"
            class="hint"
            role="status"
          >
            Chưa được phân ca.
            {{
              singleDay
                ? `Giờ nghỉ mặc định 00:00–${fromPart === 'full' ? '08:00' : '04:00'}.`
                : 'Giờ nghỉ mặc định 00:00.'
            }}
          </p>
          <p v-else-if="workShifts[side].shift" class="hint">
            Ca {{ workShifts[side].shift!.code }} · {{ workShifts[side].shift!.startTime }}–{{
              workShifts[side].shift!.endTime
            }}{{ workShifts[side].shift!.overnight ? ' (qua đêm)' : '' }}
          </p>
        </template>
      </fieldset>
    </div>
    <p v-if="singleDay" class="hint">Đến ngày tự động bằng ngày đã chọn ở Từ ngày.</p>
    <p
      v-if="
        calculation.range &&
        (calculation.range.fromDate !== form.fromDate || calculation.range.toDate !== form.toDate)
      "
      class="hint"
      role="status"
    >
      Khoảng nghỉ theo ca qua đêm: {{ calculation.range.fromDate }}
      {{ calculation.range.fromTime }} → {{ calculation.range.toDate }}
      {{ calculation.range.toTime }}.
    </p>
    <p v-if="calculation.error" class="error" role="alert">{{ calculation.error }}</p>
    <label
      >Lý do *<Textarea
        v-model="form.reason"
        rows="3"
        required
        placeholder="Nhập lý do nghỉ phép"
        :disabled="saving || loading"
    /></label>
    <label
      >Loại nghỉ phép *<Select
        v-model="form.leaveTypeId"
        :options="leaveOptions"
        option-label="label"
        option-value="id"
        placeholder="Chọn loại nghỉ phép"
        :disabled="saving || loading"
    /></label>
    <p v-if="error" class="error" role="alert">
      {{ error
      }}<AppButton
        v-if="!leaveOptions.length"
        type="button"
        label="Tải lại danh mục"
        text
        :disabled="saving || loading"
        @click="load"
      />
    </p>
    <footer>
      <AppButton
        type="button"
        label="Hủy"
        severity="secondary"
        outlined
        :disabled="saving"
        @click="emit('close')"
      /><AppButton type="submit" label="Xác nhận" :loading="saving" :disabled="cannotSubmit" />
    </footer>
  </form>
</template>
<style scoped>
.leave-request-form {
  display: grid;
  gap: 16px;
}
.leave-request-form p {
  margin: 0;
  line-height: 1.6;
}
.employee-summary {
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.leave-request-form label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
}
.leave-request-form .single-day-control {
  flex-direction: row;
  align-items: center;
  gap: 9px;
  cursor: pointer;
}
.single-day-control input {
  accent-color: #568267;
}
.time-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.date-section {
  display: grid;
  align-content: start;
  gap: 14px;
  margin: 0;
  min-width: 0;
  padding: 14px;
  border: 1px solid #dce5df;
  border-radius: 8px;
}
.date-section legend {
  padding: 0 6px;
  font-size: 13px;
  font-weight: 600;
}
.date-section:disabled {
  background: #f8fafc;
}
.leave-request-form :deep(.p-inputtext),
.leave-request-form :deep(.p-select),
.leave-request-form :deep(.p-textarea) {
  width: 100%;
}
.hint {
  color: #64748b;
  font-size: 12px;
}
footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}
.error {
  color: #b42318;
}
@media (max-width: 480px) {
  .time-grid {
    grid-template-columns: 1fr;
  }
}
</style>
