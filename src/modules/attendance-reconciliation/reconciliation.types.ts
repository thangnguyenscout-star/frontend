export type PeriodStatus = 'OPEN' | 'RECONCILING' | 'REVIEWED' | 'CLOSED' | 'REOPENED';
export type RunStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type RunScope = 'PERIOD' | 'DEPARTMENT' | 'EMPLOYEE' | 'INCREMENTAL';
export type IssueStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'ACCEPTED' | 'SUPERSEDED';
export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AdjustmentType =
  'ADD_IN' | 'ADD_OUT' | 'CHANGE_IN' | 'CHANGE_OUT' | 'CHANGE_SHIFT' | 'WORK_MINUTES' | 'OTHER';
export type AdjustmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'APPLIED' | 'CANCELLED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'INVALIDATED';
export type ClosingAction = 'CLOSE' | 'REOPEN' | 'RECLOSE';
export type DemoRole = 'HR' | 'HOD' | 'Payroll';
export interface Actor {
  role: DemoRole;
  departmentCode: string;
}

// Seven SQL-aligned entities. UI context and calculated flags are kept separately.
export interface KyChamCong {
  id: number;
  maKy: string;
  tuNgay: string;
  denNgay: string;
  trangThai: PeriodStatus;
  phienBanChot: number;
  createdAt: string;
  updatedAt: string | null;
  rowVer: string;
}
export interface DoiSoatCong {
  id: number;
  kyChamCongId: number;
  maBoPhan: string | null;
  phamVi: RunScope;
  lanChay: number;
  trangThai: RunStatus;
  dataVersion: number;
  tongNhanVien: number;
  tongBatThuong: number;
  batDauLuc: string;
  ketThucLuc: string | null;
  nguoiChay: string | null;
  loiXuLy: string | null;
}
export interface DoiSoatCongChiTiet {
  id: number;
  doiSoatCongId: number;
  maNhanVien: string;
  maBoPhan: string | null;
  ngayCong: string;
  phanCongCaId: number | null;
  maLoi: string;
  mucDo: Severity;
  trangThai: IssueStatus;
  moTa: string | null;
  giaTriDuKien: string | null;
  giaTriThucTe: string | null;
  issueKey: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  ghiChuXuLy: string | null;
  createdAt: string;
  rowVer: string;
}
export interface DieuChinhChamCong {
  id: number;
  doiSoatChiTietId: number;
  maNhanVien: string;
  ngayCong: string;
  loaiDieuChinh: AdjustmentType;
  phanCongCaId: number | null;
  gioInMoi: string | null;
  gioOutMoi: string | null;
  soPhutDieuChinh: number | null;
  lyDo: string;
  trangThai: AdjustmentStatus;
  nguoiDeXuat: string;
  deXuatLuc: string;
  nguoiDuyet: string | null;
  duyetLuc: string | null;
  lyDoTuChoi: string | null;
  appliedAt: string | null;
  appliedBy: string | null;
  rowVer: string;
}
export interface PheDuyetCongBoPhan {
  id: number;
  kyChamCongId: number;
  maBoPhan: string;
  lanDuyet: number;
  dataVersion: number;
  trangThai: ApprovalStatus;
  tongNhanVien: number;
  nguoiDuyet: string | null;
  duyetLuc: string | null;
  ghiChu: string | null;
  createdAt: string;
  rowVer: string;
}
export interface LichSuChotCong {
  id: number;
  kyChamCongId: number;
  hanhDong: ClosingAction;
  trangThaiTruoc: PeriodStatus;
  trangThaiSau: PeriodStatus;
  phienBanChot: number;
  nguoiThucHien: string;
  thoiGian: string;
  lyDo: string;
  correlationId: string;
}
export interface CongThangSnapshot {
  id: number;
  kyChamCongId: number;
  phienBanChot: number;
  maNhanVien: string;
  maBoPhan: string;
  congChuan: number;
  congThucTe: number;
  congPhep: number;
  congLe: number;
  gioOT: number;
  phutDiMuon: number;
  phutVeSom: number;
  dataVersion: number;
  chotLuc: string;
  nguoiChot: string;
}
export interface Employee {
  code: string;
  name: string;
  departmentCode: string;
}
export interface Department {
  code: string;
  name: string;
  head: string;
}
export interface SourceReadiness {
  code: string;
  label: string;
  count: number;
  status: 'READY' | 'MISSING' | 'CHECK';
  important: boolean;
  updatedAt: string;
  description: string;
}
export interface ShiftCalculation {
  id: number;
  periodId: number;
  employeeCode: string;
  departmentCode: string;
  date: string;
  shift: string;
  start: string;
  end: string;
  originalIn: string | null;
  originalOut: string | null;
  standardMinutes: number;
  workedMinutes: number;
  leaveMinutes: number;
  overtimeHours: number;
  holidayDays: number;
  lateMinutes: number;
  earlyMinutes: number;
  nightHours: number;
}
export interface IssueContext {
  shiftId: number;
  expectedType: AdjustmentType;
  expectedMinutes?: number;
  leave: string;
  overtime: string;
  holiday: string;
  assignment: string;
  extraLogs: string[];
}
export interface IssueViewModel {
  issue: DoiSoatCongChiTiet;
  employeeName: string;
  departmentName: string;
  shift: ShiftCalculation;
  context: IssueContext;
  isStale: boolean;
  pendingAdjustment: DieuChinhChamCong | null;
}
export interface SnapshotViewModel {
  snapshot: CongThangSnapshot;
  employeeName: string;
  departmentName: string;
  regularHours: number;
  nightHours?: number;
  holidayHours?: number;
}
export interface AuditEvent {
  id: number;
  periodId: number;
  issueKey: string | null;
  at: string;
  actor: string;
  message: string;
}
export interface PeriodRuntime {
  dataVersion: number;
  calculatedVersion: number;
  calculatedAt: string;
  sourceChanges: Array<{
    departmentCode: string;
    shiftId: number;
    expectedMinutes: number;
    key: string;
  }>;
  sources: SourceReadiness[];
  handoverVersions: number[];
}
export interface ReconciliationState {
  periods: KyChamCong[];
  runs: DoiSoatCong[];
  issues: DoiSoatCongChiTiet[];
  adjustments: DieuChinhChamCong[];
  approvals: PheDuyetCongBoPhan[];
  closingHistory: LichSuChotCong[];
  snapshots: CongThangSnapshot[];
  employees: Employee[];
  departments: Department[];
  calculations: ShiftCalculation[];
  contexts: Record<string, IssueContext>;
  runtime: Record<number, PeriodRuntime>;
  audit: AuditEvent[];
  snapshotDetails: Record<
    number,
    { regularHours: number; nightHours: number; holidayHours: number }
  >;
}
export interface IssueFilters {
  periodId: number;
  departmentCode?: string;
  employeeCode?: string;
  date?: string;
  code?: string;
  severity?: Severity | '';
  status?: IssueStatus | '';
  search?: string;
  runId?: number;
}
export interface AdjustmentPayload {
  type: AdjustmentType;
  reason: string;
  newIn?: string | null;
  newOut?: string | null;
  minutes?: number | null;
}
export interface ClosingEligibility {
  canClose: boolean;
  blockers: Array<{ code: string; label: string; count: number; targetStep: number }>;
}
export const periodLabels: Record<PeriodStatus, string> = {
  OPEN: 'Đang mở',
  RECONCILING: 'Đang đối soát',
  REVIEWED: 'Đủ điều kiện chốt',
  CLOSED: 'Đã chốt',
  REOPENED: 'Đã mở lại',
};
export const issueLabels: Record<IssueStatus, string> = {
  OPEN: 'Mới phát hiện',
  IN_REVIEW: 'Đang xác minh',
  RESOLVED: 'Đã xử lý',
  ACCEPTED: 'Chấp nhận ngoại lệ',
  SUPERSEDED: 'Đã có kết quả mới',
};
export const adjustmentLabels: Record<AdjustmentStatus, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt, chưa áp dụng',
  APPLIED: 'Đã áp dụng',
  REJECTED: 'Đã từ chối',
  CANCELLED: 'Đã hủy',
};
export const adjustmentTypes: Record<AdjustmentType, string> = {
  ADD_IN: 'Bổ sung giờ vào',
  ADD_OUT: 'Bổ sung giờ ra',
  CHANGE_IN: 'Điều chỉnh giờ vào',
  CHANGE_OUT: 'Điều chỉnh giờ ra',
  CHANGE_SHIFT: 'Xem xét đổi ca',
  WORK_MINUTES: 'Điều chỉnh phút công',
  OTHER: 'Điều chỉnh khác',
};
export const severityLabels: Record<Severity, string> = {
  CRITICAL: 'Nghiêm trọng',
  WARNING: 'Cần xác nhận',
  INFO: 'Thông tin',
};
export const runLabels: Record<RunStatus, string> = {
  RUNNING: 'Đang chạy',
  COMPLETED: 'Hoàn thành',
  FAILED: 'Thất bại',
  CANCELLED: 'Đã hủy',
};
export const scopeLabels: Record<RunScope, string> = {
  PERIOD: 'Toàn kỳ',
  DEPARTMENT: 'Bộ phận',
  EMPLOYEE: 'Nhân viên',
  INCREMENTAL: 'Phần thay đổi',
};
export const formatDate = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(date.length === 10 ? date + 'T12:00:00' : date))
    : '—';
export const formatTime = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(
        new Date(date),
      )
    : '—';
export const formatStamp = (date: string | null) =>
  date ? `${formatDate(date)} · ${formatTime(date)}` : '—';
export const number = (value: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);
