import { ref, reactive, watch, onMounted } from 'vue';
import { recordService } from '@/services/modules/record.service';
import { apiErrorKey } from '@/services/api/apiErrorHandler';
import type { HrRecord, ListQuery } from '@/types/common';
export function useRecords(module: string) {
  const rows = ref<HrRecord[]>([]),
    all = ref<HrRecord[]>([]),
    total = ref(0),
    loading = ref(false),
    error = ref('');
  const query = reactive<ListQuery>({
    page: 1,
    pageSize: 10,
    search: '',
    filters: {},
    sortField: 'code',
    sortOrder: 1,
  });
  let request = 0;
  async function load() {
    const current = ++request;
    loading.value = true;
    error.value = '';
    try {
      const page = await recordService.list(module, { ...query, filters: { ...query.filters } });
      if (current !== request) return;
      rows.value = page.items;
      all.value = page.all;
      total.value = page.total;
    } catch (e) {
      if (current === request) error.value = apiErrorKey(e);
    } finally {
      if (current === request) loading.value = false;
    }
  }
  watch(query, load, { deep: true });
  onMounted(load);
  function reset() {
    query.search = '';
    query.filters = {};
    query.page = 1;
  }
  async function save(row: HrRecord) {
    const result = await recordService.save(module, row);
    await load();
    return result;
  }
  async function remove(id: string) {
    await recordService.remove(module, id);
    if (query.page > 1 && rows.value.length === 1) query.page--;
    await load();
  }
  return {
    rows,
    all,
    total,
    loading,
    error,
    query,
    load,
    reset,
    save,
    remove,
    simulateError: recordService.simulateError,
  };
}
