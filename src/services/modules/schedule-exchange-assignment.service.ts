import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import { mapScheduleAssignments, type ApiAssignment } from './schedule-assignment.service';

export const LOAD_DANH_SACH_NGAY = gql`
  query LoadDanhSachNgay($selectedNgay: String!, $maBoPhan: String) {
    loadDanhSachNgay(selectedNgay: $selectedNgay, maBoPhan: $maBoPhan) {
      isResults
      message
      data {
        id
        ngayLamViec
        maNhanVien
        maNhanVienThaThe
        gioCongChuan
        heSoCa
        isLocked
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

/** Load exchange candidates for the selected calendar day without a timezone suffix. */
export async function getScheduleExchangeAssignments(
  selectedDate: string,
  departmentCode: string | null = null,
) {
  const { data } = await apolloClient.query<{
    loadDanhSachNgay: {
      isResults: boolean;
      message?: string;
      data: (ApiAssignment | null)[] | null;
    };
  }>({
    query: LOAD_DANH_SACH_NGAY,
    variables: { selectedNgay: selectedDate, maBoPhan: departmentCode },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.loadDanhSachNgay;
  if (!result?.isResults || !Array.isArray(result.data))
    throw new Error(result?.message || 'Không thể tải danh sách đổi ca.');
  return mapScheduleAssignments(result.data.filter((row): row is ApiAssignment => !!row));
}
