import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
export function currentAdministrativePeriod(now = new Date()) {
  const local = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return { month: local.getUTCMonth() + 1, year: local.getUTCFullYear() };
}
export function validateAdministrativePeriod(
  month: number | null,
  year: number | null,
  now = new Date(),
) {
  const current = currentAdministrativePeriod(now);
  if (!Number.isInteger(month) || !Number.isInteger(year) || month! < 1 || month! > 12 || year! < 1)
    throw new Error('Vui lòng chọn tháng và năm hợp lệ.');
  if (year! < current.year || (year === current.year && month! < current.month))
    throw new Error('Không thể phân ca cho tháng/năm quá khứ.');
}
export const CREATE_ADMINISTRATIVE_SCHEDULE = gql`
  mutation CreateLichHanhChinh($thang: Int!, $nam: Int!) {
    createLichHanhChinh(thang: $thang, nam: $nam) {
      isResults
      message
    }
  }
`;
export async function createAdministrativeSchedule(month: number | null, year: number | null) {
  validateAdministrativePeriod(month, year);
  const { data } = await apolloClient.mutate<{
    createLichHanhChinh: { isResults: boolean; message?: string };
  }>({
    mutation: CREATE_ADMINISTRATIVE_SCHEDULE,
    variables: { thang: month, nam: year },
    errorPolicy: 'none',
  });
  if (!data?.createLichHanhChinh?.isResults)
    throw new Error(data?.createLichHanhChinh?.message || 'Phân ca hành chính thất bại.');
  return data.createLichHanhChinh.message || 'Phân ca hành chính thành công.';
}
