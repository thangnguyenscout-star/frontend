import { expect, it, vi } from 'vitest';
vi.mock('@/utils/schedule-date', () => ({ isPastScheduleDate: (d: string) => d < '2026-10-06' }));
import { fillUnassignedPlans } from './schedule-fill';
import type { Assignment, Shift } from '@/types/schedule';
it('fills shift IDs only for unassigned days and preserves chosen plans', () => {
  const shift = { id: 'CA01' } as Shift;
  const chosen = {
    employeeId: 'NV01',
    date: '2026-10-07',
    shiftId: 'CA02',
    fullTime: true,
    note: 'chosen',
  };
  const assignments = [{ employeeId: 'NV01', date: '2026-10-06' }] as Assignment[];
  const result = fillUnassignedPlans(
    [{ code: 'NV01' }, { code: 'NV02' }],
    ['2026-10-05', '2026-10-06', '2026-10-07'],
    shift,
    assignments,
    [chosen],
  );
  expect(result).toHaveLength(3);
  expect(result).toContainEqual(chosen);
  expect(result.filter((a) => a.employeeId === 'NV02').every((a) => a.shiftId === 'CA01')).toBe(
    true,
  );
  expect(
    result.some(
      (a) => a.date === '2026-10-05' || (a.employeeId === 'NV01' && a.date === '2026-10-06'),
    ),
  ).toBe(false);
});

it('skips Sundays for administrative schedules, including existing plans', () => {
  const shift = { id: 'HC', scheduleType: 'ADMINISTRATIVE' } as Shift;
  const sundayPlan = {
    employeeId: 'NV01',
    date: '2026-10-11',
    shiftId: 'HC',
    fullTime: true,
    note: '',
  };
  const result = fillUnassignedPlans(
    [{ code: 'NV01' }],
    ['2026-10-10', '2026-10-11', '2026-10-12'],
    shift,
    [],
    [sundayPlan],
  );
  expect(result.map((plan) => plan.date)).toEqual(['2026-10-10', '2026-10-12']);
});
