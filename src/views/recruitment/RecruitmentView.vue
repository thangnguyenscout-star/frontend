<script setup lang="ts">
import { getApiErrorMessage } from '@/utils/error-message';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import { validContractDate } from '@/utils/contract';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import AppEmptyState from '@/components/common/AppEmptyState.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import AppLoading from '@/components/common/AppLoading.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import CreateProbationContractDialog from '@/components/contracts/CreateProbationContractDialog.vue';
import RecruitmentDrawer from '@/components/recruitment/RecruitmentDrawer.vue';
import { recruitmentService } from '@/services/modules/recruitment.service';
import type {
  RecruitmentCatalogs,
  RecruitmentRecord,
  RecruitmentStatus,
} from '@/types/recruitment';
import {
  genderLabels,
  recruitmentStatusLabels,
  recruitmentStatusSeverity,
} from '@/utils/recruitment';

const router = useRouter();
const route = useRoute();
const rows = ref<RecruitmentRecord[]>([]);
const catalogs = ref<RecruitmentCatalogs>({ departments: [], positions: [] });
const loading = ref(true);
const busy = ref(false);
const error = ref('');
const catalogError = ref('');
const actionError = ref('');
const creatingEmployee = ref(false);
const startConfirmed = ref(false);
const employeeCreated = ref(false);
const pendingStatus = ref<RecruitmentStatus | null>(null);
const startDate = ref('');
const startDateError = ref('');
const success = ref(route.query.saved === '1' ? 'Đã lưu hồ sơ tuyển dụng.' : '');
const search = ref('');
const status = ref<RecruitmentStatus | null>(null);
const department = ref<string | null>(null);
const position = ref<string | null>(null);
const appliedFilters = ref({
  search: '',
  status: null as RecruitmentStatus | null,
  department: null as string | null,
  position: null as string | null,
});
function applySearch() {
  appliedFilters.value = {
    search: search.value.trim(),
    status: status.value,
    department: department.value,
    position: position.value,
  };
  void load();
}
function clearSearch() {
  search.value = '';
  status.value = null;
  department.value = null;
  position.value = null;
  applySearch();
}
const selected = ref<RecruitmentRecord>();
const drawerVisible = ref(false);
const probationVisible = ref(false);
const probationId = ref('');
function openProbation() {
  if (
    !selected.value ||
    busy.value ||
    selected.value.trangThai !== '5' ||
    !selected.value.maNhanVien?.trim()
  )
    return;
  probationId.value = selected.value.id;
  drawerVisible.value = false;
  probationVisible.value = true;
}
async function probationCreated() {
  await load();
  if (selected.value?.id === probationId.value) {
    try {
      selected.value = await recruitmentService.getDetail(probationId.value);
    } catch {
      selected.value = undefined;
    }
  }
}
const statusOptions = (Object.keys(recruitmentStatusLabels) as RecruitmentStatus[]).map(
  (value) => ({
    value,
    label: recruitmentStatusLabels[value],
  }),
);
const filteredRows = computed(() => {
  const filters = appliedFilters.value;
  return rows.value.filter(
    (row) =>
      (!filters.status || row.trangThai === filters.status) &&
      (!filters.department || row.maBoPhanDuKien === filters.department) &&
      (!filters.position || row.maChucVuDuKien === filters.position),
  );
});
const date = (value: string | null) =>
  value ? new Intl.DateTimeFormat('vi-VN').format(new Date(value + 'T00:00:00')) : '—';

let loadSequence = 0;
async function load() {
  const sequence = ++loadSequence;
  loading.value = true;
  error.value = '';
  try {
    const records = await recruitmentService.list(appliedFilters.value.search);
    if (sequence !== loadSequence) return;
    rows.value = records;
  } catch (exception) {
    if (sequence !== loadSequence) return;
    error.value = getApiErrorMessage(exception);
  } finally {
    if (sequence === loadSequence) loading.value = false;
  }
}
async function loadCatalogs() {
  catalogError.value = '';
  try {
    catalogs.value = await recruitmentService.getCatalogs();
  } catch (exception) {
    catalogError.value = getApiErrorMessage(exception);
  }
}
async function openDrawer(row: RecruitmentRecord) {
  if (busy.value) return;
  busy.value = true;
  error.value = '';
  try {
    selected.value = await recruitmentService.getDetail(row.id);
    drawerVisible.value = true;
  } catch (exception) {
    error.value = getApiErrorMessage(exception);
  } finally {
    busy.value = false;
  }
}
function edit() {
  if (selected.value) router.push('/tuyen-dung/' + selected.value.id + '/edit');
}
function requestStatus(next: RecruitmentStatus) {
  if (!selected.value || busy.value) return;
  pendingStatus.value = next;
  startConfirmed.value = false;
  employeeCreated.value = false;
  startDate.value = selected.value.ngayBatDauLamViec || '';
  startDateError.value = '';
  actionError.value = '';
}
async function changeStatus(next: RecruitmentStatus) {
  if (!selected.value || busy.value) return;
  startDateError.value = '';
  if (next === '5' && !validContractDate(startDate.value)) {
    startDateError.value = 'Vui lòng chọn ngày nhận việc hợp lệ.';
    return;
  }
  busy.value = true;
  actionError.value = '';
  success.value = '';
  const recordId = selected.value.id;
  try {
    if (next === '5') {
      if (!startConfirmed.value) {
        await recruitmentService.confirmStart(selected.value, startDate.value);
        startConfirmed.value = true;
        selected.value = {
          ...selected.value,
          trangThai: '5',
          ngayBatDauLamViec: startDate.value,
        };
      }
      if (!employeeCreated.value) {
        creatingEmployee.value = true;
        await recruitmentService.createEmployeeFromRecruitment(recordId);
        employeeCreated.value = true;
      }
      await recruitmentService.transition(recordId, '6');
    } else {
      await recruitmentService.transition(recordId, next);
    }
    pendingStatus.value = null;
    startConfirmed.value = false;
    employeeCreated.value = false;
    drawerVisible.value = false;
    selected.value = undefined;
    success.value =
      next === '5'
        ? 'Đã xác nhận nhận việc và hoàn thành tạo hồ sơ nhân viên.'
        : 'Đã cập nhật trạng thái hồ sơ.';
    await load();
  } catch (exception) {
    actionError.value = getApiErrorMessage(exception);
  } finally {
    creatingEmployee.value = false;
    busy.value = false;
  }
}
onMounted(() => {
  void load();
  void loadCatalogs();
});
</script>

<template>
  <div class="recruitment-page">
    <header class="page-heading">
      <div>
        <p class="text-sm font-semibold text-primary-600">Nhân sự</p>
        <h1 class="text-2xl font-bold text-surface-900">Tuyển dụng</h1>
        <p class="mt-1 text-sm text-surface-500">Quản lý hồ sơ và quá trình tiếp nhận ứng viên.</p>
      </div>
      <AppButton label="Thêm hồ sơ" icon="pi pi-plus" @click="router.push('/tuyen-dung/create')" />
    </header>

    <p v-if="catalogError" role="alert">
      {{ catalogError }} <AppButton label="Tải lại bộ lọc" text @click="loadCatalogs" />
    </p>
    <section class="panel">
      <form @submit.prevent="applySearch">
        <div class="filters">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="search"
              aria-label="Tìm họ tên, điện thoại, email"
              class="w-full"
              placeholder="Tìm họ tên, điện thoại, email..."
            />
          </span>
          <Select
            v-model="status"
            aria-label="Trạng thái"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            placeholder="Tất cả trạng thái"
            show-clear
          />
          <Select
            v-model="department"
            aria-label="Bộ phận dự kiến"
            filter
            :options="catalogs.departments"
            option-label="label"
            option-value="value"
            class="w-full"
            placeholder="Tất cả bộ phận"
            show-clear
          />
          <Select
            v-model="position"
            aria-label="Chức vụ dự kiến"
            filter
            :options="catalogs.positions"
            option-label="label"
            option-value="value"
            class="w-full"
            placeholder="Tất cả chức vụ"
            show-clear
          />
        </div>
        <div class="search-actions">
          <span class="search-hint">Nhập điều kiện rồi nhấn Enter hoặc Tìm kiếm.</span>
          <AppButton type="submit" label="Tìm kiếm" icon="pi pi-search" :disabled="loading" />
          <AppButton
            type="button"
            label="Xóa tìm kiếm"
            icon="pi pi-filter-slash"
            severity="secondary"
            outlined
            @click="clearSearch"
          />
          <AppButton
            type="button"
            label="Làm mới"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            :loading="loading"
            :disabled="busy"
            @click="load"
          />
        </div>
      </form>
    </section>

    <p v-if="success" role="status" class="text-green-700">
      {{ success }}
    </p>
    <AppErrorState v-if="error" :error="error" @retry="load" />
    <AppLoading v-else-if="loading" />

    <section v-else class="panel">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead class="bg-surface-50 text-xs uppercase tracking-wide text-surface-500">
            <tr>
              <th class="px-5 py-4">Ứng viên</th>
              <th class="px-5 py-4">Liên hệ</th>
              <th class="px-5 py-4">Giới tính</th>
              <th class="px-5 py-4">Bộ phận dự kiến</th>
              <th class="px-5 py-4">Chức vụ dự kiến</th>
              <th class="px-5 py-4">Ngày tiếp nhận</th>
              <th class="px-5 py-4">Trạng thái</th>
              <th class="px-5 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <tr
              v-for="row in filteredRows"
              :key="row.id"
              class="cursor-pointer transition hover:bg-primary-50/50"
              tabindex="0"
              @click="openDrawer(row)"
              @keydown.enter="openDrawer(row)"
            >
              <td class="px-5 py-4 font-semibold text-surface-900">
                {{ row.hoTen }}
                <p class="candidate-code">
                  {{ row.maNhanVien || 'Chưa có mã nhân viên' }}
                </p>
              </td>
              <td class="px-5 py-4">
                <p>{{ row.soDienThoai || '—' }}</p>
                <p class="mt-1 text-xs text-surface-500">
                  {{ row.email || '—' }}
                </p>
              </td>
              <td class="px-5 py-4">
                {{ genderLabels[row.gioiTinh] || '—' }}
              </td>
              <td class="px-5 py-4">
                {{ row.tenBoPhanDuKien }}
              </td>
              <td class="px-5 py-4">
                {{ row.tenChucVuDuKien }}
              </td>
              <td class="px-5 py-4">
                {{ date(row.ngayTiepNhan) }}
              </td>
              <td class="px-5 py-4">
                <AppStatusBadge
                  :label="recruitmentStatusLabels[row.trangThai]"
                  :severity="recruitmentStatusSeverity[row.trangThai]"
                />
              </td>
              <td class="px-5 py-4" @click.stop @keydown.stop>
                <AppButton
                  label="Xem"
                  icon="pi pi-eye"
                  text
                  :aria-label="'Xem hồ sơ ' + row.hoTen"
                  @click="router.push('/tuyen-dung/' + row.id + '/view')"
                />
                <AppButton
                  label="Sửa"
                  icon="pi pi-pencil"
                  text
                  :disabled="row.trangThai != '1'"
                  :aria-label="'Sửa hồ sơ ' + row.hoTen"
                  @click="router.push('/tuyen-dung/' + row.id + '/edit')"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmptyState
        v-if="!filteredRows.length"
        title="Không có hồ sơ phù hợp"
        description="Thử thay đổi từ khóa hoặc bộ lọc."
      />
      <div v-else class="border-t border-surface-100 px-5 py-3 text-xs text-surface-500">
        Hiển thị {{ filteredRows.length }} / {{ rows.length }} hồ sơ
      </div>
    </section>

    <Dialog
      :visible="pendingStatus !== null"
      modal
      :header="pendingStatus === '5' ? 'Xác nhận ngày nhận việc' : 'Xác nhận chuyển trạng thái'"
      :closable="!busy && !startConfirmed"
      :close-on-escape="!busy && !startConfirmed"
      :style="{ width: '440px', maxWidth: '95vw' }"
      @update:visible="!busy && !startConfirmed && (pendingStatus = null)"
    >
      <p v-if="selected && pendingStatus">
        Chuyển hồ sơ <strong>{{ selected.hoTen }}</strong> sang
        <strong>{{ recruitmentStatusLabels[pendingStatus] }}</strong
        >?
      </p>
      <div v-if="pendingStatus === '5'" class="start-date-field">
        <label for="recruitment-start-date">Ngày nhận việc *</label>
        <InputText
          id="recruitment-start-date"
          v-model="startDate"
          type="date"
          :disabled="busy"
          :invalid="!!startDateError"
          aria-describedby="recruitment-start-date-error"
          @update:model-value="startDateError = ''"
        />
        <small id="recruitment-start-date-error" class="text-red-600" role="alert">{{
          startDateError
        }}</small>
      </div>
      <p v-if="actionError" role="alert" class="text-red-600">
        {{ actionError }}
      </p>
      <p v-if="creatingEmployee" role="status" aria-live="polite">
        Đang tạo hồ sơ nhân viên...
      </p>
      <template #footer>
        <AppButton
          label="Hủy"
          severity="secondary"
          outlined
          :disabled="busy"
          @click="pendingStatus = null"
        />
        <AppButton
          :label="
            pendingStatus === '5'
              ? creatingEmployee
                ? 'Đang tạo hồ sơ nhân viên'
                : startConfirmed
                  ? employeeCreated
                    ? 'Hoàn tất trạng thái'
                    : 'Thử lại tạo hồ sơ'
                  : 'Xác nhận nhận việc'
              : 'Xác nhận'
          "
          :disabled="busy"
          :loading="busy"
          @click="pendingStatus && changeStatus(pendingStatus)"
        />
      </template>
    </Dialog>
    <CreateProbationContractDialog
      v-if="probationId"
      v-model:visible="probationVisible"
      :recruitment-id="probationId"
      @created="probationCreated"
      @busy="busy = $event"
    />
    <RecruitmentDrawer
      v-model:visible="drawerVisible"
      :record="selected"
      :busy="busy"
      @edit="edit"
      @probation="openProbation"
      @status="requestStatus"
    />
  </div>
</template>
<style scoped>
.start-date-field {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}
.candidate-code {
  margin-top: 5px !important;
  font-size: 11px;
  font-weight: 400;
  color: #64748b;
}
.search-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
}
.search-hint {
  margin-right: auto;
  color: #64748b;
  font-size: 13px;
}
.recruitment-page tbody tr:focus-visible {
  outline: 2px solid var(--p-primary-500);
  outline-offset: -2px;
}

.recruitment-page .filters {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) repeat(3, minmax(160px, 220px));
  gap: 8px;
}
.recruitment-page .filters > .p-input-icon-left {
  position: relative;
  display: block;
  min-width: 0;
}
.recruitment-page .filters > .p-input-icon-left > i {
  position: absolute;
  left: 10px;
  top: 50%;
  z-index: 1;
  transform: translateY(-50%);
}
.recruitment-page .filters > .p-input-icon-left :deep(input) {
  width: 100%;
  padding-left: 30px;
}
.recruitment-page .filters :deep(.p-select) {
  width: 100%;
  min-width: 0;
}
.recruitment-page table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 12px;
}
.recruitment-page th,
.recruitment-page td {
  padding: 10px 12px !important;
}
.recruitment-page th {
  background: #f8f9fa;
  font-size: 10px;
}
.recruitment-page td {
  border-bottom: 1px solid #f0f0f0;
}
.recruitment-page td p {
  margin: 0;
}
.recruitment-page td p + p {
  margin-top: 3px;
}
.recruitment-page tbody tr {
  height: auto;
}
@media (max-width: 1000px) {
  .recruitment-page .filters {
    grid-template-columns: 1fr 1fr;
  }
  .recruitment-page .filters > .p-input-icon-left {
    grid-column: 1/-1;
  }
}
@media (max-width: 600px) {
  .recruitment-page .filters {
    grid-template-columns: 1fr;
  }
}
</style>
