import { describe, expect, it } from 'vitest';
import type { Shift } from '@/types/schedule';
import { buildRotatingSchedule } from './schedule-auto';

const shifts: Shift[] = ['M', 'E', 'N'].map((code) => ({
  id: code,
  code,
  name: code,
  scheduleType: 'ROTATING',
  startTime: '00:00',
  endTime: '08:00',
  crossDay: false,
  displayColor: '#000000',
  active: true,
}));

describe('buildRotatingSchedule', () => {
  it('assigns six days per employee and caps M/E at two people each day', () => {
    const employees = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const rows = buildRotatingSchedule(employees, '2026-09-28', '2026-10-04', shifts);

    for (const employeeId of employees) {
      const employeeRows = rows.filter((row) => row.employeeId === employeeId);
      expect(employeeRows.filter((row) => row.status === 'SCHEDULED')).toHaveLength(6);
      expect(employeeRows.filter((row) => row.status === 'OFF')).toHaveLength(1);
    }
    for (const date of ['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']) {
      const dayRows = rows.filter((row) => row.date === date);
      expect(new Set(dayRows.map((row) => row.employeeId)).size).toBe(dayRows.length);
      expect(dayRows.filter((row) => row.shiftId === 'M').length).toBeLessThanOrEqual(2);
      expect(dayRows.filter((row) => row.shiftId === 'E').length).toBeLessThanOrEqual(2);
    }
  });

  it('requires complete Monday-to-Sunday weeks and active shift definitions', () => {
    expect(() => buildRotatingSchedule(['A'], '2026-09-28', '2026-10-04', shifts.slice(0, 2))).toThrow('Thiếu ca N');
  });

  it('expands a selected month to complete calendar weeks', () => {
    const rows = buildRotatingSchedule(['A', 'B'], '2026-10-01', '2026-10-31', shifts);
    expect(rows[0].date).toBe('2026-09-28');
    expect(rows.at(-1)?.date).toBe('2026-11-01');
    for (const employeeId of ['A', 'B']) {
      const scheduled = rows.filter((row) => row.employeeId === employeeId && row.status === 'SCHEDULED');
      expect(scheduled.length % 6).toBe(0);
      expect(new Set(scheduled.map((row) => row.date)).size).toBe(scheduled.length);
    }
  });
});