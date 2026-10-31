import { expect, it } from 'vitest';
import { scheduleDate } from './schedule-date';
it.each([
  ['2026-10-09T17:00:00Z', '2026-10-10'],
  ['2026-10-10T00:00:00+07:00', '2026-10-10'],
  ['2026-10-10', '2026-10-10'],
  ['2026-10-10T00:00:00', '2026-10-10'],
  ['2026-12-31T17:00:00Z', '2027-01-01'],
])('normalizes %s to the UTC+07 calendar day', (value, expected) => {
  expect(scheduleDate(value)).toBe(expected);
});
