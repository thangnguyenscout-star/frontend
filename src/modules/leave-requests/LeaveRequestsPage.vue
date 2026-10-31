<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import DataTable, { type DataTablePageEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import Drawer from 'primevue/drawer';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import AppButton from '@/components/common/AppButton.vue';
import LeaveRequestForm from './LeaveRequestForm.vue';
import LeaveGantt from './LeaveGantt.vue';
import {
  ganttRange,
  getGanttLeaveRequests,
  getLeaveEmployees,
  type LeaveEmployee,
} from './leave-gantt.service';
import {
  getScheduleDepartments,
  type ScheduleDepartment,
} from '@/services/modules/schedule-shift.service';
import {
  getLeaveRequests,
  leaveDateTime,
  leaveEmployeeName,
  leaveRequestInput,
  leaveRequestStatuses,
  type LeaveRequest,
  type LeaveRequestFilter,
} from '@/services/modules/leave-request.service';
import { usePermissionStore } from '@/stores/permission.store';
import { useAuthStore } from '@/stores/auth.store';
import { getApiErrorMessage } from '@/utils/error-message';
import './leave-requests.css';

const permission = usePermissionStore();
const auth = useAuthStore();
const canCreate = computed(() => permission.can('leave', 'create'));
const mode = ref<'list' | 'gantt'>('list');
const ganttRows = ref<LeaveRequest[]>([]),
  ganttLoading = ref(false),
  ganttError = ref('');
const ganttProgress = ref({ loaded: 0, total: 0 });
const employeeCatalogReady = ref(false);
const defaultFilters = (): LeaveRequestFilter => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === 'year')!.value);
  const month = Number(parts.find((part) => part.type === 'month')!.value);
  return {
    thang: month,
    nam: year,
    maBoPhan: null,
    maNhanVien: null,
    tinhTrang: null,
  };
};
const initialFilters = defaultFilters();
const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  code: index + 1,
  label: `Tháng ${index + 1}`,
}));
const draft = reactive<LeaveRequestFilter>({ ...initialFilters });
const applied = ref<LeaveRequestFilter>({ ...initialFilters });
const rows = ref<LeaveRequest[]>([]);
const pageIndex = ref(1),
  pageSize = ref(20),
  totalRecords = ref(0),
  totalPages = ref(0);
const loading = ref(false),
  error = ref(''),
  filterError = ref(''),
  notice = ref('');
const departments = ref<ScheduleDepartment[]>([]);
const employees = ref<LeaveEmployee[]>([]);
const catalogLoading = ref(false),
  catalogError = ref('');
const createOpen = ref(false),
  creatingBusy = ref(false),
  createEmployeeId = ref<string | null>(null);
const detailOpen = ref(false),
  selected = ref<LeaveRequest | null>(null);
let requestSequence = 0,
  ganttSequence = 0,
  catalogSequence = 0,
  disposed = false;
let catalogPromise: Promise<void> | null = null;
const employeeLabel = (person: LeaveEmployee) =>
  leaveEmployeeName({
    hoTen: person.hoTen as string | null,
    ho: person.ho as string | null,
    tenDem: person.tenDem as string | null,
    ten: person.ten as string | null,
  });
const employeeOptions = computed(() =>
  employees.value
    .filter((e) => !draft.maBoPhan || e.maBoPhan === draft.maBoPhan)
    .map((e) => ({ code: e.maNhanVien, label: `${e.maNhanVien} · ${employeeLabel(e)}` })),
);
const createOptions = computed(() =>
  employees.value
    .filter((e) => auth.role !== 'Staff' || e.maNhanVien === auth.maNhanVien)
    .map((e) => ({ code: e.maNhanVien, label: `${e.maNhanVien} · ${employeeLabel(e)}` })),
);
const createEmployee = computed(() =>
  employees.value.find((e) => e.maNhanVien === createEmployeeId.value),
);
const statusInfo = (status: string | null) => leaveRequestStatuses.find((s) => s.code === status);
const dayCount = (value: number | null) =>
  value === null ? '—' : new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);
const filterSummary = computed(
  () =>
    [
      applied.value.thang ? `Tháng ${applied.value.thang}` : 'Tất cả tháng',
      applied.value.nam ? `Năm ${applied.value.nam}` : 'Tất cả năm',
      departments.value.find((d) => d.code === applied.value.maBoPhan)?.name ||
        applied.value.maBoPhan,
      applied.value.maNhanVien,
      statusInfo(applied.value.tinhTrang)?.label || applied.value.tinhTrang,
    ]
      .filter(Boolean)
      .join(' · ') || 'Tất cả thời gian · Tất cả bộ phận · Tất cả tình trạng',
);

async function load(page = pageIndex.value, size = pageSize.value) {
  const sequence = ++requestSequence;
  loading.value = true;
  error.value = '';
  try {
    const result = await getLeaveRequests({ ...applied.value }, page, size);
    if (sequence !== requestSequence || disposed) return;
    if (result.totalRecords > 0 && result.totalPages > 0 && page > result.totalPages) {
      await load(result.totalPages, size);
      return;
    }
    rows.value = result.items;
    pageIndex.value = result.pageIndex;
    pageSize.value = result.pageSize;
    totalRecords.value = result.totalRecords;
    totalPages.value = result.totalPages;
  } catch (e) {
    if (sequence === requestSequence && !disposed) {
      error.value = getApiErrorMessage(e);
      rows.value = [];
      totalRecords.value = 0;
      totalPages.value = 0;
    }
  } finally {
    if (sequence === requestSequence && !disposed) loading.value = false;
  }
}
function apply() {
  try {
    const { thang, nam, maBoPhan, maNhanVien, tinhTrang } = leaveRequestInput(
      draft,
      1,
      pageSize.value,
    );
    if (
      draft.maBoPhan &&
      draft.maNhanVien &&
      !employeeOptions.value.some((e) => e.code === draft.maNhanVien)
    )
      throw new Error('Nhân viên không thuộc bộ phận đang chọn.');
    if (mode.value === 'gantt') ganttRange({ thang, nam, maBoPhan, maNhanVien, tinhTrang });
    applied.value = { thang, nam, maBoPhan, maNhanVien, tinhTrang };
    filterError.value = '';
    pageIndex.value = 1;
    void reloadCurrent();
  } catch (e) {
    filterError.value = getApiErrorMessage(e);
  }
}
function reset() {
  Object.assign(draft, defaultFilters());
  apply();
}
function changePage(event: DataTablePageEvent) {
  pageIndex.value = event.rows !== pageSize.value ? 1 : event.page + 1;
  pageSize.value = event.rows;
  void load(pageIndex.value, pageSize.value);
}
async function fetchCatalog() {
  const sequence = ++catalogSequence;
  catalogLoading.value = true;
  catalogError.value = '';
  employeeCatalogReady.value = false;
  const [departmentResult, employeeResult] = await Promise.allSettled([
    getScheduleDepartments(),
    getLeaveEmployees(),
  ]);
  if (sequence !== catalogSequence || disposed) return;
  const errors: string[] = [];
  if (departmentResult.status === 'fulfilled') departments.value = departmentResult.value;
  else errors.push('Bộ phận: ' + getApiErrorMessage(departmentResult.reason));
  if (employeeResult.status === 'fulfilled') {
    employees.value = employeeResult.value;
    employeeCatalogReady.value = true;
  } else errors.push('Nhân viên: ' + getApiErrorMessage(employeeResult.reason));
  catalogError.value = errors.join(' · ');
  catalogLoading.value = false;
}
async function loadCatalog() {
  if (catalogPromise) return catalogPromise;
  catalogPromise = fetchCatalog();
  try {
    await catalogPromise;
  } finally {
    catalogPromise = null;
  }
}
async function loadGantt() {
  const sequence = ++ganttSequence;
  const current = () => sequence === ganttSequence && !disposed;
  const filter = { ...applied.value };
  ganttLoading.value = true;
  ganttError.value = '';
  ganttRows.value = [];
  ganttProgress.value = { loaded: 0, total: 0 };
  try {
    ganttRange(filter);
    if (!employeeCatalogReady.value) await loadCatalog();
    if (!current()) return;
    if (!employeeCatalogReady.value)
      throw new Error(
        'Chưa tải được danh sách nhân viên. Vui lòng tải lại danh mục trước khi xem Gantt.',
      );
    const records = await getGanttLeaveRequests(filter, {
      isCurrent: current,
      onProgress: (loaded, total) => {
        if (current()) ganttProgress.value = { loaded, total };
      },
    });
    if (current() && records) ganttRows.value = records;
  } catch (e) {
    if (current()) ganttError.value = getApiErrorMessage(e);
  } finally {
    if (current()) ganttLoading.value = false;
  }
}
async function reloadCurrent() {
  if (mode.value === 'gantt') await loadGantt();
  else await load();
}
async function refresh() {
  if (mode.value === 'gantt') employeeCatalogReady.value = false;
  await reloadCurrent();
}
async function switchMode(value: 'list' | 'gantt') {
  if (mode.value === value) return;
  mode.value = value;
  ++requestSequence;
  ++ganttSequence;
  loading.value = false;
  ganttLoading.value = false;
  await reloadCurrent();
}
function openCreate() {
  if (!canCreate.value) return;
  createEmployeeId.value = createOptions.value.some((e) => e.code === applied.value.maNhanVien)
    ? applied.value.maNhanVien
    : createOptions.value.some((e) => e.code === auth.maNhanVien)
      ? auth.maNhanVien
      : null;
  creatingBusy.value = false;
  createOpen.value = true;
}
function closeCreate() {
  if (!creatingBusy.value) createOpen.value = false;
}
async function created() {
  creatingBusy.value = false;
  createOpen.value = false;
  notice.value = 'Đã tạo đơn xin phép thành công. Danh sách được tải lại theo bộ lọc đang áp dụng.';
  pageIndex.value = 1;
  await reloadCurrent();
}
function view(row: LeaveRequest) {
  selected.value = row;
  detailOpen.value = true;
}
watch(
  () => draft.maBoPhan,
  () => {
    if (draft.maNhanVien && !employeeOptions.value.some((e) => e.code === draft.maNhanVien))
      draft.maNhanVien = null;
  },
);
onMounted(() => {
  void load();
  void loadCatalog();
});
onBeforeUnmount(() => {
  disposed = true;
  ++requestSequence;
  ++ganttSequence;
  ++catalogSequence;
});
</script>
<template>
  <section class="leave-requests-page">
    <header class="leave-requests-heading">
      <div>
        <span class="leave-eyebrow">QUẢN LÝ NGHỈ PHÉP</span>
        <h1>Đơn nghỉ phép</h1>
        <p>Theo dõi đơn đăng ký nghỉ và tình trạng phê duyệt của nhân viên.</p>
      </div>
      <div class="leave-heading-actions">
        <RouterLink to="/leave/annual"><i class="pi pi-wallet" /> Quản lý phép năm</RouterLink
        ><AppButton
          v-if="canCreate"
          label="Tạo đơn xin phép"
          icon="pi pi-plus"
          @click="openCreate"
        />
      </div>
    </header>
    <form class="leave-request-filters" @submit.prevent="apply">
      <label
        >Tháng<Select
          v-model="draft.thang"
          :options="monthOptions"
          option-label="label"
          option-value="code"
          show-clear
          placeholder="Tất cả tháng"
          aria-label="Lọc tháng"
      /></label>
      <label
        >Năm<input
          v-model.number="draft.nam"
          type="number"
          min="1"
          max="9999"
          step="1"
          placeholder="Tất cả năm"
          aria-label="Lọc năm"
      /></label>
      <label
        >Bộ phận<Select
          v-model="draft.maBoPhan"
          :options="departments"
          option-label="name"
          option-value="code"
          show-clear
          filter
          placeholder="Tất cả bộ phận"
          :loading="catalogLoading"
          aria-label="Lọc bộ phận"
      /></label>
      <label
        >Nhân viên<Select
          v-model="draft.maNhanVien"
          :options="employeeOptions"
          option-label="label"
          option-value="code"
          show-clear
          filter
          placeholder="Tất cả nhân viên"
          :loading="catalogLoading"
          aria-label="Lọc nhân viên"
      /></label>
      <label
        >Tình trạng<Select
          v-model="draft.tinhTrang"
          :options="[...leaveRequestStatuses]"
          option-label="label"
          option-value="code"
          show-clear
          placeholder="Tất cả tình trạng"
          aria-label="Lọc tình trạng đơn"
      /></label>
      <div class="leave-filter-actions">
        <AppButton type="submit" label="Áp dụng" icon="pi pi-filter" /><AppButton
          type="button"
          label="Đặt lại"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          @click="reset"
        />
      </div>
    </form>
    <p v-if="filterError" class="leave-error" role="alert">{{ filterError }}</p>
    <p v-if="catalogError" class="leave-catalog-error" role="alert">
      Không tải đủ danh mục: {{ catalogError }}
      <AppButton label="Tải lại danh mục" text :loading="catalogLoading" @click="loadCatalog" />
    </p>
    <p v-if="notice" class="leave-success" role="status">
      <i class="pi pi-check-circle" /> {{ notice
      }}<button type="button" aria-label="Đóng thông báo" @click="notice = ''">×</button>
    </p>
    <section class="leave-list-panel">
      <div class="leave-list-toolbar">
        <div>
          <h2>
            {{ mode === 'list' ? 'Danh sách đơn nghỉ phép' : 'Lịch nghỉ phép theo nhân viên' }}
            <span>{{ mode === 'list' ? totalRecords : ganttRows.length }}</span>
          </h2>
          <p>{{ filterSummary }}</p>
        </div>
        <div class="leave-view-actions">
          <div class="leave-view-switch" role="group" aria-label="Chế độ hiển thị nghỉ phép">
            <button
              type="button"
              :class="{ active: mode === 'list' }"
              :aria-pressed="mode === 'list'"
              @click="switchMode('list')"
            >
              <i class="pi pi-list" /> Danh sách</button
            ><button
              type="button"
              :class="{ active: mode === 'gantt' }"
              :aria-pressed="mode === 'gantt'"
              @click="switchMode('gantt')"
            >
              <i class="pi pi-chart-bar" /> Biểu đồ Gantt
            </button>
          </div>
          <AppButton
            label="Tải lại"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            :loading="mode === 'list' ? loading : ganttLoading"
            @click="refresh"
          />
        </div>
      </div>
      <template v-if="mode === 'gantt'"
        ><div v-if="ganttLoading" class="gantt-loading" role="status">
          <i class="pi pi-spin pi-spinner" /><strong>Đang tải lịch nghỉ phép…</strong
          ><span v-if="ganttProgress.total"
            >{{ ganttProgress.loaded }} / {{ ganttProgress.total }} đơn</span
          ><span v-else>Đang tải danh sách nhân viên và dữ liệu nghỉ phép</span>
        </div>
        <div v-else-if="ganttError" class="leave-list-error" role="alert">
          <i class="pi pi-exclamation-circle" />
          <p>{{ ganttError }}</p>
          <AppButton label="Thử lại" outlined @click="loadGantt" />
        </div>
        <LeaveGantt
          v-else
          :employees="employees"
          :requests="ganttRows"
          :filter="applied"
          @open="view"
      /></template>
      <div v-else-if="error" class="leave-list-error" role="alert">
        <i class="pi pi-exclamation-circle" />
        <p>{{ error }}</p>
        <AppButton label="Thử lại" outlined @click="load()" />
      </div>
      <DataTable
        v-else
        class="leave-excel-table"
        :value="rows"
        data-key="id"
        :loading="loading"
        lazy
        paginator
        show-gridlines
        striped-rows
        scrollable
        scroll-height="560px"
        :rows="pageSize"
        :first="(pageIndex - 1) * pageSize"
        :total-records="totalRecords"
        :rows-per-page-options="[10, 20, 50, 100]"
        paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        current-page-report-template="{first}–{last} / {totalRecords} đơn"
        :table-style="{ minWidth: '1850px' }"
        @page="changePage"
      >
        <Column header="#" frozen style="width: 48px; min-width: 48px"
          ><template #body="{ index }">{{
            (pageIndex - 1) * pageSize + index + 1
          }}</template></Column
        >
        <Column field="maNhanVien" header="Mã nhân viên" frozen style="min-width: 115px"
          ><template #body="{ data }"
            ><button type="button" class="leave-table-link" @click="view(data)">
              {{ data.maNhanVien }}
            </button></template
          ></Column
        >
        <Column header="Họ và tên" frozen style="min-width: 200px"
          ><template #body="{ data }"
            ><button type="button" class="leave-table-link leave-person-name" @click="view(data)">
              {{ leaveEmployeeName(data) }}
            </button></template
          ></Column
        >
        <Column field="tenBoPhan" header="Bộ phận" style="min-width: 170px"
          ><template #body="{ data }">{{
            data.tenBoPhan || data.maBoPhan || '—'
          }}</template></Column
        >
        <Column field="tenChucVu" header="Chức vụ" style="min-width: 145px"
          ><template #body="{ data }">{{
            data.tenChucVu || data.maChucVu || '—'
          }}</template></Column
        >
        <Column header="Ngày đăng ký" style="min-width: 155px"
          ><template #body="{ data }">{{
            leaveDateTime(data.ngayDangKyLichNghi)
          }}</template></Column
        >
        <Column header="Từ ngày / giờ" style="min-width: 155px"
          ><template #body="{ data }">{{ leaveDateTime(data.tuNgay) }}</template></Column
        >
        <Column header="Đến ngày / giờ" style="min-width: 155px"
          ><template #body="{ data }">{{ leaveDateTime(data.denNgay) }}</template></Column
        >
        <Column header="Số ngày nghỉ" style="min-width: 110px" body-class="leave-number"
          ><template #body="{ data }">{{ dayCount(data.soNgayNghi) }}</template></Column
        >
        <Column field="lyDoNghi" header="Lý do nghỉ" style="min-width: 260px"
          ><template #body="{ data }"
            ><span class="leave-reason" :title="data.lyDoNghi || ''">{{
              data.lyDoNghi || '—'
            }}</span></template
          ></Column
        >
        <Column header="Tình trạng" style="min-width: 125px"
          ><template #body="{ data }"
            ><Tag
              :value="statusInfo(data.tinhTrang)?.label || data.tinhTrang || '—'"
              :severity="statusInfo(data.tinhTrang)?.severity || 'secondary'" /></template
        ></Column>
        <Column header="Ngày duyệt" style="min-width: 155px"
          ><template #body="{ data }">{{ leaveDateTime(data.ngayDuyet) }}</template></Column
        >
        <Column field="nguoiDuyetDon" header="Người duyệt" style="min-width: 145px"
          ><template #body="{ data }">{{ data.nguoiDuyetDon || '—' }}</template></Column
        >
        <Column header="Chi tiết" style="min-width: 75px"
          ><template #body="{ data }"
            ><button
              type="button"
              class="leave-detail-button"
              :aria-label="'Xem đơn ' + data.id"
              @click="view(data)"
            >
              <i class="pi pi-arrow-up-right" /></button></template
        ></Column>
        <template #empty
          ><div class="leave-empty">
            <i class="pi pi-calendar" /><strong>Không có đơn nghỉ phép</strong
            ><span>Thử thay đổi khoảng ngày, bộ phận hoặc tình trạng.</span>
          </div></template
        >
      </DataTable>
      <div v-if="mode === 'list'" class="leave-list-footnote">
        <span>Phân trang theo dữ liệu máy chủ</span
        ><span>{{ totalPages ? `Trang ${pageIndex} / ${totalPages}` : '0 bản ghi' }}</span>
      </div>
    </section>
    <Drawer
      :visible="createOpen"
      position="right"
      header="Tạo đơn xin phép"
      class="leave-create-drawer"
      :style="{ width: '780px', maxWidth: '100vw' }"
      :closable="!creatingBusy"
      :close-on-escape="!creatingBusy"
      :dismissable="!creatingBusy"
      @update:visible="!$event && closeCreate()"
    >
      <p class="leave-drawer-intro">
        Chọn nhân viên, nhập khoảng nghỉ, loại nghỉ phép và lý do để gửi đơn.
      </p>
      <label class="leave-create-employee"
        >Nhân viên *<Select
          v-model="createEmployeeId"
          :options="createOptions"
          option-label="label"
          option-value="code"
          filter
          placeholder="Tìm mã hoặc họ tên nhân viên"
          :loading="catalogLoading"
          :disabled="creatingBusy"
          aria-label="Nhân viên tạo đơn nghỉ phép"
      /></label>
      <p v-if="catalogError" class="leave-error" role="alert">
        {{ catalogError
        }}<AppButton label="Tải lại danh mục" text :loading="catalogLoading" @click="loadCatalog" />
      </p>
      <LeaveRequestForm
        v-if="createOpen && createEmployee && canCreate"
        :key="createEmployee.maNhanVien"
        :employee-id="createEmployee.maNhanVien"
        :employee-name="employeeLabel(createEmployee)"
        @busy="creatingBusy = $event"
        @close="closeCreate"
        @saved="created"
      />
      <div v-else-if="!catalogLoading" class="leave-create-placeholder">
        <i class="pi pi-user" />
        <p>Chọn nhân viên để nhập nội dung đơn xin phép.</p>
      </div>
    </Drawer>
    <Dialog
      v-model:visible="detailOpen"
      modal
      header="Chi tiết đơn nghỉ phép"
      :style="{ width: '680px', maxWidth: '95vw' }"
      ><template v-if="selected"
        ><div class="leave-detail-person">
          <div>
            <h3>{{ leaveEmployeeName(selected) }}</h3>
            <p>{{ selected.maNhanVien }} · {{ selected.tenBoPhan || selected.maBoPhan || '—' }}</p>
          </div>
          <Tag
            :value="statusInfo(selected.tinhTrang)?.label || selected.tinhTrang || '—'"
            :severity="statusInfo(selected.tinhTrang)?.severity || 'secondary'"
          />
        </div>
        <dl class="leave-detail-fields">
          <dt>Mã đơn</dt>
          <dd>{{ selected.id }}</dd>
          <dt>Ngày sinh</dt>
          <dd>{{ leaveDateTime(selected.ngaySinh, true) }}</dd>
          <dt>Chức vụ</dt>
          <dd>{{ selected.tenChucVu || selected.maChucVu || '—' }}</dd>
          <dt>Ngày đăng ký</dt>
          <dd>{{ leaveDateTime(selected.ngayDangKyLichNghi) }}</dd>
          <dt>Từ ngày / giờ</dt>
          <dd>{{ leaveDateTime(selected.tuNgay) }}</dd>
          <dt>Đến ngày / giờ</dt>
          <dd>{{ leaveDateTime(selected.denNgay) }}</dd>
          <dt>Số ngày nghỉ</dt>
          <dd>{{ dayCount(selected.soNgayNghi) }}</dd>
          <dt>Lý do nghỉ</dt>
          <dd>{{ selected.lyDoNghi || '—' }}</dd>
          <dt>Ngày duyệt</dt>
          <dd>{{ leaveDateTime(selected.ngayDuyet) }}</dd>
          <dt>Người duyệt</dt>
          <dd>{{ selected.nguoiDuyetDon || '—' }}</dd>
        </dl></template
      ><template #footer
        ><AppButton
          label="Đóng"
          severity="secondary"
          outlined
          @click="detailOpen = false" /></template
    ></Dialog>
  </section>
</template>
