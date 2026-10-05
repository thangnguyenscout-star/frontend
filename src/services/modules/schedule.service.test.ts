import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scheduleCatalog } from '@/mock/data/schedule';
import type { Assignment, ScheduleData } from '@/types/schedule';
vi.mock('@/services/api/privateApi', () => ({
  privateApi: (job: () => Promise<unknown>) => job(),
}));
vi.mock('./record.service', () => ({
  recordService: { list: vi.fn().mockResolvedValue({ all: [] }) },
}));
vi.mock('@/stores/permission.store', () => ({ usePermissionStore: () => ({ can: () => true }) }));
const row = (id: string, date: string, shiftId: string, employeeId = 'NV001'): Assignment => ({
  id,
  date,
  shiftId,
  employeeId,
  scheduleType: 'ROTATING',
  status: 'SCHEDULED',
  note: '',
  revision: 1,
});
const base = (): ScheduleData => ({
  shifts: structuredClone(scheduleCatalog),
  assignments: [],
  templates: [],
  swaps: [],
  history: [],
});
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-01T12:00:00'));
  vi.resetModules();
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => storage.get(k) || null,
    setItem: (k: string, v: string) => storage.set(k, v),
  });
});
afterEach(() => vi.useRealTimers());

describe('schedule conflict and approval safeguards', () => {
  it('uses entered hours for flexible shifts across midnight', async () => {
    const { conflicts } = await import('./schedule.service');
    const data = base();
    data.assignments = [
      { ...row('old', '2026-10-02', 'M'), startTime: '23:30', endTime: '07:30', crossDay: true },
    ];
    expect(conflicts(data, [row('new', '2026-10-03', 'M')])).toHaveLength(1);
    data.assignments[0].endTime = '06:00';
    expect(conflicts(data, [row('new', '2026-10-03', 'M')])).toHaveLength(0);
  });
  it('detects overnight overlap but accepts adjacent shifts', async () => {
    const { conflicts } = await import('./schedule.service');
    const data = base();
    data.assignments = [row('old', '2026-10-02', 'N')];
    expect(conflicts(data, [row('new', '2026-10-03', 'HC')])).toHaveLength(0);
    data.shifts.find((s) => s.id === 'M')!.startTime = '05:00';
    expect(conflicts(data, [row('new', '2026-10-03', 'M')])).toHaveLength(1);
  });
  it('reports existing leave and refuses the entire conflicting batch', async () => {
    const data = base();
    data.assignments = [{ ...row('old', '2026-10-02', ''), status: 'LEAVE' }];
    localStorage.setItem('hotel-shift-scheduling-v2', JSON.stringify(data));
    const { scheduleService, conflicts } = await import('./schedule.service');
    expect(conflicts(data, [row('new', '2026-10-02', 'M')])[0].reason).toContain('nghỉ phép');
    await expect(
      scheduleService.assign([row('', '2026-10-03', 'M'), row('', '2026-10-02', 'E')]),
    ).rejects.toThrow('xung đột');
    expect((await scheduleService.load()).assignments).toHaveLength(1);
  });
  it('applies an approved swap once and keeps rejected schedules intact', async () => {
    const data = base();
    data.assignments = [row('a', '2026-10-02', 'M'), row('b', '2026-10-02', 'E', 'NV002')];
    localStorage.setItem('hotel-shift-scheduling-v2', JSON.stringify(data));
    const { scheduleService } = await import('./schedule.service');
    let next = await scheduleService.request({
      assignmentId: 'a',
      targetAssignmentId: 'b',
      shiftId: '',
      reason: 'Việc gia đình',
    });
    const id = next.swaps[0].id;
    next = await scheduleService.decide(id, true, '');
    expect(next.assignments.find((a) => a.id === 'a')?.shiftId).toBe('E');
    expect(next.assignments.find((a) => a.id === 'b')?.shiftId).toBe('M');
    await expect(scheduleService.decide(id, true, '')).rejects.toThrow('đã xử lý');
    next = await scheduleService.request({
      assignmentId: 'a',
      targetAssignmentId: '',
      shiftId: 'HC',
      reason: 'Lịch cá nhân',
    });
    next = await scheduleService.decide(next.swaps[1].id, false, 'Không phù hợp');
    expect(next.assignments.find((a) => a.id === 'a')?.shiftId).toBe('E');
  });
  it('rejects approval when the original schedule was edited', async () => {
    const data = base();
    data.assignments = [row('a', '2026-10-02', 'M')];
    localStorage.setItem('hotel-shift-scheduling-v2', JSON.stringify(data));
    const { scheduleService } = await import('./schedule.service');
    const next = await scheduleService.request({
      assignmentId: 'a',
      targetAssignmentId: '',
      shiftId: 'E',
      reason: 'Việc gia đình',
    });
    await scheduleService.assign([{ ...next.assignments[0], shiftId: 'N' }]);
    await expect(scheduleService.decide(next.swaps[0].id, true, '')).rejects.toThrow(
      'Lịch gốc đã thay đổi',
    );
    expect((await scheduleService.load()).swaps[0].status).toBe('PENDING');
  });
});

it('persists half-shift selection and keeps it when editing an assignment', async () => {
  const { scheduleService } = await import('./schedule.service');
  let saved = await scheduleService.assign([{ ...row('', '2026-10-05', 'M'), fullTime: false }]);
  expect(saved.assignments[0].fullTime).toBe(false);
  expect(
    JSON.parse(localStorage.getItem('hotel-shift-scheduling-v2')!).assignments[0].fullTime,
  ).toBe(false);
  saved = await scheduleService.assign([{ ...saved.assignments[0], fullTime: true }]);
  expect(saved.assignments[0].fullTime).toBe(true);
});

it('keeps shifts and full-time choices separate for employees on the same date', async () => {
  const { scheduleService } = await import('./schedule.service');
  const saved = await scheduleService.assign([
    { ...row('', '2026-10-06', 'M', 'NV001'), fullTime: false },
    { ...row('', '2026-10-06', 'E', 'NV002'), fullTime: true },
  ]);
  expect(saved.assignments.find((a) => a.employeeId === 'NV001')).toMatchObject({
    shiftId: 'M',
    fullTime: false,
  });
  expect(saved.assignments.find((a) => a.employeeId === 'NV002')).toMatchObject({
    shiftId: 'E',
    fullTime: true,
  });
});

it('rejects past dates and rechecks the system date at save time', async () => {
  const { scheduleService } = await import('./schedule.service');
  vi.setSystemTime(new Date('2026-10-03T23:59:00'));
  await expect(scheduleService.assign([row('', '2026-10-02', 'M')])).rejects.toThrow('quá khứ');
  await expect(scheduleService.assign([row('', '2026-10-03', 'M')])).resolves.toBeDefined();
  vi.setSystemTime(new Date('2026-10-04T00:01:00'));
  await expect(scheduleService.assign([row('', '2026-10-03', 'E')])).rejects.toThrow('quá khứ');
  await expect(scheduleService.assign([row('', '2026-10-05', 'M')])).resolves.toBeDefined();
});
