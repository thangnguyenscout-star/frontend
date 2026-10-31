<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import AppButton from '@/components/common/AppButton.vue';
import { useToast } from '@/composables/useToast';
import { getApiErrorMessage } from '@/utils/error-message';
import { getDepartmentShifts } from '@/services/modules/schedule-shift.service';
import {
  buildScheduleShiftChange,
  updateScheduleAssignment,
} from '@/services/modules/schedule-update.service';
import type { Assignment, Shift } from '@/types/schedule';
import '../schedule-dialog.css';

const props = defineProps<{
  assignment?: Assignment;
  departmentCode: string;
  employeeName: string;
}>();
const emit = defineEmits<{ close: []; saved: []; busy: [boolean] }>();
const toast = useToast();
const shiftId = ref(''),
  shifts = ref<Shift[]>([]);
const loading = ref(false),
  saving = ref(false),
  error = ref('');
let sequence = 0;
const options = computed(() =>
  shifts.value
    .filter(
      (item) =>
        item.active &&
        item.workType !== '0' &&
        item.scheduleType === props.assignment?.scheduleType &&
        item.id !== props.assignment?.shiftId,
    )
    .map((item) => ({
      ...item,
      label: `${item.code} · ${item.name}${item.startTime && item.endTime ? ` (${item.startTime}–${item.endTime})` : ''}`,
    })),
);
watch(saving, (value) => emit('busy', value), { flush: 'sync' });
async function load() {
  const request = ++sequence;
  shifts.value = [];
  error.value = '';
  if (!props.assignment) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    if (!props.departmentCode) throw new Error('Chưa xác định bộ phận của phân công.');
    const result = await getDepartmentShifts(props.departmentCode, props.assignment.scheduleType);
    if (request === sequence) shifts.value = result;
  } catch (e) {
    if (request === sequence) error.value = getApiErrorMessage(e);
  } finally {
    if (request === sequence) loading.value = false;
  }
}
watch(
  () => [props.assignment, props.departmentCode] as const,
  () => {
    shiftId.value = '';
    void load();
  },
  { immediate: true },
);
async function save() {
  if (!props.assignment || saving.value || loading.value) return;
  error.value = '';
  saving.value = true;
  try {
    await updateScheduleAssignment(
      buildScheduleShiftChange(props.assignment, shiftId.value, shifts.value),
    );
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
});
</script>
<template>
  <Dialog
    class="schedule-dialog"
    :visible="!!assignment"
    modal
    header="Điều chỉnh phân công ca"
    :closable="!saving"
    :close-on-escape="!saving"
    :style="{ width: '520px', maxWidth: '95vw' }"
    @update:visible="!saving && emit('close')"
  >
    <form class="edit-form" @submit.prevent="save">
      <p class="employee-summary">
        <strong>{{ employeeName }}</strong
        ><br />{{ assignment?.date }} · Ca hiện tại:
        {{ assignment?.shiftSymbol || assignment?.shiftId }}
      </p>
      <p v-if="loading" role="status">Đang tải danh mục ca...</p>
      <label
        >Ca làm việc mới *<Select
          v-model="shiftId"
          :options="options"
          option-label="label"
          option-value="id"
          placeholder="Chọn ca làm việc"
          :disabled="loading || saving"
      /></label>
      <p v-if="!loading && !error && !options.length" class="hint">
        Chưa có ca làm việc khác trong bộ phận để đổi.
      </p>
      <p v-if="error" class="error" role="alert">
        {{ error
        }}<AppButton
          v-if="!shifts.length"
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
        /><AppButton
          type="submit"
          label="Xác nhận"
          :loading="saving"
          :disabled="loading || !options.length || !shiftId"
        />
      </footer>
    </form>
  </Dialog>
</template>
<style scoped>
.edit-form {
  display: grid;
  gap: 16px;
}
.edit-form p {
  margin: 0;
  line-height: 1.6;
}
.employee-summary {
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.edit-form label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
}
.edit-form :deep(.p-select) {
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
</style>
