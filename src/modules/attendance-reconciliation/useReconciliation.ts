import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { createReconciliationFixtures } from './reconciliation.fixtures';
import { createReconciliationService } from './reconciliation.service';

export const useReconciliation = defineStore('attendance-reconciliation-demo', () => {
  const state = reactive(createReconciliationFixtures());
  const service = createReconciliationService(state);
  return { ...service };
});
