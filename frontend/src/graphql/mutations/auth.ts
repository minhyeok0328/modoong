import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation SignUp($signUpUserInput: SignUpUserInput!) {
    signUp(signUpUserInput: $signUpUserInput)
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      success
    }
  }
`;
