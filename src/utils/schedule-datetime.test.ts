import { expect, it } from 'vitest';
import { buildScheduleInterval, splitScheduleDateTime } from './schedule-datetime';
it('preserves XepCa wall-clock DateTimes without adding seven hours', () => {
  expect(splitScheduleDateTime('2026-10-10T23:30:00Z')).toEqual({
    date: '2026-10-10',
    time: '23:30',
  });
  expect(splitScheduleDateTime('2026-10-10T22:00:00+07:00')).toEqual({
    date: '2026-10-10',
    time: '22:00',
  });
  expect(splitScheduleDateTime('2026-10-10T22:00:00')).toEqual({
    date: '2026-10-10',
    time: '22:00',
  });
});
it('builds DateTime intervals across a year boundary', () => {
  expect(buildScheduleInterval('2026-12-31', '22:00', '06:00')).toEqual({
    thoiGianBatDau: '2026-12-31T22:00:00+07:00',
    thoiGianKetThuc: '2027-01-01T06:00:00+07:00',
  });
});
it('keeps a half shift on the same date', () => {
  expect(buildScheduleInterval('2026-10-10', '08:00', '12:00')).toEqual({
    thoiGianBatDau: '2026-10-10T08:00:00+07:00',
    thoiGianKetThuc: '2026-10-10T12:00:00+07:00',
  });
});
it('rejects invalid dates and times before sending writes', () => {
  expect(() => buildScheduleInterval('2026-02-30', '08:00', '16:00')).toThrow();
  expect(() => buildScheduleInterval('2026-10-10', '25:00', '16:00')).toThrow();
  expect(splitScheduleDateTime('badZ')).toEqual({ date: '', time: '' });
  expect(splitScheduleDateTime(null)).toEqual({ date: '', time: '' });
});
