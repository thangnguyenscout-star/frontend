import { ref, onMounted } from 'vue';
import { recordService } from '@/services/modules/record.service';
import { apiErrorKey } from '@/services/api/apiErrorHandler';
import type { HrRecord, HistoryEntry } from '@/types/common';
export function useRecordDetail(module: string, id: string) {
  const row = ref<HrRecord>(),
    related = ref<Record<string, HrRecord[]>>({}),
    history = ref<HistoryEntry[]>([]),
    loading = ref(false),
    error = ref('');
  async function load() {
    loading.value = true;
    error.value = '';
    try {
      row.value = await recordService.get(module, id);
      history.value = await recordService.history(module, id);
      related.value = await recordService.overview();
    } catch (e) {
      error.value = apiErrorKey(e);
    } finally {
      loading.value = false;
    }
  }
  async function save(value: HrRecord) {
    row.value = await recordService.save(module, value);
    await load();
  }
  onMounted(load);
  return { row, related, history, loading, error, load, save };
}
