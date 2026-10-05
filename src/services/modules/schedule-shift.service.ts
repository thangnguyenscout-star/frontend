import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import type { Shift, ScheduleType } from '@/types/schedule';

export const CA_LAM_VIEC = gql`
  query CaLamViec($maBoPhan: String) {
    caLamViec(maBoPhan: $maBoPhan) {
      isResults
      message
      data {
        maCa
        tenCa
        kyHieuCa
        loaiCa
        gioBatDau
        gioKetThuc
        loaiHinhLamViec
      }
    }
  }
`;
interface ApiShift {
  maCa: string;
  tenCa: string;
  kyHieuCa: string;
  loaiCa: string;
  gioBatDau: string | null;
  gioKetThuc: string | null;
  loaiHinhLamViec: string;
}
export async function getDepartmentShifts(
  maBoPhan: string | null,
  scheduleType: ScheduleType,
): Promise<Shift[]> {
  const { data } = await apolloClient.query<{
    caLamViec: { isResults: boolean; message: string; data: (ApiShift | null)[] | null };
  }>({ query: CA_LAM_VIEC, variables: { maBoPhan }, fetchPolicy: 'no-cache' });
  const result = data?.caLamViec;
  if (!result?.isResults || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải danh sách ca làm việc.');
  return result.data
    .filter((s): s is ApiShift => !!s && !!s.maCa)
    .map((s) => {
      const startTime = s.gioBatDau?.slice(0, 5) || '';
      const endTime = s.gioKetThuc?.slice(0, 5) || '';
      return {
        id: s.maCa,
        code: s.maCa,
        name: s.tenCa,
        scheduleType,
        startTime,
        endTime,
        crossDay: !!startTime && !!endTime && endTime <= startTime,
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
