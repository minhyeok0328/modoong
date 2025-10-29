import { gql } from '@apollo/client';

export const GET_SPORTS_FACILITY_AMENITIES = gql`
  query GetSportsFacilityAmenities {
    sportsFacilityAmenities
  }
`;

export interface GetSportsFacilityAmenitiesData {
  sportsFacilityAmenities: string[];
}
