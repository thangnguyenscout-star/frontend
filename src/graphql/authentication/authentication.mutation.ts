import { gql } from '@apollo/client/core';
export const AUTHENTICATION_MUTATION = gql`
  mutation Authentication($loginAccount: LoginAccountInput!) {
    authentication(loginAccount: $loginAccount) {
      isResults
      data {
        userName
        maNhanVien
        loginDateTime
        roleId
        accessToken
        refeshToken
        maBoPhan
        tenBoPhan
      }
    }
  }
`;
