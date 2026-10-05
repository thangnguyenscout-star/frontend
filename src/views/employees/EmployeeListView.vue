<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import AppButton from '@/components/common/AppButton.vue';
import AppDataTable from '@/components/common/AppDataTable.vue';
import { employeeService } from '@/services/modules/employee.service';
import { employeeErrorMessage, mapEmployeeDetailToForm } from '@/types/employee.type';
import { useToast } from '@/composables/useToast';
import { usePermission } from '@/composables/usePermission';
import { employeeStatusLabels } from '@/constants/employee';
import { exportCsv } from '@/utils/export';
import type { HrRecord } from '@/types/common';
const router = useRouter(),
  route = useRoute(),
  toast = useToast(),
  permission = usePermission(),
  { t } = useI18n();
const employeeContextMenu = [
  'Ký hợp đồng lao động',
  'Điều chỉnh chế độ',
  'Xem ngày công',
  'Chuyển bộ phận',
  'Kết thúc hợp đồng',
].map(label => ({ label, disabled: true }));
const search = ref(''),
  employees = ref<HrRecord[]>([]),
  loading = ref(false),
  error = ref('');
const page = ref(1),
  pageSize = ref(10),
  sortField = ref(''),
  sortOrder = ref(1);
const columns = [
  'code',
  'name',
  'gender',
  'birthDate',
  'birthPlace',
  'department',
  'position',
  'phone',
  'email',
  'identityNumber',
  'identityIssuedDate',
  'identityIssuedPlace',
  'startDate',
  'status',
];
const labels: Record<string, string> = {
  code: 'Mã nhân viên',
  name: 'Họ tên',
  gender: 'Giới tính',
  birthDate: 'Ngày sinh',
  birthPlace: 'Nơi sinh',
  department: 'Bộ phận',
  position: 'Chức vụ',
  phone: 'Số điện thoại',
  email: 'Email',
  identityNumber: 'CCCD',
  identityIssuedDate: 'Ngày cấp',
  identityIssuedPlace: 'Nơi cấp',
  startDate: 'Ngày tuyển dụng',
  status: 'Trạng thái',
};
const sorted = computed(() =>
  sortField.value
    ? [...employees.value].sort(
        (a, b) =>
          String(a[sortField.value] ?? '').localeCompare(String(b[sortField.value] ?? ''), 'vi', {
            numeric: true,
          }) * sortOrder.value,
      )
    : employees.value,
);
const rows = computed(() =>
  sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value),
);
let requestId = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
async function load() {
  clearTimeout(timer);
  const id = ++requestId;
  loading.value = true;
  error.value = '';
  try {
    const data = await employeeService.list(search.value);
    if (id !== requestId) return;
    employees.value = data.map((item) => ({
      ...mapEmployeeDetailToForm(item),
      birthPlace: String(item.tenNoiSinh ?? ''),
      identityIssuedPlace: String(item.tenNoiCap ?? ''),
      department: String(item.tenBoPhan ?? ''),
      position: String(item.tenChucVu ?? ''),
    }));
    page.value = 1;
  } catch (e) {
    if (id !== requestId) return;
    employees.value = [];
    error.value = employeeErrorMessage(e);
    toast.error(error.value);
  } finally {
    if (id === requestId) loading.value = false;
  }
}
watch(search, () => {
  ++requestId;
  clearTimeout(timer);
  loading.value = true;
  timer = setTimeout(load, 300);
});
watch(
  () => route.query.search,
  (value) => {
    const keyword = typeof value === 'string' ? value : '';
    if (search.value === keyword) void load();
    else search.value = keyword;
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  ++requestId;
  clearTimeout(timer);
});
function changePage(event: { page: number; rows: number }) {
  page.value = event.rows !== pageSize.value ? 1 : event.page + 1;
  pageSize.value = event.rows;
}
function open(row: HrRecord, edit = false) {
  router.push({ name: edit ? 'EmployeeEdit' : 'EmployeeRead', params: { maNhanVien: row.code } });
}
</script>
<template>
  <section>
    <div class="page-heading">
      <div>
        <div class="eyebrow">
          {{ t('workspace') }} / {{ t('modules.employees') }}
        </div>
        <h1>{{ t('modules.employees') }}</h1>
        <p>{{ t('subtitle') }}</p>
      </div>
      <AppButton
        v-if="permission.can('employees', 'create')"
        :label="t('employeeCreate')"
        icon="pi pi-plus"
        @click="router.push('/employees/new')"
      />
    </div>
    <div class="panel">
      <div class="panel-top">
        <div class="panel-title">
          <h2>{{ t('modules.employees') }}</h2>
          <span class="count-pill">{{ employees.length }}</span>
        </div>
        <div class="toolbar-actions">
          <AppButton
            :label="t('export')"
            icon="pi pi-download"
            severity="secondary"
            outlined
            @click="
              exportCsv(
                sorted,
                columns,
                columns.map((column) => labels[column]),
                'employees',
              )
            "
          /><AppButton
            :aria-label="t('refresh')"
            icon="pi pi-refresh"
            severity="secondary"
            text
            :disabled="loading"
            @click="load"
          />
        </div>
      </div>
      <div class="filters">
        <div class="search-field">
          <i class="pi pi-search" /><InputText
            v-model="search"
            :placeholder="t('search')"
            :aria-label="t('search')"
            @keyup.enter="load"
          />
        </div>
        <AppButton
          :aria-label="t('reset')"
          icon="pi pi-filter-slash"
          text
          severity="secondary"
          @click="search = ''"
        />
      </div>
      <AppDataTable
        :rows="rows"
        :columns="columns"
        :column-labels="labels"
        :status-labels="employeeStatusLabels"
        :context-menu-items="employeeContextMenu"
        :total="employees.length"
        :page="page"
        :page-size="pageSize"
        :loading="loading"
        :error="error"
        @page="changePage"
        @sort="
          sortField = $event.sortField || '';
          sortOrder = $event.sortOrder || 1;
          page = 1;
        "
        @view="open"
        @reset="search = ''"
        @retry="load"
      >
        <template #actions="{ row }">
          <div class="row-actions">
            <button
              class="icon-button"
              :title="t('view')"
              :aria-label="t('view')"
              @click="open(row)"
            >
              <i class="pi pi-eye" />
            </button><button
              v-if="permission.can('employees', 'edit')"
              class="icon-button"
              :title="t('edit')"
              :aria-label="t('edit')"
              @click="open(row, true)"
            >
              <i class="pi pi-pencil" />
            </button>
          </div>
        </template>
      </AppDataTable>
    </div>
  </section>
</template>
