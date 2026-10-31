import { isPastScheduleDate } from '@/utils/schedule-date';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const OFFSET = 7 * 60 * MINUTE;
export interface LeaveRequestRange {
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
}
export interface LeaveWorkShift {
  code: string;
  startTime: string;
  endTime: string;
  overnight: boolean;
}
export type LeaveShiftPart = 'full' | 'first' | 'last' | 'half';

function shiftBounds(date: string, shift: LeaveWorkShift | null) {
  const start = leaveRequestTimestamp(date, shift?.startTime || '00:00');
  const end = leaveRequestTimestamp(date, shift?.endTime || '04:00') + (shift?.overnight ? DAY : 0);
  if (end <= start || end - start > DAY)
    throw new Error('Giờ ca làm việc không hợp lệ. Vui lòng kiểm tra lại phân ca.');
  return { start, end };
}

export function resolveLeaveRequestRange(selection: {
  singleDay: boolean;
  fromDate: string;
  toDate: string;
  fromPart: LeaveShiftPart;
  toPart: LeaveShiftPart;
  fromShift: LeaveWorkShift | null;
  toShift: LeaveWorkShift | null;
}): LeaveRequestRange {
  const first = shiftBounds(selection.fromDate, selection.fromShift);
  let start = first.start;
  let end = first.end;
  if (selection.singleDay) {
    if (!['full', 'first', 'last'].includes(selection.fromPart))
      throw new Error('Vui lòng chọn phần ca nghỉ hợp lệ.');
    if (selection.fromShift) {
      if (selection.fromPart === 'first') end -= 4 * 60 * MINUTE;
      if (selection.fromPart === 'last') start += 4 * 60 * MINUTE;
      if (end <= start) throw new Error('Ca làm việc không đủ thời gian để chọn nghỉ nửa ca.');
    } else if (selection.fromPart === 'full') end = start + 8 * 60 * MINUTE;
  } else {
    if (selection.toDate <= selection.fromDate)
      throw new Error('Đến ngày phải sau từ ngày khi nghỉ nhiều ngày.');
    if (![selection.fromPart, selection.toPart].every((part) => ['full', 'half'].includes(part)))
      throw new Error('Vui lòng chọn phần ca nghỉ hợp lệ.');
    const last = shiftBounds(selection.toDate, selection.toShift);
    if (selection.fromShift && selection.fromPart === 'half') start += 4 * 60 * MINUTE;
    end = !selection.toShift
      ? last.start
      : selection.toPart === 'half'
        ? last.start + 4 * 60 * MINUTE
        : last.end;
  }
  const from = localLeaveDateTime(start);
  const to = localLeaveDateTime(end);
  return {
    fromDate: from.slice(0, 10),
    fromTime: from.slice(11, 16),
    toDate: to.slice(0, 10),
    toTime: to.slice(11, 16),
  };
}
export function localLeaveDateTime(timestamp: number) {
  return new Date(timestamp + OFFSET).toISOString().slice(0, 19) + '+07:00';
}
export function leaveRequestTimestamp(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
    throw new Error('Vui lòng nhập ngày và giờ hợp lệ.');
  const timestamp = Date.parse(`${date}T${time}:00+07:00`);
  if (!Number.isFinite(timestamp) || localLeaveDateTime(timestamp).slice(0, 10) !== date)
    throw new Error('Ngày nghỉ phép không hợp lệ.');
  return timestamp;
}
export function validateLeaveRequestRange(range: LeaveRequestRange) {
  const start = leaveRequestTimestamp(range.fromDate, range.fromTime);
  const end = leaveRequestTimestamp(range.toDate, range.toTime);
  if (isPastScheduleDate(range.fromDate))
    throw new Error('Không thể đăng ký nghỉ phép ngày quá khứ.');
  if (end <= start) throw new Error('Thời điểm kết thúc nghỉ phép phải sau thời điểm bắt đầu.');
  if (end - start > 366 * DAY) throw new Error('Khoảng nghỉ phép không được vượt quá 366 ngày.');
  return { start, end };
}
