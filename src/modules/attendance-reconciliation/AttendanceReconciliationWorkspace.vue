<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AppButton from '@/components/common/AppButton.vue';
import AppDialog from '@/components/common/AppDialog.vue';
import AppDrawer from '@/components/common/AppDrawer.vue';
import { useToast } from '@/composables/useToast';
import { exportCsv } from '@/utils/export';
import AttendanceIssuesPanel from './AttendanceIssuesPanel.vue';
import IssueResolutionDrawer from './IssueResolutionDrawer.vue';
import { useReconciliation } from './useReconciliation';
import { DEMO_NOTICE } from './reconciliation.fixtures';
import {
  periodLabels,
  runLabels,
  scopeLabels,
  formatStamp,
  formatDate,
  number,
  type DemoRole,
  type Actor,
  type IssueViewModel,
  type RunScope,
  type Severity,
} from './reconciliation.types';
import './reconciliation.css';

const store = useReconciliation(),
  toast = useToast();
const periodId = ref(1),
  departmentCode = ref(''),
  role = ref<DemoRole>('HR');
const tab = ref(0),
  step = ref(3),
  selectedIssueId = ref<number | null>(null),
  selectedRunId = ref<number>();
const issueSeverity = ref<Severity | ''>('');
const sourceCode = ref(''),
  detailDepartment = ref(''),
  showDemoTools = ref(false);
const closeDialog = ref(false),
  reopenDialog = ref(false),
  reopenReason = ref(''),
  closeConfirmed = ref(false),
  confirmationVersion = ref(0),
  dialogError = ref('');
const completeDialog = ref(false),
  helpDialog = ref(false);
const snapshotVersion = ref(1),
  compareVersion = ref(0);
const calculationFilter = ref(''),
  runScope = ref<RunScope>('PERIOD'),
  runEmployee = ref(''),
  runStatus = ref(''),
  runScopeFilter = ref('');
const actor = computed<Actor>(() => ({ role: role.value, departmentCode: departmentCode.value }));
const period = computed(() => store.state.periods.find((p) => p.id === periodId.value)!);
const runtime = computed(() => store.state.runtime[periodId.value]);
const overview = computed(() => store.getOverview(periodId.value, departmentCode.value));
const wholeOverview = computed(() => store.getOverview(periodId.value));
const eligibility = computed(() => store.getClosingEligibility(periodId.value));
const closed = computed(() => period.value.trangThai === 'CLOSED');
const busy = computed(() =>
  store.state.runs.some((r) => r.kyChamCongId === periodId.value && r.trangThai === 'RUNNING'),
);
const mutable = computed(() => role.value !== 'Payroll' && !closed.value && !busy.value);
const hrMutable = computed(() => mutable.value && role.value === 'HR');
const scopedDepartments = computed(() =>
  store.state.departments.filter((d) => !departmentCode.value || d.code === departmentCode.value),
);
const scopedEmployees = computed(() =>
  store.state.employees.filter(
    (e) => !departmentCode.value || e.departmentCode === departmentCode.value,
  ),
);
const currentRows = computed(() =>
  store.getIssues({ periodId: periodId.value, departmentCode: departmentCode.value }),
);
const selectedIssue = computed(() => {
  const issue = store.state.issues.find((i) => i.id === selectedIssueId.value);
  return issue ? store.view(issue) : null;
});
const currentSource = computed(() =>
  runtime.value.sources.find((s) => s.code === sourceCode.value),
);
const stepDone = computed(() => [
  runtime.value.sources.every((s) => s.status === 'READY'),
  runtime.value.calculatedVersion === runtime.value.dataVersion,
  !currentRows.value.some(
    (r) =>
      (r.issue.mucDo !== 'INFO' && ['OPEN', 'IN_REVIEW'].includes(r.issue.trangThai)) || r.isStale,
  ),
  overview.value.approved === overview.value.departments,
  closed.value,
  closed.value && runtime.value.handoverVersions.includes(period.value.phienBanChot),
]);
const progress = computed(() => Math.round((stepDone.value.filter(Boolean).length / 6) * 100));
const workflow = computed(() => [
  {
    title: 'Chuẩn bị dữ liệu',
    icon: 'pi-database',
    owner: 'HR',
    description: 'Kiểm tra đủ nguồn dữ liệu',
    metric: `${runtime.value.sources.filter((s) => s.status === 'READY').length}/${runtime.value.sources.length} nguồn sẵn sàng`,
    action: 'Xem dữ liệu nguồn',
  },
  {
    title: 'Tính & kiểm tra',
    icon: 'pi-calculator',
    owner: 'HR',
    description: 'Cập nhật kết quả tính công',
    metric: `${number(overview.value.calculatedShifts)}/${number(overview.value.shifts)} ca đã tính`,
    action: 'Kiểm tra bản tính',
  },
  {
    title: 'Đối soát bất thường',
    icon: 'pi-search',
    owner: 'HOD · HR',
    description: 'Xác minh những ca sai lệch',
    metric: `${overview.value.unresolved} trường hợp chưa xử lý`,
    action: 'Xử lý bất thường',
  },
  {
    title: 'HOD xác nhận',
    icon: 'pi-users',
    owner: 'HOD',
    description: 'Xác nhận công từng bộ phận',
    metric: `${overview.value.approved}/${overview.value.departments} bộ phận đã duyệt`,
    action: 'Duyệt bộ phận',
  },
  {
    title: 'HR kiểm tra & chốt',
    icon: 'pi-lock',
    owner: 'HR',
    description: 'Kiểm tra và khóa kỳ công',
    metric: closed.value
      ? `Đã chốt phiên bản ${period.value.phienBanChot}`
      : `${eligibility.value.blockers.length} điều kiện chưa đạt`,
    action: 'Kiểm tra chốt công',
  },
  {
    title: 'Bàn giao Payroll',
    icon: 'pi-send',
    owner: 'HR · Payroll',
    description: 'Bàn giao kết quả đã chốt',
    metric: stepDone.value[5]
      ? 'Đã bàn giao mô phỏng'
      : closed.value
        ? 'Snapshot sẵn sàng'
        : 'Chờ chốt kỳ công',
    action: 'Xem snapshot',
  },
]);
function stepState(index: number) {
  if (closed.value && index < 5)
    return {
      label: index === 4 ? 'Đã khóa' : 'Hoàn thành',
      class: 'success',
      icon: index === 4 ? 'pi-lock' : 'pi-check-circle',
    };
  if (stepDone.value[index])
    return { label: 'Hoàn thành', class: 'success', icon: 'pi-check-circle' };
  if (
    index === 0 ||
    (index === 1 && runtime.value.calculatedVersion !== runtime.value.dataVersion) ||
    (index === 2 && overview.value.unresolved)
  )
    return { label: 'Cần chú ý', class: 'warning', icon: 'pi-exclamation-circle' };
  if (index === 3) return { label: 'Đang xử lý', class: 'info', icon: 'pi-clock' };
  return { label: 'Chưa bắt đầu', class: 'neutral', icon: 'pi-circle' };
}
function goStep(value: number) {
  step.value = value;
  tab.value = value === 4 ? 2 : value >= 5 ? 3 : 0;
}
function goIssues(severity: Severity | '' = '') {
  selectedRunId.value = undefined;
  issueSeverity.value = severity;
  tab.value = 1;
  step.value = 3;
}
function openIssue(row: IssueViewModel) {
  selectedIssueId.value = row.issue.id;
}
async function perform(action: () => unknown | Promise<unknown>, message: string) {
  try {
    await action();
    toast.info(`${message} — chưa lưu lên hệ thống`);
  } catch (error) {
    toast.error(error);
  }
}
async function run(fail = false) {
  await perform(async () => {
    const result = await store.runReconciliation(
      periodId.value,
      {
        type: runScope.value,
        departmentCode: departmentCode.value || undefined,
        employeeCode: runEmployee.value || undefined,
        fail,
      },
      actor.value,
    );
    if (result.trangThai === 'FAILED')
      throw new Error(result.loiXuLy || 'Lần chạy mô phỏng thất bại.');
  }, 'Đã hoàn tất đối soát mô phỏng');
}
const issuesByShift = computed(() => {
  const result = new Map<number, IssueViewModel[]>();
  for (const row of currentRows.value) {
    if (!['OPEN', 'IN_REVIEW'].includes(row.issue.trangThai)) continue;
    const group = result.get(row.context.shiftId) || [];
    group.push(row); result.set(row.context.shiftId, group);
  }
  return result;
});
const employeeNames = computed(() => new Map(store.state.employees.map(e => [e.code, e.name])));
const allCalculations = computed(() =>
  store.state.calculations
    .filter(
      (s) =>
        s.periodId === periodId.value &&
        (!departmentCode.value || s.departmentCode === departmentCode.value),
    )
    .map((s) => {
      const issues = issuesByShift.value.get(s.id) || [];
      const issueCount = issues.length;
      return {
        ...s,
        name: employeeNames.value.get(s.employeeCode)!,
        needsReview:
          issueCount > 0 || runtime.value.calculatedVersion !== runtime.value.dataVersion,
        issueCount,
        issues,
      };
    }),
);
const calculations = computed(() => allCalculations.value.filter(
      (s) =>
        !calculationFilter.value ||
        (calculationFilter.value === 'check' ? s.needsReview : !s.needsReview),
    ));
const runs = computed(() =>
  store
    .getReconciliationRuns(periodId.value, departmentCode.value)
    .filter(
      (r) =>
        (!runStatus.value || r.trangThai === runStatus.value) &&
        (!runScopeFilter.value || r.phamVi === runScopeFilter.value),
    ),
);
const latestFailed = computed(
  () =>
    store.getReconciliationRuns(periodId.value, departmentCode.value)[0]?.trangThai === 'FAILED',
);
const versions = computed(() =>
  [...new Set(store.getSnapshots(periodId.value).map((s) => s.snapshot.phienBanChot))].sort(
    (a, b) => b - a,
  ),
);
const snapshots = computed(() =>
  store.getSnapshots(periodId.value, snapshotVersion.value, departmentCode.value),
);
const compareRows = computed(() => {
  const previous = store.getSnapshots(periodId.value, compareVersion.value, departmentCode.value);
  const byEmployee = new Map(
    previous.map((s) => [`${s.snapshot.maNhanVien}|${s.snapshot.maBoPhan}`, s.snapshot]),
  );
  return snapshots.value.map((s) => {
    const old = byEmployee.get(`${s.snapshot.maNhanVien}|${s.snapshot.maBoPhan}`);
    return {
      ...s,
      workDifference: old ? s.snapshot.congThucTe - old.congThucTe : null,
      otDifference: old ? s.snapshot.gioOT - old.gioOT : null,
    };
  });
});
function exportSnapshot() {
  const rows = snapshots.value.map(({ snapshot: s, employeeName }) => ({
    id: String(s.id),
    code: s.maNhanVien,
    name: employeeName,
    status: 'Dữ liệu mô phỏng',
    department: s.maBoPhan,
    standard: s.congChuan,
    actual: s.congThucTe,
    leave: s.congPhep,
    holiday: s.congLe,
    ot: s.gioOT,
    late: s.phutDiMuon,
    early: s.phutVeSom,
    version: s.phienBanChot,
  }));
  exportCsv(
    rows,
    [
      'code',
      'name',
      'department',
      'standard',
      'actual',
      'leave',
      'holiday',
      'ot',
      'late',
      'early',
      'version',
      'status',
    ],
    [
      'Mã nhân viên',
      'Họ tên',
      'Bộ phận',
      'Công chuẩn',
      'Công thực tế',
      'Công phép',
      'Công lễ',
      'Giờ OT',
      'Phút đi muộn',
      'Phút về sớm',
      'Phiên bản',
      'Ghi chú',
    ],
    `snapshot-demo-${period.value.maKy.replace('/', '-')}-v${snapshotVersion.value}`,
  );
  toast.info('Đã xuất CSV dữ liệu mô phỏng trong phạm vi đang chọn.');
}
const history = computed(() =>
  store.state.closingHistory
    .filter((h) => h.kyChamCongId === periodId.value)
    .slice()
    .reverse(),
);
const audit = computed(() =>
  store.state.audit
    .filter((e) => e.periodId === periodId.value)
    .slice()
    .reverse(),
);
const departmentStaff = computed(() =>
  store.state.employees
    .filter((e) => e.departmentCode === detailDepartment.value)
    .map((e) => {
      const shifts = store.state.calculations.filter(
        (s) => s.periodId === periodId.value && s.employeeCode === e.code,
      );
      return {
        ...e,
        days: shifts.reduce((n, s) => n + s.workedMinutes / 480, 0),
        leave: shifts.reduce((n, s) => n + s.leaveMinutes / 480, 0),
        overtime: shifts.reduce((n, s) => n + s.overtimeHours, 0),
        issues: store
          .getIssues({ periodId: periodId.value, employeeCode: e.code })
          .filter((r) => ['OPEN', 'IN_REVIEW'].includes(r.issue.trangThai)).length,
      };
    }),
);
const approvalHistory = computed(() =>
  store.state.approvals
    .filter(
      (a) =>
        a.kyChamCongId === periodId.value &&
        (!departmentCode.value || a.maBoPhan === departmentCode.value),
    )
    .slice()
    .reverse(),
);
const checklist = computed(() =>
  [
    { code: 'SOURCES', label: 'Các nguồn dữ liệu đã sẵn sàng', step: 1 },
    { code: 'CALCULATION', label: 'Đã tính công ở phiên bản hiện hành', step: 2 },
    { code: 'CRITICAL', label: 'Không còn bất thường nghiêm trọng', step: 3 },
    { code: 'WARNING', label: 'Cảnh báo cần xác nhận đã giải quyết', step: 3 },
    { code: 'ADJUSTMENTS', label: 'Đề xuất điều chỉnh đã hoàn tất', step: 3 },
    { code: 'LEAVE_OT', label: 'Nghỉ phép và OT đã được xác nhận', step: 3 },
    { code: 'APPROVALS', label: 'HOD duyệt đủ, đúng phiên bản dữ liệu', step: 4 },
    { code: 'RECONCILIATION', label: 'Đối soát toàn kỳ còn hiệu lực', step: 2 },
    { code: 'RUNNING', label: 'Không có lần đối soát đang chạy', step: 2 },
    { code: 'TOTALS', label: 'Tổng công của nhân viên nhất quán', step: 2 },
    { code: 'SNAPSHOT', label: 'Đủ dữ liệu tạo snapshot toàn kỳ', step: 6 },
  ].map((item) => ({
    ...item,
    blocker: eligibility.value.blockers.find((b) => b.code === item.code),
  })),
);
function departmentStatus(code: string) {
  const approval = store.approvalFor(periodId.value, code);
  if (approval?.trangThai === 'APPROVED' && approval.dataVersion === runtime.value.dataVersion)
    return { label: 'Đã duyệt', class: 'success' };
  if (
    approval?.trangThai === 'INVALIDATED' ||
    (approval && approval.dataVersion !== runtime.value.dataVersion)
  )
    return { label: 'Cần duyệt lại', class: 'warning' };
  if (!store.departmentEligibility(periodId.value, code).length)
    return { label: 'Có thể duyệt', class: 'info' };
  return { label: 'Chưa duyệt', class: 'neutral' };
}
function confirmClose() {
  dialogError.value = '';
  if (!closeConfirmed.value) {
    dialogError.value = 'Vui lòng xác nhận phạm vi và việc khóa chỉnh sửa.';
    return;
  }
  try {
    store.closePeriod(periodId.value, actor.value, confirmationVersion.value);
    closeDialog.value = false;
    snapshotVersion.value = period.value.phienBanChot;
    step.value = 6;
    toast.info('Đã mô phỏng chốt công — chưa lưu lên server');
  } catch (e) {
    dialogError.value = e instanceof Error ? e.message : String(e);
  }
}
function confirmReopen() {
  dialogError.value = '';
  try {
    store.reopenPeriod(periodId.value, reopenReason.value, actor.value);
    reopenDialog.value = false;
    toast.info('Đã mô phỏng mở lại kỳ — snapshot cũ được giữ nguyên');
  } catch (e) {
    dialogError.value = e instanceof Error ? e.message : String(e);
  }
}
watch(periodId, () => {
  selectedIssueId.value = null;
  selectedRunId.value = undefined;
  sourceCode.value = '';
  detailDepartment.value = '';
  closeDialog.value = false;
  reopenDialog.value = false;
  completeDialog.value = false;
  snapshotVersion.value = period.value.phienBanChot || 1;
  compareVersion.value = 0;
  runStatus.value = '';
  calculationFilter.value = '';
  runEmployee.value = '';
  if (closed.value || role.value === 'Payroll') {
    step.value = 6;
    tab.value = 3;
  } else {
    step.value = 3;
    tab.value = 0;
  }
});
watch(departmentCode, () => {
  selectedIssueId.value = null;
  selectedRunId.value = undefined;
  runEmployee.value = '';
  detailDepartment.value = '';
});
watch(role, (value) => {
  selectedIssueId.value = null;
  closeDialog.value = false;
  reopenDialog.value = false;
  completeDialog.value = false;
  if (value === 'HOD' && !departmentCode.value)
    departmentCode.value = store.state.departments[0].code;
  runScope.value = value === 'HOD' ? 'DEPARTMENT' : 'PERIOD';
  if (value === 'Payroll') {
    step.value = 6;
    tab.value = 3;
  }
});
watch(snapshotVersion, (value) => {
  if (compareVersion.value === value) compareVersion.value = 0;
});
watch(tab, (value) => {
  if (value === 2) step.value = 4;
  if (value === 3 && step.value < 5) step.value = closed.value ? 6 : 5;
});
</script>

<template>
  <div class="recon-workspace">
    <div class="rc-breadcrumb">
      Chấm công <i class="pi pi-angle-right" /><span>Đối soát & Chốt công</span>
    </div>
    <header class="rc-page-header">
      <div>
        <div class="rc-eyebrow">
          QUẢN LÝ CÔNG THÁNG
        </div>
        <h1>
          Đối soát & Chốt công
          <span
            class="rc-badge"
            :class="closed ? 'success' : 'info'"
          ><i :class="['pi', closed ? 'pi-lock' : 'pi-sync']" />{{
            periodLabels[period.trangThai]
          }}</span>
        </h1>
        <p>Một quy trình rõ ràng, từ dữ liệu chấm công đến kết quả sẵn sàng tính lương.</p>
      </div>
      <AppButton
        label="Hướng dẫn"
        icon="pi pi-question-circle"
        severity="secondary"
        outlined
        @click="helpDialog = true"
      />
    </header>
    <section
      class="rc-filter-bar rc-card"
      aria-label="Phạm vi đối soát"
    >
      <div class="rc-main-filters">
        <label><span>Kỳ công</span><select
          v-model="periodId"
          :disabled="busy"
        >
          <option
            v-for="p in store.state.periods"
            :key="p.id"
            :value="p.id"
          >
            Tháng {{ p.maKy }}
          </option>
        </select></label><label><span>{{ role === 'HOD' ? 'Bộ phận phụ trách (demo)' : 'Bộ phận' }}</span><select
          v-model="departmentCode"
          :disabled="busy"
        >
          <option
            value=""
            :disabled="role === 'HOD'"
          >Tất cả bộ phận</option>
          <option
            v-for="d in store.state.departments"
            :key="d.code"
            :value="d.code"
          >
            {{ d.name }}
          </option>
        </select></label><span class="rc-period-range"><i class="pi pi-calendar" />{{ formatDate(period.tuNgay) }} –
          {{ formatDate(period.denNgay) }}</span>
      </div>
      <div class="rc-filter-meta">
        <i class="pi pi-shield" /><span>{{
          closed ? 'Đã khóa chỉnh sửa' : 'Dữ liệu phiên bản ' + runtime.dataVersion
        }}</span>
      </div>
    </section>
    <section
      class="rc-demo-toolbar"
      aria-label="Công cụ mô phỏng"
    >
      <div class="rc-demo-label">
        <span class="rc-demo-dot" />DEMO · PHASE 0
      </div>
      <p>{{ DEMO_NOTICE }}</p>
      <label><span>Vai trò demo</span><select
        v-model="role"
        :disabled="busy"
      >
        <option value="HR">HR · Nhân sự</option>
        <option value="HOD">HOD · Trưởng bộ phận</option>
        <option value="Payroll">Payroll · Tiền lương</option>
      </select></label><AppButton
        label="Công cụ demo"
        icon="pi pi-sliders-h"
        severity="secondary"
        text
        :aria-expanded="showDemoTools"
        @click="showDemoTools = !showDemoTools"
      />
    </section>
    <div
      v-if="showDemoTools"
      class="rc-demo-tools"
    >
      <p>
        Công cụ dành riêng cho phiên mô phỏng. Hoàn tất dữ liệu sẽ tạo, duyệt, áp dụng đề xuất và
        tính lại; vẫn cần đối soát, HOD duyệt rồi HR chốt.
      </p>
      <AppButton
        label="Hoàn tất dữ liệu demo"
        icon="pi pi-bolt"
        outlined
        :disabled="!hrMutable"
        @click="completeDialog = true"
      /><AppButton
        label="Mô phỏng cập nhật nguồn"
        icon="pi pi-database"
        outlined
        severity="secondary"
        :disabled="!hrMutable || !departmentCode"
        title="Chọn một bộ phận để kiểm tra tình huống dữ liệu thay đổi sau HOD duyệt"
        @click="
          perform(
            () => store.simulateSourceChange(periodId, departmentCode, actor),
            'Đã mô phỏng dữ liệu nguồn thay đổi; cần duyệt lại',
          )
        "
      /><AppButton
        label="Mô phỏng lỗi lần chạy"
        severity="secondary"
        outlined
        :disabled="!mutable || (role === 'HOD' && runScope === 'PERIOD')"
        @click="run(true)"
      />
    </div>
    <div
      v-if="closed"
      class="rc-closed-banner"
    >
      <i class="pi pi-lock" />
      <div>
        <strong>Kỳ {{ period.maKy }} đã được chốt · Snapshot v{{ period.phienBanChot }}</strong>
        <p>
          Kết quả công được khóa. Bạn có thể xem snapshot và lịch sử hoặc mô phỏng bàn giao Payroll.
        </p>
      </div>
      <AppButton
        label="Xem snapshot"
        icon="pi pi-arrow-right"
        text
        @click="goStep(6)"
      />
    </div>
    <div
      v-else-if="role === 'Payroll'"
      class="rc-notice"
    >
      <i class="pi pi-eye" />Payroll chỉ xem dữ liệu và nhận snapshot sau khi kỳ công đã chốt.
    </div>
    <div class="rc-kpi-grid">
      <button
        class="rc-kpi rc-card"
        @click="goStep(4)"
      >
        <span class="rc-kpi-icon info"><i class="pi pi-users" /></span>
        <div>
          <span>Nhân viên trong phạm vi</span><strong>{{ number(overview.employees) }}</strong><small>{{ overview.departments }} bộ phận · kỳ {{ period.maKy }}</small>
        </div>
        <i class="pi pi-arrow-up-right" />
      </button><button
        class="rc-kpi rc-card"
        @click="goStep(2)"
      >
        <span class="rc-kpi-icon success"><i class="pi pi-calculator" /></span>
        <div>
          <span>Ca đã tính</span><strong>{{ number(overview.calculatedShifts) }}<em>/ {{ number(overview.shifts) }}</em></strong><small>{{
            runtime.calculatedVersion === runtime.dataVersion
              ? 'Bản tính đã cập nhật'
              : 'Có điều chỉnh, cần tính lại'
          }}</small>
        </div>
        <i class="pi pi-arrow-up-right" />
      </button><button
        class="rc-kpi rc-card"
        @click="goIssues()"
      >
        <span class="rc-kpi-icon warning"><i class="pi pi-exclamation-triangle" /></span>
        <div>
          <span>Bất thường chưa xử lý</span><strong>{{ overview.unresolved
          }}<em
            v-if="overview.critical"
            class="rc-text-danger"
          >{{ overview.critical }} nghiêm trọng</em></strong><small>{{ overview.warning }} cảnh báo cần xác nhận</small>
        </div>
        <i class="pi pi-arrow-up-right" />
      </button><button
        class="rc-kpi rc-card"
        @click="goStep(4)"
      >
        <span class="rc-kpi-icon info"><i class="pi pi-verified" /></span>
        <div>
          <span>Bộ phận đã duyệt</span><strong>{{ overview.approved }}<em>/ {{ overview.departments }}</em></strong><small>Duyệt theo phiên bản hiện hành</small>
        </div>
        <i class="pi pi-arrow-up-right" />
      </button>
    </div>
    <nav
      class="rc-tabs"
      aria-label="Điều hướng workspace"
    >
      <button
        v-for="(label, i) in [
          'Tổng quan quy trình',
          'Danh sách bất thường',
          'Duyệt công bộ phận',
          'Chốt công & Lịch sử',
        ]"
        :key="label"
        :class="{ active: tab === i }"
        :aria-current="tab === i ? 'page' : undefined"
        @click="tab = i"
      >
        <i :class="['pi', ['pi-sitemap', 'pi-list', 'pi-users', 'pi-lock'][i]]" />{{ label
        }}<span
          v-if="i === 1 && overview.unresolved"
          class="rc-tab-count"
        >{{
          overview.unresolved
        }}</span>
      </button>
    </nav>
    <section
      v-if="tab !== 1"
      class="rc-card rc-workflow-section"
    >
      <div class="rc-section-heading">
        <div>
          <h2>Tiến độ xử lý công tháng</h2>
          <p>Chọn một bước để xem công việc và người phụ trách.</p>
        </div>
        <div class="rc-progress">
          <span><strong>{{ progress }}%</strong> hoàn tất</span>
          <div
            role="progressbar"
            :aria-valuenow="progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Số bước hoàn tất trong 6 bước"
          >
            <span :style="{ width: progress + '%' }" />
          </div>
          <small>{{ stepDone.filter(Boolean).length }}/6 bước · không thay thế điều kiện chốt</small>
        </div>
      </div>
      <div class="rc-workflow">
        <button
          v-for="(item, index) in workflow"
          :key="item.title"
          class="rc-step"
          :class="{ active: step === index + 1, done: stepDone[index] }"
          :aria-current="step === index + 1 ? 'step' : undefined"
          @click="goStep(index + 1)"
        >
          <div class="rc-step-top">
            <span class="rc-step-number"><i
              v-if="stepDone[index]"
              class="pi pi-check"
            /><template v-else>{{
              index + 1
            }}</template></span><i :class="['pi', item.icon]" /><span class="rc-step-owner">{{ item.owner }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <span
            class="rc-badge"
            :class="stepState(index).class"
          ><i :class="['pi', stepState(index).icon]" />{{ stepState(index).label }}</span><strong class="rc-step-metric">{{ item.metric }}</strong><span class="rc-step-cta">{{ item.action }} <i class="pi pi-arrow-right" /></span>
        </button>
      </div>
    </section>

    <template v-if="tab === 1">
      <AttendanceIssuesPanel
        :key="periodId"
        :period-id="periodId"
        :department-code="departmentCode"
        :severity="issueSeverity"
        :run-id="selectedRunId"
        @open="openIssue"
        @clear-run="selectedRunId = undefined"
      />
    </template>

    <section
      v-else-if="step === 1"
      class="rc-card rc-panel"
    >
      <div class="rc-section-heading">
        <div>
          <div class="rc-eyebrow">
            BƯỚC 01 · HR
          </div>
          <h2>Chuẩn bị đủ dữ liệu trước khi tính công</h2>
          <p>Nguồn chưa sẵn sàng sẽ chặn duyệt bộ phận và chốt kỳ.</p>
        </div>
        <AppButton
          label="Mô phỏng kiểm tra dữ liệu"
          icon="pi pi-check"
          :disabled="!hrMutable"
          @click="
            perform(
              () => store.verifySources(periodId, actor),
              'Đã kiểm tra nguồn dữ liệu mô phỏng',
            )
          "
        />
      </div>
      <div class="rc-source-grid">
        <article
          v-for="source in runtime.sources"
          :key="source.code"
          class="rc-source"
        >
          <div class="rc-source-heading">
            <i
              :class="[
                'pi',
                {
                  shifts: 'pi-calendar',
                  logs: 'pi-server',
                  leave: 'pi-calendar-minus',
                  holidays: 'pi-sun',
                  ot: 'pi-clock',
                  employees: 'pi-users',
                }[source.code],
              ]"
            />
            <h3>{{ source.label }}</h3>
            <span
              class="rc-badge"
              :class="source.status === 'READY' ? 'success' : 'warning'"
            ><i
              :class="[
                'pi',
                source.status === 'READY' ? 'pi-check-circle' : 'pi-exclamation-circle',
              ]"
            />{{
              source.status === 'READY'
                ? 'Đã sẵn sàng'
                : source.status === 'MISSING'
                  ? 'Thiếu dữ liệu'
                  : 'Cần kiểm tra'
            }}</span>
          </div>
          <strong class="rc-source-count">{{ number(source.count) }} <small>bản ghi mô phỏng</small></strong>
          <p>{{ source.description }}</p>
          <small>Cập nhật: {{ formatStamp(source.updatedAt) }}</small><AppButton
            label="Xem dữ liệu nguồn"
            text
            icon="pi pi-arrow-right"
            icon-pos="right"
            @click="sourceCode = source.code"
          />
        </article>
      </div>
    </section>

    <section
      v-else-if="step === 2"
      class="rc-card rc-panel"
    >
      <div class="rc-section-heading">
        <div>
          <div class="rc-eyebrow">
            BƯỚC 02 · HR
          </div>
          <h2>Tính lại, sau đó đối soát để kiểm chứng</h2>
          <p>
            Tính lại cập nhật công mô phỏng; đối soát mới quyết định bất thường đã được xử lý hay
            chưa.
          </p>
        </div>
        <AppButton
          label="Mô phỏng tính lại"
          icon="pi pi-calculator"
          :disabled="!hrMutable"
          @click="
            perform(
              () => store.recalculate(periodId, actor),
              'Đã tính lại mô phỏng; tiếp tục chạy đối soát',
            )
          "
        />
      </div>
      <div class="rc-calculation-summary">
        <div>
          <small>Tổng ca trong phạm vi</small><strong>{{ number(overview.shifts) }}</strong>
        </div>
        <div>
          <small>Ca tính thành công</small><strong>{{ number(overview.calculatedShifts) }}</strong>
        </div>
        <div>
          <small>Ca cần kiểm tra</small><strong>{{ allCalculations.filter((s) => s.needsReview).length }}</strong>
        </div>
        <div>
          <small>Phiên bản bản tính / dữ liệu</small><strong>{{ runtime.calculatedVersion }} / {{ runtime.dataVersion }}</strong>
        </div>
      </div>
      <p class="rc-meta">
        Tính gần nhất: {{ formatStamp(runtime.calculatedAt) }} · Thời gian mô phỏng
      </p>
      <div
        v-if="runtime.calculatedVersion !== runtime.dataVersion"
        class="rc-notice"
      >
        <i class="pi pi-exclamation-circle" />Bản tính cũ do dữ liệu thay đổi. HR cần tính lại trước
        khi chạy đối soát.
      </div>
      <div class="rc-inline-controls">
        <label><span>Kết quả tính công</span><select v-model="calculationFilter">
          <option value="">Tất cả ca</option>
          <option value="success">Thành công</option>
          <option value="check">Cần kiểm tra</option>
        </select></label><span class="rc-muted">Lọc trong phạm vi bộ phận đang chọn.</span>
      </div>
      <DataTable
        :value="calculations"
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        scrollable
        :table-style="{ minWidth: '760px' }"
      >
        <Column
          field="name"
          header="Nhân viên"
          sortable
        /><Column
          field="date"
          header="Ngày công"
          sortable
        >
          <template #body="{ data }">
            {{ formatDate(data.date) }}
          </template>
        </Column><Column
          field="shift"
          header="Ca"
        /><Column header="Công thực tế">
          <template #body="{ data }">
            {{ number(data.workedMinutes) }} phút
          </template>
        </Column><Column header="Kết quả">
          <template #body="{ data }">
            <span
              class="rc-badge"
              :class="data.needsReview ? 'warning' : 'success'"
            >{{
              data.needsReview
                ? runtime.calculatedVersion !== runtime.dataVersion
                  ? 'Cần tính lại'
                  : data.issueCount + ' bất thường cần xác minh'
                : 'Thành công'
            }}</span>
          </template>
        </Column><Column header="Chi tiết kiểm tra">
          <template #body="{ data }">
            <template v-if="data.issues.length">
              <small>{{ data.issues.map((r: IssueViewModel) => r.issue.moTa).join('; ') }}</small><AppButton
                label="Xem & xử lý"
                text
                @click="openIssue(data.issues[0])"
              />
            </template><span
              v-else
              class="rc-muted"
            >{{ data.needsReview ? 'Chờ tính lại phiên bản mới' : 'Không có bất thường' }}</span>
          </template>
        </Column><template #empty>
          <div class="rc-empty">
            Không có ca phù hợp bộ lọc.
          </div>
        </template>
      </DataTable>
      <div class="rc-run-toolbar">
        <div>
          <h3>Chạy đối soát mô phỏng</h3>
          <p>Kết quả cũ được giữ trong lịch sử; lần thất bại không thay thế kết quả hoàn thành.</p>
        </div>
        <label><span>Phạm vi chạy</span><select
          v-model="runScope"
          :disabled="busy"
        >
          <option
            value="PERIOD"
            :disabled="role === 'HOD'"
          >Toàn kỳ</option>
          <option value="DEPARTMENT">Bộ phận đang chọn</option>
          <option value="EMPLOYEE">Nhân viên</option>
          <option value="INCREMENTAL">Phần thay đổi trong bộ phận</option>
        </select></label><label v-if="runScope === 'EMPLOYEE'"><span>Nhân viên demo</span><select v-model="runEmployee">
          <option value="">Chọn nhân viên</option>
          <option
            v-for="e in scopedEmployees"
            :key="e.code"
            :value="e.code"
          >{{ e.name }}</option>
        </select></label><AppButton
          label="Mô phỏng chạy đối soát"
          icon="pi pi-sync"
          :loading="busy"
          :disabled="
            !mutable ||
              runtime.calculatedVersion !== runtime.dataVersion ||
              (runScope !== 'PERIOD' && !departmentCode) ||
              (runScope === 'EMPLOYEE' && !runEmployee)
          "
          @click="run()"
        />
      </div>
      <p
        v-if="runScope !== 'PERIOD' && !departmentCode"
        class="rc-text-warning"
      >
        Chọn một bộ phận ở thanh bộ lọc để chạy phạm vi này.
      </p>
      <p
        v-if="runScope === 'INCREMENTAL'"
        class="rc-notice"
      >
        Kết quả phần thay đổi được hợp nhất vào danh sách hiện hành. Chốt công vẫn yêu cầu lần đối
        soát toàn kỳ đúng phiên bản.
      </p>
      <p
        v-if="latestFailed"
        class="rc-error"
        role="alert"
      >
        Lần chạy gần nhất thất bại. Danh sách hiện hành tiếp tục sử dụng các kết quả hoàn thành hợp
        lệ trước đó.
      </p>
      <div class="rc-section-heading rc-history-heading">
        <div>
          <h3>Lịch sử chạy đối soát</h3>
          <p>Chọn một lần chạy để xem kết quả và lỗi xử lý.</p>
        </div>
        <div class="rc-inline-controls">
          <label><span>Trạng thái lần chạy</span><select v-model="runStatus">
            <option value="">Tất cả trạng thái</option>
            <option
              v-for="(label, code) in runLabels"
              :key="code"
              :value="code"
            >
              {{ label }}
            </option>
          </select></label><label><span>Phạm vi lần chạy</span><select v-model="runScopeFilter">
            <option value="">Tất cả phạm vi</option>
            <option
              v-for="(label, code) in scopeLabels"
              :key="code"
              :value="code"
            >
              {{ label }}
            </option>
          </select></label>
        </div>
      </div>
      <DataTable
        :value="runs"
        paginator
        :rows="5"
        scrollable
        :table-style="{ minWidth: '1240px' }"
      >
        <Column
          field="lanChay"
          header="Lần chạy"
          sortable
        /><Column header="Phạm vi">
          <template #body="{ data }">
            {{ scopeLabels[data.phamVi as RunScope] }}
          </template>
        </Column><Column
          field="maBoPhan"
          header="Bộ phận"
        >
          <template #body="{ data }">
            {{ data.maBoPhan || 'Toàn kỳ' }}
          </template>
        </Column><Column
          field="dataVersion"
          header="Phiên bản dữ liệu"
        >
          <template #body="{ data }">
            {{ data.dataVersion
            }}<small
              v-if="data.dataVersion < runtime.dataVersion"
              class="rc-text-warning"
            >Kết quả cũ</small>
          </template>
        </Column><Column header="Bắt đầu / kết thúc">
          <template #body="{ data }">
            {{ formatStamp(data.batDauLuc)
            }}<small>{{ formatStamp(data.ketThucLuc) }}</small>
          </template>
        </Column><Column header="Trạng thái">
          <template #body="{ data }">
            <span
              class="rc-badge"
              :class="
                data.trangThai === 'COMPLETED'
                  ? 'success'
                  : data.trangThai === 'FAILED'
                    ? 'danger'
                    : 'neutral'
              "
            >{{ runLabels[data.trangThai as keyof typeof runLabels] }}</span><small v-if="data.loiXuLy">{{ data.loiXuLy }}</small>
          </template>
        </Column><Column
          field="tongNhanVien"
          header="Nhân viên"
        /><Column
          field="tongBatThuong"
          header="Bản ghi kiểm chứng"
        /><Column
          field="nguoiChay"
          header="Người chạy"
        /><Column header="Chi tiết">
          <template #body="{ data }">
            <AppButton
              label="Xem kết quả"
              text
              :disabled="data.trangThai !== 'COMPLETED'"
              @click="
                selectedRunId = data.id;
                tab = 1;
              "
            />
          </template>
        </Column><template #empty>
          <div class="rc-empty">
            Không có lần chạy phù hợp.
          </div>
        </template>
      </DataTable>
    </section>

    <template v-else-if="step === 3">
      <section class="rc-action-panel rc-card">
        <div class="rc-action-main">
          <div class="rc-eyebrow">
            BƯỚC 03 · HOD & HR
          </div>
          <h2>Đối chiếu từng bất thường, chốt công có căn cứ</h2>
          <p>
            Còn <strong>{{ overview.unresolved }} trường hợp</strong> cần xác minh trong phạm vi
            đang chọn. Bắt đầu với lỗi thiếu log và các ca có ảnh hưởng đến công.
          </p>
          <div class="rc-actions">
            <AppButton
              :label="'Xem danh sách bất thường'"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="goIssues()"
            /><AppButton
              v-if="overview.critical"
              :label="overview.critical + ' lỗi nghiêm trọng'"
              severity="danger"
              text
              @click="goIssues('CRITICAL')"
            />
          </div>
        </div>
        <aside class="rc-next-tasks">
          <h3><i class="pi pi-list-check" /> Việc cần làm tiếp theo</h3>
          <button
            v-for="blocker in eligibility.blockers.filter((b) => b.code !== 'CLOSED').slice(0, 3)"
            :key="blocker.code"
            @click="blocker.targetStep === 3 ? goIssues() : goStep(blocker.targetStep)"
          >
            <span class="rc-task-dot" /><span>{{ blocker.label }}
              <small>{{ blocker.count }} mục cần xử lý · bước {{ blocker.targetStep }}</small></span><i class="pi pi-arrow-right" />
          </button>
          <p v-if="eligibility.canClose">
            Đã đủ điều kiện. HR có thể kiểm tra và chốt toàn kỳ.
          </p>
          <AppButton
            v-if="eligibility.canClose"
            label="Đến bước chốt công"
            text
            @click="goStep(5)"
          />
        </aside>
      </section>
      <AttendanceIssuesPanel
        :period-id="periodId"
        :department-code="departmentCode"
        priority
        @open="openIssue"
        @all="goIssues()"
      />
    </template>

    <section
      v-else-if="step === 4"
      class="rc-card rc-panel"
    >
      <div class="rc-section-heading">
        <div>
          <div class="rc-eyebrow">
            BƯỚC 04 · HOD
          </div>
          <h2>Xác nhận công từng bộ phận</h2>
          <p>Chỉ duyệt khi dữ liệu đầy đủ, không còn blocker và kết quả đối soát còn hiệu lực.</p>
        </div>
        <span class="rc-badge info">{{ overview.approved }}/{{ overview.departments }} bộ phận đã duyệt</span>
      </div>
      <div class="rc-department-grid">
        <article
          v-for="d in scopedDepartments"
          :key="d.code"
          class="rc-department"
        >
          <div class="rc-department-heading">
            <span class="rc-dept-icon"><i class="pi pi-building" /></span>
            <div>
              <h3>{{ d.name }}</h3>
              <small>HOD · {{ d.head }}</small>
            </div>
            <span
              class="rc-badge"
              :class="departmentStatus(d.code).class"
            >{{
              departmentStatus(d.code).label
            }}</span>
          </div>
          <div class="rc-department-metrics">
            <div>
              <strong>{{ store.getOverview(periodId, d.code).employees }}</strong><small>Nhân viên</small>
            </div>
            <div>
              <strong>{{ store.getOverview(periodId, d.code).shifts }}</strong><small>Ca làm việc</small>
            </div>
            <div>
              <strong>{{ store.getOverview(periodId, d.code).unresolved }}</strong><small>Chưa xử lý</small>
            </div>
          </div>
          <p
            v-if="store.approvalFor(periodId, d.code)"
            class="rc-meta"
          >
            Lần duyệt {{ store.approvalFor(periodId, d.code)!.lanDuyet }} · Phiên bản
            {{ store.approvalFor(periodId, d.code)!.dataVersion }}<br>{{
              store.approvalFor(periodId, d.code)!.nguoiDuyet
            }}
            · {{ formatStamp(store.approvalFor(periodId, d.code)!.duyetLuc) }}
          </p>
          <p
            v-if="store.approvalFor(periodId, d.code)?.ghiChu"
            class="rc-text-warning"
          >
            {{ store.approvalFor(periodId, d.code)!.ghiChu }}
          </p>
          <p
            v-if="!closed && store.departmentEligibility(periodId, d.code).length"
            class="rc-department-blocker"
          >
            <i class="pi pi-info-circle" />{{ store.departmentEligibility(periodId, d.code)[0] }}
          </p>
          <div class="rc-actions">
            <AppButton
              label="Xem công bộ phận"
              severity="secondary"
              outlined
              @click="detailDepartment = d.code"
            /><AppButton
              :label="
                departmentStatus(d.code).label === 'Cần duyệt lại' ? 'Duyệt lại' : 'Duyệt công'
              "
              icon="pi pi-check"
              :disabled="
                !mutable ||
                  !!store.departmentEligibility(periodId, d.code).length ||
                  departmentStatus(d.code).label === 'Đã duyệt' ||
                  (role === 'HOD' && departmentCode !== d.code)
              "
              @click="
                perform(
                  () => store.approveDepartment(periodId, d.code, actor),
                  'Đã duyệt công bộ phận mô phỏng',
                )
              "
            />
          </div>
        </article>
      </div>
      <h3 class="rc-history-heading">
        Lịch sử phê duyệt bộ phận
      </h3>
      <DataTable
        :value="approvalHistory"
        paginator
        :rows="5"
        scrollable
        :table-style="{ minWidth: '850px' }"
      >
        <Column
          field="maBoPhan"
          header="Bộ phận"
        /><Column
          field="tongNhanVien"
          header="Nhân viên"
        /><Column
          field="lanDuyet"
          header="Lần duyệt"
        /><Column
          field="dataVersion"
          header="Phiên bản dữ liệu"
        /><Column header="Trạng thái">
          <template #body="{ data }">
            <span
              class="rc-badge"
              :class="
                data.trangThai === 'APPROVED' && data.dataVersion === runtime.dataVersion
                  ? 'success'
                  : 'warning'
              "
            >{{
              data.trangThai === 'INVALIDATED' || data.dataVersion !== runtime.dataVersion
                ? 'Duyệt không còn hiệu lực'
                : data.trangThai === 'APPROVED'
                  ? 'Đã duyệt'
                  : data.trangThai === 'REJECTED'
                    ? 'Đã từ chối'
                    : 'Chờ duyệt'
            }}</span><small>{{ data.ghiChu }}</small>
          </template>
        </Column><Column
          field="nguoiDuyet"
          header="Người duyệt"
        /><Column header="Thời gian">
          <template #body="{ data }">
            {{ formatStamp(data.duyetLuc) }}
          </template>
        </Column><template #empty>
          <div class="rc-empty">
            Chưa có phê duyệt cho bộ phận trong kỳ này.
          </div>
        </template>
      </DataTable>
    </section>

    <template v-else-if="step === 5">
      <section class="rc-card rc-panel">
        <div class="rc-section-heading">
          <div>
            <div class="rc-eyebrow">
              BƯỚC 05 · HR
            </div>
            <h2>Kiểm tra lần cuối trước khi chốt toàn kỳ</h2>
            <p>
              Checklist tự động từ dữ liệu mô phỏng. Mỗi điều kiện chưa đạt đều dẫn đến nơi cần xử
              lý.
            </p>
          </div>
          <span
            class="rc-badge"
            :class="closed ? 'success' : eligibility.canClose ? 'success' : 'warning'"
          ><i
            :class="[
              'pi',
              closed || eligibility.canClose ? 'pi-check-circle' : 'pi-exclamation-circle',
            ]"
          />{{
            closed
              ? 'Kỳ đã chốt'
              : eligibility.canClose
                ? 'Đủ điều kiện chốt'
                : eligibility.blockers.length + ' điều kiện chưa đạt'
          }}</span>
        </div>
        <div class="rc-notice">
          <i class="pi pi-globe" />Chốt công áp dụng cho toàn bộ {{ wholeOverview.employees }} nhân
          viên / {{ wholeOverview.departments }} bộ phận trong kỳ {{ period.maKy }}, kể cả khi đang
          lọc một bộ phận.
        </div>
        <div class="rc-calculation-summary">
          <div>
            <small>Nhân viên toàn kỳ</small><strong>{{ wholeOverview.employees }}</strong>
          </div>
          <div>
            <small>Tổng công thực tế</small><strong>{{ number(wholeOverview.workDays) }}</strong>
          </div>
          <div>
            <small>Tổng giờ OT</small><strong>{{ number(wholeOverview.overtime) }}</strong>
          </div>
          <div>
            <small>Snapshot dự kiến</small><strong>v{{ closed ? period.phienBanChot : period.phienBanChot + 1 }}</strong>
          </div>
        </div>
        <div class="rc-checklist">
          <div
            v-for="item in checklist"
            :key="item.code"
            class="rc-check-row"
          >
            <i
              :class="[
                'pi',
                item.blocker
                  ? 'pi-exclamation-circle rc-text-warning'
                  : 'pi-check-circle rc-text-success',
              ]"
            /><span>{{ item.label
            }}<small v-if="item.blocker">{{ item.blocker.count }} mục chưa hoàn tất</small></span><AppButton
              v-if="item.blocker"
              label="Đi xử lý"
              icon="pi pi-arrow-right"
              icon-pos="right"
              text
              @click="item.step === 3 ? goIssues() : goStep(item.step)"
            /><span
              v-else
              class="rc-text-success"
            >Đã đạt</span>
          </div>
        </div>
        <div class="rc-closing-footer">
          <div>
            <strong>{{
              closed
                ? 'Đã khóa kỳ công'
                : eligibility.canClose
                  ? 'Sẵn sàng xác nhận chốt kỳ'
                  : 'Hoàn tất các điều kiện còn thiếu để chốt công'
            }}</strong>
            <p>Chốt sẽ tạo snapshot mới và khóa các thao tác điều chỉnh.</p>
          </div>
          <AppButton
            v-if="!closed"
            label="Chốt công mô phỏng"
            icon="pi pi-lock"
            :disabled="!hrMutable || !eligibility.canClose"
            @click="
              confirmationVersion = runtime.dataVersion;
              closeConfirmed = false;
              dialogError = '';
              closeDialog = true;
            "
          /><AppButton
            v-else
            label="Xem snapshot"
            icon="pi pi-arrow-right"
            @click="goStep(6)"
          />
        </div>
        <p
          v-if="role !== 'HR'"
          class="rc-muted"
        >
          <i class="pi pi-lock" /> Chỉ vai trò HR demo được chốt hoặc mở lại kỳ.
        </p>
      </section>
    </template>

    <section
      v-else-if="step === 6"
      class="rc-card rc-panel"
    >
      <div class="rc-section-heading">
        <div>
          <div class="rc-eyebrow">
            BƯỚC 06 · HR & PAYROLL
          </div>
          <h2>Kết quả công sẵn sàng tính lương</h2>
          <p>
            Snapshot chỉ đọc, được giữ riêng cho từng lần chốt. Mở lại kỳ không thay đổi phiên bản
            trước.
          </p>
        </div>
        <div class="rc-actions">
          <AppButton
            label="Xuất CSV demo"
            icon="pi pi-download"
            severity="secondary"
            outlined
            :disabled="!snapshots.length"
            @click="exportSnapshot"
          /><AppButton
            label="Mô phỏng bàn giao Payroll"
            icon="pi pi-send"
            :disabled="
              !closed ||
                role === 'HOD' ||
                snapshotVersion !== period.phienBanChot ||
                runtime.handoverVersions.includes(snapshotVersion)
            "
            @click="
              perform(
                () => store.handover(periodId, snapshotVersion, actor),
                'Đã mô phỏng bàn giao Payroll',
              )
            "
          />
        </div>
      </div>
      <div
        v-if="!versions.length"
        class="rc-empty rc-payroll-empty"
      >
        <span class="rc-empty-icon"><i class="pi pi-lock" /></span>
        <h2>Kết quả công đang chờ chốt</h2>
        <p>Snapshot sẽ xuất hiện sau khi HR hoàn tất checklist và chốt kỳ {{ period.maKy }}.</p>
        <AppButton
          label="Xem điều kiện chốt"
          icon="pi pi-arrow-left"
          outlined
          @click="goStep(5)"
        />
      </div>
      <template v-else>
        <div class="rc-snapshot-bar">
          <label><span>Phiên bản snapshot</span><select v-model="snapshotVersion">
            <option
              v-for="version in versions"
              :key="version"
              :value="version"
            >
              Phiên bản {{ version }}{{ version === period.phienBanChot ? ' · gần nhất' : '' }}
            </option>
          </select></label><label><span>So sánh với</span><select v-model="compareVersion">
            <option :value="0">Không so sánh</option>
            <option
              v-for="version in versions.filter((v) => v !== snapshotVersion)"
              :key="version"
              :value="version"
            >
              Phiên bản {{ version }}
            </option>
          </select></label><span
            class="rc-badge"
            :class="
              runtime.handoverVersions.includes(snapshotVersion)
                ? 'success'
                : closed && snapshotVersion === period.phienBanChot
                  ? 'info'
                  : 'neutral'
            "
          ><i class="pi pi-shield" />{{
            runtime.handoverVersions.includes(snapshotVersion)
              ? 'Đã bàn giao mô phỏng'
              : closed && snapshotVersion === period.phienBanChot
                ? 'Sẵn sàng bàn giao'
                : 'Snapshot lưu trữ · chỉ xem'
          }}</span>
        </div>
        <p
          v-if="snapshots[0]"
          class="rc-meta"
        >
          Chốt lúc {{ formatStamp(snapshots[0].snapshot.chotLuc) }} ·
          {{ snapshots[0].snapshot.nguoiChot }} · Phiên bản dữ liệu
          {{ snapshots[0].snapshot.dataVersion }} · {{ snapshots.length }} nhân viên trong phạm vi
        </p>
        <DataTable
          :value="compareRows"
          paginator
          :rows="8"
          :rows-per-page-options="[8, 16, 24]"
          scrollable
          :table-style="{ minWidth: '1250px' }"
        >
          <Column
            field="employeeName"
            header="Nhân viên"
            sortable
            style="min-width: 180px"
          >
            <template #body="{ data }">
              <strong>{{ data.employeeName }}</strong><small>{{ data.snapshot.maNhanVien }} · {{ data.departmentName }}</small>
            </template>
          </Column><Column
            field="snapshot.congChuan"
            header="Công chuẩn"
          >
            <template #body="{ data }">
              {{ number(data.snapshot.congChuan) }}
            </template>
          </Column><Column
            field="snapshot.congThucTe"
            header="Công thực tế"
          >
            <template #body="{ data }">
              <strong>{{ number(data.snapshot.congThucTe) }}</strong><small v-if="compareVersion">Δ
                {{
                  data.workDifference === null ? 'Không có dữ liệu' : number(data.workDifference)
                }}</small>
            </template>
          </Column><Column header="Công phép">
            <template #body="{ data }">
              {{ number(data.snapshot.congPhep) }}
            </template>
          </Column><Column header="Công lễ">
            <template #body="{ data }">
              {{ number(data.snapshot.congLe) }}
            </template>
          </Column><Column header="Giờ thường">
            <template #body="{ data }">
              {{ number(data.regularHours) }}
            </template>
          </Column><Column header="Giờ đêm (demo)">
            <template #body="{ data }">
              {{ number(data.nightHours ?? 0) }}
            </template>
          </Column><Column header="Giờ lễ (demo)">
            <template #body="{ data }">
              {{ number(data.holidayHours ?? 0) }}
            </template>
          </Column><Column header="Giờ OT">
            <template #body="{ data }">
              {{ number(data.snapshot.gioOT)
              }}<small v-if="compareVersion">Δ
                {{
                  data.otDifference === null ? 'Không có dữ liệu' : number(data.otDifference)
                }}</small>
            </template>
          </Column><Column header="Muộn / sớm (phút)">
            <template #body="{ data }">
              {{ data.snapshot.phutDiMuon }} / {{ data.snapshot.phutVeSom }}
            </template>
          </Column><template #empty>
            <div class="rc-empty">
              Không có snapshot phù hợp.
            </div>
          </template>
        </DataTable>
        <p class="rc-footnote">
          <i class="pi pi-info-circle" /> Giờ thường được tính từ công thực tế; giờ đêm và giờ lễ là
          dữ liệu hiển thị demo, chưa có cột tương ứng trong snapshot DB.
        </p>
      </template>
    </section>

    <section
      v-if="tab === 3"
      class="rc-card rc-panel"
    >
      <div class="rc-section-heading">
        <div>
          <h2>Lịch sử chốt & mở lại kỳ</h2>
          <p>Mỗi lần chốt lại tạo một phiên bản mới, giữ nguyên snapshot đã phát hành.</p>
        </div>
        <div class="rc-actions">
          <AppButton
            v-if="step === 6 && !closed"
            label="Kiểm tra chốt công"
            outlined
            @click="goStep(5)"
          /><AppButton
            v-if="closed && role === 'HR'"
            label="Mở lại kỳ mô phỏng"
            icon="pi pi-lock-open"
            severity="secondary"
            outlined
            @click="
              reopenReason = '';
              dialogError = '';
              reopenDialog = true;
            "
          />
        </div>
      </div>
      <ul
        v-if="history.length"
        class="rc-closing-history"
      >
        <li
          v-for="event in history"
          :key="event.id"
        >
          <span class="rc-history-icon"><i :class="['pi', event.hanhDong === 'REOPEN' ? 'pi-lock-open' : 'pi-lock']" /></span>
          <div>
            <strong>{{
                      event.hanhDong === 'REOPEN'
                        ? 'Mở lại kỳ'
                        : event.hanhDong === 'RECLOSE'
                          ? 'Chốt lại kỳ'
                          : 'Chốt kỳ'
                    }}
              <span class="rc-badge neutral">Snapshot v{{ event.phienBanChot }}</span></strong>
            <p>{{ event.lyDo }}</p>
            <small>{{ event.nguoiThucHien }} · {{ formatStamp(event.thoiGian) }}</small>
          </div>
        </li>
      </ul>
      <div
        v-else
        class="rc-empty"
      >
        Chưa có lịch sử chốt trong kỳ này.
      </div>
    </section>
    <details class="rc-card rc-audit-details">
      <summary>
        <span><i class="pi pi-history" /> Nhật ký thao tác mô phỏng</span><span>{{ audit.length }} sự kiện</span>
      </summary>
      <ul class="rc-audit-list">
        <li
          v-for="event in audit"
          :key="event.id"
        >
          <i class="pi pi-circle-fill" />
          <div>
            <strong>{{ event.message }}</strong><small>{{ event.actor }} · {{ formatStamp(event.at) }}</small>
          </div>
        </li>
        <li v-if="!audit.length">
          Chưa có sự kiện.
        </li>
      </ul>
    </details>
    <footer class="rc-workspace-footer">
      <span><i class="pi pi-shield" />{{ DEMO_NOTICE }}</span><span>Phase 0 · Dữ liệu chỉ tồn tại trong phiên demo</span>
    </footer>

    <IssueResolutionDrawer
      :row="selectedIssue"
      :visible="selectedIssueId !== null"
      :actor="actor"
      :historical="!!selectedRunId || selectedIssue?.issue.trangThai === 'SUPERSEDED'"
      @close="selectedIssueId = null"
      @step="goStep"
    />
    <AppDrawer
      :visible="!!sourceCode"
      header="Thông tin dữ liệu nguồn"
      position="right"
      class="recon-overlay recon-drawer"
      :style="{ width: 'min(520px, 100vw)' }"
      @update:visible="
        (value) => {
          if (!value) sourceCode = '';
        }
      "
    >
      <template v-if="currentSource">
        <span class="rc-badge info">Nguồn mô phỏng · chỉ xem</span>
        <h2 class="rc-history-heading">
          {{ currentSource.label }}
        </h2>
        <p>{{ currentSource.description }}</p>
        <div class="rc-comparison">
          <div>
            <small>Bản ghi</small><strong>{{ number(currentSource.count) }}</strong>
          </div>
          <div>
            <small>Cập nhật</small><strong>{{ formatStamp(currentSource.updatedAt) }}</strong>
          </div>
        </div>
        <p class="rc-notice">
          {{
            currentSource.status === 'READY'
              ? 'Nguồn đã sẵn sàng.'
              : 'Nguồn chưa sẵn sàng sẽ chặn duyệt công và chốt kỳ. HR có thể mô phỏng kiểm tra dữ liệu tại bước 1.'
          }}
        </p>
        <p>{{ DEMO_NOTICE }}</p>
      </template>
    </AppDrawer>
    <AppDrawer
      :visible="!!detailDepartment"
      :header="
        'Công bộ phận · ' +
          (store.state.departments.find((d) => d.code === detailDepartment)?.name || '')
      "
      position="right"
      class="recon-overlay recon-drawer"
      :style="{ width: 'min(760px, 100vw)' }"
      @update:visible="
        (value) => {
          if (!value) detailDepartment = '';
        }
      "
    >
      <p>{{ DEMO_NOTICE }}</p>
      <DataTable
        :value="departmentStaff"
        scrollable
        :table-style="{ minWidth: '600px' }"
      >
        <Column
          field="name"
          header="Nhân viên"
        /><Column header="Tổng công">
          <template #body="{ data }">
            {{ number(data.days) }}
          </template>
        </Column><Column header="Phép">
          <template #body="{ data }">
            {{ number(data.leave) }}
          </template>
        </Column><Column
          field="overtime"
          header="Giờ OT"
        /><Column
          field="issues"
          header="Bất thường"
        />
      </DataTable>
    </AppDrawer>
    <AppDialog
      :visible="closeDialog"
      header="Xác nhận chốt công mô phỏng"
      modal
      class="recon-overlay"
      :style="{ width: 'min(520px, 95vw)' }"
      @update:visible="closeDialog = $event"
    >
      <div class="rc-confirm-icon">
        <i class="pi pi-lock" />
      </div>
      <h2>Chốt toàn bộ kỳ {{ period.maKy }}?</h2>
      <p>
        Tạo snapshot <strong>phiên bản {{ period.phienBanChot + 1 }}</strong> từ dữ liệu phiên bản
        {{ confirmationVersion }} cho
        <strong>{{ wholeOverview.employees }} nhân viên / {{ wholeOverview.departments }} bộ phận</strong>.
      </p>
      <p class="rc-notice">
        Sau khi chốt, các thao tác điều chỉnh sẽ bị khóa. HR cần mở lại kỳ và duyệt lại trước khi
        chốt phiên bản tiếp theo.
      </p>
      <label class="rc-checkbox"><input
        v-model="closeConfirmed"
        type="checkbox"
      >Tôi đã kiểm tra phạm vi và xác nhận khóa
        kỳ công này.</label>
      <p
        v-if="dialogError"
        role="alert"
        class="rc-error"
      >
        {{ dialogError }}
      </p>
      <p class="rc-footnote">
        {{ DEMO_NOTICE }}
      </p>
      <div class="rc-actions rc-dialog-actions">
        <AppButton
          label="Quay lại kiểm tra"
          severity="secondary"
          outlined
          @click="closeDialog = false"
        /><AppButton
          label="Xác nhận chốt mô phỏng"
          icon="pi pi-lock"
          :disabled="!closeConfirmed || !eligibility.canClose || role !== 'HR'"
          @click="confirmClose"
        />
      </div>
    </AppDialog>
    <AppDialog
      :visible="reopenDialog"
      header="Mở lại kỳ công mô phỏng"
      modal
      class="recon-overlay"
      :style="{ width: 'min(520px, 95vw)' }"
      @update:visible="reopenDialog = $event"
    >
      <p>
        Snapshot v{{ period.phienBanChot }} của kỳ {{ period.maKy }} vẫn được giữ nguyên. Bản tính,
        kết quả đối soát và phê duyệt cần được cập nhật theo phiên bản mới.
      </p>
      <label class="rc-form"><span>Lý do mở lại <b class="rc-required">*</b></span><textarea
        v-model="reopenReason"
        rows="4"
        placeholder="Nhập lý do mở lại kỳ (ít nhất 8 ký tự)…"
      />
      </label>
      <p
        v-if="dialogError"
        role="alert"
        class="rc-error"
      >
        {{ dialogError }}
      </p>
      <p class="rc-footnote">
        {{ DEMO_NOTICE }}
      </p>
      <div class="rc-actions rc-dialog-actions">
        <AppButton
          label="Hủy"
          severity="secondary"
          outlined
          @click="reopenDialog = false"
        /><AppButton
          label="Xác nhận mở lại mô phỏng"
          icon="pi pi-lock-open"
          @click="confirmReopen"
        />
      </div>
    </AppDialog>
    <AppDialog
      :visible="completeDialog"
      header="Hoàn tất dữ liệu demo"
      modal
      class="recon-overlay"
      :style="{ width: 'min(500px, 95vw)' }"
      @update:visible="completeDialog = $event"
    >
      <p>
        Công cụ sẽ tạo, duyệt và áp dụng các đề xuất mô phỏng còn thiếu, kiểm tra nguồn rồi tính
        lại. Mọi thao tác có nhật ký; log gốc được giữ nguyên.
      </p>
      <p>Sau đó bạn vẫn cần chạy đối soát và duyệt từng bộ phận trước khi chốt công.</p>
      <div class="rc-actions rc-dialog-actions">
        <AppButton
          label="Hủy"
          outlined
          severity="secondary"
          @click="completeDialog = false"
        /><AppButton
          label="Hoàn tất dữ liệu mô phỏng"
          :disabled="!hrMutable"
          @click="
            completeDialog = false;
            perform(
              () => store.completeDemoData(periodId, actor),
              'Đã hoàn tất dữ liệu demo; cần đối soát và HOD duyệt',
            );
          "
        />
      </div>
    </AppDialog>
    <AppDialog
      :visible="helpDialog"
      header="Hướng dẫn đối soát & chốt công"
      modal
      class="recon-overlay"
      :style="{ width: 'min(560px, 95vw)' }"
      @update:visible="helpDialog = $event"
    >
      <ol class="rc-help-list">
        <li>HR kiểm tra dữ liệu nguồn và bản tính.</li>
        <li>HOD / HR xem bất thường, nhập giá trị điều chỉnh và lý do.</li>
        <li>Phê duyệt đề xuất, sau đó áp dụng riêng.</li>
        <li>HR tính lại rồi chạy đối soát toàn kỳ để kiểm chứng.</li>
        <li>HOD xác nhận từng bộ phận ở phiên bản hiện hành.</li>
        <li>HR kiểm tra checklist, chốt công và bàn giao snapshot cho Payroll.</li>
      </ol>
      <p class="rc-notice">
        Thanh công cụ demo cho phép đổi vai trò. Dùng “Hoàn tất dữ liệu demo” để rút ngắn thao tác;
        dữ liệu chỉ tồn tại trong bộ nhớ, tải lại trang sẽ đặt lại fixtures.
      </p>
      <p>{{ DEMO_NOTICE }}</p>
    </AppDialog>
  </div>
</template>
