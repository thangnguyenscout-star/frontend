import { beforeEach, expect, it, vi } from 'vitest';
import { print } from 'graphql';
const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate } }));
import { buildScheduleShiftChange, updateScheduleAssignment } from './schedule-update.service';
import type { Assignment, Shift } from '@/types/schedule';
const assignment = {
  id: '9007199254740993',
  employeeId: 'NV01',
  date: '2099-10-10',
  shiftId: 'M6',
  scheduleType: 'ROTATING',
  startTime: '06:00',
  endTime: '14:00',
  fullTime: true,
} as Assignment;
const shifts = [
  {
    id: 'M6',
    code: 'M6',
    workType: '2',
    scheduleType: 'ROTATING',
    startTime: '06:00',
    endTime: '14:00',
  },
  {
    id: 'M7',
    code: 'M7',
    workType: '2',
    scheduleType: 'ROTATING',
    startTime: '07:00',
    endTime: '15:00',
  },
  { id: 'MXXX', code: 'MXXX', workType: '2', scheduleType: 'ROTATING', startTime: '', endTime: '' },
  { id: 'NP', code: 'NP', workType: '0' },
  {
    id: 'D',
    code: 'D',
    workType: '1',
    scheduleType: 'ADMINISTRATIVE',
    startTime: '06:00',
    endTime: '14:00',
  },
] as Shift[];
beforeEach(() => mutate.mockReset());
it('calls the update mutation with an exact ID and checks business success', async () => {
  mutate.mockResolvedValueOnce({ data: { updatePhanCongCa: { isResults: true, message: 'OK' } } });
  await updateScheduleAssignment(
    buildScheduleShiftChange(
      assignment,
      'M7',
      shifts.map((shift) => ({ ...shift, active: true })),
    ),
  );
  const document = print(mutate.mock.calls[0][0].mutation);
  expect(document).toContain('updatePhanCongCa');
  expect(document).toContain('id: 9007199254740993');
  expect(document).toContain('maNhanVien: "NV01"');
  mutate.mockResolvedValueOnce({
    data: { updatePhanCongCa: { isResults: false, message: 'Rejected' } },
  });
  await expect(
    updateScheduleAssignment(
      buildScheduleShiftChange(
        assignment,
        'M7',
        shifts.map((shift) => ({ ...shift, active: true })),
      ),
    ),
  ).rejects.toThrow('Rejected');
});

it('changes shift using the new shift hours instead of the previous shift start', () => {
  expect(
    buildScheduleShiftChange(
      assignment,
      'M7',
      shifts.map((shift) => ({ ...shift, active: true })),
    ),
  ).toMatchObject({
    maCa: 'M7',
    gioBatDau: 'PT7H0M',
    gioKetThuc: 'PT15H0M',
    toanCa: true,
    maLoaiNghiPhep: null,
  });
});
it('rejects unchanged, inactive, leave and untimed shifts in the simple change-shift form', () => {
  const activeShifts = shifts.map((shift) => ({ ...shift, active: true }));
  for (const id of ['M6', 'NP', 'MXXX'])
    expect(() => buildScheduleShiftChange(assignment, id, activeShifts)).toThrow();
  expect(() =>
    buildScheduleShiftChange(
      assignment,
      'M7',
      shifts.map((shift) => ({ ...shift, active: false })),
    ),
  ).toThrow();
});
