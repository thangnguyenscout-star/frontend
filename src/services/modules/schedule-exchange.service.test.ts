import { beforeEach, expect, it, vi } from 'vitest';
import { print } from 'graphql';
import type { Assignment } from '@/types/schedule';
const api = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate: api.mutate } }));
import { exchangeScheduleAssignments } from './schedule-exchange.service';
const source: Assignment = {
  id: '9007199254740993',
  employeeId: 'NV1',
  date: '2099-10-10',
  shiftId: 'M',
  scheduleType: 'ROTATING',
  status: 'SCHEDULED',
  note: '',
  revision: 1,
  fullTime: true,
  leaveTypeId: null,
};
const target = { ...source, id: '2', employeeId: 'NV2', date: '2099-10-11', shiftId: 'E' };
beforeEach(() => {
  vi.resetAllMocks();
  api.mutate.mockResolvedValue({
    data: { doiCa: { isResults: true, message: 'Done', data: null } },
  });
});
it('calls doiCa once with exact assignment IDs and the supplied response fields', async () => {
  const result = await exchangeScheduleAssignments(source, target);
  expect(api.mutate).toHaveBeenCalledOnce();
  const call = api.mutate.mock.calls[0][0];
  const text = print(call.mutation);
  expect(text).toContain('idCaYeuCauDoi: 9007199254740993');
  expect(text).toContain('idCaDuocDoi: 2');
  for (const field of [
    'isResults',
    'message',
    'ngayLamViecCu',
    'maNhanVienYeuCau',
    'maNhanVienDoi',
    'maCaCu',
    'maCaMoi',
    'lyDo',
    'trangThai',
    'nguoiDuyet',
    'ngayDuyet',
  ])
    expect(text).toContain(field);
  expect(call.errorPolicy).toBe('none');
  expect(result.message).toBe('Done');
});
it('quotes nonnumeric IDs safely', async () => {
  await exchangeScheduleAssignments({ ...source, id: 'abc"def' }, target);
  expect(print(api.mutate.mock.calls[0][0].mutation)).toContain(
    'idCaYeuCauDoi: ' + JSON.stringify('abc"def'),
  );
});
it('surfaces unsuccessful and empty API responses', async () => {
  api.mutate.mockResolvedValueOnce({ data: { doiCa: { isResults: false, message: 'Rejected' } } });
  await expect(exchangeScheduleAssignments(source, target)).rejects.toThrow('Rejected');
  api.mutate.mockResolvedValueOnce({ data: null });
  await expect(exchangeScheduleAssignments(source, target)).rejects.toThrow('Không thể đổi ca');
});
it('propagates network and GraphQL failures', async () => {
  api.mutate.mockRejectedValue(new Error('Network error'));
  await expect(exchangeScheduleAssignments(source, target)).rejects.toThrow('Network error');
});
it.each([
  { ...target, shiftId: 'DO000' },
  { ...target, shiftSymbol: ' do ' },
  { ...target, leaveTypeId: 'NP' },
  { ...target, employeeId: source.employeeId },
  { ...target, id: '' },
])('does not submit an ineligible target', async (invalid) => {
  await expect(exchangeScheduleAssignments(source, invalid)).rejects.toThrow();
  expect(api.mutate).not.toHaveBeenCalled();
});

it('sends rich text through lyDoDoiCa variables without interpolating HTML', async () => {
  const reason = '<p><strong>Reason "quoted"</strong></p>\n<p>Next line</p>';
  await exchangeScheduleAssignments(source, target, reason);
  const call = api.mutate.mock.calls[0][0];
  expect(call.variables).toEqual({ lyDoDoiCa: reason });
  expect(print(call.mutation)).toContain('lyDoDoiCa: $lyDoDoiCa');
  expect(print(call.mutation)).not.toContain(reason);
});
it('sends null when no reason is entered', async () => {
  await exchangeScheduleAssignments(source, target);
  expect(api.mutate.mock.calls[0][0].variables).toEqual({ lyDoDoiCa: null });
});

it('accepts locked assignments and matching shifts on different days', async () => {
  await exchangeScheduleAssignments(
    { ...source, locked: true },
    { ...target, locked: true, shiftId: source.shiftId },
  );
  expect(api.mutate).toHaveBeenCalledOnce();
});
it('rejects matching shifts on the same day', async () => {
  await expect(
    exchangeScheduleAssignments(source, { ...target, date: source.date, shiftId: source.shiftId }),
  ).rejects.toThrow();
  expect(api.mutate).not.toHaveBeenCalled();
});
