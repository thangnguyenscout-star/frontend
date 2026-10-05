import { normalizeApiErrors, normalizeErrorCode } from '@/services/graphql/errors';
import { i18n } from '@/locales';
export function getErrorMessage(code: string, locale: string = i18n.global.locale.value): string {
  const language = locale === 'vi' || locale === 'fr' ? locale : 'en';
  for (const key of [`system.${code}`, `authentication.${code}`, `common.${code}`]) {
    if (i18n.global.te(key, language)) return i18n.global.t(key, {}, { locale: language });
  }
  return i18n.global.t('common.COMMON_UNKNOWN_ERROR', {}, { locale: language });
}

/** Resolve business codes from payloads and Apollo errors using the active language. */
export function getApiErrorMessage(
  error: unknown,
  locale: string = i18n.global.locale.value,
): string {
  const value =
    error && typeof error === 'object'
      ? (error as {
          code?: unknown;
          message?: unknown;
          graphQLErrors?: { extensions?: { code?: unknown }; message?: unknown }[];
          networkError?: unknown;
          errors?: { code?: unknown }[];
        })
      : undefined;
  const candidates = [
    value?.code,
    ...(Array.isArray(value?.errors) ? value.errors.map((item) => item?.code) : []),
    ...(Array.isArray(value?.graphQLErrors)
      ? value.graphQLErrors.flatMap((item) => [item?.extensions?.code, item?.message])
      : []),
    typeof error === 'string' ? error : value?.message,
  ];
  for (const candidate of candidates) {
    const code = normalizeErrorCode(candidate);
    if (code !== 'COMMON_UNKNOWN_ERROR') return getErrorMessage(code, locale);
  }
  if (value?.graphQLErrors?.length || value?.networkError)
    return getErrorMessage(normalizeApiErrors(error)[0]!.code, locale);
  // Existing local validation messages remain readable; unknown codes use a translated fallback.
  const message = typeof error === 'string' ? error : value?.message;
  if (typeof message === 'string' && message.trim() && !/^[A-Z][A-Z0-9_]*$/.test(message))
    return message;
  return getErrorMessage('COMMON_UNKNOWN_ERROR', locale);
}
