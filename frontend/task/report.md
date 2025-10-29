# 작업 보고서

## 1. API 연동 → 목업 데이터 전환
- Apollo HTTP 네트워크 링크 제거 → 로컬 목업 링크로 대체
  - 수정: `src/apollo/client.ts` (`httpLink` → `mockLink`)
- 목업 링크/데이터 추가: `src/mocks/apollo.ts`
  - 지원 쿼리
    - `GetNearbySportsFacilities` (주변 체육시설 목록)
    - `GetSportsFacility` (체육시설 상세 + 스포츠강좌 시설일 경우 강좌 정보)
    - `GetSportsFacilityTypes` (체육시설 종목 목록)
    - `GetSportTypes` (스포츠 종목 타입 목록)
    - `GetDisabilityTypes` (장애 유형 목록)
    - `GetSportsFacilityAmenities` (편의/접근성 옵션 목록)
    - `TokenPayload` (사용자 토큰 페이로드)
  - 지원 뮤테이션
    - `SignUp` (단순 성공 응답)
    - `GenerateEssay` (AI 에세이 결과 목업)
    - `RefreshToken` (성공 응답; 에러 링크에서 사용 가능성 고려)

## 2. 작업 내용 및 설명
- 목업 링크 설계
  - `ApolloLink` 기반의 `mockLink`를 구현하여 모든 GraphQL 요청을 네트워크 없이 처리
  - `operationName` 기준으로 라우팅하고, 일부는 문서 비교(fallback)도 지원
  - 최소 지연(150ms)으로 실제감 부여, 네트워크/백엔드 의존성 제거

- 데이터 구성 방식
  - 체육시설 데이터셋을 메모리 배열로 생성(`facilityDataset`)
    - `public/images`의 자산을 `getFacilityImageBySeed`로 안정적으로 매핑해 시각적 다양성 유지
    - 주소/전화/운영상태/거리/편의시설(AMENITY_MAP 키와 일치) 등을 한국어로 제공
    - 일부 시설은 `posesnMainbdNm`/`disabilitySportsFacility`를 부여해 ‘장애인 시설/스포츠강좌 가맹점’ UI가 자연스럽게 노출되도록 구성
  - 목록 쿼리(`GetNearbySportsFacilities`)는 `facilityType` 변수로 간단 필터링 지원
  - 상세 쿼리(`GetSportsFacility`)는 ID 매칭으로 단일 항목 반환 + 조건부 강좌 정보 제공
  - 공통 마스터 데이터
    - `sportsFacilityTypes`: 한국어 종목명 리스트(자동완성/필터에 사용)
    - `sportsFacilityAmenities`: `utils/amenitiesFilter.ts`가 매핑 가능한 키로 구성
    - `sportTypes`, `disabilityTypes`: 코드/이름 구조로 한국어 데이터 제공
  - 사용자 토큰 페이로드(`TokenPayload`)는 Jotai 초기화 흐름에 맞춰 합리적 기본값으로 제공

- 기존 코드 변경 최소화
  - 네트워크 레이어만 교체하고, 컴포넌트/페이지의 `useQuery`, `useMutation` 호출부는 그대로 유지
  - 기존 `src/mocks/chat.ts`, `src/mocks/lounge.ts`와 동일한 “변수로 직접 목데이터 제공” 패턴 준수

- 기타 고려사항
  - `errorLink`는 유지하되, 목업에서는 401/네트워크 에러를 발생시키지 않도록 설계하여 토큰 재발급 네트워크 호출을 유발하지 않음
  - 이미지/아이콘은 `public/` 자산을 적극 활용하여 ‘목업이지만 동적인’ UI를 보이도록 구성

이로써 백엔드 없이도 데모/시연 환경에서 애플리케이션 전반이 정상 동작하도록 리팩토링을 완료했습니다.

