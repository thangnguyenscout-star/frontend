export interface LeavePolicy {
  id: number;
  tenChinhSach: string;
  soNgayPhepNam: number | null;
  thuViecHuongNgayPhep: boolean | null;
  choPhepNghiKhongLuong: boolean | null;
  soThangDuocCongNgay: number | null;
  soThangThamNienCongDon: number | null;
  soPhepDuocChuyenSangNam: number | null;
  thangHetDungPhepCu: number | null;
  isActive: boolean | null;
  userCreated: string | null;
  createdAt: string | null;
  userUpdated: string | null;
  updatedAt: string | null;
}
export const balanceFields = [
  'soNgayPhepCoBan',
  'soNgayPhepThamNien',
  'soNgayPhepChuyenSang',
  'soNgayPhepDieuChinh',
  'soNgayPhepDaSieuDung',
  'soNgayPhepChoDuyet',
  'soNgayPhepCuHetHan',
] as const;
export type BalanceField = (typeof balanceFields)[number];
export const balanceLabels: Record<BalanceField, string> = {
  soNgayPhepCoBan: 'Phép cơ bản',
  soNgayPhepThamNien: 'Phép thâm niên',
  soNgayPhepChuyenSang: 'Phép chuyển sang',
  soNgayPhepDieuChinh: 'Phép điều chỉnh',
  soNgayPhepDaSieuDung: 'Đã sử dụng',
  soNgayPhepChoDuyet: 'Chờ duyệt',
  soNgayPhepCuHetHan: 'Phép cũ hết hạn',
};
export interface LeaveBalance extends Record<BalanceField, number | null> {
  id: number;
  nhanVienId: string;
  nam: number;
  hanSuDungPhepCu: string | null;
  ghiChu: string | null;
  ngayTao: string;
  ngayCapNhat: string;
}
export interface LeaveEmployee {
  code: string;
  name: string;
  department: string;
}
export interface AnnualLeaveState {
  version: 1;
  policies: LeavePolicy[];
  balances: LeaveBalance[];
}
export const policyNumbers = [
  ['soNgayPhepNam', 'Số ngày phép năm', 'ngày'],
  ['soThangDuocCongNgay', 'Số tháng được cộng ngày', 'tháng'],
  ['soThangThamNienCongDon', 'Số tháng thâm niên cộng dồn', 'tháng'],
  ['soPhepDuocChuyenSangNam', 'Số phép được chuyển sang năm', 'ngày'],
  ['thangHetDungPhepCu', 'Tháng hết dùng phép cũ', 'tháng'],
] as const;
export const annualEmployees: LeaveEmployee[] = [
  ['NV0001', 'Nguyễn Minh Anh', 'Khoa Khám bệnh'],
  ['NV0002', 'Trần Hoàng Nam', 'Khoa Khám bệnh'],
  ['NV0003', 'Lê Thu Hà', 'Khoa Cấp cứu'],
  ['NV0004', 'Phạm Quang Huy', 'Khoa Cấp cứu'],
  ['NV0005', 'Võ Ngọc Linh', 'Khoa Nội'],
  ['NV0006', 'Đặng Đức Anh', 'Khoa Nội'],
  ['NV0007', 'Bùi Thanh Mai', 'Khoa Ngoại'],
  ['NV0008', 'Đỗ Hải Đăng', 'Khoa Ngoại'],
  ['NV0009', 'Hồ Phương Thảo', 'Phòng Điều dưỡng'],
  ['NV0010', 'Ngô Tuấn Kiệt', 'Phòng Điều dưỡng'],
  ['NV0011', 'Dương Bảo Ngọc', 'Phòng Hành chính'],
  ['NV0012', 'Lý Minh Quân', 'Phòng Hành chính'],
].map(([code, name, department]) => ({ code, name, department }));
export function blankPolicy(): LeavePolicy {
  return {
    id: 0,
    tenChinhSach: '',
    soNgayPhepNam: 12,
    thuViecHuongNgayPhep: false,
    choPhepNghiKhongLuong: true,
    soThangDuocCongNgay: 1,
    soThangThamNienCongDon: 60,
    soPhepDuocChuyenSangNam: 5,
    thangHetDungPhepCu: 3,
    isActive: true,
    userCreated: null,
    createdAt: null,
    userUpdated: null,
    updatedAt: null,
  };
}
export function blankBalance(year: number): LeaveBalance {
  return {
    id: 0,
    nhanVienId: '',
    nam: year,
    soNgayPhepCoBan: 12,
    soNgayPhepThamNien: 0,
    soNgayPhepChuyenSang: 0,
    soNgayPhepDieuChinh: 0,
    soNgayPhepDaSieuDung: 0,
    soNgayPhepChoDuyet: 0,
    soNgayPhepCuHetHan: 0,
    hanSuDungPhepCu: null,
    ghiChu: null,
    ngayTao: '',
    ngayCapNhat: '',
  };
}
// Keep SQL NULL propagation; calculate decimal days as integer tenths to avoid floating point drift.
export function balanceTotals(balance: LeaveBalance) {
  const grantedFields = balanceFields.slice(0, 4);
  const granted = grantedFields.some((field) => balance[field] === null)
    ? null
    : grantedFields.reduce((sum, field) => sum + Math.round(balance[field]! * 10), 0) / 10;
  const available =
    granted === null || balanceFields.slice(4).some((field) => balance[field] === null)
      ? null
      : (Math.round(granted * 10) -
          balanceFields
            .slice(4)
            .reduce((sum, field) => sum + Math.round(balance[field]! * 10), 0)) /
        10;
  return { tongPhepDuocCap: granted, soNgayPhepConLai: available };
}
export function validatePolicy(policy: LeavePolicy) {
  if (!policy.tenChinhSach.trim() || policy.tenChinhSach.trim().length > 100)
    throw new Error('Tên chính sách bắt buộc, tối đa 100 ký tự.');
  for (const [key, label] of policyNumbers) {
    const value = policy[key];
    if (value !== null && (!Number.isInteger(value) || value < 0 || value > 255))
      throw new Error(label + ' phải là số nguyên từ 0 đến 255 hoặc để trống.');
  }
  if (
    policy.thangHetDungPhepCu !== null &&
    (policy.thangHetDungPhepCu < 1 || policy.thangHetDungPhepCu > 12)
  )
    throw new Error('Tháng hết dùng phép cũ phải từ 1 đến 12.');
  for (const key of ['thuViecHuongNgayPhep', 'choPhepNghiKhongLuong', 'isActive'] as const)
    if (policy[key] !== null && typeof policy[key] !== 'boolean')
      throw new Error('Lựa chọn chính sách không hợp lệ.');
}
export function validateDays(value: number | null, label: string, signed = false) {
  if (value === null) return;
  if (
    !Number.isFinite(value) ||
    Math.abs(value) > 999.9 ||
    Math.abs(value * 10 - Math.round(value * 10)) > 0.000001 ||
    (!signed && value < 0)
  )
    throw new Error(
      label + ` phải từ ${signed ? '-999,9' : '0'} đến 999,9, tối đa 1 chữ số thập phân.`,
    );
}
export function validateBalance(
  balance: LeaveBalance,
  existing: LeaveBalance[],
  employees = annualEmployees,
) {
  if (!employees.some((e) => e.code === balance.nhanVienId) || balance.nhanVienId.length !== 6)
    throw new Error('Vui lòng chọn mã nhân viên hợp lệ gồm 6 ký tự.');
  if (!Number.isInteger(balance.nam) || balance.nam < 1900 || balance.nam > 9999)
    throw new Error('Năm quản lý phải là số nguyên từ 1900 đến 9999.');
  if (
    existing.some(
      (row) =>
        row.id !== balance.id && row.nhanVienId === balance.nhanVienId && row.nam === balance.nam,
    )
  )
    throw new Error(
      'Nhân viên đã có số dư phép trong năm này. Mỗi nhân viên chỉ có một dòng mỗi năm.',
    );
  for (const key of balanceFields)
    validateDays(balance[key], balanceLabels[key], key === 'soNgayPhepDieuChinh');
  if ((balance.ghiChu?.length || 0) > 255) throw new Error('Ghi chú tối đa 255 ký tự.');
  if (balance.hanSuDungPhepCu) {
    const date = balance.hanSuDungPhepCu;
    const parsed = new Date(date + 'T00:00:00Z');
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    )
      throw new Error('Hạn sử dụng phép cũ không hợp lệ.');
  }
  if (
    balance.soNgayPhepCuHetHan !== null &&
    balance.soNgayPhepChuyenSang !== null &&
    balance.soNgayPhepCuHetHan > balance.soNgayPhepChuyenSang
  )
    throw new Error('Phép cũ hết hạn không được vượt quá số phép chuyển sang.');
}
export function balanceStatus(balance: LeaveBalance, today: string) {
  const available = balanceTotals(balance).soNgayPhepConLai;
  if (available === null) return { key: 'incomplete', label: 'Thiếu số liệu', tone: 'neutral' };
  if (available < 0) return { key: 'negative', label: 'Âm quỹ phép', tone: 'danger' };
  if (
    balance.hanSuDungPhepCu &&
    balance.hanSuDungPhepCu < today &&
    (balance.soNgayPhepChuyenSang || 0) > (balance.soNgayPhepCuHetHan || 0)
  )
    return { key: 'review', label: 'Rà soát phép cũ', tone: 'warning' };
  if (available <= 2) return { key: 'low', label: 'Sắp hết phép', tone: 'warning' };
  return { key: 'available', label: 'Còn phép', tone: 'success' };
}
export function createAnnualDemo(year: number): AnnualLeaveState {
  const stamp = `${year}-01-01T08:00:00+07:00`;
  const policy = blankPolicy();
  const balances = annualEmployees.slice(0, 10).map((employee, i) => {
    const balance = {
      ...blankBalance(year),
      id: i + 1,
      nhanVienId: employee.code,
      soNgayPhepThamNien: i % 3,
      soNgayPhepChuyenSang: i % 2 ? 2 : 0,
      soNgayPhepDieuChinh: i === 3 ? -1 : 0,
      soNgayPhepDaSieuDung: i === 0 ? 13.5 : 2 + i * 0.5,
      soNgayPhepChoDuyet: i % 3 === 0 ? 1 : 0.5,
      soNgayPhepCuHetHan: i === 5 ? 2 : 0,
      hanSuDungPhepCu: i % 2 ? `${year}-03-31` : null,
      ghiChu: 'Số liệu minh họa',
      ngayTao: stamp,
      ngayCapNhat: stamp,
    };
    return balance;
  });
  return {
    version: 1,
    policies: [
      {
        ...policy,
        id: 1,
        tenChinhSach: 'Chính sách phép tiêu chuẩn',
        userCreated: 'HR.DEMO',
        createdAt: stamp,
      },
      {
        ...policy,
        id: 2,
        tenChinhSach: 'Chính sách phép mở rộng',
        soNgayPhepNam: 14,
        thuViecHuongNgayPhep: true,
        userCreated: 'HR.DEMO',
        createdAt: stamp,
      },
      {
        ...policy,
        id: 3,
        tenChinhSach: 'Chính sách cũ',
        isActive: false,
        userCreated: 'HR.DEMO',
        createdAt: stamp,
      },
    ],
    balances,
  };
}
