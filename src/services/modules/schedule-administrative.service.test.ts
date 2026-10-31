import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate } }));
import { currentAdministrativePeriod, validateAdministrativePeriod, createAdministrativeSchedule, CREATE_ADMINISTRATIVE_SCHEDULE } from './schedule-administrative.service';
beforeEach(() => { mutate.mockReset(); vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-08T00:00:00Z')); });
afterEach(() => vi.useRealTimers());
it('uses UTC+07 at a month/year boundary', () => {
 expect(currentAdministrativePeriod(new Date('2026-12-31T18:00:00Z'))).toEqual({ month: 1, year: 2027 });
});
it.each([[9, 2026], [12, 2025], [0, 2027], [13, 2027], [10, null], [null, 2027], [10, 2026.5]])('rejects invalid or past period %s/%s before calling API', async (month, year) => {
 await expect(createAdministrativeSchedule(month, year)).rejects.toThrow(); expect(mutate).not.toHaveBeenCalled();
});
it('accepts the current month and a future year', () => {
 expect(() => validateAdministrativePeriod(10, 2026)).not.toThrow(); expect(() => validateAdministrativePeriod(1, 2027)).not.toThrow();
});
it('sends only month and year and returns the success message', async () => {
 mutate.mockResolvedValueOnce({ data: { createLichHanhChinh: { isResults: true, message: 'Created' } } });
 await expect(createAdministrativeSchedule(10, 2026)).resolves.toBe('Created');
 expect(mutate).toHaveBeenCalledWith({ mutation: CREATE_ADMINISTRATIVE_SCHEDULE, variables: { thang: 10, nam: 2026 }, errorPolicy: 'none' });
});
it('propagates business and transport errors for an error toast', async () => {
 mutate.mockResolvedValueOnce({ data: { createLichHanhChinh: { isResults: false, message: 'Rejected' } } });
 await expect(createAdministrativeSchedule(10, 2026)).rejects.toThrow('Rejected');
 mutate.mockRejectedValueOnce(new Error('Network failure'));
 await expect(createAdministrativeSchedule(10, 2026)).rejects.toThrow('Network failure');
});
