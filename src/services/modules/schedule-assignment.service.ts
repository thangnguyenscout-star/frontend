import { scheduleTime } from '@/utils/schedule-time';
import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import type { Assignment, Shift } from '@/types/schedule';

export const PHAN_CONG_CA = gql`
  query PhanCongCa($tuNgay: DateTime!, $denNgay: DateTime!) {
    phanCongCa(
      tuNgay: $tuNgay
      denNgay: $denNgay
      maBoPhan: null
      maNhanVien: null
      trangThai: null
    ) {
      isResults
      message
      data {
        id
        ngayLamViec
        maNhanVien
        hoTen
        maBoPhan
        tenBoPhan
        maChucVu
        tenChucVu
        maCa
        tenCa
        kyHieuCa
        ngayBatDau
        gioBatDau
        ngayKetThuc
        gioKetThuc
        quaNgay
        trangThai
        nguonPhanCong
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
        .map((date) => date.slice(0, 10))
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
  ngayBatDau: string | null;
  gioBatDau: string | null;
  ngayKetThuc: string | null;
  gioKetThuc: string | null;
  quaNgay: boolean | null;
  trangThai: string | number | null;
  nguonPhanCong: string | null;
  ghiChu: string | null;
}
export async function getScheduleAssignments(
  from: string,
  to: string,
): Promise<{
  assignments: Assignment[];
  shifts: Shift[];
}> {
  const { data } = await apolloClient.query<{
    phanCongCa: { isResults: boolean; message?: string; data: (ApiAssignment | null)[] | null };
  }>({
    query: PHAN_CONG_CA,
    variables: { tuNgay: `${from}T00:00:00+07:00`, denNgay: `${to}T23:59:59.999+07:00` },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.phanCongCa;
  if (!result?.isResults || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải lịch phân công ca.');
  const rows = result.data.filter((row): row is ApiAssignment => !!row);
  const shifts = new Map<string, Shift>();
  const assignments = rows.map((row): Assignment => {
    const startTime = scheduleTime(row.gioBatDau);
    const endTime = scheduleTime(row.gioKetThuc);
    shifts.set(row.maCa, {
      id: row.maCa,
      code: row.kyHieuCa || row.maCa,
      name: row.tenCa,
      scheduleType: 'ROTATING',
      startTime,
      endTime,
      crossDay: !!row.quaNgay,
      displayColor: '#2563eb',
      active: true,
    });
    return {
      id: String(row.id),
      employeeId: row.maNhanVien,
      date: row.ngayLamViec.slice(0, 10),
      shiftId: row.maCa,
      shiftSymbol: row.kyHieuCa || row.maCa,
      shiftName: row.tenCa,
      scheduleType: 'ROTATING',
      status: 'SCHEDULED',
      note: row.ghiChu || '',
      revision: 1,
      fullTime: true,
      startTime,
      endTime,
      crossDay: !!row.quaNgay,
      apiStatus: row.trangThai,
      assignmentSource: row.nguonPhanCong,
      startDate: row.ngayBatDau?.slice(0, 10),
      endDate: row.ngayKetThuc?.slice(0, 10),
    };
  });
  return { assignments, shifts: [...shifts.values()] };
}
