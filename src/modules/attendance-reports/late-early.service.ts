import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import { downloadReportFile, type ReportExportFormat } from '@/services/api/report-download';
export interface LateEarlyFilter {
  thang: number;
  nam: number;
  ten: string | null;
  maBoPhan: string | null;
}
export interface LateEarlyItem {
  thang: number | null;
  nam: number | null;
  maNhanVien: string;
  hoVaTen: string;
  ngaySinh: string | null;
  gioiTinh: string;
  maBoPhan: string;
  tenBoPhan: string;
  maCa: string | null;
  tenCa: string | null;
  gioBatDau: string | null;
  gioKetThuc: string | null;
  tinhCaDem: boolean | null;
  ngayChamCong: string | null;
  gioVao: string;
  gioRa: string;
  diTre: number;
  veSom: number;
  tinhTrang: string | null;
}
export interface LateEarlyPage {
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: LateEarlyItem[];
}
export const LATE_EARLY_REPORT = gql`
  query DiMuonVeSom($input: DiMuonVeSomInput!) {
    diMuonVeSom(input: $input) {
      isResults
      message
      data {
        pageIndex
        pageSize
        totalRecords
        totalPages
        items {
          thang
          nam
          maNhanVien
          hoVaTen
          ngaySinh
          gioiTinh
          maBoPhan
          tenBoPhan
          maCa
          tenCa
          gioBatDau
          gioKetThuc
          tinhCaDem
          ngayChamCong
          gioVao
          gioRa
          diTre
          veSom
          tinhTrang
        }
      }
    }
  }
`;
export function normalizeLateEarlyFilter(filter: LateEarlyFilter): LateEarlyFilter {
  if (
    !Number.isInteger(filter.thang) ||
    filter.thang < 1 ||
    filter.thang > 12 ||
    !Number.isInteger(filter.nam) ||
    filter.nam < 1753 ||
    filter.nam > 9998
  )
    throw new Error('Tháng hoặc năm báo cáo không hợp lệ.');
  const ten = filter.ten?.trim() || null,
    maBoPhan = filter.maBoPhan?.trim() || null;
  if (
    ten &&
    (ten.length > 100 ||
      [...ten].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127))
  )
    throw new Error('Tên tìm kiếm không hợp lệ hoặc vượt quá 100 ký tự.');
  return { thang: filter.thang, nam: filter.nam, ten, maBoPhan };
}
export async function getLateEarlyReport(
  filter: LateEarlyFilter,
  pageIndex = 1,
  pageSize = 20,
): Promise<LateEarlyPage> {
  const input = { ...normalizeLateEarlyFilter(filter), pageIndex, pageSize };
  if (
    !Number.isInteger(pageIndex) ||
    pageIndex < 1 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 200
  )
    throw new Error('Thông tin phân trang báo cáo không hợp lệ.');
  const { data } = await apolloClient.query<{
    diMuonVeSom: {
      isResults: boolean;
      message?: string | null;
      data: (Omit<LateEarlyPage, 'items'> & { items: (LateEarlyItem | null)[] | null }) | null;
    };
  }>({
    query: LATE_EARLY_REPORT,
    variables: { input },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = data?.diMuonVeSom;
  if (result?.isResults !== true || !result.data)
    throw new Error(result?.message || 'Không thể tải báo cáo đi muộn / về sớm.');
  const page = result.data;
  if (
    !Array.isArray(page.items) ||
    !Number.isInteger(page.pageIndex) ||
    page.pageIndex < 1 ||
    !Number.isInteger(page.pageSize) ||
    page.pageSize < 1 ||
    !Number.isSafeInteger(page.totalRecords) ||
    page.totalRecords < 0 ||
    !Number.isSafeInteger(page.totalPages) ||
    page.totalPages < 0
  )
    throw new Error('Dữ liệu phân trang báo cáo không hợp lệ.');
  return { ...page, items: page.items.filter((item): item is LateEarlyItem => item !== null) };
}
export function exportLateEarlyReport(filter: LateEarlyFilter, format: ReportExportFormat) {
  const parameters = normalizeLateEarlyFilter(filter);
  if (format !== 'excel' && format !== 'pdf')
    throw new Error('Định dạng xuất báo cáo không hợp lệ.');
  return downloadReportFile(
    '/api/di-muon-ve-som/export-' + format,
    { ...parameters },
    format,
    `DiMuonVeSom_${parameters.nam}_${String(parameters.thang).padStart(2, '0')}.${format === 'pdf' ? 'pdf' : 'xlsx'}`,
  );
}
