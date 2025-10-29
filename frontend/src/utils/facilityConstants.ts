export const ACCESSIBILITY_OPTIONS = ['화장실 휠체어 이용가능', '장애인 주차구역', '출입구 휠체어 이용가능'] as const;
export const FACILITY_OPTIONS = ["남/녀 화장실 구분", "무선 인터넷", "반려동물 동반"] as const;

export const DISTANCE_OPTIONS = [
  { label: '5km 이내', value: '5' },
  { label: '10km 이내', value: '10' },
  { label: '15km 이내', value: '15' },
  { label: '30km 이내', value: '30' },
] as const;

export const SEARCH_DISTANCE_OPTIONS = [
  ...DISTANCE_OPTIONS,
  { label: '상관없음', value: 'free1' },
] as const;