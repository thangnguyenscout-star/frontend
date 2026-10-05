import systemMessages from '@/locales/en/system.json';
import type { BusinessError } from '@/types/authentication';
const codes: Record<string, string> = {
  INTERNAL_SERVER_ERROR: 'COMMON_INTERNAL_ERROR',
  UNAUTHENTICATED: 'COMMON_UNAUTHORIZED',
  AUTH_NOT_AUTHENTICATED: 'COMMON_UNAUTHORIZED',
  UNAUTHORIZED: 'COMMON_UNAUTHORIZED',
  FORBIDDEN: 'COMMON_FORBIDDEN',
  BAD_USER_INPUT: 'COMMON_INVALID_DATA',
  GRAPHQL_VALIDATION_FAILED: 'COMMON_INVALID_DATA',
  GRAPHQL_PARSE_FAILED: 'COMMON_INVALID_DATA',
};
export function normalizeErrorCode(code: unknown): string {
  if (typeof code !== 'string') return 'COMMON_UNKNOWN_ERROR';
  return (
    (Object.hasOwn(codes, code) ? codes[code] : undefined) ??
    (Object.hasOwn(systemMessages, code) || /^(AUTH_|COMMON_)/.test(code)
      ? code
      : 'COMMON_UNKNOWN_ERROR')
  );
}
export function normalizeApiErrors(error: unknown): BusinessError[] {
  if (!error || typeof error !== 'object') return [{ code: 'COMMON_UNKNOWN_ERROR' }];
  const value = error as {
    graphQLErrors?: readonly { extensions?: Record<string, unknown> }[];
    networkError?: { statusCode?: number } | null;
  };
  if (value.graphQLErrors?.length) {
    return value.graphQLErrors.map((item) => ({ code: normalizeErrorCode(item.extensions?.code) }));
  }
  if (value.networkError) {
    const status = value.networkError.statusCode;
    const code =
      status === 401
        ? 'COMMON_UNAUTHORIZED'
        : status === 403
          ? 'COMMON_FORBIDDEN'
          : status && status >= 500
            ? 'COMMON_INTERNAL_ERROR'
            : status && status >= 400
              ? 'COMMON_INVALID_DATA'
              : 'COMMON_NETWORK_ERROR';
    return [{ code }];
  }
  return [{ code: 'COMMON_UNKNOWN_ERROR' }];
}
export function normalizeBusinessErrors(
  errors: readonly BusinessError[] | null | undefined,
): BusinessError[] {
  return errors?.length
    ? errors.map((error) => ({ code: normalizeErrorCode(error.code), field: error.field }))
    : [{ code: 'COMMON_UNKNOWN_ERROR' }];
}
