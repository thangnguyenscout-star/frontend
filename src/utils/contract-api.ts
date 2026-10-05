import { getApiErrorMessage, getErrorMessage } from '@/utils/error-message';
import { normalizeErrorCode } from '@/services/graphql/errors';
import type { CreateContractInput } from '@/types/contract-api';
import type { RecruitmentRecord } from '@/types/recruitment';

export class ContractApiError extends Error {}
export function contractApiError(error: unknown): string {
  if (error instanceof ContractApiError) return getApiErrorMessage(error);
  if (error instanceof Error && !('graphQLErrors' in error) && !('networkError' in error)) {
    const code = normalizeErrorCode(error.message);
    return getErrorMessage(code === 'COMMON_UNKNOWN_ERROR' ? 'COMMON_NETWORK_ERROR' : code);
  }
  return getApiErrorMessage(error);
}
export function emptyContractForm(): CreateContractInput {
  return {
    maNhanVien: '',
    soHopDongLaoDong: '',
    maLoaiHopDong: '',
    maChucVu: '',
    ngayKyHopDong: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    luongCoBan: 0,
    mucDongBHXH: 0,
    luongPhuCap: 0,
    tongThuNhap: 0,
    luongThuViec: 0,
    trangThaiHopDong: '1',
    ghiChu: '',
    phuCaps: [],
  };
}
export function buildCreateContractInput(form: CreateContractInput): CreateContractInput {
  return {
    maNhanVien: form.maNhanVien.trim(),
    soHopDongLaoDong: form.soHopDongLaoDong.trim(),
    maLoaiHopDong: form.maLoaiHopDong.trim(),
    maChucVu: form.maChucVu?.trim() || undefined,
    ngayKyHopDong: form.ngayKyHopDong,
    ngayBatDau: form.ngayBatDau,
    ngayKetThuc: form.ngayKetThuc || undefined,
    luongCoBan: form.luongCoBan,
    mucDongBHXH: form.mucDongBHXH ?? undefined,
    luongPhuCap: form.luongPhuCap ?? undefined,
    tongThuNhap: form.tongThuNhap,
    luongThuViec: form.luongThuViec,
    trangThaiHopDong: form.trangThaiHopDong.trim(),
    ghiChu: form.ghiChu?.trim() || undefined,
    phuCaps: (form.phuCaps || []).map((row) => ({
      maPhuCap: row.maPhuCap.trim(),
      soTien: row.soTien,
      tyLe: row.tyLe ?? undefined,
      mucTinh: row.mucTinh ?? undefined,
      ghiChu: row.ghiChu?.trim() || undefined,
    })),
  };
}
export function buildProbationContractInput(
  form: CreateContractInput,
  record: RecruitmentRecord,
): CreateContractInput {
  if (record.trangThai !== '5')
    throw new ContractApiError(getErrorMessage('TIEPNHAN_INVALID_STATUS'));
  if (!record.maNhanVien?.trim())
    throw new ContractApiError(getErrorMessage('TIEPNHAN_EMPLOYEE_CODE_REQUIRED'));
  return buildCreateContractInput({
    ...form,
    maLoaiHopDong: '07001',
    maNhanVien: record.maNhanVien,
    maChucVu: record.maChucVuDuKien,
    ngayBatDau: record.ngayBatDauLamViec || '',
    luongCoBan: record.luongCoBan ?? 0,
    tongThuNhap: record.tongThuNhapThoaThuan ?? 0,
    luongThuViec: record.luongThuViec ?? 0,
    ghiChu: record.ghiChu || '',
  });
}
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
export function validateContractForm(form: CreateContractInput, probation = false) {
  const errors: Record<string, string> = {};
  const required = [
    'soHopDongLaoDong',
    'maLoaiHopDong',
    'ngayKyHopDong',
    'ngayBatDau',
    'maNhanVien',
    'trangThaiHopDong',
    ...(probation ? ['maChucVu', 'ngayKetThuc'] : []),
  ] as (keyof CreateContractInput)[];
  for (const key of required)
    if (!String(form[key] ?? '').trim()) errors[key] = 'Vui lòng nhập trường này.';
  for (const key of ['ngayKyHopDong', 'ngayBatDau', 'ngayKetThuc'] as const)
    if (form[key] && !validDate(form[key]!)) errors[key] = 'Ngày không hợp lệ.';
  if (form.ngayBatDau && form.ngayKyHopDong && form.ngayBatDau < form.ngayKyHopDong)
    errors.ngayBatDau = 'Ngày bắt đầu phải lớn hơn hoặc bằng ngày ký.';
  if (form.ngayKetThuc && form.ngayKetThuc < form.ngayBatDau)
    errors.ngayKetThuc = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.';
  for (const key of [
    'luongCoBan',
    'mucDongBHXH',
    'luongPhuCap',
    'tongThuNhap',
    'luongThuViec',
  ] as const) {
    const value = form[key];
    const optional = ['mucDongBHXH', 'luongPhuCap'].includes(key);
    if (optional && value == null) continue;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0)
      errors[key] = 'Số tiền phải lớn hơn hoặc bằng 0.';
  }
  const selectedAllowances = new Set<string>();
  (form.phuCaps || []).forEach((row, i) => {
    const code = row.maPhuCap.trim();
    if (code && selectedAllowances.has(code))
      errors['phuCaps.' + i + '.maPhuCap'] = 'Phụ cấp đã được chọn.';
    selectedAllowances.add(code);
    if (!row.maPhuCap.trim()) errors['phuCaps.' + i + '.maPhuCap'] = 'Vui lòng nhập mã phụ cấp.';
    for (const key of ['soTien', 'tyLe', 'mucTinh'] as const) {
      const value = row[key];
      if (key !== 'soTien' && value == null) continue;
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0)
        errors['phuCaps.' + i + '.' + key] = 'Giá trị phải lớn hơn hoặc bằng 0.';
    }
  });
  return errors;
}
