import { expect, it, vi } from 'vitest';
const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate } }));
import { createBulkAssignments, mapBulkAssignments } from './schedule-bulk.service';
import type { Assignment, Shift } from '@/types/schedule';
const row = {
  employeeId: 'NV01',
  date: '2026-12-31',
  shiftId: 'N',
  status: 'SCHEDULED',
  note: '"note"',
} as Assignment;
const shift = { id: 'N', startTime: '22:00', endTime: '06:00', crossDay: true } as Shift;
it('uses the shift flag to roll the end date across a year boundary', () => {
  const input = mapBulkAssignments([row], [shift], 'BP01', [
    { code: 'NV01', positionCode: 'CV01' },
  ])[0];
  expect(input).toMatchObject({
    nguonPhanCong: 1,
    maCa: 'N',
    maBoPhan: 'BP01',
    maChucVu: 'CV01',
    ngayLamViec: '2026-12-31T00:00:00+07:00',
    ngayBatDau: '2026-12-31T00:00:00+07:00',
    ngayKetThuc: '2027-01-01T00:00:00+07:00',
    gioBatDau: '22:00:00',
    gioKetThuc: '06:00:00',
  });
});
it('keeps end date on the same day for quaNgay 0 even if row flag is stale', () => {
  const input = mapBulkAssignments(
    [{ ...row, crossDay: true }],
    [{ ...shift, crossDay: false }],
    'BP01',
    [{ code: 'NV01' }],
  )[0];
  expect(input.ngayKetThuc).toBe(input.ngayBatDau);
});
it('sends an array of inputs and preserves partial failures', async () => {
  mutate.mockResolvedValueOnce({
    data: {
      createPhanCongHangLoat: {
        isResults: false,
        data: {
          tongSo: 2,
          thanhCong: 1,
          thatBai: 1,
          loi: [{ maNhanVien: 'NV01', ngayLamViec: '2026-12-31', message: 'Conflict' }],
        },
      },
    },
  });
  const result = await createBulkAssignments(
    mapBulkAssignments([row], [shift], 'BP01', [{ code: 'NV01' }]),
  );
  expect(result.thatBai).toBe(1);
  expect(mutate.mock.lastCall?.[0].mutation.loc.source.body).toContain('danhSachPhanCong: [');
});
it('rejects invalid shifts before a write', () => {
  expect(() => mapBulkAssignments([row], [], 'BP01', [{ code: 'NV01' }])).toThrow('mã ca');
});
