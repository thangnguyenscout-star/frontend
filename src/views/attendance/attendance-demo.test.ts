import { expect, it } from 'vitest';
import { demoAttendance, demoEmployees, demoDepartments } from './attendance-demo';
it('keeps employee identifiers unique and daily headcounts consistent', () => {
  expect(demoEmployees).toHaveLength(325);
  expect(new Set(demoEmployees.map((r) => r.code)).size).toBe(325);
  for (const date of ['2026-10-01', '2026-10-19', '2026-10-31']) {
    const rows = demoAttendance(date);
    expect(rows).toHaveLength(325);
    const counts = ['present', 'late', 'early', 'absent', 'leave'].map(
      (status) => rows.filter((r) => r.status === status).length,
    );
    expect(counts.reduce((sum, n) => sum + n, 0)).toBe(325);
    expect(
      rows.filter((r) => r.status === 'late').every((r) => r.minutes > 0 && r.checkIn !== '—'),
    ).toBe(true);
    expect(
      rows.filter((r) => ['absent', 'leave'].includes(r.status)).every((r) => r.checkIn === '—'),
    ).toBe(true);
  }
});
it('preserves department totals and stable results when filters change', () => {
  const rows = demoAttendance('2026-10-19');
  for (const [department, total] of demoDepartments)
    expect(rows.filter((r) => r.department === department)).toHaveLength(total);
  expect(demoAttendance('2026-10-19')).toEqual(rows);
  expect(demoAttendance('2026-10-20')).not.toEqual(rows);
  expect(rows.filter((r) => r.department === 'Lễ tân' && r.shift === 'HC').length).toBeGreaterThan(
    0,
  );
});
