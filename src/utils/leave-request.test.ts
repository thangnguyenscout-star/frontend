import { expect, it } from 'vitest';
import {
  localLeaveDateTime,
  resolveLeaveRequestRange,
  validateLeaveRequestRange,
  type LeaveShiftPart,
} from './leave-request';
const range = { fromDate: '2099-10-10', fromTime: '22:00', toDate: '2099-10-11', toTime: '06:00' };
const dayShift = { code: 'D', startTime: '08:00', endTime: '16:00', overnight: false };
const selection = {
  singleDay: true,
  fromDate: '2099-10-10',
  toDate: '2099-10-10',
  fromPart: 'full' as LeaveShiftPart,
  toPart: 'full' as LeaveShiftPart,
  fromShift: dayShift,
  toShift: dayShift,
};
it.each([
  ['full', '08:00', '16:00'],
  ['first', '08:00', '12:00'],
  ['last', '12:00', '16:00'],
] as const)('calculates a single-day %s request', (fromPart, fromTime, toTime) => {
  expect(resolveLeaveRequestRange({ ...selection, fromPart })).toEqual({
    fromDate: '2099-10-10',
    fromTime,
    toDate: '2099-10-10',
    toTime,
  });
});
it('subtracts exactly four hours from the shift end for the first half', () => {
  expect(
    resolveLeaveRequestRange({
      ...selection,
      fromPart: 'first',
      fromShift: { ...dayShift, endTime: '17:00' },
    }).toTime,
  ).toBe('13:00');
});
it.each([
  ['full', 'full', '08:00', '17:00'],
  ['half', 'full', '12:00', '17:00'],
  ['full', 'half', '08:00', '13:00'],
  ['half', 'half', '12:00', '13:00'],
] as const)(
  'uses independent endpoint shifts for %s/%s multi-day requests',
  (fromPart, toPart, fromTime, toTime) => {
    expect(
      resolveLeaveRequestRange({
        ...selection,
        singleDay: false,
        toDate: '2099-10-12',
        fromPart,
        toPart,
        toShift: { ...dayShift, startTime: '09:00', endTime: '17:00' },
      }),
    ).toEqual({ fromDate: '2099-10-10', fromTime, toDate: '2099-10-12', toTime });
  },
);
it.each([
  ['full', '2099-10-10', '22:00', '2099-10-11', '06:00'],
  ['first', '2099-10-10', '22:00', '2099-10-11', '02:00'],
  ['last', '2099-10-11', '02:00', '2099-10-11', '06:00'],
] as const)(
  'preserves overnight dates for a %s request',
  (fromPart, fromDate, fromTime, toDate, toTime) => {
    expect(
      resolveLeaveRequestRange({
        ...selection,
        fromPart,
        fromShift: { code: 'N', startTime: '22:00', endTime: '06:00', overnight: true },
      }),
    ).toEqual({ fromDate, fromTime, toDate, toTime });
  },
);
it('uses 00:00–08:00 for unassigned full days and keeps 00:00–04:00 for half days', () => {
  for (const fromPart of ['full', 'first', 'last'] as const)
    expect(resolveLeaveRequestRange({ ...selection, fromPart, fromShift: null })).toMatchObject({
      fromTime: '00:00',
      toTime: fromPart === 'full' ? '08:00' : '04:00',
    });
});
it('uses midnight for each unassigned endpoint in multi-day requests for both part choices', () => {
  for (const fromPart of ['full', 'half'] as const)
    for (const toPart of ['full', 'half'] as const)
      expect(
        resolveLeaveRequestRange({
          ...selection,
          singleDay: false,
          toDate: '2099-10-12',
          fromPart,
          toPart,
          fromShift: null,
          toShift: null,
        }),
      ).toEqual({
        fromDate: '2099-10-10',
        fromTime: '00:00',
        toDate: '2099-10-12',
        toTime: '00:00',
      });
});
it('rejects equal or reversed multi-day dates and invalid shift hours', () => {
  for (const toDate of ['2099-10-10', '2099-10-09'])
    expect(() => resolveLeaveRequestRange({ ...selection, singleDay: false, toDate })).toThrow(
      'sau từ ngày',
    );
  expect(() =>
    resolveLeaveRequestRange({ ...selection, fromShift: { ...dayShift, startTime: '22:00' } }),
  ).toThrow('không hợp lệ');
  expect(() =>
    resolveLeaveRequestRange({
      ...selection,
      fromPart: 'first',
      fromShift: { ...dayShift, endTime: '12:00' },
    }),
  ).toThrow('không đủ thời gian');
});
it('validates overnight leave with UTC+07 dates without requiring assigned shifts', () => {
  const { start, end } = validateLeaveRequestRange(range);
  expect(end - start).toBe(8 * 3600000);
  expect(localLeaveDateTime(start)).toBe('2099-10-10T22:00:00+07:00');
});
it('rejects invalid dates, hours and reversed ranges', () => {
  for (const invalid of [
    { fromDate: '2099-02-30' },
    { fromTime: '25:00' },
    { toDate: '2099-10-10', toTime: '21:00' },
    { toDate: '2099-10-10', toTime: '22:00' },
  ])
    expect(() => validateLeaveRequestRange({ ...range, ...invalid })).toThrow();
});
it('rejects past requests and ranges beyond 366 days', () => {
  expect(() =>
    validateLeaveRequestRange({ ...range, fromDate: '2000-01-01', toDate: '2000-01-02' }),
  ).toThrow('quá khứ');
  expect(() => validateLeaveRequestRange({ ...range, toDate: '2101-01-01' })).toThrow('366');
});
