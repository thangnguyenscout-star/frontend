import { describe, expect, it } from 'vitest';
import { contractCompensation, contractEndDate, monthlyAllowance } from './contract-calculations';
const catalog = (unit: number, type = 1) => ({ maPhuCap: 'PC', tenPhuCap: 'Allowance', loaiTinh: type, donViThoiGian: unit });

describe('monthly contract compensation', () => {
  it.each([[1, 10000], [2, 260000], [3, 2080000]])('converts unit %s to a monthly amount', (unit, expected) => {
    expect(monthlyAllowance({ maPhuCap: 'PC', soTien: 10000 }, catalog(unit), 0)).toBe(expected);
  });
  it.each([[1, 500000], [2, 13000000], [3, 104000000]])('uses insurance salary for percentage unit %s', (unit, expected) => {
    expect(monthlyAllowance({ maPhuCap: 'PC', soTien: 999, tyLe: 10 }, catalog(unit, 2), 5000000)).toBe(expected);
  });
  it('recalculates totals when rows are added, changed, removed or salary changes', () => {
    const catalogs = [catalog(2), { ...catalog(1, 2), maPhuCap: 'PERCENT' }];
    const rows = [{ maPhuCap: 'PC', soTien: 10000 }, { maPhuCap: 'PERCENT', soTien: 0, tyLe: 10 }];
    const result = contractCompensation(rows, catalogs, 10000000);
    expect(result.mucDongBHXH).toBe(10000000);
    expect(result.luongPhuCap).toBe(1260000);
    expect(result.tongThuNhap).toBe(11260000);
    expect(result.phuCaps.map(row => row.mucTinh)).toEqual([260000, 1000000]);
    expect(contractCompensation(rows, catalogs, 12000000).tongThuNhap).toBe(13460000);
    expect(contractCompensation([{ maPhuCap: 'PC', soTien: 20000 }], catalogs, 10000000).luongPhuCap).toBe(520000);
    expect(contractCompensation([], catalogs, 10000000)).toEqual({ phuCaps: [], luongPhuCap: 0, mucDongBHXH: 10000000, tongThuNhap: 10000000 });
  });
  it('does not count blank rows or invalid amounts', () => {
    expect(monthlyAllowance({ maPhuCap: '', soTien: 100 }, undefined, 0)).toBe(0);
    expect(monthlyAllowance({ maPhuCap: 'PC', soTien: Number.NaN }, catalog(1), 0)).toBe(0);
  });
});

describe('contract end date', () => {
  it('adds two calendar months for probation, including month-end clamping', () => {
    expect(contractEndDate('2026-09-25', '07001', '')).toBe('2026-11-25');
    expect(contractEndDate('2026-12-31', '07001', '')).toBe('2027-02-28');
    expect(contractEndDate('2027-12-31', '07001', '')).toBe('2028-02-29');
  });
  it.each(['Hợp đồng 1 năm', 'Hợp đồng 01 năm', 'Hợp đồng một năm', 'Hợp đồng 12 tháng'])('adds one year for %s', label => {
    expect(contractEndDate('2024-02-29', 'ANNUAL', label)).toBe('2025-02-28');
  });
  it.each(['Hợp đồng vô thời hạn', 'Hợp đồng không xác định thời hạn'])('clears end date for %s', label => {
    expect(contractEndDate('2026-09-25', 'INDEFINITE', label)).toBe('');
  });
  it('clears the end date for absent or invalid starts', () => {
    expect(contractEndDate('', '07001', '')).toBe('');
    expect(contractEndDate('2026-02-30', '07001', '')).toBe('');
  });
});
