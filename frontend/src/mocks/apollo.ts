import { ApolloLink, Observable, Operation, FetchResult } from '@apollo/client';
import {
  GET_NEARBY_FACILITIES,
  NearbyFacility,
} from '@/graphql/queries/nearbySportsFacilities';
import { GET_SPORTS_FACILITY } from '@/graphql/queries/sportsFacility';
import { GET_SPORTS_FACILITY_TYPES } from '@/graphql/queries/sportsFacilityTypes';
import { GET_SPORT_TYPES } from '@/graphql/queries/sportTypes';
import { GET_DISABILITY_TYPES } from '@/graphql/queries/disabilityTypes';
import { GET_SPORTS_FACILITY_AMENITIES } from '@/graphql/queries/amenitiesType';
import { GET_TOKEN_PAYLOAD } from '@/graphql/queries/tokenPayload';
import dayjs from 'dayjs';
import { getFacilityImageBySeed } from '@/utils/facilityImages';

// ------------------------- Mock Data Sources -------------------------------

const sportsFacilityTypes: string[] = [
  '수영장',
  '테니스장',
  '배드민턴장',
  '헬스장',
  '농구장',
  '축구장',
  '볼링장',
  '요가',
  '필라테스',
  '기타',
];

const sportsFacilityAmenities: string[] = [
  '남/녀 화장실 구분',
  '무선 인터넷',
  '반려동물 동반',
  '화장실 휠체어 이용가능',
  '장애인 주차구역',
  '출입구 휠체어 이용가능',
];

const sportTypes = [
  { id: 1, code: 'SWIMMING', name: '수영' },
  { id: 2, code: 'TENNIS', name: '테니스' },
  { id: 3, code: 'BADMINTON', name: '배드민턴' },
  { id: 4, code: 'SOCCER', name: '축구' },
  { id: 5, code: 'BASKETBALL', name: '농구' },
  { id: 6, code: 'RUNNING', name: '러닝' },
];

const disabilityTypes = [
  { id: 1, code: 'VISION', name: '시각장애' },
  { id: 2, code: 'HEARING', name: '청각장애' },
  { id: 3, code: 'PHYSICAL', name: '지체장애' },
  { id: 4, code: 'INTELLECTUAL', name: '지적장애' },
  { id: 5, code: 'AUTISM', name: '자폐성장애' },
];

function makeFacility(id: string, type: string, seed: string | number, overrides: Partial<NearbyFacility> = {}): NearbyFacility {
  const base: NearbyFacility = {
    id,
    facltCdEncptVl: null,
    refineWgs84Lat: 37.5 + (Number(id) % 10) * 0.01,
    refineWgs84Logt: 127.0 + (Number(id) % 10) * 0.01,
    distance: Number(((Number(id) % 30) / 10).toFixed(2)),
    facltDivNm: '체육시설',
    indutypeNm: type.replace('장', ''),
    facltTypeNm: type,
    facltTelno: '031-000-0000',
    sidoNm: '경기도',
    signguNm: '수원시',
    refineRoadnmAddr: '경기도 수원시 팔달구 정조로 123',
    refineLotnoAddr: '경기도 수원시 팔달구 123-45',
    siDesc: `${type} 즐기기 좋은 시설 ${id}`,
    facltStateNm: '운영중',
    facltHmpgAddr: 'https://example.com',
    facltOpertFormCd: '공공',
    posesnMainbdNm: Number(id) % 4 === 0 ? '대한장애인체육회' : '수원시청',
    posesnMainbdSidoNm: '경기도',
    posesnMainbdSignguNm: '수원시',
    chrgpsnDeptNm: '체육시설관리과',
    facltMangrTelno: '031-111-2222',
    inoutdrDivNm: Number(id) % 2 === 0 ? '실내' : '실외',
    audtrmSeatCnt: null,
    audtrmAceptncPsncnt: null,
    facltTotAr: '1200',
    livelhOpenpublYn: 'Y',
    livelhGymNm: null,
    utlzGrpNm: null,
    facltCreatStdDe: '2018-03-01',
    registStatmntDe: null,
    compltnDe: null,
    suspnbizDe: null,
    clsbizDe: null,
    nationPhstrnFacltYn: 'N',
    qukprfDesignYn: 'N',
    selfctrlCheckTargetYn: 'N',
    registDtm: dayjs().subtract(365, 'day').toISOString(),
    updDtm: dayjs().toISOString(),
    refineZipno: '12345',
    createdAt: dayjs().subtract(365, 'day').toISOString(),
    updatedAt: dayjs().toISOString(),
    imageSrc: getFacilityImageBySeed(seed),
    facilityImageBase64: null,
    amenities: sportsFacilityAmenities,
    streetViewUrl: null,
    streetViewPreview: null,
  };
  return { ...base, ...overrides };
}

const facilityDataset: NearbyFacility[] = [
  makeFacility('1', '수영장', '1'),
  makeFacility('2', '테니스장', '2'),
  makeFacility('3', '배드민턴장', '3'),
  makeFacility('4', '헬스장', '4'),
  makeFacility('5', '농구장', '5'),
  makeFacility('6', '수영장', '6'),
  makeFacility('7', '테니스장', '7'),
  makeFacility('8', '헬스장', '8'),
  makeFacility('9', '배드민턴장', '9'),
  makeFacility('10', '축구장', '10'),
];

// --------------------------- Mock Link ------------------------------------

function buildData(operation: Operation): FetchResult | undefined {
  const { operationName, variables, query } = operation;

  // Some usages rely on direct document equality; keep operationName first
  switch (operationName) {
    case 'GetSportsFacilityTypes':
      return { data: { sportsFacilityTypes } };
    case 'GetSportTypes':
      return { data: { sportTypes } };
    case 'GetDisabilityTypes':
      return { data: { disabilityTypes } };
    case 'GetSportsFacilityAmenities':
      return { data: { sportsFacilityAmenities } };
    case 'TokenPayload':
      return {
        data: {
          tokenPayload: {
            username: '홍길동',
            address: '경기도 수원시 팔달구 정조로 123',
            accessibilityStatus: {
              wheelchair: true,
              guideDog: false,
              elevator: true,
            },
            activitySchedule: {
              dawn: { start: '06:00', end: '08:00', selected: false },
              morning: { start: '08:00', end: '12:00', selected: false },
              noon: { start: '12:00', end: '14:00', selected: false },
              afternoon: { start: '14:00', end: '18:00', selected: true },
              evening: { start: '18:00', end: '22:00', selected: false },
              lateNight: { start: '22:00', end: '06:00', selected: false },
            },
            sportPreference: '수영장, 테니스장',
            otherSportDescription: '',
            otherDisabilityDescription: '',
          },
        },
      };
    case 'GetNearbySportsFacilities': {
      const { paginationInput } = variables || {};
      const { facilityType } = paginationInput || {};
      let facilities = facilityDataset;
      if (facilityType) {
        facilities = facilities.filter((f) => f.facltTypeNm === facilityType);
      }
      return {
        data: {
          nearbySportsFacilitiesForUser: {
            facilities,
            totalCount: facilities.length,
            hasNext: false,
            hasPrevious: false,
          },
        },
      };
    }
    case 'GetSportsFacility': {
      const id = variables?.id as string;
      const base = facilityDataset.find((f) => f.id === id) || facilityDataset[0];
      return {
        data: {
          sportsFacility: {
            ...base,
            streetViewUrl: null,
            streetViewPreview: null,
            amenities: sportsFacilityAmenities,
            disabilitySportsFacility:
              Number(id) % 3 === 0
                ? {
                    facilityOwner: '홍길동 트레이너',
                    vehicleSupport: '픽업 지원',
                    disabilitySupport: '엘리베이터, 장애인 주차구역, 입구계단없음',
                    facilityImageBase64: null,
                    courseInfo: [
                      {
                        title: '수영 기초 반',
                        description: '장애 유형에 맞춘 맞춤형 수영 기초 수업',
                        info: [
                          { key: '요일', value: '화/목' },
                          { key: '시간', value: '14:00~15:00' },
                          { key: '정원', value: '8명' },
                        ],
                        price: '월 30,000원',
                        tags: ['초급', '개인별 맞춤'],
                      },
                      {
                        title: '테니스 중급 레슨',
                        description: '휠체어 테니스 중심의 중급 레슨',
                        info: [
                          { key: '요일', value: '월/수/금' },
                          { key: '시간', value: '16:00~17:00' },
                          { key: '정원', value: '6명' },
                        ],
                        price: '월 45,000원',
                        tags: ['중급', '휠체어 테니스'],
                      },
                    ],
                  }
                : null,
          },
        },
      };
    }
    case 'SignUp': {
      return { data: { signUp: 'ok' } };
    }
    case 'RefreshToken': {
      return { data: { refreshToken: { success: true } } };
    }
    case 'GenerateEssay': {
      const input = variables?.input || variables?.generateEssay?.input || variables?.variables?.input;
      const baseText = `운동 기록: ${input?.exercise_record || ''}\n감정: ${input?.emotion || ''}\n이야기: ${input?.user_additional_thoughts || ''}`;
      return {
        data: {
          generateEssay: {
            title: '모둥이와 함께한 운동 에세이',
            content: `${baseText}\n\n오늘도 스스로를 이겨낸 당신을 응원합니다.`,
            comment: '꾸준함이 최고의 재능이에요! 다음엔 사진도 첨부해볼까요?',
          },
        },
      };
    }
    default:
      // Fallback by comparing known documents when operationName is unavailable
      if (query === GET_SPORTS_FACILITY_TYPES) return { data: { sportsFacilityTypes } };
      if (query === GET_SPORT_TYPES) return { data: { sportTypes } };
      if (query === GET_DISABILITY_TYPES) return { data: { disabilityTypes } };
      if (query === GET_SPORTS_FACILITY_AMENITIES) return { data: { sportsFacilityAmenities } };
      if (query === GET_TOKEN_PAYLOAD)
        return {
          data: {
            tokenPayload: {
              username: '홍길동',
              address: '경기도 수원시 팔달구 정조로 123',
              accessibilityStatus: {},
              activitySchedule: {
                dawn: { start: '06:00', end: '08:00', selected: false },
                morning: { start: '08:00', end: '12:00', selected: false },
                noon: { start: '12:00', end: '14:00', selected: false },
                afternoon: { start: '14:00', end: '18:00', selected: true },
                evening: { start: '18:00', end: '22:00', selected: false },
                lateNight: { start: '22:00', end: '06:00', selected: false },
              },
              sportPreference: '수영장, 테니스장',
              otherSportDescription: '',
              otherDisabilityDescription: '',
            },
          },
        };
      if (query === GET_NEARBY_FACILITIES)
        return {
          data: {
            nearbySportsFacilitiesForUser: {
              facilities: facilityDataset,
              totalCount: facilityDataset.length,
              hasNext: false,
              hasPrevious: false,
            },
          },
        };
      if (query === GET_SPORTS_FACILITY)
        return {
          data: {
            sportsFacility: {
              ...facilityDataset[0],
              disabilitySportsFacility: null,
              amenities: sportsFacilityAmenities,
            },
          },
        };
  }
}

export const mockLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    try {
      const result = buildData(operation);
      // Simulate brief network latency for realism
      setTimeout(() => {
        observer.next(result ?? { data: {} });
        observer.complete();
      }, 150);
    } catch (e) {
      observer.error(e);
    }
  });
});
