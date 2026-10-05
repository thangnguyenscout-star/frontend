import { ApolloLink, Observable, type FetchResult } from '@apollo/client/core';
import { tokenService } from '../auth/token.service';
import { sessionGeneration, sessionRevision } from '../auth/auth-session';

const expiredCodes = new Set([
  'UNAUTHENTICATED',
  'AUTH_NOT_AUTHENTICATED',
  'UNAUTHORIZED',
  'COMMON_UNAUTHORIZED',
  'AUTH_TOKEN_EXPIRED',
  'AUTH_TOKEN_INVALID',
]);
function isExpiredResult(result: FetchResult): boolean {
  if (result.errors?.some((error) => expiredCodes.has(String(error.extensions?.code)))) return true;
  return Object.values(result.data ?? {}).some((value) => {
    if (!value || typeof value !== 'object') return false;
    const envelope = value as { isResults?: boolean; errors?: { code?: string }[] };
    return (
      envelope.isResults === false &&
      Array.isArray(envelope.errors) &&
      envelope.errors.some((error) => expiredCodes.has(error.code ?? ''))
    );
  });
}
export function createSessionLink(refresh: () => Promise<void>, expire: () => void): ApolloLink {
  return new ApolloLink((operation, forward) => {
    if (operation.getContext().public) return forward(operation);
    return new Observable((observer) => {
      let subscription: ReturnType<ReturnType<typeof forward>['subscribe']> | undefined;
      const generation = sessionGeneration();
      let cancelled = false;
      let refreshing = false;
      let retried = false;
      let sentToken = tokenService.get();
      let sentRevision = sessionRevision();
      const run = () => {
        if (cancelled) return;
        if (generation !== sessionGeneration()) {
          observer.error(new Error('AUTH_SESSION_CHANGED'));
          return;
        }
        refreshing = false;
        sentToken = tokenService.get();
        sentRevision = sessionRevision();
        subscription = forward(operation).subscribe({
          next(result) {
            if (isExpiredResult(result)) recover(() => observer.next(result));
            else observer.next(result);
          },
          error(error) {
            if (error?.statusCode === 401) recover(() => observer.error(error));
            else observer.error(error);
          },
          complete() {
            if (!refreshing) observer.complete();
          },
        });
      };
      const recover = (fail: () => void) => {
        if (generation !== sessionGeneration()) {
          observer.error(new Error('AUTH_SESSION_CHANGED'));
          return;
        }
        if (retried || !sentToken) {
          if (retried && sessionRevision() === sentRevision) expire();
          fail();
          return;
        }
        if (refreshing) return;
        refreshing = true;
        retried = true;
        // Another request may already have rotated the token.
        const task =
          tokenService.get() !== sentToken && tokenService.get() ? Promise.resolve() : refresh();
        void task
          .then(() => {
            subscription?.unsubscribe();
            run();
          })
          .catch((error) => {
            if (!cancelled) observer.error(error);
          });
      };
      run();
      return () => {
        cancelled = true;
        subscription?.unsubscribe();
      };
    });
  });
}
