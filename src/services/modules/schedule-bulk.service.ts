import { scheduleTime } from '@/utils/schedule-time';
import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import type { Assignment, Shift } from '@/types/schedule';
export interface BulkAssignmentResult {
  tongSo: number;
  thanhCong: number;
  thatBai: number;
  loi: { maNhanVien: string; ngayLamViec: string; message: string }[];
}
export function mapBulkAssignments(
  rows: Assignment[],
  shifts: Shift[],
  departmentCode: string,
  employees: { code: string; positionCode?: string | null }[],
) {
  console.log('Mapping bulk assignments:', { rows, shifts, departmentCode, employees });
  if (!departmentCode || !rows.length) throw new Error('Chọn bộ phận và ít nhất một phân công.');
  return rows.map((row) => {
    const shift = shifts.find((s) => s.id === row.shiftId);
    if (row.status !== 'SCHEDULED' || !shift)
      throw new Error('Chỉ có thể tạo phân công với mã ca hợp lệ.');
    const employee = employees.find((e) => e.code === row.employeeId);
    if (!employee) throw new Error('Không tìm thấy nhân viên trong bộ phận đã chọn.');
    const startTime = scheduleTime(row.startTime || shift.startTime);
    const endTime = scheduleTime(row.endTime || shift.endTime);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(row.date) ||
      !/^\d{2}:\d{2}$/.test(startTime) ||
      !/^\d{2}:\d{2}$/.test(endTime)
    )
      throw new Error('Ngày hoặc giờ của ca không hợp lệ.');
    const end = new Date(`${row.date}T12:00:00Z`);
    const timeToDuration = (time: string | null) => {
      const [h = 0, m = 0, s = 0] = time?.split(':').map(Number) || [];
      return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}` || 'PT0S';
    };

    if (shift.crossDay) end.setUTCDate(end.getUTCDate() + 1);
    return {
      ngayLamViec: `${row.date}T00:00:00+07:00`,
      maNhanVien: row.employeeId,
      maCa: shift.id,
      maBoPhan: departmentCode,
      maChucVu: employee.positionCode || null,
      ngayBatDau: `${row.date}T00:00:00+07:00`,
      gioBatDau: timeToDuration(startTime),
      ngayKetThuc: `${end.toISOString().slice(0, 10)}T00:00:00+07:00`,
      gioKetThuc: timeToDuration(endTime),
      trangThai: '2',
      nguonPhanCong: '1',
      ghiChu: row.note || null,
    };
  });
}
// Inline input values avoid assuming an input type name not supplied by the API contract.
// All values are JSON-escaped; field names come only from the fixed mapper above.
export async function createBulkAssignments(
  input: ReturnType<typeof mapBulkAssignments>,
): Promise<BulkAssignmentResult> {
  const values = input
    .map(
      (row) =>
        '{' +
        Object.entries(row)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join(',') +
        '}',3.
    )
    .join(',');
  const mutation = gql`mutation CreatePhanCongHangLoat {
    createPhanCongHangLoat(input: { danhSachPhanCong: [${values}] }) {
      isResults message data { tongSo thanhCong thatBai loi { maNhanVien ngayLamViec message } }
    }
  }`;
  const { data } = await apolloClient.mutate<{
    createPhanCongHangLoat: {
      isResults: boolean;
      message?: string;
      data: BulkAssignmentResult | null;
    };
  }>({ mutation, errorPolicy: 'none' });
  const result = data?.createPhanCongHangLoat;
  if (!result?.data) throw new Error(result?.message || 'Không thể lưu phân công ca.');
  if (!result.isResults && !result.data.thatBai)
    throw new Error(result.message || 'Không thể lưu phân công ca.');
  return { ...result.data, loi: result.data.loi || [] };
}
