<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import AppButton from '@/components/common/AppButton.vue';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppDrawer from '@/components/common/AppDrawer.vue';
import AppKpiCard from '@/components/common/AppKpiCard.vue';
import ContractInspector from '@/components/contracts/ContractInspector.vue';
import { contractService } from '@/services/modules/contract.service';
import { contractApiError } from '@/utils/contract-api';
import { contractDate, contractMoney, contractStatusLabel } from '@/utils/contract';
import { useContractPermission } from '@/composables/useContractPermission';
import { useToast } from '@/composables/useToast';
import type { ContractDto, ContractListInput } from '@/types/contract-api';
import type { HrRecord } from '@/types/common';
const props = defineProps<{ initialContractId?: string }>();
const route = useRoute(),
  router = useRouter(),
  toast = useToast(),
  hasPermission = useContractPermission();
const records = ref<ContractDto[]>([]);
const statistics = ref({
  total: null as number | null,
  published: null as number | null,
  pendingSignature: null as number | null,
  expiring: null as number | null,
});
const filters = reactive({
  keyword: typeof route.query.search === 'string' ? route.query.search : '',
  maNhanVien: '',
  maLoaiHopDong: '',
  maChucVu: '',
  trangThaiHopDong: '',
  tuNgay: '',
  denNgay: '',
});
const appliedFilters = ref({ ...filters });
const filterFields = [
  { key: 'keyword', label: 'Từ khóa' },
  { key: 'maNhanVien', label: 'Mã nhân viên' },
  { key: 'maLoaiHopDong', label: 'Mã loại hợp đồng' },
  { key: 'maChucVu', label: 'Mã chức vụ' },
  { key: 'trangThaiHopDong', label: 'Mã trạng thái' },
  { key: 'tuNgay', label: 'Từ ngày' },
  { key: 'denNgay', label: 'Đến ngày' },
] as const;
const page = ref(1),
  pageSize = ref(10),
  total = ref(0),
  sortField = ref(''),
  sortDirection = ref('');
const loadingList = ref(false),
  loadingStatistics = ref(false),
  statisticsError = ref(''),
  error = ref(''),
  filterError = ref(''),
  visible = ref(false),
  busy = ref(false);
const preview = ref<HrRecord>();
let sequence = 0;
let statisticsSequence = 0;
const labels: Record<string, string> = {
  maNhanVien: 'Mã nhân viên',
  tenNhanVien: 'Họ tên',
  soHopDongLaoDong: 'Số hợp đồng',
  tenLoaiHopDong: 'Loại hợp đồng',
  tenChucVu: 'Chức vụ',
  ngayKyHopDong: 'Ngày ký',
  ngayBatDau: 'Ngày bắt đầu',
  ngayKetThuc: 'Ngày kết thúc',
  luongCoBan: 'Lương cơ bản',
  tongThuNhap: 'Tổng thu nhập',
  status: 'Trạng thái',
};
const columns = Object.keys(labels);
const rows = computed<HrRecord[]>(() =>
  records.value.map((item) => ({
    id: item.id,
    code: item.soHopDongLaoDong,
    name: item.tenNhanVien || item.maNhanVien,
    maNhanVien: item.maNhanVien,
    tenNhanVien: item.tenNhanVien || '',
    soHopDongLaoDong: item.soHopDongLaoDong,
    tenLoaiHopDong: item.tenLoaiHopDong || item.maLoaiHopDong,
    tenChucVu: item.tenChucVu || item.maChucVu || '',
    ngayKyHopDong: item.ngayKyHopDong,
    ngayBatDau: item.ngayBatDau,
    ngayKetThuc: item.ngayKetThuc || '',
    luongCoBan: item.luongCoBan,
    tongThuNhap: item.tongThuNhap,
    status: contractStatusLabel(item.trangThaiHopDong, item.tenTrangThaiHopDong),
  })),
);
const dateFormat = (value: string | number) => contractDate(String(value || '') || null);
const moneyFormat = (value: string | number) => contractMoney(Number(value));
const formatters = {
  ngayKyHopDong: dateFormat,
  ngayBatDau: dateFormat,
  ngayKetThuc: dateFormat,
  luongCoBan: moneyFormat,
  tongThuNhap: moneyFormat,
};
async function load() {
  const current = ++sequence;
  if (!hasPermission('HOPDONG_VIEW')) return;
  loadingList.value = true;
  error.value = '';
  const input: ContractListInput = {
    pageIndex: page.value,
    pageSize: pageSize.value,
    sortField: sortField.value || undefined,
    sortDirection: sortDirection.value || undefined,
  };
  for (const field of filterFields)
    if (appliedFilters.value[field.key].trim())
      input[field.key] = appliedFilters.value[field.key].trim();
  try {
    const result = await contractService.getList(input);
    if (current !== sequence) return;
    records.value = result.items;
    total.value = result.totalRecords;
    page.value = result.pageIndex;
    pageSize.value = result.pageSize;
  } catch (e) {
    if (current === sequence) {
      records.value = [];
      total.value = 0;
      error.value = contractApiError(e);
      toast.error(error.value);
    }
  } finally {
    if (current === sequence) loadingList.value = false;
  }
}
async function loadStatistics() {
  const current = ++statisticsSequence;
  if (!hasPermission('HOPDONG_VIEW')) return;
  loadingStatistics.value = true;
  statisticsError.value = '';
  const countInput = (status?: string): ContractListInput => ({
    pageIndex: 1,
    pageSize: 1,
    trangThaiHopDong: status,
  });
  try {
    const results = await Promise.allSettled([
      contractService.getList(countInput()),
      contractService.getList(countInput('3')),
      contractService.getList(countInput('1')),
      contractService.getExpiringContracts(),
    ]);
    if (current !== statisticsSequence) return;
    const [totalResult, publishedResult, pendingResult, expiringResult] = results;
    statistics.value = {
      total: totalResult.status === 'fulfilled' ? totalResult.value.totalRecords : null,
      published: publishedResult.status === 'fulfilled' ? publishedResult.value.totalRecords : null,
      pendingSignature:
        pendingResult.status === 'fulfilled' ? pendingResult.value.totalRecords : null,
      expiring: expiringResult.status === 'fulfilled' ? expiringResult.value.totalRecords : null,
    };
    const failure = results.find((result) => result.status === 'rejected');
    if (failure?.status === 'rejected') statisticsError.value = contractApiError(failure.reason);
  } finally {
    if (current === statisticsSequence) loadingStatistics.value = false;
  }
}
function refreshAll() {
  void load();
  void loadStatistics();
}
function search() {
  filterError.value = '';
  if (filters.tuNgay && filters.denNgay && filters.tuNgay > filters.denNgay) {
    filterError.value = 'Đến ngày phải lớn hơn hoặc bằng từ ngày.';
    return;
  }
  appliedFilters.value = { ...filters };
  page.value = 1;
  void load();
}
function reset() {
  for (const field of filterFields) filters[field.key] = '';
  search();
}
function changePage(event: { page: number; rows: number }) {
  page.value = event.rows === pageSize.value ? event.page + 1 : 1;
  pageSize.value = event.rows;
  void load();
}
function sort(event: { sortField?: string; sortOrder?: number }) {
  sortField.value = event.sortOrder
    ? event.sortField === 'status'
      ? 'trangThaiHopDong'
      : event.sortField || ''
    : '';
  sortDirection.value = event.sortOrder ? (event.sortOrder === 1 ? 'ASC' : 'DESC') : '';
  page.value = 1;
  void load();
}
function open(row: HrRecord) {
  if (!busy.value) {
    preview.value = row;
    visible.value = true;
  }
}
function close(value: boolean) {
  if (busy.value) return;
  visible.value = value;
  if (!value && route.query.contract) {
    const query = { ...route.query };
    delete query.contract;
    void router.replace({ path: '/contracts', query });
  }
}
watch(
  () => props.initialContractId || route.query.contract,
  (value) => {
    if (typeof value === 'string' && value) open({ id: value, code: '', name: '', status: '' });
  },
  { immediate: true },
);
watch(
  () => route.query.search,
  (value) => {
    filters.keyword = typeof value === 'string' ? value : '';
    search();
  },
);
onBeforeUnmount(() => {
  ++sequence;
  ++statisticsSequence;
});
refreshAll();
</script>
<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Hợp đồng lao động</h1>
        <p>Quản lý hợp đồng, phụ cấp và thời hạn.</p>
      </div>
      <div class="toolbar-actions">
        <AppButton
          v-if="hasPermission('HOPDONG_VIEW')"
          label="Sắp hết hạn"
          icon="pi pi-clock"
          severity="secondary"
          @click="router.push('/contracts/expiry')"
        />
        <AppButton
          v-if="hasPermission('HOPDONG_CREATE')"
          label="Tạo hợp đồng"
          icon="pi pi-plus"
          @click="router.push('/contracts/new')"
        />
      </div>
    </div>
    <p
      v-if="!hasPermission('HOPDONG_VIEW')"
      role="alert"
    >
      Bạn không có quyền xem hợp đồng.
    </p>
    <section
      v-if="hasPermission('HOPDONG_VIEW')"
      class="contract-kpis"
      aria-label="Thống kê hợp đồng"
    >
      <AppKpiCard
        label="Tổng số hợp đồng"
        :value="statistics.total ?? '—'"
        note="Không phụ thuộc bộ lọc"
        icon="pi-file"
        tone="blue"
      />
      <AppKpiCard
        label="Hợp đồng đã phát hành"
        :value="statistics.published ?? '—'"
        note="Trạng thái 3"
        icon="pi-check-circle"
        tone="green"
      />
      <AppKpiCard
        label="Hợp đồng đang chờ ký"
        :value="statistics.pendingSignature ?? '—'"
        note="Trạng thái 1"
        icon="pi-pencil"
        tone="amber"
      />
      <AppKpiCard
        label="Hợp đồng gần hết hạn"
        :value="statistics.expiring ?? '—'"
        note="Ngày kết thúc trong 30 ngày tới"
        icon="pi-clock"
        tone="red"
      />
    </section>
    <p
      v-if="statisticsError && hasPermission('HOPDONG_VIEW')"
      class="statistics-error"
      role="alert"
    >
      {{ statisticsError }}
      <AppButton
        label="Tải lại thống kê"
        text
        :disabled="loadingStatistics"
        @click="loadStatistics"
      />
    </p>
    <div
      v-if="hasPermission('HOPDONG_VIEW')"
      class="panel"
    >
      <div class="panel-top">
        <h2>Danh sách hợp đồng ({{ total }})</h2>
        <AppButton
          label="Tải lại"
          icon="pi pi-refresh"
          text
          :disabled="loadingList || loadingStatistics"
          @click="refreshAll"
        />
      </div>
      <form
        class="filters"
        @submit.prevent="search"
      >
        <div
          v-for="field in filterFields"
          :key="field.key"
          class="filter-field"
        >
          <label :for="'filter-' + field.key">{{ field.label }}</label>
          <InputText
            :id="'filter-' + field.key"
            v-model="filters[field.key]"
            :type="['tuNgay', 'denNgay'].includes(field.key) ? 'date' : 'text'"
          />
        </div>
        <AppButton
          label="Tìm kiếm"
          type="submit"
          icon="pi pi-search"
        />
        <AppButton
          label="Xóa bộ lọc"
          type="button"
          severity="secondary"
          outlined
          @click="reset"
        />
      </form>
      <p
        v-if="filterError"
        role="alert"
      >
        {{ filterError }}
      </p>
      <AppDataTable
        :rows="rows"
        :columns="columns"
        :column-labels="labels"
        :formatters="formatters"
        :total="total"
        :page="page"
        :page-size="pageSize"
        :loading="loadingList"
        :error="error"
        @page="changePage"
        @sort="sort"
        @view="open"
        @reset="reset"
        @retry="load"
      >
        <template #actions="{ row }">
          <AppButton
            label="Xem"
            icon="pi pi-eye"
            text
            :disabled="busy"
            @click="open(row)"
          />
        </template>
      </AppDataTable>
    </div>
    <AppDrawer
      :visible="visible"
      header="Hợp đồng lao động"
      position="right"
      :style="{ width: '900px', maxWidth: '100vw' }"
      :dismissable="!busy"
      :close-on-escape="!busy"
      :show-close-icon="!busy"
      @update:visible="close"
    >
      <ContractInspector
        v-if="visible && preview"
        :key="preview.id"
        :record="preview"
        @changed="refreshAll"
        @busy="busy = $event"
      />
    </AppDrawer>
  </section>
</template>
<style scoped>
.contract-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0;
}
.statistics-error {
  margin: 0 0 12px;
  color: #b42318;
  font-size: 13px;
}
.filters {
  flex-wrap: wrap;
  align-items: end;
}
.filter-field {
  display: grid;
  gap: 6px;
}
label {
  font-size: 12px;
}
[role='alert'] {
  color: #b42318;
}
@media (max-width: 960px) {
  .contract-kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 560px) {
  .contract-kpis {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
