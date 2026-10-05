import { apolloClient } from '@/services/graphql/apollo';
import { REFRESH_TOKEN_MUTATION } from '@/graphql/authentication/refresh-token.mutation';
import type { AuthenticationData } from '@/types/authentication';
import { ApiError } from '@/services/api/apiErrorHandler';
import { normalizeApiErrors } from '@/services/graphql/errors';
import { tokenService } from './token.service';
import { expireSession, saveSession, sessionRevision } from './auth-session';

let pending: { revision: number; promise: Promise<void> } | undefined;
export function refreshSession(): Promise<void> {
  const revision = sessionRevision();
  if (pending?.revision === revision) return pending.promise;
  const promise = refresh(revision);
  const current = { revision, promise };
  pending = current;
  void promise
    .finally(() => {
      if (pending === current) pending = undefined;
    })
    .catch(() => undefined);
  return promise;
}
async function refresh(revision: number): Promise<void> {
  const accessToken = tokenService.get();
  const refreshToken = tokenService.getRefresh();
  try {
    if (!accessToken || !refreshToken) throw new ApiError(401);
    const response = await apolloClient.mutate<{
      refreshToken: {
        isResults: boolean;
        message?: string | null;
        data: AuthenticationData | null;
      };
    }>({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { accessToken, refreshToken },
      context: { public: true },
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    });
    // A logout or a different login must not be overwritten by this response.
    if (sessionRevision() !== revision) throw new ApiError(409);
    const result = response.data?.refreshToken;
    if (result?.isResults !== true) throw new ApiError(401);
    if (
      typeof result.data?.accessToken !== 'string' ||
      !result.data.accessToken.trim() ||
      typeof result.data.refeshToken !== 'string' ||
      !result.data.refeshToken.trim()
    ) {
      throw new ApiError(502);
    }
    saveSession(result.data, true);
  } catch (error) {
    if (sessionRevision() !== revision) throw new ApiError(409);
    const codes = normalizeApiErrors(error).map((item) => item.code);
    const denied =
      error instanceof ApiError
        ? error.status === 401
        : codes.some((code) =>
            [
              'COMMON_UNAUTHORIZED',
              'AUTH_TOKEN_EXPIRED',
              'AUTH_TOKEN_INVALID',
              'AUTH_REFRESH_TOKEN_INVALID',
              'AUTH_REFRESH_TOKEN_EXPIRED',
            ].includes(code),
          );
    if (denied) expireSession();
    // Network/server failures keep the current session so the user can retry.
    throw error;
  }
}
