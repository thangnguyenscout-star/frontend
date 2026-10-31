import { describe, expect, it } from 'vitest';
import {
  balanceStatus,
  balanceTotals,
  blankBalance,
  blankPolicy,
  createAnnualDemo,
  validateBalance,
  validateDays,
  validatePolicy,
} from './annual-leave.model';
import {
  adjustBalance,
  allocateBalances,
  previewAdjustment,
  saveBalance,
  savePolicy,
} from './annual-leave.repository';

const balance = () => ({ ...blankBalance(2026), nhanVienId: 'NV0001' });
describe('annual leave DDL calculations and constraints', () => {
  it('calculates grants and available days with integer tenths, including signed adjustments', () => {
    const row = {
      ...balance(),
      soNgayPhepCoBan: 12,
      soNgayPhepThamNien: 1,
      soNgayPhepChuyenSang: 2,
      soNgayPhepDieuChinh: -0.2,
      soNgayPhepDaSieuDung: 4.1,
      soNgayPhepChoDuyet: 0.3,
      soNgayPhepCuHetHan: 0.1,
    };
    expect(balanceTotals(row)).toEqual({ tongPhepDuocCap: 14.8, soNgayPhepConLai: 10.3 });
    expect(balanceTotals({ ...row, soNgayPhepDaSieuDung: 20 }).soNgayPhepConLai).toBe(-5.6);
  });
  it('preserves SQL NULL propagation and distinguishes it from zero', () => {
    expect(balanceTotals({ ...balance(), soNgayPhepDieuChinh: null })).toEqual({
      tongPhepDuocCap: null,
      soNgayPhepConLai: null,
    });
    expect(balanceTotals({ ...balance(), soNgayPhepChoDuyet: null })).toEqual({
      tongPhepDuocCap: 12,
      soNgayPhepConLai: null,
    });
    expect(balanceTotals({ ...balance(), soNgayPhepCoBan: 0 }).soNgayPhepConLai).toBe(0);
  });
  it('enforces decimal(4,1), allows signed adjustments and rejects excessive precision', () => {
    expect(() => validateDays(999.9, 'Phép')).not.toThrow();
    expect(() => validateDays(-999.9, 'Điều chỉnh', true)).not.toThrow();
    for (const invalid of [1000, 1.25, NaN, Infinity, -0.1])
      expect(() => validateDays(invalid, 'Phép')).toThrow();
  });
  it('enforces employee/year uniqueness, identity and valid dates', () => {
    const state = createAnnualDemo(2026);
    expect(() => validateBalance(balance(), state.balances)).toThrow('đã có số dư');
    expect(() => validateBalance({ ...balance(), nhanVienId: 'NV00001' }, [])).toThrow('6 ký tự');
    expect(() => validateBalance({ ...balance(), hanSuDungPhepCu: '2026-02-30' }, [])).toThrow(
      'Hạn sử dụng',
    );
    expect(() =>
      validateBalance({ ...balance(), soNgayPhepCuHetHan: 2, soNgayPhepChuyenSang: 1 }, []),
    ).toThrow('không được vượt');
    expect(() => saveBalance(state, { ...state.balances[0], nam: 2027 })).toThrow('Không thay đổi');
  });
  it('validates nullable policy settings, tinyint bounds and expiry month', () => {
    expect(() =>
      validatePolicy({
        ...blankPolicy(),
        tenChinhSach: 'Mẫu',
        soNgayPhepNam: null,
        isActive: null,
      }),
    ).not.toThrow();
    expect(() => validatePolicy(blankPolicy())).toThrow('Tên chính sách');
    expect(() =>
      validatePolicy({ ...blankPolicy(), tenChinhSach: 'Mẫu', soThangThamNienCongDon: 256 }),
    ).toThrow('255');
    expect(() =>
      validatePolicy({ ...blankPolicy(), tenChinhSach: 'Mẫu', thangHetDungPhepCu: 13 }),
    ).toThrow('1 đến 12');
  });
  it('flags expired carryover for review without changing or deducting it', () => {
    const row = { ...balance(), soNgayPhepChuyenSang: 2, hanSuDungPhepCu: '2026-03-31' };
    expect(balanceStatus(row, '2026-10-29').key).toBe('review');
    expect(balanceTotals(row).soNgayPhepConLai).toBe(14);
    expect(balanceStatus({ ...row, soNgayPhepCuHetHan: 2 }, '2026-10-29').key).toBe('available');
  });
});
describe('annual leave prototype mutations', () => {
  it('allocates only missing employees, deduplicates selection and leaves existing data untouched', () => {
    const state = createAnnualDemo(2026);
    const snapshot = JSON.stringify(state);
    const result = allocateBalances(state, 1, 2026, ['NV0001', 'NV0011', 'NV0012', 'NV0011']);
    expect(result.created).toBe(2);
    expect(result.skipped).toBe(1);
    expect(result.state.balances).toHaveLength(12);
    expect(result.state.balances[0]).toEqual(state.balances[0]);
    expect(JSON.stringify(state)).toBe(snapshot);
    expect(result.state.balances.find((r) => r.nhanVienId === 'NV0011')?.soNgayPhepThamNien).toBe(
      0,
    );
    expect(() => allocateBalances(state, 3, 2026, ['NV0011'])).toThrow('đang áp dụng');
    expect(() => allocateBalances(state, 1, NaN, ['NV0001'])).toThrow('Năm quản lý');
  });
  it('applies a delta to the adjustment field, preserves approved/pending usage and previews exactly', () => {
    const state = createAnnualDemo(2026);
    const previous = state.balances[0];
    const preview = previewAdjustment(previous, 0.3);
    const next = adjustBalance(state, previous.id, 0.3, 'Bổ sung phép', '2026-10-29T08:00:00Z');
    expect(balanceTotals(next.balances[0])).toEqual(preview);
    expect(next.balances[0].soNgayPhepDieuChinh).toBe(0.3);
    expect(next.balances[0].soNgayPhepDaSieuDung).toBe(previous.soNgayPhepDaSieuDung);
    expect(next.balances[0].soNgayPhepChoDuyet).toBe(previous.soNgayPhepChoDuyet);
    expect(next.balances[0].ghiChu).toBe('Bổ sung phép');
    expect(() => adjustBalance(state, previous.id, 0, 'Lý do')).toThrow('khác 0');
    expect(() => adjustBalance(state, previous.id, 1, ' ')).toThrow('Lý do');
  });
  it('rejects stale edits and preserves creation audit fields on update', () => {
    const state = createAnnualDemo(2026);
    const updated = savePolicy(
      state,
      { ...state.policies[0], tenChinhSach: 'Sửa chính sách' },
      'HR.DEMO',
      '2026-10-29T09:00:00Z',
    );
    expect(updated.policies[0].createdAt).toBe(state.policies[0].createdAt);
    expect(updated.policies[0].updatedAt).toBe('2026-10-29T09:00:00Z');
    expect(() => savePolicy(updated, state.policies[0], 'HR.DEMO')).toThrow('tab khác');
    const balanceUpdated = adjustBalance(state, 1, 1, 'Điều chỉnh', '2026-10-29T09:00:00Z');
    expect(() => saveBalance(balanceUpdated, state.balances[0])).toThrow('tab khác');
  });
});
