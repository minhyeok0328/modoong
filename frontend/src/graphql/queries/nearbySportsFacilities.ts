import { gql } from '@apollo/client';

// GraphQL Query -------------------------------------------------------------
export const GET_NEARBY_FACILITIES = gql`
  query GetNearbySportsFacilities($paginationInput: SportsFacilitiesPaginationInput!) {
    nearbySportsFacilitiesForUser(paginationInput: $paginationInput) {
      facilities {
        id
        facltCdEncptVl
        refineWgs84Lat
        refineWgs84Logt
        distance
        facltDivNm
        indutypeNm
        facltTypeNm
        facltTelno
        sidoNm
        signguNm
        refineRoadnmAddr
        refineLotnoAddr
        siDesc
        facltStateNm
        facltHmpgAddr
        facltOpertFormCd
        posesnMainbdNm
        posesnMainbdSidoNm
        posesnMainbdSignguNm
        chrgpsnDeptNm
        facltMangrTelno
        inoutdrDivNm
        audtrmSeatCnt
        audtrmAceptncPsncnt
        facltTotAr
        livelhOpenpublYn
        livelhGymNm
        utlzGrpNm
        facltCreatStdDe
        registStatmntDe
        compltnDe
        suspnbizDe
        clsbizDe
        nationPhstrnFacltYn
        qukprfDesignYn
        selfctrlCheckTargetYn
        registDtm
        updDtm
        refineZipno
        createdAt
        updatedAt
        imageSrc
        facilityImageBase64
      }
      totalCount
      hasNext
      hasPrevious
    }
  }
`;

// --------------------------- TypeScript Types ------------------------------
export interface NearbyFacility {
  id: string;
  facltCdEncptVl: string | null;
  refineWgs84Lat: number | null;
  refineWgs84Logt: number | null;
  distance: number | null;
  facltDivNm: string | null;
  indutypeNm: string | null;
  facltTypeNm: string | null;
  facltTelno: string | null;
  sidoNm: string | null;
  signguNm: string | null;
  refineRoadnmAddr: string | null;
  refineLotnoAddr: string | null;
  siDesc: string | null;
  facltStateNm: string | null;
  facltHmpgAddr: string | null;
  facltOpertFormCd: string | null;
  posesnMainbdNm: string | null;
  posesnMainbdSidoNm: string | null;
  posesnMainbdSignguNm: string | null;
  chrgpsnDeptNm: string | null;
  facltMangrTelno: string | null;
  inoutdrDivNm: string | null;
  audtrmSeatCnt: string | null;
  audtrmAceptncPsncnt: string | null;
  facltTotAr: string | null;
  livelhOpenpublYn: string | null;
  livelhGymNm: string | null;
  utlzGrpNm: string | null;
  facltCreatStdDe: string | null;
  registStatmntDe: string | null;
  compltnDe: string | null;
  suspnbizDe: string | null;
  clsbizDe: string | null;
  nationPhstrnFacltYn: string | null;
  qukprfDesignYn: string | null;
  selfctrlCheckTargetYn: string | null;
  registDtm: string | null;
  updDtm: string | null;
  refineZipno: string | null;
  createdAt: string;
  updatedAt: string;
  imageSrc: string | null;
  facilityImageBase64: string | null;
  amenities: string[];
  streetViewUrl: string | null;
  streetViewPreview: string | null;
}

export interface NearbyFacilitiesPagination {
  facilities: NearbyFacility[];
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetNearbyFacilitiesData {
  nearbySportsFacilitiesForUser: NearbyFacilitiesPagination;
}

export interface SportsFacilitiesPaginationInput {
  skip?: number;
  take?: number;
  facilityType?: string;
  filter?: string;
}

export interface GetNearbyFacilitiesVars {
  paginationInput: SportsFacilitiesPaginationInput;
}
