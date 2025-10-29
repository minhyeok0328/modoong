import { gql } from '@apollo/client';
import { NearbyFacility } from './nearbySportsFacilities';

export const GET_SPORTS_FACILITY = gql`
  query GetSportsFacility($id: String!) {
    sportsFacility(id: $id) {
      id
      facltDivNm
      indutypeNm
      facltTypeNm
      facltTelno
      sidoNm
      signguNm
      refineRoadnmAddr
      siDesc
      facltStateNm
      facltHmpgAddr
      refineWgs84Lat
      refineWgs84Logt
      facltMangrTelno
      inoutdrDivNm
      facltTotAr
      createdAt
      updatedAt
      imageSrc
      streetViewUrl
      amenities
      streetViewPreview
      posesnMainbdNm
      disabilitySportsFacility {
        facilityOwner
        vehicleSupport
        disabilitySupport
        facilityImageBase64
        courseInfo
      }
    }
  }
`;

export interface CourseInfo {
  description: string;
  info: { key: string; value: string }[];
  price: string;
  tags: string[];
  title: string;
}
export interface DisabilitySportsFacility {
  facilityOwner: string;
  vehicleSupport: string;
  disabilitySupport: string;
  facilityImageBase64: string;
  courseInfo: CourseInfo[];
}

export interface GetSportsFacilityData {
  sportsFacility: NearbyFacility & { disabilitySportsFacility: DisabilitySportsFacility };
}

export interface GetSportsFacilityVars {
  id: string;
}
