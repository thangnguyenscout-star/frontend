import { expect, it, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null });
const { getErrorMessage, getApiErrorMessage } = await import('./error-message');
it.each([
  ['vi', 'Tên đăng nhập hoặc mật khẩu không chính xác.'],
  ['en', 'Invalid username or password.'],
  ['fr', "Nom d'utilisateur ou mot de passe incorrect."],
])('resolves authentication codes in %s', (locale, message) => {
  expect(getErrorMessage('AUTH_INVALID_CREDENTIALS', locale)).toBe(message);
});
it('resolves common codes and falls back for unknown codes/locales', () => {
  expect(getErrorMessage('COMMON_REQUIRED', 'en')).toBe('Please complete all required fields.');
  expect(getErrorMessage('UNRECOGNIZED', 'fr')).toBe('Une erreur inconnue est survenue.');
  expect(getErrorMessage('UNRECOGNIZED', 'xx')).toBe('An unknown error occurred.');
});

const { i18n } = await import('@/locales');
const { normalizeErrorCode, normalizeApiErrors, normalizeBusinessErrors } =
  await import('@/services/graphql/errors');
const systemMessages = {
  en: (await import('@/locales/en/system.json')).default,
  vi: (await import('@/locales/vi/system.json')).default,
  fr: (await import('@/locales/fr/system.json')).default,
};
it.each(['en', 'vi', 'fr'] as const)('translates all 50 system codes in %s', (locale) => {
  const messages = systemMessages[locale];
  expect(Object.keys(messages)).toHaveLength(50);
  expect(Object.keys(messages).sort()).toEqual(Object.keys(systemMessages.en).sort());
  for (const [code, message] of Object.entries(messages)) {
    expect(message.trim()).not.toBe('');
    expect(getErrorMessage(code, locale)).toBe(message);
    expect(normalizeErrorCode(code)).toBe(code);
  }
});
it.each([
  'TUYENDUNG_NOT_FOUND',
  new Error('TUYENDUNG_NOT_FOUND'),
  { code: 'TUYENDUNG_NOT_FOUND' },
  { errors: [{ code: 'TUYENDUNG_NOT_FOUND' }] },
  { graphQLErrors: [{ extensions: { code: 'TUYENDUNG_NOT_FOUND' }, message: 'Internal details' }] },
  { graphQLErrors: [{ message: 'TUYENDUNG_NOT_FOUND' }] },
])('resolves business error shapes without displaying raw codes', (error) => {
  expect(getApiErrorMessage(error, 'fr')).toBe(systemMessages.fr.TUYENDUNG_NOT_FOUND);
});
it('preserves backend business codes and fields during normalization', () => {
  expect(normalizeBusinessErrors([{ code: 'INVALID_INPUT', field: 'name' }])).toEqual([
    { code: 'INVALID_INPUT', field: 'name' },
  ]);
  expect(
    normalizeApiErrors({ graphQLErrors: [{ extensions: { code: 'DUPLICATE_BO_PHAN' } }] }),
  ).toEqual([{ code: 'DUPLICATE_BO_PHAN' }]);
});
it('uses the active language at call time', () => {
  const original = i18n.global.locale.value;
  try {
    for (const locale of ['vi', 'en', 'fr'] as const) {
      i18n.global.locale.value = locale;
      expect(getApiErrorMessage(new Error('HOPDONG_INVALID_SALARY'))).toBe(
        systemMessages[locale].HOPDONG_INVALID_SALARY,
      );
    }
  } finally {
    i18n.global.locale.value = original;
  }
});
it('handles unknown codes, network errors, and local validation messages', () => {
  expect(getApiErrorMessage('FUTURE_ERROR', 'en')).toBe('An unknown error occurred.');
  expect(getApiErrorMessage(null, 'en')).toBe('An unknown error occurred.');
  expect(getApiErrorMessage({ networkError: { statusCode: 503 } }, 'en')).toBe(
    'An internal error occurred.',
  );
  expect(getApiErrorMessage({ networkError: {} }, 'en')).toBe('Unable to connect to the server.');
  expect(getApiErrorMessage({ graphQLErrors: [{ message: 'SQL stack trace' }] }, 'en')).toBe(
    'An unknown error occurred.',
  );
  expect(getApiErrorMessage(new Error('Vui lòng chọn ngày hợp lệ.'), 'vi')).toBe(
    'Vui lòng chọn ngày hợp lệ.',
  );
  expect(normalizeErrorCode('toString')).toBe('COMMON_UNKNOWN_ERROR');
});

it('resolves system errors in shared screens while preserving HTTP error keys', async () => {
  const { ApiError, apiErrorKey } = await import('@/services/api/apiErrorHandler');
  expect(apiErrorKey(new ApiError(409))).toBe('errors.409');
  expect(apiErrorKey(new Error('BO_PHAN_NOT_FOUND'))).toBe(getErrorMessage('BO_PHAN_NOT_FOUND'));
});
