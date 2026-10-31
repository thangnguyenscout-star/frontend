vi.mock('@/services/modules/attendance-device.service', () => ({
  getAttendanceDevices: vi.fn(async () => []),
}));
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { readdirSync, readFileSync } from 'node:fs';
import { useAttendanceSyncMock } from './useAttendanceSyncMock';
beforeEach(() => {
  setActivePinia(createPinia());
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 20, 10));
});
afterEach(() => vi.useRealTimers());
it('seeds required nullable/overnight/duplicate/unknown-code cases and complete mock sets', () => {
  const s = useAttendanceSyncMock();
  expect(s.logs.length).toBeGreaterThanOrEqual(40);
  expect(s.devices).toHaveLength(0);
  expect(s.batches).toHaveLength(6);
  expect(s.errors).toHaveLength(8);
  expect(s.logs.some((r) => !r.maNhanVien)).toBe(true);
  expect(s.logs.some((r) => r.maThietBi === null && r.dotDongBoId === null)).toBe(true);
  expect(s.logs.some((r) => r.maYeuCauBoSung && r.lyDo && r.createdBy)).toBe(true);
  expect(s.logs.some((r) => r.thoiGianQuet.includes('T00:'))).toBe(true);
  expect(s.logs.every((r) => Object.keys(r).length === 13)).toBe(true);
});
it('filters logs and KPI counts by date/device/case-insensitive user/event/mapping/batch', () => {
  const s = useAttendanceSyncMock();
  s.clearFilters();
  s.filters.search = 'de0001';
  expect(s.filteredLogs.every((r) => r.maNhanVien === 'DE0001')).toBe(true);
  expect(s.summary.total).toBe(s.filteredLogs.length);
  s.filters.search = '';
  s.filters.mapping = 'unmapped';
  expect(s.summary.unmapped).toBe(s.summary.total);
  s.filters.device = 1;
  expect(s.filteredLogs.every((r) => r.maThietBi === 1)).toBe(true);
  s.filters.from = '2026-10-20';
  s.filters.to = '2026-10-01';
  expect(s.filteredLogs).toEqual([]);
  expect(s.rangeError).toBeTruthy();
});
it('keeps unmapped logs, records invalid rows and avoids duplicates when importing again', async () => {
  const s = useAttendanceSyncMock();
  const text = [
    '1\t1007\t0\t2026-10-20 09:00:00\t0',
    '1\t9999\t0\t2026-10-20 09:00:00\t0',
    '1\t1008\t0\tbad\t0',
  ].join('\n');
  const preview = s.previewText(text, 'dat', false, 1);
  const before = s.logs.length;
  const pending = s.simulateFileImport(preview, 1, 'DAT', 'fixture.dat');
  expect(s.loading).toBe(true);
  await vi.runAllTimersAsync();
  const batch = await pending;
  expect(batch).toMatchObject({
    tongBanGhi: 3,
    soMoi: 2,
    soTrung: 0,
    soLoi: 1,
    trangThai: 'PARTIAL',
  });
  expect(s.logs).toHaveLength(before + 2);
  expect(
    s.logsByBatch(batch.id).find((row) => row.maNguoiDungMay === '9999')?.maNhanVien,
  ).toBeNull();
  expect(s.logsByBatch(batch.id).every((row) => row.loaiSuKien === 'U')).toBe(true);
  const again = s.simulateFileImport(preview, 1, 'DAT', 'fixture.dat');
  await vi.runAllTimersAsync();
  expect((await again).soTrung).toBe(2);
  expect(s.logs).toHaveLength(before + 2);
});
it('blocks offline devices and invalid date ranges', async () => {
  const s = useAttendanceSyncMock();
  await expect(s.simulateDeviceSync(3, '2026-10-01', '2026-10-02')).rejects.toThrow();
  await expect(s.simulateDeviceSync(1, '2026-02-30', '2026-03-04')).rejects.toThrow();
  expect(s.batches).toHaveLength(6);
});
it('simulates online devices locally and makes repeated syncs idempotent for log keys', async () => {
  const s = useAttendanceSyncMock();
  s.devices = [
    {
      maThietBi: 1,
      tenThietBi: 'Máy API',
      diaDiem: 'Lễ tân',
      loaiThietBi: 'RJ',
      isActive: true,
      lanDongBoCuoi: null,
      createdAt: null,
    },
  ];
  const pending = s.simulateDeviceSync(1, '2026-10-20', '2026-10-20');
  await expect(s.simulateDeviceSync(1, '2026-10-20', '2026-10-20')).rejects.toThrow('Đang chạy');
  await vi.runAllTimersAsync();
  const batch = await pending;
  expect(batch.tongBanGhi).toBe(4);
  const length = s.logs.length;
  const again = s.simulateDeviceSync(1, '2026-10-20', '2026-10-20');
  await vi.runAllTimersAsync();
  expect((await again).soTrung).toBe(4);
  expect(s.logs).toHaveLength(length);
  expect(s.devices[0].lanDongBoCuoi).toBeNull();
  s.resetDemoData();
  expect(s.logs).toHaveLength(49);
  expect(s.batches).toHaveLength(6);
});
it('keeps state across route consumers but never persists or imports network clients', () => {
  const a = useAttendanceSyncMock(),
    b = useAttendanceSyncMock();
  a.errors[0].trangThai = 'IGNORED';
  expect(b.errors[0].trangThai).toBe('IGNORED');
  for (const name of readdirSync(new URL('.', import.meta.url)).filter(
    (n) => /\.(ts|vue)$/.test(n) && !n.endsWith('.test.ts'),
  )) {
    const source = readFileSync(new URL(name, import.meta.url), 'utf8');
    expect(source).not.toMatch(
      /\bfetch\s*\(|axios|apolloClient|XMLHttpRequest|localStorage|sessionStorage/,
    );
  }
});
