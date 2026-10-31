import type { Shift } from '@/types/schedule';
import {
  localLeaveDateTime,
  leaveRequestTimestamp,
  validateLeaveRequestRange,
  type LeaveRequestRange,
  type LeaveWorkShift,
} from '@/utils/leave-request';
import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import { scheduleTime } from '@/utils/schedule-time';

export const LEAVE_WORK_SHIFT = gql`
  query CaLamViecDonNghiPhep($maNhanVien: String!, $ngay: Date!) {
    caLamViecDonNghiPhep(maNhanVien: $maNhanVien, ngay: $ngay) {
      isResults
      message
      data {
        maCa
        gioBatDau
        gioKetThuc
        quaDem
      }
    }
  }
`;

export async function getLeaveWorkShift(
  employeeId: string,
  date: string,
): Promise<LeaveWorkShift | null> {
  if (!employeeId) throw new Error('Chưa xác định nhân viên nghỉ phép.');
  leaveRequestTimestamp(date, '00:00');
  const { data } = await apolloClient.query<{
    caLamViecDonNghiPhep: {
      isResults: boolean;
      message?: string | null;
      data: {
        maCa: string | null;
        gioBatDau: string | null;
        gioKetThuc: string | null;
        quaDem: boolean;
      } | null;
    };
  }>({
    query: LEAVE_WORK_SHIFT,
    variables: { maNhanVien: employeeId, ngay: date },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.caLamViecDonNghiPhep;
  if (result?.isResults !== true)
    throw new Error(result?.message || 'Không thể tải ca làm việc của ngày nghỉ phép.');
  if (!result.data?.maCa?.trim()) return null;
  const startTime = scheduleTime(result.data.gioBatDau);
  const endTime = scheduleTime(result.data.gioKetThuc);
  if (!startTime || !endTime || typeof result.data.quaDem !== 'boolean')
    throw new Error('Giờ ca làm việc không hợp lệ. Vui lòng kiểm tra lại phân ca.');
  return { code: result.data.maCa, startTime, endTime, overnight: result.data.quaDem };
}

export const leaveRequestStatuses = [
  { code: 'N', label: 'Tạo mới', severity: 'info' },
  { code: 'A', label: 'Đã duyệt', severity: 'success' },
  { code: 'C', label: 'Hủy đơn', severity: 'secondary' },
] as const;
export interface LeaveRequestFilter {
  thang: number | null;
  nam: number | null;
  maBoPhan: string | null;
  maNhanVien: string | null;
  tinhTrang: string | null;
}
export interface LeaveRequestInput extends LeaveRequestFilter {
  pageIndex: number;
  pageSize: number;
}
export interface LeaveRequest {
  id: string | number;
  maNhanVien: string;
  ho: string | null;
  tenDem: string | null;
  ten: string | null;
  hoTen: string | null;
  ngaySinh: string | null;
  maBoPhan: string | null;
  tenBoPhan: string | null;
  maChucVu: string | null;
  tenChucVu: string | null;
  ngayDangKyLichNghi: string | null;
  tuNgay: string;
  denNgay: string;
  soNgayNghi: number | null;
  lyDoNghi: string | null;
  ngayDuyet: string | null;
  nguoiDuyetDon: string | null;
  tinhTrang: string | null;
}
export interface LeaveRequestPage {
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: LeaveRequest[];
}
export const LEAVE_REQUEST_HISTORY = gql`
  query LichSuNhanVienNghiPhep($input: LichSuNhanVienNghiPhepInput) {
    lichSuNhanVienNghiPhep(input: $input) {
      isResults
      message
      data {
        pageIndex
        pageSize
        totalRecords
        totalPages
        items {
          id
          maNhanVien
          ho
          tenDem
          ten
          hoTen
          ngaySinh
          maBoPhan
          tenBoPhan
          maChucVu
          tenChucVu
          ngayDangKyLichNghi
          tuNgay
          denNgay
          soNgayNghi
          lyDoNghi
          ngayDuyet
          nguoiDuyetDon
          tinhTrang
        }
      }
    }
  }
`;
export function leaveRequestInput(
  filter: LeaveRequestFilter,
  pageIndex = 1,
  pageSize = 20,
): LeaveRequestInput {
  // Native number inputs emit an empty string when cleared.
  const optionalNumber = (value: unknown) => (value === '' || value == null ? null : value);
  const thang = optionalNumber(filter.thang) as number | null;
  const nam = optionalNumber(filter.nam) as number | null;
  if (thang !== null && (!Number.isInteger(thang) || thang < 1 || thang > 12))
    throw new Error('Tháng phải là số nguyên từ 1 đến 12.');
  if (nam !== null && (!Number.isInteger(nam) || nam < 1 || nam > 9999))
    throw new Error('Năm phải là số nguyên từ 1 đến 9999.');
  if (
    !Number.isInteger(pageIndex) ||
    pageIndex < 1 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 100
  )
    throw new Error('Trang phải từ 1 và số dòng mỗi trang phải từ 1 đến 100.');
  return {
    thang,
    nam,
    maBoPhan: filter.maBoPhan?.trim() || null,
    maNhanVien: filter.maNhanVien?.trim() || null,
    tinhTrang: filter.tinhTrang?.trim() || null,
    pageIndex,
    pageSize,
  };
}
export async function getLeaveRequests(
  filter: LeaveRequestFilter,
  pageIndex = 1,
  pageSize = 20,
): Promise<LeaveRequestPage> {
  const input = leaveRequestInput(filter, pageIndex, pageSize);
  const { data } = await apolloClient.query<{
    lichSuNhanVienNghiPhep: {
      isResults: boolean;
      message?: string | null;
      data: (Omit<LeaveRequestPage, 'items'> & { items: (LeaveRequest | null)[] | null }) | null;
    };
  }>({
    query: LEAVE_REQUEST_HISTORY,
    variables: { input },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.lichSuNhanVienNghiPhep;
  if (result?.isResults !== true || !result.data)
    throw new Error(result?.message || 'Không thể tải danh sách đơn nghỉ phép.');
  const page = result.data;
  if (
    !Array.isArray(page.items) ||
    !Number.isInteger(page.pageIndex) ||
    page.pageIndex < 1 ||
    !Number.isInteger(page.pageSize) ||
    page.pageSize < 1 ||
    !Number.isInteger(page.totalRecords) ||
    page.totalRecords < 0 ||
    !Number.isInteger(page.totalPages) ||
    page.totalPages < 0
  )
    throw new Error('Dữ liệu phân trang đơn nghỉ phép không hợp lệ.');
  return { ...page, items: page.items.filter((item): item is LeaveRequest => item !== null) };
}
export function leaveEmployeeName(row: Pick<LeaveRequest, 'hoTen' | 'ho' | 'tenDem' | 'ten'>) {
  return row.hoTen?.trim() || [row.ho, row.tenDem, row.ten].filter(Boolean).join(' ').trim() || '—';
}
export function leaveDateTime(value: string | null, dateOnly = false) {
  if (!value) return '—';
  if (dateOnly || /^\d{4}-\d{2}-\d{2}$/.test(value))
    return value.slice(0, 10).split('-').reverse().join('/');
  const date = new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : value + '+07:00');
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Asia/Bangkok',
      }).format(date);
}

export interface LeaveRequestFormValues extends LeaveRequestRange {
  leaveTypeId: string;
  reason: string;
}
export function buildLeaveRequestInput(
  employeeId: string,
  form: LeaveRequestFormValues,
  leaveTypes: Shift[],
) {
  if (!employeeId) throw new Error('Chưa xác định nhân viên nghỉ phép.');
  if (
    !leaveTypes.some((item) => item.id === form.leaveTypeId && item.workType === '0' && item.active)
  )
    throw new Error('Vui lòng chọn loại nghỉ phép hợp lệ.');
  if (!form.reason.trim()) throw new Error('Vui lòng nhập lý do nghỉ phép.');
  const { start, end } = validateLeaveRequestRange(form);
  return {
    maNhanVien: employeeId,
    tuNgay: localLeaveDateTime(start),
    denNgay: localLeaveDateTime(end),
    loaiNghiPhep: form.leaveTypeId,
    lyDoNghi: form.reason.trim(),
  };
}
export interface LeaveRequestCreateResult {
  isResults: boolean;
  message?: string | null;
  data?: {
    id: string | number;
    maNhanVien: string;
    ngayDangKyLichNghi: string;
    tuNgay: string;
    denNgay: string;
    lyDoNghi: string | null;
    loaiNghiPhep: string;
    soNgayNghi: number;
    tinhTrang: string;
    soPhanCongCapNhat: number;
  } | null;
}

export const CREATE_LEAVE_REQUEST = gql`
  mutation TaoNhanVienNghiPhep($input: TaoNhanVienNghiPhepInput!) {
    taoNhanVienNghiPhep(input: $input) {
      isResults
      message
      data {
        id
        maNhanVien
        ngayDangKyLichNghi
        tuNgay
        denNgay
        lyDoNghi
        loaiNghiPhep
        soNgayNghi
        tinhTrang
        soPhanCongCapNhat
      }
    }
  }
`;

export async function createLeaveRequest(input: ReturnType<typeof buildLeaveRequestInput>) {
  // The server determines registration date, status and affected assignments.
  const { maNhanVien, tuNgay, denNgay, lyDoNghi, loaiNghiPhep } = input;
  const { data } = await apolloClient.mutate<{ taoNhanVienNghiPhep: LeaveRequestCreateResult }>({
    mutation: CREATE_LEAVE_REQUEST,
    variables: { input: { maNhanVien, tuNgay, denNgay, lyDoNghi, loaiNghiPhep } },
    errorPolicy: 'none',
  });
  if (!data?.taoNhanVienNghiPhep?.isResults)
    throw new Error(data?.taoNhanVienNghiPhep?.message || 'Không thể đăng ký nghỉ phép.');
  return data.taoNhanVienNghiPhep;
}
