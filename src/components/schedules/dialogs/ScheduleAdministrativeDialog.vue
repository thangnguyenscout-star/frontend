<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import '../schedule-dialog.css';
import Select from 'primevue/select';
import AppButton from '@/components/common/AppButton.vue';
import { useToast } from '@/composables/useToast';
import {
  currentAdministrativePeriod,
  createAdministrativeSchedule,
} from '@/services/modules/schedule-administrative.service';
const props = defineProps<{ disabled?: boolean }>();
const emit = defineEmits<{ saved: []; busy: [boolean] }>();
const toast = useToast();
const visible = ref(false),
  saving = ref(false);
const current = ref(currentAdministrativePeriod());
const month = ref<number | null>(current.value.month),
  year = ref<number | null>(current.value.year);
const months = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: 'Tháng ' + (i + 1) })).filter(
    (item) => year.value !== current.value.year || item.value >= current.value.month,
  ),
);
const years = computed(() =>
  Array.from({ length: Math.max(0, 2100 - current.value.year + 1) }, (_, index) => ({
    value: current.value.year + index,
    label: String(current.value.year + index),
  })),
);
watch(year, (value) => {
  if (value === current.value.year && (month.value == null || month.value < current.value.month))
    month.value = current.value.month;
});
function open() {
  if (props.disabled || saving.value) return;
  current.value = currentAdministrativePeriod();
  month.value = current.value.month;
  year.value = current.value.year;
  visible.value = true;
}
async function confirm() {
  if (saving.value || props.disabled) return;
  saving.value = true;
  emit('busy', true);
  try {
    const message = await createAdministrativeSchedule(month.value, year.value);
    toast.success(message);
    visible.value = false;
    emit('saved');
  } catch (e) {
    toast.error(e);
  } finally {
    saving.value = false;
    emit('busy', false);
  }
}
</script>
<template>
  <AppButton
    label="Phân ca hành chính"
    icon="pi pi-calendar-plus"
    :disabled="disabled || saving"
    @click="open"
  />
  <Dialog
    class="schedule-dialog"
    :visible="visible"
    modal
    header="Phân ca hành chính"
    :closable="!saving"
    :close-on-escape="!saving"
    :style="{ width: '440px', maxWidth: '95vw' }"
    @update:visible="!saving && (visible = $event)"
  >
    <form class="period-form" @submit.prevent="confirm">
      <div class="period-fields">
        <label
          >Tháng<Select
            v-model="month"
            :options="months"
            option-label="label"
            option-value="value"
            :disabled="saving"
            placeholder="Chọn tháng"
        /></label>
        <label
          >Năm<Select
            v-model="year"
            :options="years"
            option-label="label"
            option-value="value"
            filter
            :disabled="saving"
            placeholder="Chọn năm"
        /></label>
      </div>
      <footer>
        <AppButton
          type="button"
          label="Hủy"
          severity="secondary"
          outlined
          :disabled="saving"
          @click="visible = false"
        /><AppButton
          type="submit"
          label="Xác nhận"
          icon="pi pi-check"
          :loading="saving"
          :disabled="month == null || year == null || year < current.year"
        />
      </footer>
    </form>
  </Dialog>
</template>
<style scoped>
.period-form {
  display: grid;
  gap: 24px;
}
.period-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  font-size: 13px;
}
label :deep(.p-select) {
  width: 100%;
  min-width: 0;
}
footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}
@media (max-width: 480px) {
  .period-fields {
    grid-template-columns: 1fr;
  }
}
</style>
