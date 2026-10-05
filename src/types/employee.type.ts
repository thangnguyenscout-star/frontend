import { getApiErrorMessage } from '@/utils/error-message';
import type { HrRecord } from '@/types/common';
export interface EmployeeResponse<T> {
  isResults: boolean;
  message?: string;
  data: T | null;
}
export interface MasterCode {
  maKey: string;
  tenGiaTri: string;
  phanLoai: string;
}
export type EmployeeDto = Record<string, string | number | null> & { maNhanVien: string };
export const employeeFieldMap = {
  code: 'maNhanVien',
  lastName: 'ho',
  middleName: 'tenDem',
  firstName: 'ten',
  gender: 'gioiTinh',
  birthDate: 'ngaySinh',
  ethnicity: 'danToc',
  religion: 'tonGiao',
  birthPlace: 'noiSinh',
  address: 'diaChiThuongTru',
  currentAddress: 'diaChiLienHe',
  email: 'email',
  phone: 'soDienThoai',
  education: 'trinhDoHocVan',
  specialization: 'trinhDoChuyenMon',
  identityNumber: 'cccd',
  identityIssuedDate: 'ngayCap',
  identityIssuedPlace: 'noiCap',
  startDate: 'ngayTuyenDung',
  bankAccount: 'soTaiKhoanNganHang',
  bank: 'nganHang',
  insuranceNumber: 'soBaoHiemXaHoi',
  taxCode: 'maSoThueCaNhan',
  taxIssuedDate: 'ngayCapMaSo',
  dependents: 'soNguoiPhuThuoc',
  status: 'trangThaiNhanVien',
  endDate: 'ngayNghiViec',
} as const;
const dateFields = new Set([
  'birthDate',
  'identityIssuedDate',
  'startDate',
  'taxIssuedDate',
  'endDate',
]);
export function mapEmployeeDetailToForm(data: EmployeeDto): HrRecord {
  const form: HrRecord = {
    id: data.maNhanVien,
    code: data.maNhanVien,
    name: String(data.hoTen ?? ''),
    status: '',
  };
  for (const [key, apiKey] of Object.entries(employeeFieldMap)) {
    const value = data[apiKey];
    form[key] = value == null ? '' : dateFields.has(key) ? String(value).slice(0, 10) : value;
  }
  form.gender = data.gioiTinh === 'M' ? 'Nam' : data.gioiTinh === 'F' ? 'Nữ' : '';
  return form;
}
// Employee form values are calendar dates. Encode midnight UTC explicitly so
// serialization never shifts the selected date through the browser's timezone.
function toEmployeeDateTime(value: string | number | null | undefined): string | null {
  if (value == null || value === '') return null;
  const date = String(value).trim();
  if (!date) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Ngày không hợp lệ.');
  const timestamp = `${date}T00:00:00.000Z`;
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date)
    throw new Error('Ngày không hợp lệ.');
  return timestamp;
}
export function mapEmployeeFormToInput(form: HrRecord) {
  const input: Record<string, string | number | null> = {};
  for (const [key, apiKey] of Object.entries(employeeFieldMap)) {
    const value = typeof form[key] === 'string' ? String(form[key]).trim() : form[key];
    input[apiKey] = dateFields.has(key)
      ? toEmployeeDateTime(value)
      : value === '' || value == null
        ? null
        : value;
  }
  input.gioiTinh = form.gender === 'Nam' ? 'M' : form.gender === 'Nữ' ? 'F' : null;
  input.soNguoiPhuThuoc = input.soNguoiPhuThuoc == null ? null : Number(input.soNguoiPhuThuoc);
  return input;
}
export function employeeErrorMessage(error: unknown): string {
  return getApiErrorMessage(error);
}
