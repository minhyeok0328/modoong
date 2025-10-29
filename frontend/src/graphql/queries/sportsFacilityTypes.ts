import { gql } from '@apollo/client';

export const GET_SPORTS_FACILITY_TYPES = gql`
  query GetSportsFacilityTypes {
    sportsFacilityTypes
  }
`;

export interface GetSportsFacilityTypesData {
  sportsFacilityTypes: string[];
}
