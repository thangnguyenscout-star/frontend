import { expect, it, vi } from 'vitest';
vi.mock('@/stores/auth.store', () => ({ useAuthStore: vi.fn() }));
vi.mock('@/stores/permission.store', () => ({ usePermissionStore: vi.fn() }));
vi.mock('vue-router', async (original) => {
  const actual = await original<typeof import('vue-router')>();
  return { ...actual, createWebHistory: actual.createMemoryHistory };
});
import { router } from './index';
it('keeps assignment, reports and exchange routes while retiring the leave calendar', () => {
  for (const page of ['assign', 'reports', 'exchange'])
    expect(router.resolve('/schedules/' + page).meta.schedulePage).toBe(page);
  const retired = router.resolve('/schedules/leave-calendar').matched.at(-1)!;
  expect(retired.path).toBe('/schedules/:id');
  expect(retired.redirect).toBe('/schedules');
  expect(router.resolve('/leave').meta.module).toBe('leave');
});
