import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
export interface MonthlyScheduleEmployee {
  tt: number;
  maNhanVien: string;
  hoVaTen: string;
  maBoPhan: string | null;
  boPhan: string | null;
  maChucVu: string | null;
  chucVu: string | null;
  al: number;
  do: number;
  ph: number;
  cl: number;
  ul: number;
  soNgayCongThucTe: number;
  soNgayCongTieuChuan: number;
  soNgayPhep: number;
  soNgayCongHuongLuong: number;
  cacNgay: { ngayTrongThang: number; giaTri: string | null }[];
}
export interface MonthlyScheduleReport {
  nam: number;
  thang: number;
  soNgayTrongThang: number;
  cotNgay: { ngayTrongThang: number; ngay: string }[];
  nhanVien: MonthlyScheduleEmployee[];
}
export const MONTHLY_SCHEDULE_REPORT = gql`
  query BaoCaoCaLamViecThang($nam: Int!, $thang: Int!) {
    baoCaoCaLamViecThang(nam: $nam, thang: $thang) {
      isResults
      message
      data {
        nam
        thang
        soNgayTrongThang
        cotNgay {
          ngayTrongThang
          ngay
        }
        nhanVien {
          tt
          maNhanVien
          hoVaTen
          maBoPhan
          boPhan
          maChucVu
          chucVu
          al
          do
          ph
          cl
          ul
          soNgayCongThucTe
          soNgayCongTieuChuan
          soNgayPhep
          soNgayCongHuongLuong
          cacNgay {
            ngayTrongThang
            giaTri
          }
        }
      }
    }
  }
`;
export async function getMonthlyScheduleReport(
  year: number,
  month: number,
): Promise<MonthlyScheduleReport> {
  if (
    !Number.isInteger(year) ||
    year < 2000 ||
    year > 2100 ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  )
    throw new Error('Tháng/năm báo cáo không hợp lệ.');
  const { data } = await apolloClient.query<{
    baoCaoCaLamViecThang: {
      isResults: boolean;
      message?: string;
      data: MonthlyScheduleReport | null;
    };
  }>({
    query: MONTHLY_SCHEDULE_REPORT,
    variables: { nam: year, thang: month },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.baoCaoCaLamViecThang;
  if (!result?.isResults || !result.data)
    throw new Error(result?.message || 'Không thể tải báo cáo ca làm việc.');
  return {
    ...result.data,
    cotNgay: [...(result.data.cotNgay || [])].sort((a, b) => a.ngayTrongThang - b.ngayTrongThang),
    nhanVien: result.data.nhanVien || [],
  };
}
