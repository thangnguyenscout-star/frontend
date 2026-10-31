import { describe, expect, it, vi } from 'vitest';
import { print } from 'graphql';
const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate } }));
import {
  canCreateRotatingWeek,
  createRotatingSchedule,
  CREATE_LICH_XOAY_CA,
} from './schedule-rotating.service';

describe('rotating schedule weeks', () => {
  it('allows the current week only on Monday and allows future weeks', () => {
    expect(canCreateRotatingWeek('2026-10-18', '2026-10-12')).toBe(true);
    expect(canCreateRotatingWeek('2026-10-18', '2026-10-13')).toBe(false);
    expect(canCreateRotatingWeek('2026-10-18', '2026-10-18')).toBe(false);
    expect(canCreateRotatingWeek('2026-10-19', '2026-10-18')).toBe(true);
    expect(canCreateRotatingWeek('2026-10-11', '2026-10-12')).toBe(false);
  });
  it('sends the selected department and full Monday–Sunday range', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-12T01:00:00Z'));
    try {
      const result = { isResults: true, message: 'Đã tạo', data: null };
      mutate.mockResolvedValueOnce({ data: { createLichXoayCa: result } });
      expect(await createRotatingSchedule('BP01', '2026-10-15')).toEqual(result);
      expect(print(CREATE_LICH_XOAY_CA)).toContain('$tuNgay: LocalDate!');
      expect(print(CREATE_LICH_XOAY_CA)).toContain('$denNgay: LocalDate!');
      expect(mutate).toHaveBeenLastCalledWith({
        mutation: CREATE_LICH_XOAY_CA,
        variables: {
          maBoPhan: 'BP01',
          tuNgay: '2026-10-12',
          denNgay: '2026-10-18',
        },
        errorPolicy: 'none',
      });
    } finally {
      vi.useRealTimers();
    }
  });
  it('blocks an ongoing week before calling the API', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-13T01:00:00Z'));
    mutate.mockClear();
    try {
      await expect(createRotatingSchedule('BP01', '2026-10-15')).rejects.toThrow('thứ Hai');
      expect(mutate).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
  it('keeps failure messages and warnings for the result dialog', async () => {
    const result = {
      isResults: false,
      message: 'Không đủ nhân viên',
      data: { canhBao: ['Thiếu ca'] },
    };
    mutate.mockResolvedValueOnce({ data: { createLichXoayCa: result } });
    expect(await createRotatingSchedule('BP01', '2099-01-05')).toEqual(result);
  });
});
