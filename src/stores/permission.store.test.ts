import { beforeEach, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
vi.mock('@/services/graphql/apollo', () => ({
  apolloClient: { mutate: vi.fn(), clearStore: vi.fn().mockResolvedValue(undefined) },
}));
const storage = new Map<string, string>();
vi.stubGlobal('sessionStorage', {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
const { usePermissionStore } = await import('./permission.store');
const { useAuthStore } = await import('./auth.store');
const { saveSession, clearSession } = await import('@/services/auth/auth-session');
const { resolveRole } = await import('@/services/auth/auth.service');
function login(roleId: string | number | null) {
  saveSession({
    userName: 'tester',
    maNhanVien: 'NV1',
    roleId,
    loginDateTime: null,
    accessToken: 'access',
    refeshToken: 'refresh',
  });
}
beforeEach(() => {
  clearSession();
  setActivePinia(createPinia());
});
it.each([
  [0, 'Admin'],
  [1, 'Owner'],
  [2, 'HR Manager'],
  [3, 'HR Staff'],
  [4, 'HOD'],
  [5, 'Staff'],
])('maps numeric and string role %s to %s', (id, name) => {
  expect(resolveRole(id)).toBe(name);
  expect(resolveRole(String(id))).toBe(name);
});
it.each([0, 1, 2, '0', '1', '2'])('grants management permissions to role %s', (id) => {
  login(id);
  const permissions = usePermissionStore();
  for (const module of ['dashboard', 'employees', 'contracts', 'payroll', 'reports']) {
    for (const action of ['view', 'create', 'edit', 'approve', 'delete']) {
      expect(permissions.can(module, action)).toBe(true);
    }
  }
});
it('preserves the restrictions for HR Staff, HOD and Staff', () => {
  const permissions = usePermissionStore();
  login(3);
  expect(permissions.can('employees', 'edit')).toBe(true);
  expect(permissions.can('employees', 'delete')).toBe(false);
  expect(permissions.can('contracts', 'approve')).toBe(false);
  login(4);
  expect(permissions.can('leave', 'approve')).toBe(true);
  expect(permissions.can('payroll')).toBe(false);
  login(5);
  expect(permissions.can('leave', 'create')).toBe(true);
  expect(permissions.can('employees', 'edit')).toBe(false);
});
it('reacts immediately to a role change from login or refresh', () => {
  login(0);
  const auth = useAuthStore();
  const permissions = usePermissionStore();
  expect(auth.role).toBe('Admin');
  expect(permissions.can('payroll', 'approve')).toBe(true);
  login(5);
  expect(auth.role).toBe('Staff');
  expect(permissions.can('payroll', 'approve')).toBe(false);
});
it('denies protected modules for missing or unknown roles and logged-out users', () => {
  const permissions = usePermissionStore();
  for (const id of [null, 6, -1, '', 'unknown', 'constructor']) {
    login(id);
    expect(permissions.can('employees', 'delete')).toBe(false);
  }
  clearSession();
  expect(permissions.can('dashboard')).toBe(false);
});
