import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const api = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate: api.mutate } }));
import { startAttendanceImport, AttendanceImportBatchError } from './attendance-import.service';
import type { AttendanceRowsRequest } from '@/modules/attendance-sync/sync.types';

const request: AttendanceRowsRequest = {
  rows: [{
    line: 2, machineNo: 7, user: '000123', time: '2026-10-01 08:00:00',
    eventType: 'I', rawStatus: 'E0001', raw: '7\t000123\tE0001\t2026-10-01 08:00:00\tI',
    status: 'VALID', message: null,
  }],
};
const result = {
  trangThai: 'PARTIAL', tongBanGhi: 12, soBanGhiMoi: 8, soBanGhiTrung: 2,
  soBanGhiLoi: 1, soBanGhiChuaMapping: 1, loi: [{ line: 4, maLoi: 'INVALID_DATE' }],
};
function ok(value: unknown) { return { data: { ghiNhanMayChamCongTheoLo: { isResults: true, message: null, data: value } } }; }
beforeEach(() => api.mutate.mockReset());
afterEach(() => vi.restoreAllMocks());

it('sends GraphQL rows, not file upload REST, and parses the batch result', async () => {
  api.mutate.mockResolvedValue(ok(result));
  expect(await startAttendanceImport(request)).toEqual(result);
  const [operation] = api.mutate.mock.calls[0];
  expect(operation.mutation.loc.source.body).toContain('ghiNhanMayChamCongTheoLo');
  expect(operation.variables.rows).toEqual(request.rows);
  expect(operation.variables.rows).toHaveLength(1);
});

it('splits large submissions into sequential bounded requests and aggregates counts', async () => {
  const rows = Array.from({ length: 2001 }, (_, index) => ({ ...request.rows[0], line: index + 1 }));
  api.mutate.mockResolvedValueOnce(ok({ ...result, trangThai: 'SUCCESS', tongBanGhi: 2000, soBanGhiMoi: 2000, soBanGhiTrung: 0, soBanGhiLoi: 0, soBanGhiChuaMapping: 0, loi: [] }))
    .mockResolvedValueOnce(ok({ ...result, trangThai: 'SUCCESS', tongBanGhi: 1, soBanGhiMoi: 1, soBanGhiTrung: 0, soBanGhiLoi: 0, soBanGhiChuaMapping: 0, loi: [] }));
  const saved = await startAttendanceImport({ rows });
  expect(api.mutate).toHaveBeenCalledTimes(2);
  expect(api.mutate.mock.calls[0][0].variables.rows).toHaveLength(2000);
  expect(api.mutate.mock.calls[1][0].variables.rows).toHaveLength(1);
  expect(saved).toMatchObject({ trangThai: 'SUCCESS', tongBanGhi: 2001, soBanGhiMoi: 2001 });
});

it('rejects empty, invalid, or duplicate-only rows before sending', async () => {
  await expect(startAttendanceImport({ rows: [] })).rejects.toThrow('Không có dòng hợp lệ');
  await expect(startAttendanceImport({ rows: [{ ...request.rows[0], status: 'INVALID' }] })).rejects.toThrow('Không có dòng hợp lệ');
  await expect(startAttendanceImport({ rows: [{ ...request.rows[0], status: 'DUPLICATE' }] })).rejects.toThrow('Không có dòng hợp lệ');
  api.mutate.mockResolvedValue(ok(result));
  const saved = await startAttendanceImport({ rows: [request.rows[0], { ...request.rows[0], line: 3, status: 'INVALID' }, { ...request.rows[0], line: 4, status: 'DUPLICATE' }] });
  expect(saved).toEqual(result);
  expect(api.mutate.mock.calls[0][0].variables.rows).toEqual([request.rows[0]]);
  api.mutate.mockReset();
  await expect(startAttendanceImport({ rows: [{ ...request.rows[0], line: 0 }] })).rejects.toThrow('contract');
  await expect(startAttendanceImport({ rows: [{ ...request.rows[0], machineNo: 7.1 }] })).rejects.toThrow('contract');
  expect(api.mutate).not.toHaveBeenCalled();
});

it('reports acknowledged counts and does not retry automatically after an uncertain batch', async () => {
  api.mutate.mockResolvedValueOnce(ok({ ...result, trangThai: 'SUCCESS', tongBanGhi: 2000, soBanGhiMoi: 2000, soBanGhiTrung: 0, soBanGhiLoi: 0, soBanGhiChuaMapping: 0, loi: [] }))
    .mockRejectedValueOnce(new Error('network lost'));
  const rows = Array.from({ length: 2001 }, (_, index) => ({ ...request.rows[0], line: index + 1 }));
  await expect(startAttendanceImport({ rows })).rejects.toMatchObject({
    name: 'AttendanceImportBatchError',
    partialResult: { ...result, trangThai: 'SUCCESS', tongBanGhi: 2000, soBanGhiMoi: 2000, soBanGhiTrung: 0, soBanGhiLoi: 0, soBanGhiChuaMapping: 0, loi: [] },
  } satisfies Partial<AttendanceImportBatchError>);
  expect(api.mutate).toHaveBeenCalledTimes(2);
});
