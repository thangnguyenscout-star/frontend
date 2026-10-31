import { expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ role: 'HOD', allow: true }));
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    get role() {
      return state.role;
    },
  }),
}));
vi.mock('@/composables/usePermission', () => ({
  usePermission: () => ({
    can: (_module: string, action: string) =>
      state.allow && (state.role !== 'HR Staff' || action !== 'approve'),
  }),
}));
import { usePeriodPermissions } from './usePeriodPermissions';
it.each(['HOD', 'Staff'])('keeps %s read-only regardless of broad frontend permissions', (role) => {
  state.role = role;
  state.allow = true;
  const p = usePeriodPermissions();
  expect(p.canCreate.value).toBe(false);
  expect(p.canClose.value).toBe(false);
  expect(p.canLock.value).toBe(false);
});
it('allows HR Staff to create but not close/lock', () => {
  state.role = 'HR Staff';
  state.allow = true;
  const p = usePeriodPermissions();
  expect(p.canCreate.value).toBe(true);
  expect(p.canClose.value).toBe(false);
  expect(p.canLock.value).toBe(false);
});
it('requires both manager role and permission grant', () => {
  state.role = 'HR Manager';
  state.allow = false;
  let p = usePeriodPermissions();
  expect(p.canClose.value).toBe(false);
  state.allow = true;
  p = usePeriodPermissions();
  expect(p.canClose.value).toBe(true);
  expect(p.canLock.value).toBe(true);
});
