import { ApiError } from './apiErrorHandler';
import { publicApi } from './publicApi';
import { tokenService } from '../auth/token.service';
import { expireSession, sessionGeneration, sessionRevision } from '../auth/auth-session';

export async function privateApi<T>(request: () => Promise<T>): Promise<T> {
  const generation = sessionGeneration();
  const token = tokenService.get();
  if (!token) throw new ApiError(401);
  try {
    return await request();
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    if (generation !== sessionGeneration()) throw new ApiError(409);
    if (tokenService.get() === token) await publicApi.refresh();
    if (generation !== sessionGeneration()) throw new ApiError(409);
    if (!tokenService.get()) throw new ApiError(401);
    const revision = sessionRevision();
    try {
      return await request();
    } catch (retryError) {
      if (
        retryError instanceof ApiError &&
        retryError.status === 401 &&
        revision === sessionRevision()
      )
        expireSession();
      throw retryError;
    }
  }
}
