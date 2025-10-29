import { gql } from '@apollo/client';

export const GET_DISABILITY_TYPES = gql`
  query GetDisabilityTypes {
    disabilityTypes {
      id
      code
      name
    }
  }
`;

export interface DisabilityType {
  id: number;
  code: string;
  name: string;
}

export interface GetDisabilityTypesData {
  disabilityTypes: DisabilityType[];
}
