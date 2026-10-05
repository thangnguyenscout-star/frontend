import { gql } from '@apollo/client/core';

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($accessToken: String!, $refreshToken: String!) {
    refreshToken(accessToken: $accessToken, refreshToken: $refreshToken) {
      isResults
      message
      data {
        userName
        maNhanVien
        loginDateTime
        roleId
        accessToken
        refeshToken
      }
    }
  }
`;
