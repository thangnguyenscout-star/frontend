import { scheduleTime } from './schedule-time';

/** XepCa datetime2 values are schedule wall-clock timestamps, even when GraphQL appends Z. */
export function splitScheduleDateTime(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return { date: '', time: '' };
  const date = value.slice(0, 10),
    time = scheduleTime(value.slice(11, 19));
  const parsed = new Date(`${date}T12:00:00Z`);
  if (!time || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date)
    return { date: '', time: '' };
  return { date, time };
}

export function scheduleDuration(value: string) {
  const time = scheduleTime(value);
  if (!time) throw new Error('Invalid schedule clock time.');
  return `PT${Number(time.slice(0, 2))}H${Number(time.slice(3))}M`;
}

export function buildScheduleInterval(date: string, start: string, end: string, crossDay = false) {
  const startTime = scheduleTime(start),
    endTime = scheduleTime(end);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !startTime || !endTime || startTime === endTime)
    throw new Error('Ngày hoặc giờ của ca không hợp lệ.');
  const last = new Date(`${date}T12:00:00Z`);
  if (!Number.isFinite(last.getTime()) || last.toISOString().slice(0, 10) !== date)
    throw new Error('Ngày của ca không hợp lệ.');
  if (crossDay || endTime < startTime) last.setUTCDate(last.getUTCDate() + 1);
  return {
    thoiGianBatDau: `${date}T${startTime}:00+07:00`,
    thoiGianKetThuc: `${last.toISOString().slice(0, 10)}T${endTime}:00+07:00`,
  };
}
