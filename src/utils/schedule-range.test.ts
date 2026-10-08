import { describe, expect, it } from 'vitest';
import { scheduleRange } from './schedule-range';
describe('calendar request ranges', () => {
  it('starts the current week on Monday and ends on Sunday', () => {
    expect(scheduleRange('2026-10-06', 'week')).toEqual({ from: '2026-10-05', to: '2026-10-11' });
    expect(scheduleRange('2026-10-11', 'week')).toEqual({ from: '2026-10-05', to: '2026-10-11' });
  });
  it('requests the new week across year boundaries', () => {
    expect(scheduleRange('2027-01-01', 'week')).toEqual({ from: '2026-12-28', to: '2027-01-03' });
  });
  it('requests the entire month including leap days', () => {
    expect(scheduleRange('2028-02-15', 'month')).toEqual({ from: '2028-02-01', to: '2028-02-29' });
  });
  it('requests only the selected day', () => {
    expect(scheduleRange('2026-10-06', 'day')).toEqual({ from: '2026-10-06', to: '2026-10-06' });
  });
});
