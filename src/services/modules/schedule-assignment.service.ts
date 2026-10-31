import { splitScheduleDateTime } from '@/utils/schedule-datetime';
import { scheduleDate } from '@/utils/schedule-date';
import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import type { Assignment, Shift } from '@/types/schedule';

export const PHAN_CONG_CA = gql`
  query PhanCongCa($tuNgay: DateTime!, $denNgay: DateTime!, $maBoPhan: String) {
    phanCongCa(
      tuNgay: $tuNgay
      denNgay: $denNgay
      maBoPhan: $maBoPhan
      maNhanVien: null
      trangThai: null
    ) {
      isResults
      message
      data {
        id
        ngayLamViec
        maNhanVienThaThe
        gioCongChuan
        heSoCa
        isLocked
        maNhanVien
        hoTen
        maBoPhan
        tenBoPhan
        maChucVu
        tenChucVu
        maCa
        tenCa
        kyHieuCa
        thoiGianBatDau
        thoiGianKetThuc
        quaNgay
        trangThai
        nguonPhanCong
        toanCa
        maLoaiNghiPhep
        ghiChu
      }
    }
  }
`;

export const NHAN_VIEN_CHUA_XEP_CA = gql`
  query NhanVienChuaXepCa($tuNgay: DateTime!, $denNgay: DateTime!) {
    nhanVienChuaXepCa(tuNgay: $tuNgay, denNgay: $denNgay, keyword: null, maBoPhan: null) {
      isResults
      message
      data {
        maNhanVien
        hoTen
        maBoPhan
        tenBoPhan
        maChucVu
        tenChucVu
        danhSachNgayXepCa
      }
    }
  }
`;

export interface UnscheduledScheduleEmployee {
  maNhanVien: string;
  hoTen: string;
  maBoPhan: string | null;
  tenBoPhan: string | null;
  maChucVu: string | null;
  tenChucVu: string | null;
  danhSachNgayXepCa: string[];
}

interface ApiUnscheduledScheduleEmployee extends Omit<
  UnscheduledScheduleEmployee,
  'danhSachNgayXepCa'
> {
  danhSachNgayXepCa: (string | null)[] | null;
}

export async function getEmployeesMissingSchedule(
  from: string,
  to: string,
): Promise<UnscheduledScheduleEmployee[]> {
  const { data } = await apolloClient.query<{
    nhanVienChuaXepCa: {
      isResults: boolean;
      message?: string;
      data: (ApiUnscheduledScheduleEmployee | null)[] | null;
    };
  }>({
    query: NHAN_VIEN_CHUA_XEP_CA,
    variables: {
      tuNgay: `${from}T00:00:00+07:00`,
      denNgay: `${to}T23:59:59.999+07:00`,
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.nhanVienChuaXepCa;
  if (!result?.isResults || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải danh sách nhân viên chưa xếp ca.');
  return result.data
    .filter((row): row is ApiUnscheduledScheduleEmployee => !!row)
    .map((row) => ({
      ...row,
      danhSachNgayXepCa: (row.danhSachNgayXepCa || [])
        .filter((date): date is string => typeof date === 'string')
        .map(scheduleDate)
        .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)),
    }));
}

export interface ApiAssignment {
  id: string | number;
  ngayLamViec: string;
  maNhanVien: string;
  hoTen: string;
  maBoPhan: string | null;
  tenBoPhan: string | null;
  maChucVu: string | null;
  tenChucVu: string | null;
  maCa: string;
  tenCa: string;
  kyHieuCa: string | null;
  thoiGianBatDau: string | null;
  thoiGianKetThuc: string | null;
  quaNgay: boolean | null;
  trangThai: string | number | null;
  nguonPhanCong: string | null;
  toanCa?: boolean | null;
  maLoaiNghiPhep?: string | null;
  isLocked?: boolean | null;
  ghiChu: string | null;
}
export async function getScheduleAssignments(
  from: string,
  to: string,
  departmentCode: string | null = null,
): Promise<{
  assignments: Assignment[];
  shifts: Shift[];
}> {
  const { data } = await apolloClient.query<{
    phanCongCa: { isResults: boolean; message?: string; data: (ApiAssignment | null)[] | null };
  }>({
    query: PHAN_CONG_CA,
    variables: {
      tuNgay: `${from}T00:00:00+07:00`,
      denNgay: `${to}T23:59:59.999+07:00`,
      maBoPhan: departmentCode,
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.phanCongCa;
  if (!result?.isResults || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải lịch phân công ca.');
  const rows = result.data.filter((row): row is ApiAssignment => !!row);
  return mapScheduleAssignments(rows);
}

export function mapScheduleAssignments(rows: ApiAssignment[]): {
  assignments: Assignment[];
  shifts: Shift[];
} {
  const shifts = new Map<string, Shift>();
  const assignments = rows.map((row): Assignment => {
    const { date: startDate, time: startTime } = splitScheduleDateTime(row.thoiGianBatDau);
    const { date: endDate, time: endTime } = splitScheduleDateTime(row.thoiGianKetThuc);
    shifts.set(row.maCa, {
      id: row.maCa,
      code: row.kyHieuCa || row.maCa,
      name: row.tenCa,
      scheduleType: 'ROTATING',
      startTime,
      endTime,
      crossDay: startDate && endDate ? endDate > startDate : !!row.quaNgay,
      displayColor: '#2563eb',
      active: true,
    });
    return {
      id: String(row.id),
      employeeId: row.maNhanVien,
      employeeName: row.hoTen,
      departmentCode: row.maBoPhan,
      locked: row.isLocked === true,
      date: scheduleDate(row.ngayLamViec),
      shiftId: row.maCa,
      shiftSymbol: row.kyHieuCa || row.maCa,
      shiftName: row.tenCa,
      scheduleType: 'ROTATING',
      status: 'SCHEDULED',
      note: row.ghiChu || '',
      revision: 1,
      fullTime: row.toanCa !== false,
      leaveTypeId: row.maLoaiNghiPhep?.trim() || null,
      startTime,
      endTime,
      crossDay: startDate && endDate ? endDate > startDate : !!row.quaNgay,
      apiStatus: row.trangThai,
      assignmentSource: row.nguonPhanCong,
      startDate: startDate || scheduleDate(row.ngayLamViec),
      endDate: endDate || undefined,
    };
  });
  return { assignments, shifts: [...shifts.values()] };
}

export interface CreateScheduleAssignmentInput {
  maBoPhan: string;
  maChucVu: string | null;
  maNhanVien: string;
  ngayLamViec: string;
  maCa: string;
  gioBatDau: string | null;
  gioKetThuc: string | null;
  ghiChu: string | null;
}

export async function createScheduleAssignment(input: CreateScheduleAssignmentInput) {
  // Inline typed literals follow the existing assignment mutation services.
  const fields = Object.entries(input)
    .map(([key, value]) => key + ': ' + JSON.stringify(value))
    .join(',');
  const mutation = gql`mutation CreatePhanCongCa {
    createPhanCongCa(input: { ${fields} }) {
      isResults
      message
      data {
        id ngayLamViec maNhanVien maNhanVienThaThe gioCongChuan heSoCa isLocked
        hoTen maBoPhan tenBoPhan maChucVu tenChucVu maCa tenCa kyHieuCa
        thoiGianBatDau thoiGianKetThuc quaNgay trangThai nguonPhanCong
        toanCa maLoaiNghiPhep ghiChu
      }
    }
  }`;
  const { data } = await apolloClient.mutate<{
    createPhanCongCa: { isResults: boolean; message?: string; data: ApiAssignment | null };
  }>({ mutation, errorPolicy: 'none' });
  const result = data?.createPhanCongCa;
  if (!result?.isResults) throw new Error(result?.message || 'Không thể tạo phân công ca.');
  return result;
}
