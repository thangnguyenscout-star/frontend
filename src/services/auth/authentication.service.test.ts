import { beforeEach, describe, expect, it, vi } from 'vitest';
const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { mutate } }));
import { authentication } from './authentication.service';
import { normalizeApiErrors } from '@/services/graphql/errors';
const input = { userName: 'test-user', password: 'test-password' };
const data = {
  userName: 'test-user',
  maNhanVien: 'NV1',
  roleId: 'ADMIN',
  loginDateTime: '2026-09-19',
  accessToken: 'access',
  refeshToken: 'refresh',
};
describe('authentication', () => {
  beforeEach(() => {
    mutate.mockReset();
  });
  it('uses variables, a public request, and no cache for credentials/tokens', async () => {
    mutate.mockResolvedValue({ data: { authentication: { isResults: true, data } } });
    expect(await authentication(input)).toEqual({ isResults: true, data, errors: [] });
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { loginAccount: input },
        context: { public: true },
        fetchPolicy: 'no-cache',
      }),
    );
  });
  it('returns business codes without displaying backend messages', async () => {
    mutate.mockResolvedValue({
      data: {
        authentication: {
          isResults: false,
          data: null,
          errors: [
            { code: 'AUTH_INVALID_CREDENTIALS', field: 'password', message: 'raw backend text' },
          ],
        },
      },
    });
    expect(await authentication(input)).toEqual({
      isResults: false,
      data: null,
      errors: [{ code: 'AUTH_INVALID_CREDENTIALS', field: 'password' }],
    });
  });
  it.each([null, { ...data, accessToken: '' }, { ...data, refeshToken: null }])(
    'rejects incomplete successful responses',
    async (invalid) => {
      mutate.mockResolvedValue({ data: { authentication: { isResults: true, data: invalid } } });
      expect((await authentication(input)).errors[0]?.code).toBe('COMMON_INVALID_DATA');
    },
  );
  it('handles missing GraphQL data', async () => {
    mutate.mockResolvedValue({ data: null });
    expect((await authentication(input)).isResults).toBe(false);
  });
  it('normalizes GraphQL errors', async () => {
    mutate.mockRejectedValue({
      graphQLErrors: [{ extensions: { code: 'INTERNAL_SERVER_ERROR' } }],
    });
    expect((await authentication(input)).errors).toEqual([{ code: 'COMMON_INTERNAL_ERROR' }]);
  });
  it('normalizes network errors and allows the next attempt', async () => {
    mutate.mockRejectedValueOnce({ networkError: new Error('Failed to fetch') });
    expect((await authentication(input)).errors).toEqual([{ code: 'COMMON_NETWORK_ERROR' }]);
    mutate.mockResolvedValueOnce({ data: { authentication: { isResults: true, data } } });
    expect((await authentication(input)).isResults).toBe(true);
  });
  it.each([
    [401, 'COMMON_UNAUTHORIZED'],
    [403, 'COMMON_FORBIDDEN'],
    [500, 'COMMON_INTERNAL_ERROR'],
    [400, 'COMMON_INVALID_DATA'],
  ])('handles HTTP %s', (statusCode, code) => {
    expect(normalizeApiErrors({ networkError: { statusCode } })).toEqual([{ code }]);
  });
});

it('normalizes AUTH_NOT_AUTHENTICATED returned by Hot Chocolate', async () => {
  mutate.mockRejectedValue({
    graphQLErrors: [{ extensions: { code: 'AUTH_NOT_AUTHENTICATED' } }],
  });
  expect(await authentication(input)).toEqual({
    isResults: false,
    data: null,
    errors: [{ code: 'COMMON_UNAUTHORIZED' }],
  });
});
