import { gql } from '@apollo/client';

export const GET_TOP_USERS = gql`
  query GetTopUsers {
    topUsers {
      id
      name
      status
      created_at
      updated_at
    }
  }
`;

export interface GetTopUsersData {
  topUsers: {
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}
