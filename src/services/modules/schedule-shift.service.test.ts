import { describe, expect, it, vi } from 'vitest';
const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query } }));
import { getScheduleDepartments, getDepartmentShifts } from './schedule-shift.service';
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
