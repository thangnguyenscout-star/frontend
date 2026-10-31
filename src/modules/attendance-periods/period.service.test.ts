import { beforeEach, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildSchema, print, validate } from 'graphql';
const api = vi.hoisted(() => ({ query: vi.fn(), mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: api }));
import {
  PERIOD_LIST,
  PERIOD_CREATE,
  periodDetailDocument,
  periodActionDocument,
  periodWireInput,
  exactPeriodId,
  listPeriods,
  getPeriod,
  createPeriod,
  changePeriodState,
} from './period.service';
const input = {
  nam: 2026,
  thang: 10,
  tuNgay: '2026-10-01',
  denNgay: '2026-10-31',
  ghiChu: '  Ghi chú  ',
};
const row = { id: '12', maKy: '2026-10', nam: 2026, thang: 10, trangThai: 'O' };
beforeEach(() => {
  api.query.mockReset();
  api.mutate.mockReset();
});
it('validates every operation against the contract extracted from the running server', () => {
  const schema = buildSchema(
    readFileSync(new URL('./period.contract.graphql', import.meta.url), 'utf8'),
  );
  for (const doc of [
    PERIOD_LIST,
    PERIOD_CREATE,
    periodDetailDocument('12'),
    periodActionDocument('close', '12'),
    periodActionDocument('lock', '12'),
  ])
    expect(validate(schema, doc).map((e) => e.message)).toEqual([]);
});
it('preserves date-only form values and serializes hotel midnight for the live DateTime scalar', () => {
  expect(periodWireInput(input)).toEqual({
    ...input,
    tuNgay: '2026-10-01T00:00:00+07:00',
    denNgay: '2026-10-31T00:00:00+07:00',
    ghiChu: 'Ghi chú',
  });
  expect(input.tuNgay).toBe('2026-10-01');
});
it.each([
  { ...input, thang: 13 },
  { ...input, nam: 0 },
  { ...input, tuNgay: '2026-02-30' },
  { ...input, denNgay: '2026-09-30' },
  { ...input, ghiChu: 'a'.repeat(501) },
])('rejects invalid period input before writing', async (invalid) => {
  await expect(createPeriod(invalid)).rejects.toThrow();
  expect(api.mutate).not.toHaveBeenCalled();
});
it('keeps Long identifiers exact and rejects injection or unsafe numeric IDs', () => {
  expect(print(periodDetailDocument('9007199254740993'))).toContain('id: 9007199254740993');
  for (const id of ['1) { isResults }', '0', '-1', '9223372036854775808', 9007199254740992])
    expect(() => exactPeriodId(id)).toThrow();
});
it('maps list filters to real scalar variables and sorts newest first', async () => {
  api.query.mockResolvedValue({
    data: { danhSachKyChamCong: { isResults: true, data: [null, { ...row, thang: 9 }, row] } },
  });
  const result = await listPeriods({ nam: 2026, thang: null, trangThai: null });
  expect(result[0].thang).toBe(10);
  expect(api.query.mock.calls[0][0].variables).toEqual({ nam: 2026, thang: null, trangThai: null });
});
it('uses the real create envelope and never supplies a client-selected status', async () => {
  api.mutate.mockResolvedValue({ data: { createKyChamCong: { isResults: true, data: row } } });
  expect(await createPeriod(input)).toEqual(row);
  expect(api.mutate.mock.calls[0][0].variables.input).not.toHaveProperty('trangThai');
});
it('surfaces create/partition failures without reporting success', async () => {
  api.mutate.mockResolvedValue({
    data: { createKyChamCong: { isResults: false, message: 'FAIL_BOUNARY_MONTHS', data: null } },
  });
  await expect(createPeriod(input)).rejects.toThrow('FAIL_BOUNARY_MONTHS');
});
it('blocks a stale state before calling a mutation and does not retry writes', async () => {
  api.query.mockResolvedValue({
    data: { thongTinKyChamCong: { isResults: true, data: { ...row, trangThai: 'C' } } },
  });
  await expect(changePeriodState('12', 'close', 'O')).rejects.toThrow(
    'KY_CHAM_CONG_UPDATE_CONFLICT',
  );
  expect(api.mutate).not.toHaveBeenCalled();
});
it.each([
  ['close', 'O', 'chotCong', 'C'],
  ['lock', 'C', 'khoaCong', 'L'],
] as const)('calls %s only after reloading the period', async (action, expected, field, target) => {
  api.query.mockResolvedValue({
    data: { thongTinKyChamCong: { isResults: true, data: { ...row, trangThai: expected } } },
  });
  api.mutate.mockResolvedValue({
    data: { [field]: { isResults: true, data: { ...row, trangThai: target } } },
  });
  expect((await changePeriodState('12', action, expected)).trangThai).toBe(target);
  expect(api.query.mock.invocationCallOrder[0]).toBeLessThan(
    api.mutate.mock.invocationCallOrder[0],
  );
  expect(print(api.mutate.mock.calls[0][0].mutation)).toContain(field + '(id: 12)');
  expect(api.mutate).toHaveBeenCalledTimes(1);
});
it('preserves backend business errors on detail and transport errors', async () => {
  api.query.mockResolvedValueOnce({
    data: {
      thongTinKyChamCong: { isResults: false, message: 'KY_CHAM_CONG_NOT_FOUND', data: null },
    },
  });
  await expect(getPeriod('12')).rejects.toThrow('KY_CHAM_CONG_NOT_FOUND');
  api.query.mockRejectedValueOnce(new Error('Offline'));
  await expect(getPeriod('12')).rejects.toThrow('Offline');
});
