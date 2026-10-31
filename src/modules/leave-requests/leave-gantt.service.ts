import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import {
  getLeaveRequests,
  leaveRequestInput,
  type LeaveRequest,
  type LeaveRequestFilter,
} from '@/services/modules/leave-request.service';

export interface LeaveEmployee {
  maNhanVien: string;
  hoTen: string | null;
  ho: string | null;
  tenDem: string | null;
  ten: string | null;
  gioiTinh: string | null;
  ngaySinh: string | null;
  maBoPhan: string | null;
  tenBoPhan: string | null;
  maChucVu: string | null;
  tenChucVu: string | null;
}
export const LEAVE_EMPLOYEES = gql`
  query DanhSachNhanVienNghiPhep($keyword: String) {
    danhSachNhanVien(keyword: $keyword) {
      isResults
      message
      data {
        maNhanVien
        hoTen
        ho
        tenDem
        ten
        gioiTinh
        ngaySinh
        maBoPhan
        tenBoPhan
        maChucVu
        tenChucVu
      }
    }
  }
`;
export async function getLeaveEmployees(): Promise<LeaveEmployee[]> {
  const { data } = await apolloClient.query<{
    danhSachNhanVien: {
      isResults: boolean;
      message?: string | null;
      data: (LeaveEmployee | null)[] | null;
    };
  }>({
    query: LEAVE_EMPLOYEES,
    variables: { keyword: null },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.danhSachNhanVien;
  if (result?.isResults !== true || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải danh sách nhân viên.');
  return result.data.filter((row): row is LeaveEmployee => row !== null);
}
export function ganttRange(filter: LeaveRequestFilter) {
  const { thang, nam } = leaveRequestInput(filter);
  if (nam === null) throw new Error('Vui lòng chọn năm để xem biểu đồ Gantt.');
  const year = String(nam).padStart(4, '0');
  const firstMonth = thang ?? 1;
  const lastMonth = thang ?? 12;
  // Use an ISO year to avoid Date.UTC treating years 1–99 as 1901–1999.
  const lastDay = new Date(`${year}-${String(lastMonth).padStart(2, '0')}-01T00:00:00Z`);
  lastDay.setUTCMonth(lastDay.getUTCMonth() + 1, 0);
  const tuNgay = `${year}-${String(firstMonth).padStart(2, '0')}-01`;
  const denNgay = `${year}-${String(lastMonth).padStart(2, '0')}-${lastDay.getUTCDate()}`;
  const start = Date.parse(tuNgay + 'T00:00:00+07:00');
  const end = Date.parse(denNgay + 'T00:00:00+07:00') + 86400000;
  return { from: tuNgay, to: denNgay, start, end, days: (end - start) / 86400000 };
}
export async function getGanttLeaveRequests(
  filter: LeaveRequestFilter,
  options: {
    isCurrent?: () => boolean;
    onProgress?: (loaded: number, total: number) => void;
  } = {},
): Promise<LeaveRequest[] | null> {
  ganttRange(filter);
  const current = options.isCurrent || (() => true);
  const rows: LeaveRequest[] = [];
  const ids = new Set<string>();
  let expectedTotal: number | undefined;
  let expectedPages: number | undefined;
  for (let index = 1; ; index++) {
    if (!current()) return null;
    const page = await getLeaveRequests(filter, index, 100);
    if (!current()) return null;
    if (
      page.pageIndex !== index ||
      (expectedTotal !== undefined &&
        (page.totalRecords !== expectedTotal || page.totalPages !== expectedPages))
    )
      throw new Error('Danh sách đơn thay đổi trong khi tải biểu đồ. Vui lòng tải lại.');
    expectedTotal = page.totalRecords;
    expectedPages = page.totalPages;
    for (const row of page.items) {
      const id = String(row.id);
      if (ids.has(id))
        throw new Error('Dữ liệu đơn bị trùng giữa các trang. Vui lòng tải lại biểu đồ.');
      ids.add(id);
      rows.push(row);
    }
    options.onProgress?.(rows.length, expectedTotal);
    if (index >= page.totalPages) break;
    if (!page.items.length)
      throw new Error('Chưa tải đủ dữ liệu nghỉ phép. Vui lòng tải lại biểu đồ.');
  }
  if (rows.length !== expectedTotal)
    throw new Error('Chưa tải đủ dữ liệu nghỉ phép. Vui lòng tải lại biểu đồ.');
  return rows;
}
