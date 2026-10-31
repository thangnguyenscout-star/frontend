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
    nguonPhanCong: '1',
    maCa: 'N',
    maBoPhan: 'BP01',
    maChucVu: 'CV01',
    ngayLamViec: '2026-12-31T00:00:00+07:00',
    thoiGianBatDau: '2026-12-31T22:00:00+07:00',
    thoiGianKetThuc: '2027-01-01T06:00:00+07:00',
  });
});
it('rolls the end date forward when the clock wraps past midnight', () => {
  const input = mapBulkAssignments(
    [{ ...row, crossDay: true }],
    [{ ...shift, crossDay: false }],
    'BP01',
    [{ code: 'NV01' }],
  )[0];
  expect(input.thoiGianKetThuc).toBe('2027-01-01T06:00:00+07:00');
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

it('preserves Friday and Saturday in a sorted payload without mutating the source', async () => {
  const rows = [
    { ...row, date: '2026-10-10' },
    { ...row, date: '2026-10-09' },
  ];
  const input = mapBulkAssignments(rows, [{ ...shift, crossDay: false }], 'BP01', [
    { code: 'NV01' },
  ]);
  expect(rows.map((item) => item.date)).toEqual(['2026-10-10', '2026-10-09']);
  expect(input.map((item) => item.ngayLamViec)).toEqual([
    '2026-10-09T00:00:00+07:00',
    '2026-10-10T00:00:00+07:00',
  ]);
  expect(input[1].thoiGianBatDau).toBe('2026-10-10T22:00:00+07:00');
  expect(input[1].thoiGianKetThuc).toBe('2026-10-11T06:00:00+07:00');
  mutate.mockResolvedValueOnce({
    data: {
      createPhanCongHangLoat: {
        isResults: true,
        data: { tongSo: 2, thanhCong: 2, thatBai: 0, loi: [] },
      },
    },
  });
  await createBulkAssignments(input);
  expect(mutate.mock.lastCall?.[0].mutation.loc.source.body).toContain(
    'ngayLamViec: "2026-10-10T00:00:00+07:00"',
  );
});

it('preserves half-shift hours without assigning a leave code from legacy drafts', () => {
  const input = mapBulkAssignments(
    [
      {
        ...row,
        shiftId: 'D',
        fullTime: false,
        leaveTypeId: 'NP',
        startTime: '08:00',
        endTime: '12:00',
      },
    ],
    [{ ...shift, id: 'D', startTime: '08:00', endTime: '16:00', crossDay: false }],
    'BP01',
    [{ code: 'NV01' }],
  )[0];
  expect(input).toMatchObject({
    maCa: 'D',
    toanCa: false,
    thoiGianBatDau: '2026-12-31T08:00:00+07:00',
    thoiGianKetThuc: '2026-12-31T12:00:00+07:00',
  });
  expect(input).not.toHaveProperty('maLoaiNghiPhep');
});
