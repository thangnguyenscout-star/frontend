import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
export interface AttendanceDevice {
  maThietBi: number;
  tenThietBi: string;
  diaDiem: string | null;
  loaiThietBi: string | null;
  isActive: boolean;
  lanDongBoCuoi: string | null;
  createdAt: string | null;
}
export const ATTENDANCE_DEVICES = gql`
  query DanhSachMayChamCong {
    danhSachMayChamCong {
      isResults
      message
      data {
        maThietBi
        tenThietBi
        diaDiem
        loaiThietBi
        isActive
        lanDongBoCuoi
        createdAt
      }
    }
  }
`;
export async function getAttendanceDevices(): Promise<AttendanceDevice[]> {
  const { data } = await apolloClient.query<{
    danhSachMayChamCong: {
      isResults: boolean;
      message?: string | null;
      data: (AttendanceDevice | null)[] | null;
    };
  }>({ query: ATTENDANCE_DEVICES, fetchPolicy: 'no-cache', errorPolicy: 'none' });
  const result = data?.danhSachMayChamCong;
  if (!result?.isResults || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải danh sách máy chấm công.');
  return result.data.filter((row): row is AttendanceDevice => !!row);
}
