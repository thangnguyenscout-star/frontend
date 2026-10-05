import { beforeEach, expect, it, vi } from 'vitest';
const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate } }));
const storage = new Map<string, string>();
vi.stubGlobal('sessionStorage', {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
const dispatchEvent = vi.fn();
vi.stubGlobal('window', { dispatchEvent });
const { saveSession, clearSession, sessionUser } = await import('./auth-session');
const { refreshSession } = await import('./refresh-token.service');
const data = {
  userName: 'tester',
  maNhanVien: 'NV1',
  roleId: 'ADMIN',
  loginDateTime: '2026-09-19',
  accessToken: 'old-access',
  refeshToken: 'old-refresh',
};
const rotated = {
  ...data,
  roleId: 'Employee',
  accessToken: 'new-access',
  refeshToken: 'new-refresh',
};
beforeEach(() => {
  clearSession();
  saveSession(data);
  mutate.mockReset();
  dispatchEvent.mockClear();
});
it('sends token variables publicly, rotates both tokens and updates the reactive user', async () => {
  mutate.mockResolvedValue({ data: { refreshToken: { isResults: true, data: rotated } } });
  await refreshSession();
  expect(mutate).toHaveBeenCalledWith(
    expect.objectContaining({
      variables: { accessToken: 'old-access', refreshToken: 'old-refresh' },
      context: { public: true },
      fetchPolicy: 'no-cache',
    }),
  );
  expect(storage.get('hr-access')).toBe('new-access');
  expect(storage.get('hr-refresh-session')).toBe('new-refresh');
  expect(sessionUser.value?.roleId).toBe('Employee');
});
it('shares one refresh between concurrent callers', async () => {
  mutate.mockResolvedValue({ data: { refreshToken: { isResults: true, data: rotated } } });
  await Promise.all([refreshSession(), refreshSession(), refreshSession()]);
  expect(mutate).toHaveBeenCalledTimes(1);
});
it('clears the session on business rejection without using the raw message', async () => {
  mutate.mockResolvedValue({
    data: { refreshToken: { isResults: false, message: 'raw backend text', data: null } },
  });
  await expect(refreshSession()).rejects.toMatchObject({ status: 401 });
  expect(storage.size).toBe(0);
  expect(sessionUser.value).toBe(null);
  expect(dispatchEvent).toHaveBeenCalledTimes(1);
});
it.each([
  { networkError: new Error('offline') },
  { networkError: { statusCode: 500 } },
  { graphQLErrors: [{ extensions: { code: 'INTERNAL_SERVER_ERROR' } }] },
])('preserves the session for transient failures', async (error) => {
  mutate.mockRejectedValue(error);
  await expect(refreshSession()).rejects.toEqual(error);
  expect(storage.get('hr-access')).toBe('old-access');
  expect(dispatchEvent).not.toHaveBeenCalled();
});
it('expires the session on HTTP 401', async () => {
  mutate.mockRejectedValue({ networkError: { statusCode: 401 } });
  await expect(refreshSession()).rejects.toBeDefined();
  expect(sessionUser.value).toBe(null);
});
it('rejects incomplete successful responses without replacing tokens', async () => {
  mutate.mockResolvedValue({
    data: { refreshToken: { isResults: true, data: { ...rotated, refeshToken: '' } } },
  });
  await expect(refreshSession()).rejects.toMatchObject({ status: 502 });
  expect(storage.get('hr-access')).toBe('old-access');
});
it.each(['logout', 'new login'])('ignores a stale response after %s', async (action) => {
  let resolve!: (value: unknown) => void;
  mutate.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const pending = refreshSession();
  clearSession();
  if (action === 'new login') saveSession({ ...data, accessToken: 'other-session' });
  resolve({ data: { refreshToken: { isResults: true, data: rotated } } });
  await expect(pending).rejects.toMatchObject({ status: 409 });
  expect(storage.get('hr-access')).toBe(action === 'new login' ? 'other-session' : undefined);
  expect(dispatchEvent).not.toHaveBeenCalled();
});
