import { NearbyFacility } from '@/graphql/queries/nearbySportsFacilities';
import { DisabilitySportsFacility } from '@/graphql/queries/sportsFacility';

export interface FacilityTypeProps extends NearbyFacility {
  disabilitySportsFacility?: DisabilitySportsFacility;
}

export const facilityType = (item: FacilityTypeProps) => {
  const { posesnMainbdNm, facilityImageBase64 } = item;

  if (posesnMainbdNm === '대한장애인체육회') {
    return '장애인 시설';
  }

  if (facilityImageBase64?.length || item.disabilitySportsFacility) {
    return '스포츠강좌 가맹점';
  }

  if (posesnMainbdNm !== '대한장애인체육회' && posesnMainbdNm !== null) {
    return '공공시설';
  }

  return '일반시설';
};
