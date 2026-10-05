import { validContractDate } from '@/utils/contract';
import type {
  RecruitmentInput,
  RecruitmentStatus,
  RecruitmentValidation,
} from '@/types/recruitment';

export const recruitmentStatusLabels: Record<RecruitmentStatus, string> = {
  '1': 'Tuyển dụng',
  '2': 'Tiếp nhận',
  '3': 'Không tuyển',
  '4': 'Không nhận việc',
  '5': 'Đã nhận việc',
  '6': 'Hoàn thành thủ tục nhận việc',
};

export const recruitmentStatusSeverity: Record<RecruitmentStatus, string> = {
  '1': 'info',
  '2': 'warning',
  '3': 'danger',
  '4': 'secondary',
  '5': 'success',
  '6': 'success',
};

export const genderLabels: Record<string, string> = { M: 'Nam', F: 'Nữ', O: 'Khác' };

export const recruitmentActions = [
  { value: '2' as RecruitmentStatus, label: 'Tiếp nhận', enabled: () => true },
  { value: '3' as RecruitmentStatus, label: 'Không tuyển', enabled: () => true },
  {
    value: '4' as RecruitmentStatus,
    label: 'Không nhận việc',
    enabled: (status: RecruitmentStatus) => status === '2',
  },
  {
    value: '5' as RecruitmentStatus,
    label: 'Đã nhận việc',
    enabled: (status: RecruitmentStatus) => status === '2',
  },
];

export function emptyRecruitment(): RecruitmentInput {
  return {
    ngayTiepNhan: null,
    ho: '',
    tenDem: '',
    ten: '',
    gioiTinh: '',
    soCCCD: '',
    ngayCap: null,
    noiCap: '',
    soDienThoai: '',
    email: '',
    tongThuNhapThoaThuan: null,
    luongCoBan: null,
    luongThuViec: null,
    maBoPhanDuKien: '',
    maChucVuDuKien: '',
    ngayBatDauLamViec: null,
  };
}

export function validateRecruitment(input: RecruitmentInput): RecruitmentValidation {
  const errors: RecruitmentValidation = {};
  const required = [
    ['ho', 'họ'],
    ['tenDem', 'tên đệm'],
    ['ten', 'tên'],
    ['gioiTinh', 'giới tính'],
    ['maBoPhanDuKien', 'bộ phận dự kiến'],
    ['maChucVuDuKien', 'chức vụ dự kiến'],
  ] as const;
  for (const [key, label] of required)
    if (!String(input[key]).trim()) errors[key] = 'Vui lòng nhập ' + label + '.';
  if (input.ho.length > 10) errors.ho = 'Họ tối đa 10 ký tự.';
  if (input.tenDem.length > 30) errors.tenDem = 'Tên đệm tối đa 30 ký tự.';
  if (input.ten.length > 20) errors.ten = 'Tên tối đa 20 ký tự.';
  if (input.soDienThoai.length > 13) errors.soDienThoai = 'Số điện thoại tối đa 13 ký tự.';
  if (input.email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || input.email.length > 100))
    errors.email = 'Email không đúng định dạng.';
  for (const key of ['tongThuNhapThoaThuan', 'luongCoBan', 'luongThuViec'] as const)
    if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key]! < 0)
      errors[key] = 'Vui lòng nhập số tiền lớn hơn hoặc bằng 0.';
  if (input.ngayCap && !validContractDate(input.ngayCap))
    errors.ngayCap = 'Ngày cấp không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy.';
  return errors;
}
