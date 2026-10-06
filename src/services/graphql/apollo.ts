import { createSessionLink } from './session-link';
import { expireSession } from '../auth/auth-session';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client/core';
import { tokenService } from '../auth/token.service';
const authLink = new ApolloLink((operation, forward) => {
  const token = operation.getContext().public ? null : tokenService.get();
  const headers = { ...operation.getContext().headers };
  delete headers.authorization;
  delete headers.Authorization;
  if (token) headers.authorization = `Bearer ${token}`;
  operation.setContext({ headers });
  return forward(operation);
});
export const apolloClient = new ApolloClient({
  link: createSessionLink(
    () => import('../auth/refresh-token.service').then((service) => service.refreshSession()),
    expireSession,
  )
    .concat(authLink)
    .concat(
      new HttpLink({ uri: import.meta.env.VITE_API_URL || '/graphql', credentials: 'include' }),
    ),
  cache: new InMemoryCache(),
});
