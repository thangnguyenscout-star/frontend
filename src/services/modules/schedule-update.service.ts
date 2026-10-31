import { scheduleDuration } from '@/utils/schedule-datetime';
import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import { scheduleTime } from '@/utils/schedule-time';
import { isPastScheduleDate } from '@/utils/schedule-date';
import type { Assignment, Shift } from '@/types/schedule';
export async function updateScheduleAssignment(input: ReturnType<typeof buildScheduleShiftChange>) {
  const fields = Object.entries(input)
    .map(
      ([key, value]) =>
        key +
        ': ' +
        (key === 'id' && /^\d+$/.test(String(value)) ? String(value) : JSON.stringify(value)),
    )
    .join(',');
  const mutation = gql`mutation UpdatePhanCongCa {
    updatePhanCongCa(input: { ${fields} }) { isResults message }
  }`;
  const { data } = await apolloClient.mutate<{
    updatePhanCongCa: { isResults: boolean; message?: string };
  }>({ mutation, errorPolicy: 'none' });
  if (!data?.updatePhanCongCa?.isResults)
    throw new Error(data?.updatePhanCongCa?.message || 'Không thể cập nhật phân công.');
  return data.updatePhanCongCa;
}

/** The change-shift dialog uses the selected shift's hours, never the old shift's hours. */
export function buildScheduleShiftChange(assignment: Assignment, shiftId: string, shifts: Shift[]) {
  if (!assignment.id || isPastScheduleDate(assignment.date))
    throw new Error('Không thể sửa phân công ngày quá khứ.');
  const shift = shifts.find(
    (item) =>
      item.id === shiftId &&
      item.active &&
      item.workType !== '0' &&
      item.scheduleType === assignment.scheduleType,
  );
  if (!shift || shiftId === assignment.shiftId)
    throw new Error('Vui lòng chọn ca làm việc khác ca hiện tại.');
  const start = scheduleTime(shift.startTime);
  const end = scheduleTime(shift.endTime);
  if (!start || !end || start === end)
    throw new Error('Ca được chọn chưa có giờ làm việc hợp lệ. Vui lòng cấu hình giờ của ca.');
  return {
    id: assignment.id,
    maNhanVien: assignment.employeeId,
    ngayLamViec: `${assignment.date}T00:00:00+07:00`,
    maCa: shiftId,
    toanCa: true,
    gioBatDau: scheduleDuration(start),
    gioKetThuc: scheduleDuration(end),
    maLoaiNghiPhep: null,
    ghiChu: (assignment.note || '').trim() || null,
  };
}
