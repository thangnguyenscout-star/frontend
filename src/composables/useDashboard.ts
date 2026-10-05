import { ref, onMounted } from 'vue';
import { recordService } from '@/services/modules/record.service';
import { apiErrorKey } from '@/services/api/apiErrorHandler';
import type { HrRecord } from '@/types/common';
export function useDashboard() {
  const data = ref<Record<string, HrRecord[]>>({}),
    loading = ref(false),
    error = ref('');
  async function load() {
    loading.value = true;
    try {
      data.value = await recordService.overview();
      error.value = '';
    } catch (e) {
      error.value = apiErrorKey(e);
    } finally {
      loading.value = false;
    }
  }
  onMounted(load);
  return { data, loading, error, load };
}
