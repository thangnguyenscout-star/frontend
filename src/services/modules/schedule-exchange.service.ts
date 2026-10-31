import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import type { Assignment } from '@/types/schedule';

export interface ScheduleExchangeResult {
  isResults: boolean;
  message?: string | null;
  data?: {
    id: string | number;
    ngayLamViec: string | null;
    ngayLamViecCu: string | null;
    maNhanVienYeuCau: string | null;
    maNhanVienDoi: string | null;
    maCaCu: string | null;
    maCaMoi: string | null;
    lyDo: string | null;
    trangThai: string | number | null;
    nguoiDuyet: string | null;
    ngayDuyet: string | null;
  } | null;
}

export async function exchangeScheduleAssignments(
  source: Assignment,
  target: Assignment,
  reason = '',
) {
  const eligible = (a: Assignment) =>
    !!a.id.trim() &&
    a.leaveTypeId == null &&
    a.status !== 'OFF' &&
    ![a.shiftId, a.shiftSymbol].some((code) => /^(DO(?:0+)?|OFF)$/i.test(code?.trim() || ''));
  if (
    !eligible(source) ||
    !eligible(target) ||
    source.id === target.id ||
    source.employeeId === target.employeeId ||
    (source.date === target.date && source.shiftId.trim() === target.shiftId.trim())
  )
    throw new Error('Chọn hai ca làm việc hợp lệ của hai nhân viên khác nhau.');

  // Preserve large numeric IDs without converting them to JavaScript numbers.
  // Literal arguments also avoid assuming a scalar type absent from the API contract.
  const idLiteral = (id: string) =>
    /^\d+$/.test(id.trim()) ? id.trim().replace(/^0+(?=\d)/, '') : JSON.stringify(id.trim());
  const mutation = gql`mutation DoiCa($lyDoDoiCa: String!) {
    doiCa(idCaYeuCauDoi: ${idLiteral(source.id)}, idCaDuocDoi: ${idLiteral(target.id)}, lyDoDoiCa: $lyDoDoiCa) {
      isResults
      message
      data {
        id
        ngayLamViec
        ngayLamViecCu
        maNhanVienYeuCau
        maNhanVienDoi
        maCaCu
        maCaMoi
        lyDo
        trangThai
        nguoiDuyet
        ngayDuyet
      }
    }
  }`;
  const { data } = await apolloClient.mutate<{ doiCa: ScheduleExchangeResult }>({
    mutation,
    variables: { lyDoDoiCa: reason || null },
    errorPolicy: 'none',
  });
  if (!data?.doiCa?.isResults)
    throw new Error(data?.doiCa?.message || 'Không thể đổi ca. Vui lòng thử lại.');
  return data.doiCa;
}
