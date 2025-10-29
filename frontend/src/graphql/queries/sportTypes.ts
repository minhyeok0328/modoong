import { gql } from '@apollo/client';

export const GET_SPORT_TYPES = gql`
  query GetSportTypes {
    sportTypes {
      id
      code
      name
    }
  }
`;

export interface SportType {
  id: number;
  code: string;
  name: string;
}

export interface GetSportTypesData {
  sportTypes: SportType[];
}
