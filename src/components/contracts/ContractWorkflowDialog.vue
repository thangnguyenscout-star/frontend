<script setup lang="ts">
import { computed } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import { usePermission } from '@/composables/usePermission';
import { contractWorkflow, getContractActions } from '@/utils/contract';
import type { ContractAction, ContractStatus } from '@/types/contract';
const props = defineProps<{ status: ContractStatus; busy?: boolean }>();
const emit = defineEmits<{ action: [ContractAction]; proposal: [] }>();
const permission = usePermission();
const actions = computed(() => getContractActions(props.status));
</script>
<template>
  <footer class="dialog-footer contract-workflow">
    <AppButton
      v-for="action in contractWorkflow"
      :key="action.key"
      :label="action.label"
      type="button"
      :disabled="busy || !actions[action.key] || !permission.can('contracts', action.permission)"
      @click="emit('action', action.key)"
    />
    <AppButton
      v-if="actions.proposal"
      label="Lập tờ trình"
      icon="pi pi-print"
      type="button"
      severity="secondary"
      outlined
      :disabled="busy || !permission.can('contracts')"
      @click="emit('proposal')"
    />
  </footer>
</template>
<style scoped>
.contract-workflow {
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  padding: 16px 0;
  flex-wrap: wrap;
  z-index: 2;
  gap: 8px;
}
.contract-workflow :deep(.p-button) {
  font-size: 12px;
}
</style>
