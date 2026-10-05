import { getApiErrorMessage } from '@/utils/error-message';
import type {
  ContractAction,
  ContractInput,
  ContractStatus,
  ContractValidation,
} from '@/types/contract';
export const contractStatusLabels: Partial<Record<ContractStatus, string>> = {
  '1': 'Chờ ký',
  '2': 'Đã ký',
  '3': 'Đã phát hành',
};
export function contractStatusLabel(status: string | null | undefined, backendLabel?: string | null) {
  const mapped = status ? contractStatusLabels[status as ContractStatus] : undefined;
  return mapped || backendLabel?.trim() || status || '—';
}
export const contractTimeUnitOptions = [
  { value: '07001', label: 'Tháng', monthlyFactor: 1 },
  { value: '07020', label: 'Ngày (40h)', monthlyFactor: 22 },
  { value: '07021', label: 'Ngày (48h)', monthlyFactor: 26 },
  { value: '07030', label: 'Giờ (40h)', monthlyFactor: 176 },
  { value: '07031', label: 'Giờ (48h)', monthlyFactor: 208 },
] as const;
export function contractTimeUnitLabel(value: string | null) {
  return contractTimeUnitOptions.find((option) => option.value === value)?.label || value || '—';
}
export function calculateMonthlyAllowance(amount: number | null, timeUnit: string | null) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) return null;
  const option = contractTimeUnitOptions.find((item) => item.value === timeUnit);
  return option ? Math.round(amount * option.monthlyFactor * 100) / 100 : null;
}
export const employeeSocialInsuranceRate = 0.08;
export function calculateTotalAllowance(allowances: { soTienPhuCapThang: number | null }[]) {
  return (
    Math.round(
      allowances.reduce(
        (total, item) =>
          total +
          (typeof item.soTienPhuCapThang === 'number' && Number.isFinite(item.soTienPhuCapThang)
            ? item.soTienPhuCapThang
            : 0),
        0,
      ) * 100,
    ) / 100
  );
}
export function calculateTotalIncome(baseSalary: number | null, totalAllowance: number) {
  return typeof baseSalary === 'number' && Number.isFinite(baseSalary) && baseSalary >= 0
    ? Math.round((baseSalary + Math.max(totalAllowance, 0)) * 100) / 100
    : null;
}
export function calculateProbationSalary(income: number | null) {
  return typeof income === 'number' && Number.isFinite(income) && income >= 0
    ? Math.round(income * 0.85 * 100) / 100
    : null;
}
export function calculateSocialInsuranceContribution(baseSalary: number | null) {
  return typeof baseSalary === 'number' && Number.isFinite(baseSalary) && baseSalary >= 0
    ? Math.round(baseSalary * employeeSocialInsuranceRate * 100) / 100
    : null;
}
export const contractWorkflow: {
  key: ContractAction;
  label: string;
  message: string;
  permission: string;
}[] = [
  {
    key: 'review',
    label: 'Review',
    message: 'Bạn có chắc chắn muốn review hợp đồng này?',
    permission: 'review',
  },
  {
    key: 'confirmReview',
    label: 'Xác nhận Review',
    message: 'Bạn có chắc chắn xác nhận nội dung hợp đồng?',
    permission: 'review',
  },
  {
    key: 'approve',
    label: 'Duyệt',
    message: 'Bạn có chắc chắn duyệt hợp đồng này?',
    permission: 'approve',
  },
  {
    key: 'sign',
    label: 'Xác nhận ký',
    message: 'Bạn có chắc chắn xác nhận hợp đồng đã ký?',
    permission: 'sign',
  },
];
export function getContractActions(status: string) {
  return {
    review: status === '1',
    confirmReview: status === '2',
    approve: status === '3',
    sign: status === '4',
    proposal: status === '3',
  };
}
export function nextContractStatus(status: ContractStatus, action: ContractAction): ContractStatus {
  if (!getContractActions(status)[action])
    throw new Error(
      'Trạng thái hợp đồng đã thay đổi hoặc thao tác không hợp lệ. Vui lòng tải lại.',
    );
  return ({ review: '2', confirmReview: '3', approve: '4', sign: '5' } as const)[action];
}
export function emptyContract(): ContractInput {
  return {
    maNhanVien: '',
    soHopDongLaoDong: '',
    maLoaiHopDong: '',
    maChucVu: '',
    maBoPhan: '',
    ngayKyHopDong: null,
    ngayBatDau: null,
    ngayKetThuc: null,
    luongCoBan: null,
    tongThuNhap: null,
    tongPhuCap: 0,
    luongThuViec: null,
    mucDongBHXH: null,
    ghiChu: '',
    phuCaps: [],
  };
}
export function validContractDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00.000Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validateContract(input: ContractInput): ContractValidation {
  const master: Record<string, string> = {};
  const required = {
    maNhanVien: 'nhân viên',
    soHopDongLaoDong: 'số hợp đồng',
    maLoaiHopDong: 'loại hợp đồng',
    maChucVu: 'chức vụ',
    maBoPhan: 'bộ phận',
  } as const;
  for (const [key, label] of Object.entries(required))
    if (!String(input[key as keyof typeof required] ?? '').trim())
      master[key] = 'Vui lòng nhập ' + label + '.';
  if (input.soHopDongLaoDong.trim().length > 30)
    master.soHopDongLaoDong = 'Số hợp đồng tối đa 30 ký tự.';
  if (input.ghiChu.length > 500) master.ghiChu = 'Ghi chú tối đa 500 ký tự.';
  for (const key of ['luongCoBan'] as const) {
    const value = input[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0)
      master[key] = 'Vui lòng nhập số tiền lớn hơn hoặc bằng 0.';
  }
  for (const key of ['ngayKyHopDong', 'ngayBatDau', 'ngayKetThuc'] as const)
    if (input[key] && !validContractDate(input[key]!)) master[key] = 'Ngày không hợp lệ.';
  if (input.ngayBatDau && input.ngayKetThuc && input.ngayBatDau > input.ngayKetThuc)
    master.ngayKetThuc = 'Ngày kết thúc không được trước ngày bắt đầu.';
  const counts = new Map<string, number>();
  input.phuCaps.forEach((row) => counts.set(row.maPhuCap, (counts.get(row.maPhuCap) || 0) + 1));
  const details = input.phuCaps.map((row) => {
    const errors: Record<string, string> = {};
    if (!row.maPhuCap) errors.maPhuCap = 'Vui lòng chọn phụ cấp.';
    else if (counts.get(row.maPhuCap)! > 1) errors.maPhuCap = 'Phụ cấp bị trùng trong hợp đồng.';
    if (
      typeof row.soTienPhuCap !== 'number' ||
      !Number.isFinite(row.soTienPhuCap) ||
      row.soTienPhuCap < 0
    )
      errors.soTienPhuCap = 'Số tiền phải lớn hơn hoặc bằng 0.';
    if (!contractTimeUnitOptions.some((option) => option.value === row.donViTinhThoiGian))
      errors.donViTinhThoiGian = 'Vui lòng chọn đơn vị thời gian.';
    return errors;
  });
  return { master, details };
}
export function hasContractErrors(errors: ContractValidation) {
  return (
    Object.keys(errors.master).length > 0 ||
    errors.details.some((row) => Object.keys(row).length > 0)
  );
}
export function contractDate(value: string | null) {
  return value ? value.slice(0, 10).split('-').reverse().join('/') : '—';
}
export function contractMoney(value: number | null) {
  return value == null
    ? '—'
    : new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
        value,
      );
}
export function contractError(error: unknown) {
  return getApiErrorMessage(error);
}
