<script setup lang="ts">
import AppButton from './AppButton.vue';
import type { ReportExportFormat } from '@/services/api/report-download';
withDefaults(
  defineProps<{
    formats?: ReportExportFormat[];
    busy?: ReportExportFormat | null;
    disabled?: boolean;
  }>(),
  { formats: () => [], busy: null, disabled: false },
);
const emit = defineEmits<{ export: [format: ReportExportFormat] }>();
</script>
<template>
  <div class="report-export-buttons" role="group" aria-label="Xuất báo cáo đang chọn">
    <AppButton
      v-for="format in ['excel', 'pdf'] as const"
      :key="format"
      type="button"
      :label="format === 'excel' ? 'Xuất Excel' : 'Xuất PDF'"
      :icon="format === 'excel' ? 'pi pi-file-excel' : 'pi pi-file-pdf'"
      severity="secondary"
      outlined
      :loading="busy === format"
      :disabled="disabled || !!busy || !formats.includes(format)"
      :title="
        formats.includes(format)
          ? 'Xuất toàn bộ kết quả theo bộ lọc đã áp dụng'
            : 'Chức năng xuất chưa khả dụng cho báo cáo này'
      "
      @click="emit('export', format)"
    />
  </div>
</template>
<style scoped>
.report-export-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.report-export-buttons :deep(.p-button) {
  font-size: 12px;
  white-space: nowrap;
}
</style>
