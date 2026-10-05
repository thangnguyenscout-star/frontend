<script setup lang="ts">
import { ref, watch } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import AppDatePicker from '@/components/common/AppDatePicker.vue';
import AppDialog from '@/components/common/AppDialog.vue';
import type { RecruitmentRecord } from '@/types/recruitment';

const props = defineProps<{ visible: boolean; busy?: boolean; candidate?: RecruitmentRecord }>();
const emit = defineEmits<{ 'update:visible': [boolean]; confirm: [string] }>();
const value = ref<Date | null>(null);
watch(
  () => props.visible,
  (visible) => {
    if (visible)
      value.value = props.candidate?.ngayBatDauLamViec
        ? new Date(props.candidate.ngayBatDauLamViec + 'T00:00:00')
        : new Date();
  },
);
function submit() {
  if (!value.value) return;
  const date = [
    value.value.getFullYear(),
    String(value.value.getMonth() + 1).padStart(2, '0'),
    String(value.value.getDate()).padStart(2, '0'),
  ].join('-');
  emit('confirm', date);
}
</script>

<template>
  <AppDialog
    :visible="visible"
    modal
    header="Xác nhận đã nhận việc"
    class="w-[calc(100vw-2rem)] max-w-md"
    @update:visible="emit('update:visible', $event)"
  >
    <p class="mb-4 text-sm text-surface-600">
      Chọn ngày bắt đầu làm việc của <strong>{{ candidate?.hoTen }}</strong
      >.
    </p>
    <label class="mb-2 block text-sm font-semibold"
      >Ngày bắt đầu làm việc <span class="text-red-500">*</span></label
    >
    <AppDatePicker v-model="value" class="w-full" date-format="dd/mm/yy" show-icon />
    <template #footer>
      <AppButton
        label="Hủy"
        severity="secondary"
        text
        :disabled="busy"
        @click="emit('update:visible', false)"
      />
      <AppButton
        label="Xác nhận"
        icon="pi pi-check"
        :loading="busy"
        :disabled="!value"
        @click="submit"
      />
    </template>
  </AppDialog>
</template>
