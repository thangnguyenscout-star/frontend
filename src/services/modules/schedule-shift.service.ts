import { scheduleTime } from '@/utils/schedule-time';
import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import type { Shift, ScheduleType } from '@/types/schedule';

export const CA_LAM_VIEC = gql`
  query CaLamViec($maBoPhan: String) {
    caLamViec(maBoPhan: $maBoPhan, isActive: true) {
      isResults
      message
      data {
        maCa
        tenCa
        kyHieuCa
        loaiCa
        gioBatDau
        gioKetThuc
        maBoPhan
        quaNgay
        isActive
        loaiHinhLamViec
      }
    }
  }
`;
interface ApiShift {
  maBoPhan: string | null;
  maCa: string;
  tenCa: string;
  kyHieuCa: string;
  loaiCa: string;
  gioBatDau: string | null;
  gioKetThuc: string | null;
  loaiHinhLamViec: string | number;
  isActive?: number | string;
  quaNgay?: number | string | boolean;
}
async function getApiShifts(maBoPhan: string | null): Promise<ApiShift[]> {
  const { data } = await apolloClient.query<{
    caLamViec: { isResults: boolean; message: string; data: (ApiShift | null)[] | null };
  }>({ query: CA_LAM_VIEC, variables: { maBoPhan }, fetchPolicy: 'no-cache' });
  const result = data?.caLamViec;
  if (!result?.isResults || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải danh sách ca làm việc.');
  return result.data.filter((s): s is ApiShift => !!s && !!s.maCa);
}
export async function getDepartmentShifts(
  maBoPhan: string | null,
  scheduleType: ScheduleType,
): Promise<Shift[]> {
  return (await getApiShifts(maBoPhan)).map((s) => {
    const startTime = scheduleTime(s.gioBatDau);
    const endTime = scheduleTime(s.gioKetThuc);
    return {
      id: s.maCa,
      code: s.kyHieuCa || s.maCa,
      name: s.tenCa,
      scheduleType:
        s.loaiHinhLamViec == null
          ? scheduleType
          : String(s.loaiHinhLamViec) === '1'
            ? 'ADMINISTRATIVE'
            : 'ROTATING',
      startTime,
      endTime,
      crossDay: s.quaNgay === true || String(s.quaNgay) === '1',
      displayColor: '#2563eb',
      active: true,
    };
  });
}

export interface ScheduleDepartment {
  code: string;
  name: string;
}
export const DANH_SACH_BO_PHAN = gql`
  query DanhSachBoPhan {
    danhSachBoPhan {
      isResults
      message
      data {
        maBoPhan
        tenBoPhan
      }
    }
  }
`;
export async function getScheduleDepartments(): Promise<ScheduleDepartment[]> {
  const { data } = await apolloClient.query<{
    danhSachBoPhan: {
      isResults: boolean;
      message: string;
      data: ({ maBoPhan: string; tenBoPhan: string } | null)[] | null;
    };
  }>({ query: DANH_SACH_BO_PHAN, fetchPolicy: 'no-cache' });
  const result = data?.danhSachBoPhan;
  if (!result?.isResults || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải danh sách bộ phận.');
  return result.data
    .filter((item) => item !== null)
    .map((item) => ({ code: item.maBoPhan, name: item.tenBoPhan }));
}

export interface ScheduleDepartmentGroup {
  type: ScheduleType;
  label: string;
  departments: ScheduleDepartment[];
}
export async function getScheduleDepartmentGroups(departments: ScheduleDepartment[]) {
  const shifts = await getApiShifts(null);
  const groups: ScheduleDepartmentGroup[] = [
    { type: 'ADMINISTRATIVE', label: '1 · Hành chính', departments: [] },
    { type: 'ROTATING', label: '2 · Xoay ca', departments: [] },
  ];
  const unavailable: ScheduleDepartment[] = [];
  for (const department of departments) {
    const rows = shifts.filter((shift) => shift.maBoPhan === department.code);
    const administrative = rows.some((shift) => String(shift.loaiHinhLamViec) === '1');
    const rotating = rows.some((shift) =>
      ['C', '2'].includes(String(shift.loaiHinhLamViec).trim().toUpperCase()),
    );
    if (administrative) groups[0].departments.push(department);
    if (rotating) groups[1].departments.push(department);
    if (!administrative && !rotating) unavailable.push(department);
  }
  return { groups, unavailable };
}
