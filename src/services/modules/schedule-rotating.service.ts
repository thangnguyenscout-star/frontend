import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import { scheduleRange } from '@/utils/schedule-range';
import { scheduleDate } from '@/utils/schedule-date';

export function canCreateRotatingWeek(
  anchor: string,
  today = scheduleDate(new Date().toISOString()),
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(anchor)) return false;
  const { from } = scheduleRange(anchor, 'week');
  return from >= today;
}

export const CREATE_LICH_XOAY_CA = gql`
  mutation CreateLichXoayCa($maBoPhan: String!, $tuNgay: LocalDate!, $denNgay: LocalDate!) {
    createLichXoayCa(input: { maBoPhan: $maBoPhan, tuNgay: $tuNgay, denNgay: $denNgay }) {
      isResults
      message
      data {
        maBoPhan
        tuNgay
        denNgay
        soPhanCong
        soCaLamViec
        soNgayDO000
        duDinhBien
        tatCaNhanVienDuSauNgay
        canhBao
      }
    }
  }
`;

export interface RotatingScheduleResult {
  isResults: boolean;
  message?: string | null;
  data?: {
    maBoPhan: string;
    tuNgay: string;
    denNgay: string;
    soPhanCong: number;
    soCaLamViec: number;
    soNgayDO000: number;
    duDinhBien: boolean;
    tatCaNhanVienDuSauNgay: boolean;
    canhBao: string | string[] | null;
  } | null;
}

export async function createRotatingSchedule(maBoPhan: string, anchor: string) {
  if (!maBoPhan || !canCreateRotatingWeek(anchor))
    throw new Error('Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.');
  const { from, to } = scheduleRange(anchor, 'week');
  const { data } = await apolloClient.mutate<{ createLichXoayCa: RotatingScheduleResult }>({
    mutation: CREATE_LICH_XOAY_CA,
    variables: {
      maBoPhan,
      tuNgay: from,
      denNgay: to,
    },
    errorPolicy: 'none',
  });
  if (!data?.createLichXoayCa) throw new Error('Không nhận được kết quả xếp ca.');
  return data.createLichXoayCa;
}
