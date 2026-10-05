import { beforeEach, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
const { mutate, clearStore } = vi.hoisted(() => ({
  mutate: vi.fn(),
  clearStore: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate, clearStore } }));
const storage = new Map<string, string>();
vi.stubGlobal('sessionStorage', {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
const { useAuthStore } = await import('./auth.store');
const { clearSession } = await import('@/services/auth/auth-session');
const data = {
  userName: 'tester',
  maNhanVien: 'NV1',
  roleId: 0,
  loginDateTime: '2026-09-19',
  accessToken: 'access',
  refeshToken: 'refresh',
};
beforeEach(() => {
  clearSession();
  storage.clear();
  mutate.mockReset();
  setActivePinia(createPinia());
});
it('persists tokens and profile, restores the session, and clears them on logout', async () => {
  mutate.mockResolvedValue({ data: { authentication: { isResults: true, data } } });
  const store = useAuthStore();
  await store.login({ userName: 'tester', password: 'secret-password' });
  expect(store.authenticated).toBe(true);
  expect(store.role).toBe('Admin');
  expect(storage.get('hr-access')).toBe('access');
  expect(storage.get('hr-refresh-session')).toBe('refresh');
  expect(JSON.stringify([...storage])).not.toContain('secret-password');
  expect(storage.get('hr-user')).not.toContain('accessToken');
  setActivePinia(createPinia());
  const restored = useAuthStore();
  expect(restored.userName).toBe('tester');
  expect(restored.authenticated).toBe(true);
  restored.logout();
  expect(restored.authenticated).toBe(false);
  expect(restored.user).toBe(null);
  expect(storage.size).toBe(0);
});
it('does not persist tokens on business failure', async () => {
  mutate.mockResolvedValue({
    data: {
      authentication: {
        isResults: false,
        data: null,
        errors: [{ code: 'AUTH_USER_LOCKED' }],
      },
    },
  });
  const store = useAuthStore();
  await store.login({ userName: 'tester', password: 'secret-password' });
  expect(store.authenticated).toBe(false);
  expect(storage.size).toBe(0);
});
it('rejects stale mock sessions and malformed stored profiles', () => {
  storage.set('hr-access', 'old');
  storage.set('hr-role', 'HR Admin');
  storage.set('hr-refresh-session', 'mock-session');
  storage.set('hr-user', '{broken');
  expect(useAuthStore().authenticated).toBe(false);
});
