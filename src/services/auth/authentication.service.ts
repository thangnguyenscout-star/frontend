import { apolloClient } from '@/services/graphql/apollo';
import { normalizeApiErrors, normalizeBusinessErrors } from '@/services/graphql/errors';
import { AUTHENTICATION_MUTATION } from '@/graphql/authentication/authentication.mutation';
import type { AuthenticationResponse, LoginAccountInput } from '@/types/authentication';
export async function authentication(
  loginAccount: LoginAccountInput,
): Promise<AuthenticationResponse> {
  try {
    const response = await apolloClient.mutate<{ authentication: AuthenticationResponse }>({
      mutation: AUTHENTICATION_MUTATION,
      variables: { loginAccount },
      context: { public: true },
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    });
    
    const result = response.data?.authentication;
    if (result?.isResults !== true) {
      return { isResults: false, data: null, errors: normalizeBusinessErrors(result?.errors) };
    }
    if (
      typeof result.data?.accessToken !== 'string' ||
      !result.data.accessToken.trim() ||
      typeof result.data.refeshToken !== 'string' ||
      !result.data.refeshToken.trim()
    ) {
      return { isResults: false, data: null, errors: [{ code: 'COMMON_INVALID_DATA' }] };
    }
    return { isResults: true, data: result.data, errors: [] };
  } catch (error) {
    return { isResults: false, data: null, errors: normalizeApiErrors(error) };
  }
}
