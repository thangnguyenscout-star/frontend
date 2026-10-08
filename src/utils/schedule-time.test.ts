import { expect, it } from 'vitest';
import { scheduleTime } from './schedule-time';
it.each([
  ['PT8H', '08:00'],
  ['PT8H30M', '08:30'],
  ['PT30M', '00:30'],
  ['PT0S', '00:00'],
  ['PT22H15M30S', '22:15'],
  ['08:00:00', '08:00'],
  ['8:05', '08:05'],
  ['00:00', '00:00'],
  ['PT24H', ''],
  ['PT8H60M', ''],
  ['bad', ''],
  ['PT', ''],
  [null, ''],
])('normalizes %s to %s', (input, expected) => {
  expect(scheduleTime(input)).toBe(expected);
});
