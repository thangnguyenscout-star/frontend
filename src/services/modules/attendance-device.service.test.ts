import { beforeEach, expect, it, vi } from 'vitest';
import { print } from 'graphql';
const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query } }));
import { getAttendanceDevices, ATTENDANCE_DEVICES } from './attendance-device.service';
beforeEach(() => query.mockReset());
it('uses the supplied query and preserves inactive machines without inventing online status', async () => {
  const row = {
    maThietBi: 9,
    tenThietBi: 'Máy thật',
    diaDiem: null,
    loaiThietBi: 'RJ',
    isActive: false,
    lanDongBoCuoi: null,
    createdAt: '2026-10-20T08:00:00',
  };
  query.mockResolvedValue({
    data: { danhSachMayChamCong: { isResults: true, data: [null, row] } },
  });
  expect(await getAttendanceDevices()).toEqual([row]);
  expect(query).toHaveBeenCalledWith({
    query: ATTENDANCE_DEVICES,
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  for (const field of [
    'maThietBi',
    'tenThietBi',
    'diaDiem',
    'loaiThietBi',
    'isActive',
    'lanDongBoCuoi',
    'createdAt',
  ])
    expect(print(ATTENDANCE_DEVICES)).toContain(field);
});
it('accepts empty results and surfaces business, malformed and transport failures', async () => {
  query.mockResolvedValueOnce({ data: { danhSachMayChamCong: { isResults: true, data: [] } } });
  expect(await getAttendanceDevices()).toEqual([]);
  query.mockResolvedValueOnce({
    data: { danhSachMayChamCong: { isResults: false, message: 'ACCESS_DENIED', data: null } },
  });
  await expect(getAttendanceDevices()).rejects.toThrow('ACCESS_DENIED');
  query.mockResolvedValueOnce({ data: { danhSachMayChamCong: { isResults: true, data: null } } });
  await expect(getAttendanceDevices()).rejects.toThrow();
  query.mockRejectedValueOnce(new Error('Offline'));
  await expect(getAttendanceDevices()).rejects.toThrow('Offline');
});
