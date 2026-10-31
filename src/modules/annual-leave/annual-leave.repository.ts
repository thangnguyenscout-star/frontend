import {
  annualEmployees,
  balanceTotals,
  blankBalance,
  createAnnualDemo,
  validateBalance,
  validateDays,
  validatePolicy,
  type AnnualLeaveState,
  type LeaveBalance,
  type LeavePolicy,
} from './annual-leave.model';

// Prototype storage only. Replace this repository with API calls when contracts are available.
const storageKey = 'hrms-annual-leave-prototype-v1';
export function loadAnnualDemo(year: number): AnnualLeaveState {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return createAnnualDemo(year);
  const value = JSON.parse(saved) as AnnualLeaveState;
  if (value.version !== 1 || !Array.isArray(value.policies) || !Array.isArray(value.balances))
    throw new Error('Dữ liệu mẫu đã lưu không đúng định dạng.');
  value.policies.forEach(validatePolicy);
  value.balances.forEach((row) => validateBalance(row, value.balances));
  return value;
}
export function persistAnnualDemo(state: AnnualLeaveState) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;
export function savePolicy(
  state: AnnualLeaveState,
  input: LeavePolicy,
  actor: string,
  now = new Date().toISOString(),
): AnnualLeaveState {
  validatePolicy(input);
  const previous = state.policies.find((p) => p.id === input.id);
  if (input.id && !previous) throw new Error('Chính sách không còn tồn tại.');
  if (previous && previous.updatedAt !== input.updatedAt)
    throw new Error('Chính sách đã thay đổi ở tab khác. Đóng form và mở lại trước khi lưu.');
  const policy = {
    ...input,
    tenChinhSach: input.tenChinhSach.trim(),
    id: previous?.id || nextId(state.policies),
    userCreated: previous?.userCreated ?? actor,
    createdAt: previous?.createdAt ?? now,
    userUpdated: previous ? actor : null,
    updatedAt: previous ? now : null,
  };
  return {
    ...state,
    policies: previous
      ? state.policies.map((p) => (p.id === policy.id ? policy : p))
      : [...state.policies, policy],
  };
}
export function saveBalance(
  state: AnnualLeaveState,
  input: LeaveBalance,
  now = new Date().toISOString(),
): AnnualLeaveState {
  validateBalance(input, state.balances);
  const previous = state.balances.find((r) => r.id === input.id);
  if (input.id && !previous) throw new Error('Số dư phép không còn tồn tại.');
  if (previous && previous.ngayCapNhat !== input.ngayCapNhat)
    throw new Error('Số dư đã thay đổi ở tab khác. Đóng form và mở lại trước khi lưu.');
  if (previous && (previous.nhanVienId !== input.nhanVienId || previous.nam !== input.nam))
    throw new Error('Không thay đổi nhân viên hoặc năm của số dư đã tạo.');
  const balance = {
    ...input,
    id: previous?.id || nextId(state.balances),
    ghiChu: input.ghiChu?.trim() || null,
    ngayTao: previous?.ngayTao || now,
    ngayCapNhat: now,
  };
  return {
    ...state,
    balances: previous
      ? state.balances.map((r) => (r.id === balance.id ? balance : r))
      : [...state.balances, balance],
  };
}
export function adjustBalance(
  state: AnnualLeaveState,
  id: number,
  delta: number,
  reason: string,
  now = new Date().toISOString(),
) {
  validateDays(delta, 'Số ngày điều chỉnh', true);
  if (!delta) throw new Error('Số ngày điều chỉnh phải khác 0.');
  if (!reason.trim() || reason.trim().length > 255)
    throw new Error('Lý do điều chỉnh bắt buộc, tối đa 255 ký tự.');
  const previous = state.balances.find((r) => r.id === id);
  if (!previous) throw new Error('Không tìm thấy số dư phép.');
  if (previous.soNgayPhepDieuChinh === null)
    throw new Error('Cần bổ sung số phép điều chỉnh hiện tại trước khi cộng/trừ.');
  return saveBalance(
    state,
    {
      ...previous,
      soNgayPhepDieuChinh:
        (Math.round(previous.soNgayPhepDieuChinh * 10) + Math.round(delta * 10)) / 10,
      ghiChu: reason.trim(),
    },
    now,
  );
}
export function allocateBalances(
  state: AnnualLeaveState,
  policyId: number,
  year: number,
  codes: string[],
  now = new Date().toISOString(),
) {
  if (!Number.isInteger(year) || year < 1900 || year > 9999)
    throw new Error('Năm quản lý phải từ 1900 đến 9999.');
  const policy = state.policies.find((p) => p.id === policyId && p.isActive === true);
  if (!policy || policy.soNgayPhepNam === null)
    throw new Error('Chọn chính sách đang áp dụng có số ngày phép năm.');
  if (!codes.length || codes.some((code) => !annualEmployees.some((e) => e.code === code)))
    throw new Error('Chọn ít nhất một nhân viên hợp lệ.');
  let next = state;
  let created = 0;
  for (const code of new Set(codes)) {
    if (next.balances.some((r) => r.nhanVienId === code && r.nam === year)) continue;
    next = saveBalance(
      next,
      {
        ...blankBalance(year),
        nhanVienId: code,
        soNgayPhepCoBan: policy.soNgayPhepNam,
        ghiChu: `Khởi tạo theo mẫu: ${policy.tenChinhSach}`,
      },
      now,
    );
    created++;
  }
  return { state: next, created, skipped: new Set(codes).size - created };
}
export function previewAdjustment(balance: LeaveBalance, delta: number) {
  return balanceTotals({
    ...balance,
    soNgayPhepDieuChinh:
      balance.soNgayPhepDieuChinh === null
        ? null
        : (Math.round(balance.soNgayPhepDieuChinh * 10) + Math.round(delta * 10)) / 10,
  });
}
