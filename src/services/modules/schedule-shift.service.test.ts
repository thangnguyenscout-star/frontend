import { describe, expect, it, vi } from 'vitest';
const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query } }));
import {
  getScheduleDepartments,
  getDepartmentShifts,
  getScheduleDepartmentGroups,
} from './schedule-shift.service';
describe('department shift API', () => {
  it('passes the parent department code and maps overnight shifts', async () => {
    query.mockResolvedValueOnce({
      data: {
        caLamViec: {
          isResults: true,
          data: [
            null,
            {
              maCa: 'NXX',
              tenCa: 'Night',
              quaNgay: 1,
              gioBatDau: '20:30:00',
              gioKetThuc: '04:30:00',
            },
          ],
        },
      },
    });
    const shifts = await getDepartmentShifts('BP01', 'ROTATING');
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ variables: { maBoPhan: 'BP01' } }),
    );
    expect(shifts[0]).toMatchObject({
      id: 'NXX',
      code: 'NXX',
      startTime: '20:30',
      endTime: '04:30',
      crossDay: true,
    });
  });
  it('surfaces API failures instead of returning mock shifts', async () => {
    query.mockResolvedValueOnce({
      data: { caLamViec: { isResults: false, message: 'Unavailable', data: null } },
    });
    await expect(getDepartmentShifts(null, 'ROTATING')).rejects.toThrow('Unavailable');
  });
});

it('loads department codes and names from danhSachBoPhan', async () => {
  query.mockResolvedValueOnce({
    data: {
      danhSachBoPhan: {
        isResults: true,
        data: [null, { maBoPhan: 'BP01', tenBoPhan: 'Reception' }],
      },
    },
  });
  expect(await getScheduleDepartments()).toEqual([{ code: 'BP01', name: 'Reception' }]);
});
it('surfaces department API failures', async () => {
  query.mockResolvedValueOnce({
    data: { danhSachBoPhan: { isResults: false, message: 'Unavailable', data: null } },
  });
  await expect(getScheduleDepartments()).rejects.toThrow('Unavailable');
});

it('requests active shifts and derives administrative type and display symbol from the API', async () => {
  query.mockResolvedValueOnce({
    data: {
      caLamViec: {
        isResults: true,
        data: [
          {
            maCa: 'CA01',
            kyHieuCa: 'HC',
            tenCa: 'Hành chính',
            loaiHinhLamViec: 1,
            gioBatDau: '08:00:00',
            gioKetThuc: '17:00:00',
            isActive: 1,
          },
        ],
      },
    },
  });
  const shifts = await getDepartmentShifts('BP01', 'ROTATING');
  expect(shifts[0]).toMatchObject({ id: 'CA01', code: 'HC', scheduleType: 'ADMINISTRATIVE' });
  expect(query.mock.lastCall?.[0].query.loc.source.body).toContain('isActive: true');
  expect(query.mock.lastCall?.[0].variables).toEqual({ maBoPhan: 'BP01' });
});

it('groups by department code from a single all-department query and deduplicates shifts', async () => {
  query.mockClear();
  query.mockResolvedValueOnce({
    data: {
      caLamViec: {
        isResults: true,
        data: [
          { maCa: 'CA01', maBoPhan: 'BP01', loaiHinhLamViec: 1 },
          { maCa: 'CA02', maBoPhan: 'BP01', loaiHinhLamViec: '1' },
          { maCa: 'CA03', maBoPhan: 'BP02', loaiHinhLamViec: 'C' },
          { maCa: 'CA04', maBoPhan: null, loaiHinhLamViec: 1 },
          { maCa: 'CA05', maBoPhan: 'BP03', loaiHinhLamViec: 9 },
        ],
      },
    },
  });
  const departments = [
    { code: 'BP01', name: 'Văn phòng' },
    { code: 'BP02', name: 'Lễ tân' },
    { code: 'BP03', name: 'Nhà hàng' },
  ];
  const result = await getScheduleDepartmentGroups(departments);
  expect(result.groups[0].departments).toEqual([departments[0]]);
  expect(result.groups[1].departments).toEqual([departments[1]]);
  expect(result.unavailable).toEqual([departments[2]]);
  expect(query).toHaveBeenCalledTimes(1);
  expect(query.mock.lastCall?.[0].variables).toEqual({ maBoPhan: null });
});
it('surfaces all-department API errors for retry', async () => {
  query.mockResolvedValueOnce({
    data: { caLamViec: { isResults: false, message: 'Unavailable', data: null } },
  });
  await expect(getScheduleDepartmentGroups([])).rejects.toThrow('Unavailable');
});
