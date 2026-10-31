<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import ExcelReportSheet from '@/modules/attendance-reports/ExcelReportSheet.vue';
import type { ReportColumn, ReportRow } from '@/modules/attendance-reports/reports.model';
import { useAuthStore } from '@/stores/auth.store';
import { usePermissionStore } from '@/stores/permission.store';
import { getApiErrorMessage } from '@/utils/error-message';
import {
  annualEmployees,
  balanceFields,
  balanceLabels,
  balanceStatus,
  balanceTotals,
  blankBalance,
  blankPolicy,
  createAnnualDemo,
  policyNumbers,
  type AnnualLeaveState,
  type BalanceField,
  type LeaveBalance,
  type LeavePolicy,
} from './annual-leave.model';
import {
  adjustBalance,
  allocateBalances,
  loadAnnualDemo,
  persistAnnualDemo,
  previewAdjustment,
  saveBalance,
  savePolicy,
} from './annual-leave.repository';
import '@/modules/attendance-reports/reports.css';
import './annual-leave.css';

const auth = useAuthStore();
const permission = usePermissionStore();
const canManage = computed(
  () =>
    ['Admin', 'Owner', 'HR Manager', 'HR Staff'].includes(auth.role || '') &&
    permission.can('leave', 'update'),
);
const parts = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Bangkok',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).formatToParts(new Date());
const localPart = (key: string) => parts.find((p) => p.type === key)!.value;
const today = `${localPart('year')}-${localPart('month')}-${localPart('day')}`;
const currentYear = Number(localPart('year'));
const year = ref(currentYear);
const yearDraft = ref(currentYear);
const tab = ref<'balances' | 'policies'>('balances');
const state = ref<AnnualLeaveState>(createAnnualDemo(currentYear));
const storageReady = ref(false);
const search = ref('');
const department = ref('');
const status = ref('');
const error = ref('');
const notice = ref('');
const page = ref(1);
const pageSize = ref(20);
const sort = ref({ key: '', direction: 1 });
const departments = [...new Set(annualEmployees.map((e) => e.department))];
const selected = ref<LeaveBalance | null>(null);
const detailOpen = ref(false);
const policyOpen = ref(false);
const balanceOpen = ref(false);
const adjustmentOpen = ref(false);
const allocationOpen = ref(false);
const resetOpen = ref(false);
const formError = ref('');
const policyForm = reactive<LeavePolicy>(blankPolicy());
const balanceForm = reactive<LeaveBalance>(blankBalance(currentYear));
const templateId = ref<number | null>(null);
const adjustment = reactive({ delta: 0, reason: '' });
const allocation = reactive({
  policyId: null as number | null,
  year: currentYear,
  codes: [] as string[],
});
const activePolicies = computed(() => state.value.policies.filter((p) => p.isActive === true));
const format = (value: number | null) =>
  value === null ? '—' : new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value);
const boolLabel = (value: boolean | null) =>
  value === null ? 'Chưa thiết lập' : value ? 'Có' : 'Không';
const employee = (code: string) => annualEmployees.find((e) => e.code === code);
const normalized = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase();
const balancesInYear = computed(() => state.value.balances.filter((b) => b.nam === year.value));
const filteredBalances = computed(() =>
  balancesInYear.value.filter((balance) => {
    const person = employee(balance.nhanVienId);
    return (
      (!department.value || person?.department === department.value) &&
      (!search.value.trim() ||
        normalized(balance.nhanVienId + ' ' + person?.name).includes(
          normalized(search.value.trim()),
        )) &&
      (!status.value || balanceStatus(balance, today).key === status.value)
    );
  }),
);
const filteredPolicies = computed(() =>
  state.value.policies.filter(
    (p) =>
      (!search.value.trim() ||
        normalized(p.tenChinhSach).includes(normalized(search.value.trim()))) &&
      (!status.value ||
        (status.value === 'active'
          ? p.isActive === true
          : status.value === 'inactive'
            ? p.isActive === false
            : p.isActive === null)),
  ),
);
const column = (
  key: string,
  label: string,
  group: string,
  width = 115,
  total = false,
): ReportColumn => ({ key, label, group, width, numeric: total, total });
const balanceColumns: ReportColumn[] = [
  column('code', 'Mã nhân viên', 'Nhân sự', 110),
  column('name', 'Họ và tên', 'Nhân sự', 185),
  column('department', 'Bộ phận', 'Đơn vị', 175),
  column('soNgayPhepCoBan', 'Cơ bản', 'Quỹ phép được cấp (ngày)', 90, true),
  column('soNgayPhepThamNien', 'Thâm niên', 'Quỹ phép được cấp (ngày)', 100, true),
  column('soNgayPhepChuyenSang', 'Chuyển sang', 'Quỹ phép được cấp (ngày)', 110, true),
  column('soNgayPhepDieuChinh', 'Điều chỉnh', 'Quỹ phép được cấp (ngày)', 100, true),
  column('tongPhepDuocCap', 'Tổng được cấp', 'Quỹ phép được cấp (ngày)', 125, true),
  column('soNgayPhepDaSieuDung', 'Đã sử dụng', 'Biến động phép (ngày)', 110, true),
  column('soNgayPhepChoDuyet', 'Chờ duyệt', 'Biến động phép (ngày)', 100, true),
  column('soNgayPhepCuHetHan', 'Cũ hết hạn', 'Biến động phép (ngày)', 105, true),
  column('soNgayPhepConLai', 'Còn khả dụng', 'Số dư (ngày)', 125, true),
  column('expiry', 'Hạn phép cũ', 'Theo dõi', 120),
  column('health', 'Tình trạng', 'Theo dõi', 150),
  column('ghiChu', 'Ghi chú', 'Theo dõi', 250),
];
const policyColumns: ReportColumn[] = [
  column('code', 'ID', 'Chính sách', 65),
  column('name', 'Tên chính sách', 'Chính sách', 260),
  column('annual', 'Phép năm', 'Quyền lợi (ngày)', 100),
  column('probation', 'Thử việc hưởng phép', 'Quyền lợi (ngày)', 160),
  column('unpaid', 'Nghỉ không lương', 'Quyền lợi (ngày)', 150),
  column('accrual', 'Tháng cộng ngày', 'Tích lũy (tháng)', 140),
  column('seniority', 'Tháng thâm niên', 'Tích lũy (tháng)', 145),
  column('carry', 'Tối đa chuyển', 'Chuyển phép', 125),
  column('expiry', 'Tháng hết hạn', 'Chuyển phép', 125),
  column('health', 'Trạng thái', 'Theo dõi', 140),
  column('creator', 'Người tạo', 'Theo dõi', 130),
];
const columns = computed(() => (tab.value === 'balances' ? balanceColumns : policyColumns));
const rows = computed<ReportRow[]>(() =>
  tab.value === 'balances'
    ? filteredBalances.value.map((balance) => {
        const person = employee(balance.nhanVienId);
        const values = Object.fromEntries(balanceFields.map((key) => [key, balance[key] ?? '—']));
        const totals = balanceTotals(balance);
        return {
          ...values,
          id: String(balance.id),
          code: balance.nhanVienId,
          name: person?.name || balance.nhanVienId,
          department: person?.department || '—',
          tongPhepDuocCap: totals.tongPhepDuocCap ?? '—',
          soNgayPhepConLai: totals.soNgayPhepConLai ?? '—',
          expiry: balance.hanSuDungPhepCu?.split('-').reverse().join('/') || '—',
          health: balanceStatus(balance, today).label,
          ghiChu: balance.ghiChu || '—',
        };
      })
    : filteredPolicies.value.map((policy) => ({
        id: String(policy.id),
        code: String(policy.id),
        name: policy.tenChinhSach,
        department: '',
        annual: policy.soNgayPhepNam ?? '—',
        probation: boolLabel(policy.thuViecHuongNgayPhep),
        unpaid: boolLabel(policy.choPhepNghiKhongLuong),
        accrual: policy.soThangDuocCongNgay ?? '—',
        seniority: policy.soThangThamNienCongDon ?? '—',
        carry: policy.soPhepDuocChuyenSangNam ?? '—',
        expiry: policy.thangHetDungPhepCu ?? '—',
        health:
          policy.isActive === null
            ? 'Chưa thiết lập'
            : policy.isActive
              ? 'Đang áp dụng'
              : 'Ngừng áp dụng',
        creator: policy.userCreated || '—',
      })),
);
const sorted = computed(() =>
  [...rows.value].sort((a, b) => {
    const x = a[sort.value.key],
      y = b[sort.value.key];
    return !sort.value.key
      ? 0
      : (typeof x === 'number' && typeof y === 'number'
          ? x - y
          : String(x).localeCompare(String(y), 'vi')) * sort.value.direction;
  }),
);
const pages = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize.value)));
const visibleRows = computed(() =>
  sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value),
);
const summary = computed(() => {
  const list = filteredBalances.value;
  const totals = list.map(balanceTotals);
  return {
    employees: list.length,
    granted: totals.reduce((sum, r) => sum + (r.tongPhepDuocCap || 0), 0),
    used: list.reduce((sum, r) => sum + (r.soNgayPhepDaSieuDung || 0), 0),
    available: totals.reduce((sum, r) => sum + (r.soNgayPhepConLai || 0), 0),
    pending: list.reduce((sum, r) => sum + (r.soNgayPhepChoDuyet || 0), 0),
    incomplete: list.some((r) => balanceTotals(r).soNgayPhepConLai === null),
  };
});
const balancePreview = computed(() => balanceTotals(balanceForm));
const adjustmentPreview = computed(() =>
  selected.value && Number.isFinite(adjustment.delta)
    ? previewAdjustment(selected.value, adjustment.delta)
    : null,
);
const allocationExisting = computed(
  () =>
    allocation.codes.filter((code) =>
      state.value.balances.some((r) => r.nhanVienId === code && r.nam === allocation.year),
    ).length,
);
function authorize() {
  if (!canManage.value) throw new Error('Bạn không có quyền quản lý phép năm.');
  if (!storageReady.value)
    throw new Error('Chưa đọc được dữ liệu mẫu. Hãy tải lại hoặc khôi phục dữ liệu mẫu.');
}
function commit(next: AnnualLeaveState) {
  authorize();
  persistAnnualDemo(next);
  state.value = next;
}
function changeTab(value: 'balances' | 'policies') {
  tab.value = value;
  search.value = '';
  status.value = '';
  page.value = 1;
  sort.value = { key: '', direction: 1 };
}
function applyYear() {
  if (!Number.isInteger(yearDraft.value) || yearDraft.value < 1900 || yearDraft.value > 9999) {
    error.value = 'Năm quản lý phải từ 1900 đến 9999.';
    return;
  }
  year.value = yearDraft.value;
  page.value = 1;
  error.value = '';
}
function sortBy(key: string) {
  sort.value = { key, direction: sort.value.key === key ? -sort.value.direction : 1 };
}
function openPolicy(policy = blankPolicy()) {
  formError.value = '';
  Object.assign(policyForm, policy);
  policyOpen.value = true;
}
function openBalance(balance = blankBalance(year.value)) {
  formError.value = '';
  Object.assign(balanceForm, balance);
  templateId.value = null;
  balanceOpen.value = true;
}
function openRow(row: ReportRow) {
  if (tab.value === 'policies')
    openPolicy(state.value.policies.find((p) => p.id === Number(row.id))!);
  else {
    selected.value = state.value.balances.find((b) => b.id === Number(row.id))!;
    detailOpen.value = true;
  }
}
function template() {
  const policy = activePolicies.value.find((p) => p.id === templateId.value);
  if (policy) balanceForm.soNgayPhepCoBan = policy.soNgayPhepNam;
}
function setPolicyNumber(key: (typeof policyNumbers)[number][0], event: Event) {
  const input = event.target as HTMLInputElement;
  policyForm[key] = input.value === '' ? null : input.valueAsNumber;
}
function setBalanceNumber(key: BalanceField, event: Event) {
  const input = event.target as HTMLInputElement;
  balanceForm[key] = input.value === '' ? null : input.valueAsNumber;
}
function submitPolicy() {
  try {
    commit(savePolicy(state.value, policyForm, 'HR.DEMO'));
    policyOpen.value = false;
    notice.value = 'Đã lưu chính sách vào dữ liệu mẫu trên trình duyệt.';
  } catch (e) {
    formError.value = getApiErrorMessage(e);
  }
}
function submitBalance() {
  try {
    if (balanceForm.id && !balanceForm.ghiChu?.trim())
      throw new Error('Nhập ghi chú cho lần cập nhật này.');
    commit(saveBalance(state.value, balanceForm));
    balanceOpen.value = false;
    detailOpen.value = false;
    notice.value = 'Đã lưu số dư phép mẫu.';
  } catch (e) {
    formError.value = getApiErrorMessage(e);
  }
}
function openAdjustment() {
  if (!selected.value) return;
  formError.value = '';
  Object.assign(adjustment, { delta: 0, reason: '' });
  adjustmentOpen.value = true;
}
function submitAdjustment() {
  try {
    if (!selected.value) return;
    const id = selected.value.id;
    commit(adjustBalance(state.value, id, adjustment.delta, adjustment.reason));
    selected.value = state.value.balances.find((r) => r.id === id)!;
    adjustmentOpen.value = false;
    notice.value = 'Đã cập nhật phép điều chỉnh và tính lại số dư mẫu.';
  } catch (e) {
    formError.value = getApiErrorMessage(e);
  }
}
function openAllocation() {
  formError.value = '';
  Object.assign(allocation, {
    policyId: activePolicies.value[0]?.id || null,
    year: year.value,
    codes: [],
  });
  allocationOpen.value = true;
}
function submitAllocation() {
  try {
    const result = allocateBalances(
      state.value,
      allocation.policyId || 0,
      allocation.year,
      allocation.codes,
    );
    commit(result.state);
    year.value = allocation.year;
    yearDraft.value = allocation.year;
    allocationOpen.value = false;
    notice.value = `Đã tạo ${result.created} số dư mẫu; bỏ qua ${result.skipped} nhân viên đã có quỹ trong năm.`;
  } catch (e) {
    formError.value = getApiErrorMessage(e);
  }
}
function reload() {
  try {
    state.value = loadAnnualDemo(currentYear);
    storageReady.value = true;
    error.value = '';
  } catch (e) {
    storageReady.value = false;
    error.value = getApiErrorMessage(e);
  }
}
function resetDemo() {
  try {
    if (!canManage.value) throw new Error('Bạn không có quyền khôi phục dữ liệu mẫu.');
    const next = createAnnualDemo(currentYear);
    persistAnnualDemo(next);
    state.value = next;
    storageReady.value = true;
    resetOpen.value = false;
    error.value = '';
    notice.value = 'Đã khôi phục dữ liệu minh họa ban đầu.';
  } catch (e) {
    error.value = getApiErrorMessage(e);
  }
}
function exportCsv() {
  const cell = (value: string | number) => {
    let text = String(value ?? '');
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const csv =
    '\ufeff' +
    [
      columns.value.map((c) => c.label),
      ...sorted.value.map((r) => columns.value.map((c) => r[c.key])),
    ]
      .map((r) => r.map(cell).join(','))
      .join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `PhepNam_${tab.value}_${year.value}_mau.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notice.value = `Đã xuất ${sorted.value.length} bản ghi mẫu.`;
}
function storageChanged(event: StorageEvent) {
  if (event.key === 'hrms-annual-leave-prototype-v1') {
    reload();
    detailOpen.value = false;
    notice.value = 'Dữ liệu mẫu đã được cập nhật từ tab khác.';
  }
}
onMounted(() => {
  reload();
  window.addEventListener('storage', storageChanged);
});
onBeforeUnmount(() => window.removeEventListener('storage', storageChanged));
watch(pages, (value) => {
  if (page.value > value) page.value = value;
});
</script>
<template>
  <section class="attendance-reports annual-leave-page">
    <div class="annual-breadcrumb">
      <RouterLink to="/leave">Nghỉ phép</RouterLink><i class="pi pi-angle-right" /><span
        >Quản lý phép năm</span
      >
    </div>
    <header class="reports-heading">
      <div>
        <div class="reports-eyebrow"><span /> ANNUAL LEAVE MANAGEMENT</div>
        <h1>Quản lý phép năm</h1>
        <p>Quản lý chính sách, theo dõi quỹ phép và kiểm soát số dư nhân viên.</p>
      </div>
      <div class="annual-header-actions">
        <span class="reports-prototype"><i class="pi pi-sparkles" /> Prototype · Dữ liệu mẫu</span
        ><button
          v-if="canManage"
          type="button"
          class="report-reset"
          @click="resetOpen = true"
          title="Khôi phục dữ liệu mẫu"
        >
          <i class="pi pi-refresh" />
        </button>
      </div>
    </header>
    <div class="annual-demo-banner">
      <i class="pi pi-info-circle" /><span
        >Môi trường mô phỏng. Thay đổi được lưu trên trình duyệt này, chưa cập nhật hệ thống nhân
        sự.</span
      ><span class="annual-local-tag"><i class="pi pi-desktop" /> Lưu cục bộ</span>
    </div>
    <nav class="annual-tabs" aria-label="Quản lý phép năm">
      <button
        type="button"
        :class="{ active: tab === 'balances' }"
        :aria-pressed="tab === 'balances'"
        @click="changeTab('balances')"
      >
        <i class="pi pi-wallet" /> Số dư phép năm <b>{{ balancesInYear.length }}</b></button
      ><button
        type="button"
        :class="{ active: tab === 'policies' }"
        :aria-pressed="tab === 'policies'"
        @click="changeTab('policies')"
      >
        <i class="pi pi-sliders-h" /> Chính sách nghỉ phép <b>{{ state.policies.length }}</b>
      </button>
    </nav>
    <p v-if="error" class="report-error" role="alert">
      {{ error }} <button type="button" class="report-text-button" @click="reload">Tải lại</button>
    </p>
    <p v-if="notice" class="annual-notice" role="status">
      <i class="pi pi-check-circle" /> {{ notice
      }}<button type="button" aria-label="Đóng thông báo" @click="notice = ''">×</button>
    </p>
    <template v-if="tab === 'balances'">
      <form class="report-filters annual-filters" @submit.prevent="applyYear">
        <label
          ><span>Năm quản lý</span
          ><input v-model.number="yearDraft" type="number" min="1900" max="9999" required /></label
        ><label
          ><span>Bộ phận</span
          ><select v-model="department" @change="page = 1">
            <option value="">Tất cả bộ phận</option>
            <option v-for="item in departments" :key="item">{{ item }}</option>
          </select></label
        >
        <div class="report-filter-actions">
          <AppButton type="submit" label="Xem quỹ phép" icon="pi pi-filter" />
        </div>
        <div class="report-period-note">
          <i class="pi pi-calendar" /><span
            >Quỹ phép năm<strong>{{ year }}</strong></span
          >
        </div>
      </form>
      <div class="report-metrics">
        <article>
          <div>
            <span>Nhân viên có quỹ phép</span><strong>{{ summary.employees }}</strong
            ><small>Trong bộ lọc đang xem</small>
          </div>
          <i class="pi pi-users" />
        </article>
        <article class="report-metric-1">
          <div>
            <span>Tổng phép được cấp</span><strong>{{ format(summary.granted) }}</strong
            ><small>Ngày phép trong năm</small>
          </div>
          <i class="pi pi-calendar-plus" />
        </article>
        <article class="report-metric-2">
          <div>
            <span>Phép đã sử dụng</span><strong>{{ format(summary.used) }}</strong
            ><small>Chờ duyệt: {{ format(summary.pending) }} ngày</small>
          </div>
          <i class="pi pi-calendar-minus" />
        </article>
        <article class="report-metric-3">
          <div>
            <span>Số dư khả dụng</span><strong>{{ format(summary.available) }}</strong
            ><small>Đã trừ phép chờ duyệt và hết hạn</small>
          </div>
          <i class="pi pi-wallet" />
        </article>
      </div>
      <p v-if="summary.incomplete" class="annual-inline-note">
        Có số liệu chưa thiết lập. Tổng chỉ bao gồm các giá trị xác định; xem từng nhân viên để bổ
        sung.
      </p>
    </template>
    <section class="report-panel">
      <div class="report-panel-heading">
        <div>
          <span class="report-sheet-label"
            ><i :class="['pi', tab === 'balances' ? 'pi-file-excel' : 'pi-cog']" />
            {{ tab === 'balances' ? 'SỔ THEO DÕI PHÉP' : 'THIẾT LẬP QUYỀN LỢI' }}</span
          >
          <h2>
            {{ tab === 'balances' ? 'Số dư phép nhân viên' : 'Chính sách nghỉ phép' }}
            <span v-if="tab === 'balances'">/ {{ year }}</span>
          </h2>
          <p>
            {{
              tab === 'balances'
                ? 'Nhấn họ tên để xem chi tiết, cập nhật hoặc điều chỉnh phép.'
                : 'Nhấn tên chính sách để xem và chỉnh sửa cấu hình.'
            }}
          </p>
        </div>
        <div class="annual-toolbar-actions">
          <AppButton
            label="Xuất CSV mẫu"
            icon="pi pi-download"
            severity="secondary"
            outlined
            :disabled="!rows.length"
            @click="exportCsv"
          /><template v-if="canManage"
            ><AppButton
              v-if="tab === 'balances'"
              label="Khởi tạo hàng loạt"
              icon="pi pi-users"
              severity="secondary"
              outlined
              :disabled="!storageReady"
              @click="openAllocation" /><AppButton
              :label="tab === 'balances' ? 'Thêm số dư' : 'Thêm chính sách'"
              icon="pi pi-plus"
              :disabled="!storageReady"
              @click="tab === 'balances' ? openBalance() : openPolicy()"
          /></template>
        </div>
      </div>
      <div class="report-table-tools">
        <label class="report-search"
          ><i class="pi pi-search" /><input
            v-model="search"
            type="search"
            :placeholder="tab === 'balances' ? 'Tìm mã hoặc tên nhân viên…' : 'Tìm tên chính sách…'"
            aria-label="Tìm kiếm phép năm"
            @input="page = 1" /></label
        ><select v-model="status" aria-label="Lọc trạng thái" @change="page = 1">
          <option value="">Tất cả trạng thái</option>
          <template v-if="tab === 'balances'"
            ><option value="available">Còn phép</option>
            <option value="low">Sắp hết phép</option>
            <option value="negative">Âm quỹ phép</option>
            <option value="review">Rà soát phép cũ</option>
            <option value="incomplete">Thiếu số liệu</option></template
          ><template v-else
            ><option value="active">Đang áp dụng</option>
            <option value="inactive">Ngừng áp dụng</option>
            <option value="unset">Chưa thiết lập</option></template
          ></select
        ><span class="report-freeze-note"><i class="pi pi-lock" /> Cột tổng và số dư tự tính</span>
      </div>
      <ExcelReportSheet
        :key="tab"
        :columns="columns"
        :rows="visibleRows"
        :all-rows="rows"
        :offset="(page - 1) * pageSize"
        :sort-key="sort.key"
        :sort-direction="sort.direction"
        @sort="sortBy"
        @open="openRow"
      />
      <div class="report-pagination">
        <span>{{ rows.length }} bản ghi · Đơn vị: ngày phép</span>
        <div>
          <label
            >Số dòng<select v-model.number="pageSize" @change="page = 1">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select></label
          ><button type="button" aria-label="Trang trước" :disabled="page === 1" @click="page--">
            <i class="pi pi-chevron-left" /></button
          ><span class="report-page-current">{{ page }}</span
          ><span>/ {{ pages }}</span
          ><button type="button" aria-label="Trang sau" :disabled="page >= pages" @click="page++">
            <i class="pi pi-chevron-right" />
          </button>
        </div>
      </div>
      <div class="report-sheet-footer">
        <span
          ><i class="pi pi-check-circle" />
          {{
            tab === 'balances'
              ? 'Mỗi nhân viên có một số dư mỗi năm'
              : 'Cấu hình chính sách dùng làm mẫu cấp quỹ'
          }}</span
        ><span>Tổng cộng trên toàn bộ kết quả lọc</span>
      </div>
    </section>
    <p class="annual-formula" v-if="tab === 'balances'">
      <i class="pi pi-calculator" /><span
        ><strong>Phép khả dụng</strong> = Cơ bản + Thâm niên + Chuyển sang + Điều chỉnh − Đã sử dụng
        − Chờ duyệt − Phép cũ hết hạn</span
      >
    </p>
    <p class="annual-inline-note" v-else>
      Chính sách dùng để gợi ý phép cơ bản khi khởi tạo. Phép thâm niên, phép chuyển năm và hết hạn
      được nhập để mô phỏng; chưa có tác vụ tự động.
    </p>
    <Dialog
      v-model:visible="policyOpen"
      modal
      :header="policyForm.id ? 'Chi tiết chính sách nghỉ phép' : 'Thêm chính sách nghỉ phép'"
      :style="{ width: '720px', maxWidth: '95vw' }"
      ><form id="annual-policy-form" class="annual-form" @submit.prevent="submitPolicy">
        <p v-if="formError" class="report-error" role="alert">{{ formError }}</p>
        <fieldset :disabled="!canManage">
          <label class="annual-full"
            >Tên chính sách
            <input
              v-model="policyForm.tenChinhSach"
              maxlength="100"
              required
              placeholder="Ví dụ: Chính sách phép tiêu chuẩn"
          /></label>
          <div class="annual-form-section">Quỹ phép & tích lũy</div>
          <label v-for="[key, label, unit] in policyNumbers" :key="key"
            >{{ label }}
            <span class="annual-input-unit"
              ><input
                :value="policyForm[key]"
                type="number"
                :min="key === 'thangHetDungPhepCu' ? 1 : 0"
                :max="key === 'thangHetDungPhepCu' ? 12 : 255"
                step="1"
                placeholder="Chưa thiết lập"
                @input="setPolicyNumber(key, $event)"
              /><small>{{ unit }}</small></span
            ></label
          >
          <div class="annual-form-section">Điều kiện áp dụng</div>
          <label
            >Thử việc hưởng ngày phép<select v-model="policyForm.thuViecHuongNgayPhep">
              <option :value="null">Chưa thiết lập</option>
              <option :value="true">Có</option>
              <option :value="false">Không</option>
            </select></label
          ><label
            >Cho phép nghỉ không lương<select v-model="policyForm.choPhepNghiKhongLuong">
              <option :value="null">Chưa thiết lập</option>
              <option :value="true">Có</option>
              <option :value="false">Không</option>
            </select></label
          ><label
            >Trạng thái<select v-model="policyForm.isActive">
              <option :value="true">Đang áp dụng</option>
              <option :value="false">Ngừng áp dụng</option>
              <option :value="null">Chưa thiết lập</option>
            </select></label
          >
        </fieldset>
        <p class="annual-inline-note">
          Có thể để trống các thiết lập tùy chọn. Ví dụ trong prototype không đại diện cho chính
          sách nhân sự đang áp dụng.
        </p>
        <div v-if="policyForm.id" class="annual-audit">
          <span>Tạo bởi: {{ policyForm.userCreated || '—' }}</span
          ><span>Ngày tạo: {{ policyForm.createdAt?.slice(0, 10) || '—' }}</span
          ><span>Cập nhật: {{ policyForm.updatedAt?.slice(0, 10) || '—' }}</span>
        </div>
      </form>
      <template #footer
        ><AppButton
          label="Đóng"
          severity="secondary"
          outlined
          @click="policyOpen = false" /><AppButton
          v-if="canManage"
          type="submit"
          form="annual-policy-form"
          label="Lưu chính sách mẫu"
          icon="pi pi-check" /></template
    ></Dialog>
    <Dialog
      v-model:visible="balanceOpen"
      modal
      :header="balanceForm.id ? 'Cập nhật số liệu phép mẫu' : 'Thêm số dư phép năm'"
      :style="{ width: '760px', maxWidth: '95vw' }"
      ><form id="annual-balance-form" class="annual-form" @submit.prevent="submitBalance">
        <p v-if="formError" class="report-error" role="alert">{{ formError }}</p>
        <fieldset :disabled="!canManage">
          <label
            >Nhân viên<select
              v-model="balanceForm.nhanVienId"
              required
              :disabled="!!balanceForm.id"
            >
              <option value="" disabled>Chọn nhân viên</option>
              <option v-for="person in annualEmployees" :key="person.code" :value="person.code">
                {{ person.code }} · {{ person.name }}
              </option>
            </select></label
          ><label
            >Năm quản lý<input
              v-model.number="balanceForm.nam"
              type="number"
              min="1900"
              max="9999"
              required
              :disabled="!!balanceForm.id"
          /></label>
          <div v-if="!balanceForm.id" class="annual-template annual-full">
            <label
              >Gợi ý từ chính sách<select v-model="templateId">
                <option :value="null">Chọn chính sách</option>
                <option v-for="policy in activePolicies" :key="policy.id" :value="policy.id">
                  {{ policy.tenChinhSach }}
                </option>
              </select></label
            ><AppButton
              type="button"
              label="Lấy phép cơ bản"
              severity="secondary"
              outlined
              :disabled="!templateId"
              @click="template"
            />
          </div>
          <div class="annual-form-section">Quỹ phép & biến động · ngày</div>
          <label v-for="key in balanceFields" :key="key"
            >{{ balanceLabels[key]
            }}<input
              :value="balanceForm[key]"
              type="number"
              :min="key === 'soNgayPhepDieuChinh' ? -999.9 : 0"
              max="999.9"
              step="0.1"
              placeholder="Chưa có số liệu"
              @input="setBalanceNumber(key, $event)" /></label
          ><label
            >Hạn sử dụng phép cũ<input v-model="balanceForm.hanSuDungPhepCu" type="date" /></label
          ><label class="annual-full"
            >{{ balanceForm.id ? 'Ghi chú cập nhật *' : 'Ghi chú'
            }}<textarea
              v-model="balanceForm.ghiChu"
              maxlength="255"
              rows="2"
              :required="!!balanceForm.id"
              placeholder="Lý do cấp phép hoặc cập nhật số liệu"
            />
          </label>
        </fieldset>
        <div class="annual-computed">
          <span
            >Tổng được cấp<strong
              >{{ format(balancePreview.tongPhepDuocCap) }} <small>ngày</small></strong
            ></span
          ><span :class="{ negative: (balancePreview.soNgayPhepConLai || 0) < 0 }"
            >Số dư khả dụng<strong
              >{{ format(balancePreview.soNgayPhepConLai) }} <small>ngày</small></strong
            ></span
          ><i class="pi pi-lock" title="Tự tính, không chỉnh sửa trực tiếp" />
        </div>
        <p class="annual-inline-note">
          Để trống một số liệu sẽ làm cột tổng liên quan chưa xác định (—). Phép đã dùng và chờ
          duyệt trong form chỉ phục vụ mô phỏng.
        </p>
      </form>
      <template #footer
        ><AppButton
          label="Hủy"
          severity="secondary"
          outlined
          @click="balanceOpen = false" /><AppButton
          v-if="canManage"
          type="submit"
          form="annual-balance-form"
          label="Lưu số dư mẫu"
          icon="pi pi-check" /></template
    ></Dialog>
    <Dialog
      v-model:visible="detailOpen"
      modal
      header="Hồ sơ phép năm"
      :style="{ width: '750px', maxWidth: '95vw' }"
      ><div v-if="selected" class="annual-detail">
        <div class="report-detail-person">
          <span>{{ employee(selected.nhanVienId)?.name.split(' ').at(-1)?.[0] }}</span>
          <div>
            <h3>{{ employee(selected.nhanVienId)?.name }}</h3>
            <p>{{ selected.nhanVienId }} · {{ employee(selected.nhanVienId)?.department }}</p>
          </div>
          <b>{{ selected.nam }}</b>
        </div>
        <div class="annual-detail-status" :class="balanceStatus(selected, today).tone">
          {{ balanceStatus(selected, today).label }}
        </div>
        <div class="annual-computed">
          <span
            >Tổng phép được cấp<strong>{{
              format(balanceTotals(selected).tongPhepDuocCap)
            }}</strong></span
          ><span :class="{ negative: (balanceTotals(selected).soNgayPhepConLai || 0) < 0 }"
            >Còn khả dụng<strong
              >{{ format(balanceTotals(selected).soNgayPhepConLai) }} <small>ngày</small></strong
            ></span
          >
        </div>
        <dl class="report-detail-values">
          <div v-for="key in balanceFields" :key="key">
            <dt>{{ balanceLabels[key] }}</dt>
            <dd>{{ format(selected[key]) }} ngày</dd>
          </div>
          <div>
            <dt>Hạn sử dụng phép cũ</dt>
            <dd>{{ selected.hanSuDungPhepCu?.split('-').reverse().join('/') || '—' }}</dd>
          </div>
        </dl>
        <p class="annual-detail-note">
          <strong>Ghi chú gần nhất</strong>{{ selected.ghiChu || 'Chưa có ghi chú' }}
        </p>
        <p class="annual-inline-note" v-if="balanceStatus(selected, today).key === 'review'">
          Hạn phép cũ đã qua. Chưa tự động trừ thêm phép; cần kiểm tra số phép cũ thực tế đã dùng
          trước khi cập nhật số hết hạn.
        </p>
        <div class="annual-audit">
          <span>Tạo: {{ selected.ngayTao.slice(0, 10) }}</span
          ><span>Cập nhật: {{ selected.ngayCapNhat.slice(0, 10) }}</span>
        </div>
      </div>
      <template #footer
        ><AppButton
          label="Đóng"
          severity="secondary"
          outlined
          @click="detailOpen = false" /><AppButton
          v-if="canManage && selected"
          label="Cập nhật số liệu"
          severity="secondary"
          outlined
          @click="openBalance(selected)" /><AppButton
          v-if="canManage"
          label="Điều chỉnh phép"
          icon="pi pi-plus-minus"
          @click="openAdjustment" /></template
    ></Dialog>
    <Dialog
      v-model:visible="adjustmentOpen"
      modal
      header="Điều chỉnh quỹ phép"
      :style="{ width: '530px', maxWidth: '95vw' }"
      ><form id="annual-adjust-form" class="annual-form" @submit.prevent="submitAdjustment">
        <p v-if="formError" class="report-error" role="alert">{{ formError }}</p>
        <p class="annual-inline-note">
          {{ employee(selected?.nhanVienId || '')?.name }} · Năm {{ selected?.nam }}
        </p>
        <label class="annual-full"
          >Số ngày cộng / trừ<input
            v-model.number="adjustment.delta"
            type="number"
            min="-999.9"
            max="999.9"
            step="0.1"
            required
          /><small>Số dương để cộng, số âm để trừ. Ví dụ: +1 hoặc −0,5 ngày.</small></label
        ><label class="annual-full"
          >Lý do điều chỉnh *<textarea
            v-model="adjustment.reason"
            maxlength="255"
            rows="3"
            required
            placeholder="Nhập lý do cụ thể"
          />
        </label>
        <div class="annual-computed">
          <span
            >Khả dụng hiện tại<strong>{{
              selected ? format(balanceTotals(selected).soNgayPhepConLai) : '—'
            }}</strong></span
          ><span :class="{ negative: (adjustmentPreview?.soNgayPhepConLai || 0) < 0 }"
            >Sau điều chỉnh<strong>{{
              format(adjustmentPreview?.soNgayPhepConLai ?? null)
            }}</strong></span
          >
        </div>
        <p v-if="(adjustmentPreview?.soNgayPhepConLai || 0) < 0" class="annual-warning">
          Sau điều chỉnh, số dư sẽ âm. Kiểm tra lại số ngày trước khi lưu.
        </p>
      </form>
      <template #footer
        ><AppButton
          label="Hủy"
          severity="secondary"
          outlined
          @click="adjustmentOpen = false" /><AppButton
          v-if="canManage"
          type="submit"
          form="annual-adjust-form"
          label="Lưu điều chỉnh mẫu"
          icon="pi pi-check" /></template
    ></Dialog>
    <Dialog
      v-model:visible="allocationOpen"
      modal
      header="Khởi tạo quỹ phép hàng loạt"
      :style="{ width: '680px', maxWidth: '95vw' }"
      ><form id="annual-allocation-form" class="annual-form" @submit.prevent="submitAllocation">
        <p v-if="formError" class="report-error" role="alert">{{ formError }}</p>
        <div class="annual-form-grid">
          <label
            >Năm cấp quỹ<input
              v-model.number="allocation.year"
              type="number"
              min="1900"
              max="9999"
              required /></label
          ><label
            >Chính sách làm mẫu<select v-model="allocation.policyId" required>
              <option :value="null">Chọn chính sách</option>
              <option v-for="policy in activePolicies" :key="policy.id" :value="policy.id">
                {{ policy.tenChinhSach }} · {{ policy.soNgayPhepNam ?? '—' }} ngày
              </option>
            </select></label
          >
        </div>
        <div class="annual-pick-heading">
          <strong
            >Chọn nhân viên ({{ allocation.codes.length }}/{{ annualEmployees.length }})</strong
          ><button
            type="button"
            class="report-text-button"
            @click="
              allocation.codes =
                allocation.codes.length === annualEmployees.length
                  ? []
                  : annualEmployees.map((e) => e.code)
            "
          >
            {{
              allocation.codes.length === annualEmployees.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'
            }}
          </button>
        </div>
        <div class="annual-employee-picker">
          <label v-for="person in annualEmployees" :key="person.code"
            ><input v-model="allocation.codes" type="checkbox" :value="person.code" /><span
              ><strong>{{ person.name }}</strong
              ><small>{{ person.code }} · {{ person.department }}</small></span
            ><b
              v-if="
                state.balances.some(
                  (r) => r.nhanVienId === person.code && r.nam === allocation.year,
                )
              "
              >Đã có quỹ</b
            ></label
          >
        </div>
        <p class="annual-inline-note">
          Sẽ tạo {{ allocation.codes.length - allocationExisting }} số dư; bỏ qua
          {{ allocationExisting }} dòng đã có. Chỉ lấy phép cơ bản từ chính sách, các biến động khác
          bắt đầu từ 0.
        </p>
      </form>
      <template #footer
        ><AppButton
          label="Hủy"
          severity="secondary"
          outlined
          @click="allocationOpen = false" /><AppButton
          v-if="canManage"
          type="submit"
          form="annual-allocation-form"
          label="Khởi tạo quỹ mẫu"
          icon="pi pi-check"
          :disabled="!allocation.codes.length || !allocation.policyId" /></template
    ></Dialog>
    <Dialog
      v-model:visible="resetOpen"
      modal
      header="Khôi phục dữ liệu mẫu"
      :style="{ width: '440px', maxWidth: '95vw' }"
      ><p>
        Thay toàn bộ chính sách và số dư mẫu đã chỉnh sửa trên trình duyệt bằng bộ dữ liệu ban đầu?
      </p>
      <template #footer
        ><AppButton
          label="Giữ dữ liệu"
          severity="secondary"
          outlined
          @click="resetOpen = false" /><AppButton
          label="Khôi phục mẫu"
          severity="danger"
          @click="resetDemo" /></template
    ></Dialog>
  </section>
</template>
