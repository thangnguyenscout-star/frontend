import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import type { AttendancePeriod, PeriodInput, PeriodFilter } from './period.types';
const fields = gql`
  fragment PeriodFields on KyChamCongDto {
    id
    maKy
    nam
    thang
    tuNgay
    denNgay
    trangThai
    ghiChu
    ngayChot
    nguoiChot
    ngayKhoa
    nguoiKhoa
    createdAt
    createdBy
    updatedAt
    updatedBy
  }
`;
export const PERIOD_LIST = gql`
  query PeriodList($nam: Short, $thang: UnsignedByte, $trangThai: String) {
    danhSachKyChamCong(nam: $nam, thang: $thang, trangThai: $trangThai) {
      isResults
      message
      data {
        ...PeriodFields
      }
    }
  }
  ${fields}
`;
export const PERIOD_CREATE = gql`
  mutation PeriodCreate($input: KyChamCongInput!) {
    createKyChamCong(input: $input) {
      isResults
      message
      data {
        ...PeriodFields
      }
    }
  }
  ${fields}
`;
interface Result<T> {
  isResults: boolean;
  message?: string;
  data: T | null;
}
function unwrap<T>(result: Result<T> | null | undefined): T {
  if (!result?.isResults || result.data == null)
    throw new Error(result?.message || 'Không thể tải dữ liệu kỳ chấm công.');
  return result.data;
}
export function exactPeriodId(value: string | number): string {
  if (typeof value === 'number' && !Number.isSafeInteger(value))
    throw new Error('ID kỳ vượt giới hạn an toàn. Backend cần trả ID dưới dạng chuỗi.');
  const id = String(value);
  if (!/^[1-9][0-9]*$/.test(id) || BigInt(id) > 9223372036854775807n)
    throw new Error('ID kỳ chấm công không hợp lệ.');
  return id;
}
export function validatePeriod(input: PeriodInput) {
  if (
    !Number.isInteger(input.nam) ||
    input.nam < 1 ||
    input.nam > 9998 ||
    !Number.isInteger(input.thang) ||
    input.thang < 1 ||
    input.thang > 12
  )
    throw new Error('Tháng hoặc năm không hợp lệ.');
  for (const value of [input.tuNgay, input.denNgay]) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value + 'T12:00:00Z')) ||
      new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) !== value
    )
      throw new Error('Ngày của kỳ chấm công không hợp lệ.');
  }
  if (input.denNgay < input.tuNgay) throw new Error('Ngày kết thúc phải từ ngày bắt đầu trở đi.');
  if ((input.ghiChu?.trim().length || 0) > 500)
    throw new Error('Ghi chú không được vượt quá 500 ký tự.');
}
export function periodWireInput(input: PeriodInput) {
  validatePeriod(input);
  // Live server requires DateTime with offset; keep hotel midnight, never convert date-only via toISOString.
  return {
    ...input,
    tuNgay: input.tuNgay + 'T00:00:00+07:00',
    denNgay: input.denNgay + 'T00:00:00+07:00',
    ghiChu: input.ghiChu?.trim() || null,
  };
}
export const periodDetailDocument = (id: string | number) =>
  gql`query PeriodDetail { thongTinKyChamCong(id: ${exactPeriodId(id)}) {isResults message data{...PeriodFields}} } ${fields}`;
export const periodActionDocument = (action: 'close' | 'lock', id: string | number) =>
  gql`mutation PeriodAction { ${action === 'close' ? 'chotCong' : 'khoaCong'}(id: ${exactPeriodId(id)}) {isResults message data{...PeriodFields}} } ${fields}`;
function normalizePeriod(row: AttendancePeriod): AttendancePeriod {
  return { ...row, id: exactPeriodId(row.id) };
}
export async function listPeriods(filter: PeriodFilter): Promise<AttendancePeriod[]> {
  const { data } = await apolloClient.query<{
    danhSachKyChamCong: Result<(AttendancePeriod | null)[]>;
  }>({ query: PERIOD_LIST, variables: filter, fetchPolicy: 'no-cache', errorPolicy: 'none' });
  return unwrap(data?.danhSachKyChamCong)
    .filter((row): row is AttendancePeriod => !!row)
    .map(normalizePeriod)
    .sort((a, b) => b.nam - a.nam || b.thang - a.thang);
}
export async function getPeriod(id: string | number): Promise<AttendancePeriod> {
  const { data } = await apolloClient.query<{ thongTinKyChamCong: Result<AttendancePeriod> }>({
    query: periodDetailDocument(id),
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  return normalizePeriod(unwrap(data?.thongTinKyChamCong));
}
export async function createPeriod(input: PeriodInput): Promise<AttendancePeriod> {
  const { data } = await apolloClient.mutate<{ createKyChamCong: Result<AttendancePeriod> }>({
    mutation: PERIOD_CREATE,
    variables: { input: periodWireInput(input) },
    errorPolicy: 'none',
  });
  return normalizePeriod(unwrap(data?.createKyChamCong));
}
export async function changePeriodState(
  id: string | number,
  action: 'close' | 'lock',
  expected: 'O' | 'C',
): Promise<AttendancePeriod> {
  const current = await getPeriod(id);
  if (current.trangThai !== expected) throw new Error('KY_CHAM_CONG_UPDATE_CONFLICT');
  const { data } = await apolloClient.mutate<{
    chotCong?: Result<AttendancePeriod>;
    khoaCong?: Result<AttendancePeriod>;
  }>({ mutation: periodActionDocument(action, id), errorPolicy: 'none' });
  return normalizePeriod(unwrap(action === 'close' ? data?.chotCong : data?.khoaCong));
}
