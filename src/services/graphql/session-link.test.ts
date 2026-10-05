import { ApolloLink, Observable, execute, gql, type FetchResult } from '@apollo/client/core';
import { beforeEach, expect, it, vi } from 'vitest';
const storage = new Map<string, string>();
vi.stubGlobal('sessionStorage', {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
const { createSessionLink } = await import('./session-link');
const { saveSession, clearSession } = await import('../auth/auth-session');
const profile = {
  userName: 'user',
  maNhanVien: null,
  roleId: 'ADMIN',
  loginDateTime: null,
  accessToken: 'old',
  refeshToken: 'refresh',
};
const expired: FetchResult = {
  errors: [{ message: 'expired', extensions: { code: 'AUTH_TOKEN_EXPIRED' } }],
};
beforeEach(() => {
  clearSession();
  saveSession(profile);
});
function send(results: Array<FetchResult | Error>, context = {}) {
  const tokens: Array<string | undefined> = [];
  const refresh = vi.fn(async () => {
    saveSession({ ...profile, accessToken: 'new' }, true);
  });
  const expire = vi.fn();
  const transport = new ApolloLink(
    () =>
      new Observable((observer) => {
        tokens.push(storage.get('hr-access'));
        const result = results.shift();
        if (result instanceof Error) observer.error(result);
        else {
          observer.next(result!);
          observer.complete();
        }
      }),
  );
  const promise = new Promise<FetchResult>((resolve, reject) => {
    execute(createSessionLink(refresh, expire).concat(transport), {
      query: gql`
        query Test {
          test
        }
      `,
      context,
    }).subscribe({ next: resolve, error: reject });
  });
  return { promise, refresh, expire, tokens };
}
it('refreshes and retries a GraphQL authentication error with the rotated token', async () => {
  const run = send([expired, { data: { test: true } }]);
  expect(await run.promise).toEqual({ data: { test: true } });
  expect(run.tokens).toEqual(['old', 'new']);
  expect(run.refresh).toHaveBeenCalledTimes(1);
});
it('retries HTTP 401 and business token-expired errors', async () => {
  for (const error of [
    Object.assign(new Error('401'), { statusCode: 401 }),
    { data: { test: { isResults: false, errors: [{ code: 'AUTH_TOKEN_EXPIRED' }] } } },
  ]) {
    const run = send([error, { data: { test: true } }]);
    await expect(run.promise).resolves.toEqual({ data: { test: true } });
    expect(run.refresh).toHaveBeenCalledTimes(1);
  }
});
it('does not refresh public login/refresh operations', async () => {
  const run = send([expired], { public: true });
  expect(await run.promise).toEqual(expired);
  expect(run.refresh).not.toHaveBeenCalled();
});
it('retries at most once and expires a still-unauthorized session', async () => {
  const run = send([expired, expired]);
  expect(await run.promise).toEqual(expired);
  expect(run.refresh).toHaveBeenCalledTimes(1);
  expect(run.expire).toHaveBeenCalledTimes(1);
  expect(run.tokens).toHaveLength(2);
});
it('does not retry unrelated network errors', async () => {
  const error = new Error('offline');
  const run = send([error]);
  await expect(run.promise).rejects.toBe(error);
  expect(run.refresh).not.toHaveBeenCalled();
});

it('refreshes AUTH_NOT_AUTHENTICATED only for private requests', async () => {
  const denied: FetchResult = {
    errors: [{ message: 'denied', extensions: { code: 'AUTH_NOT_AUTHENTICATED' } }],
  };
  const privateRun = send([denied, { data: { test: true } }]);
  await expect(privateRun.promise).resolves.toEqual({ data: { test: true } });
  expect(privateRun.refresh).toHaveBeenCalledTimes(1);
  const publicRun = send([denied], { public: true });
  await expect(publicRun.promise).resolves.toEqual(denied);
  expect(publicRun.refresh).not.toHaveBeenCalled();
});
