import { beforeEach, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
const api = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock('@/services/modules/attendance-device.service', () => ({ getAttendanceDevices: api.load }));
import { useAttendanceSyncMock } from './useAttendanceSyncMock';
const row = {
  maThietBi: 9,
  tenThietBi: 'Máy API',
  diaDiem: 'Lễ tân',
  loaiThietBi: 'RJ',
  isActive: true,
  lanDongBoCuoi: null,
  createdAt: null,
};
beforeEach(() => {
  setActivePinia(createPinia());
  api.load.mockReset();
});
it('shares one API request between page and import dialog, with explicit refresh support', async () => {
  let done!: (rows: (typeof row)[]) => void;
  api.load.mockImplementationOnce(() => new Promise((resolve) => (done = resolve)));
  const a = useAttendanceSyncMock(),
    b = useAttendanceSyncMock();
  expect(a.devices).toEqual([]);
  const first = a.loadDevices(),
    second = b.loadDevices();
  expect(a.devicesLoading).toBe(true);
  expect(api.load).toHaveBeenCalledTimes(1);
  done([row]);
  await Promise.all([first, second]);
  expect(b.devices).toEqual([row]);
  await b.loadDevices();
  expect(api.load).toHaveBeenCalledTimes(1);
  api.load.mockResolvedValueOnce([]);
  await a.loadDevices(true);
  expect(a.devices).toEqual([]);
  expect(api.load).toHaveBeenCalledTimes(2);
});
it('shows API failure with no mock fallback and supports retry/reset without changing real catalogue', async () => {
  const s = useAttendanceSyncMock();
  api.load.mockRejectedValueOnce(new Error('Offline'));
  await s.loadDevices();
  expect(s.devices).toEqual([]);
  expect(s.devicesError).toBe('Offline');
  api.load.mockResolvedValueOnce([row]);
  await s.loadDevices();
  expect(s.devicesError).toBe('');
  expect(s.devices).toEqual([row]);
  s.resetDemoData();
  expect(s.devices).toEqual([row]);
});
