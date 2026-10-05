import type { AllowanceCatalogItem, ContractAllowanceInput } from '@/types/contract-api';
import { validContractDate } from './contract';

const monthlyFactors: Record<number, number> = { 1: 1, 2: 26, 3: 8 * 26 };
const roundMoney = (value: number) => Math.round(value * 100) / 100;

export function monthlyAllowance(row: ContractAllowanceInput, catalog: AllowanceCatalogItem | undefined, insuranceSalary: number) {
  const factor = monthlyFactors[Number(catalog?.donViThoiGian)];
  const amount = Number(catalog?.loaiTinh) === 2
    ? insuranceSalary * (row.tyLe ?? 0) / 100
    : row.soTien;
  if (!factor || !Number.isFinite(amount) || amount < 0) return 0;
  return roundMoney(amount * factor);
}

export function contractCompensation(
  rows: ContractAllowanceInput[],
  catalog: AllowanceCatalogItem[],
  baseSalary: number,
) {
  const phuCaps = rows.map(row => ({
    ...row,
    mucTinh: monthlyAllowance(row, catalog.find(item => item.maPhuCap === row.maPhuCap), baseSalary),
  }));
  const luongPhuCap = roundMoney(phuCaps.reduce((total, row) => total + row.mucTinh, 0));
  return { phuCaps, luongPhuCap, mucDongBHXH: baseSalary || 0, tongThuNhap: roundMoney((baseSalary || 0) + luongPhuCap) };
}

// Catalogs currently expose a code and label, without duration metadata.
export function contractDurationMonths(code: string, label: string): number | null {
  const name = label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (code === '07001' || name.includes('thu viec')) return 2;
  if (name.includes('vo thoi han') || name.includes('khong xac dinh')) return null;
  if (/\b(0?1|mot) nam\b/.test(name) || /\b12 thang\b/.test(name)) return 12;
  return null;
}

export function contractEndDate(start: string, code: string, label: string) {
  const months = contractDurationMonths(code, label);
  if (!months || !validContractDate(start)) return '';
  const date = new Date(start + 'T00:00:00Z');
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}
