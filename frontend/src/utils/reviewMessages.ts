/**
 * Utility functions for generating random review messages
 */

// 6가지 랜덤 리뷰 메시지 배열
const REVIEW_MESSAGES = [
  "저상버스가 다니는 정류장이 근처에 있어서 너무 좋아요! 입구도 1층이라 휠체어 끌고 다니기도 편리합니다. 편의점도 있어 너무 좋아요!",
  "시설이 매우 깔끔하고 직원분들이 너무 친절해요. 휠체어 전용 탈의실도 있어서 정말 편리했습니다. 주차공간도 넉넉해서 좋네요!",
  "접근성이 정말 뛰어나요! 엘리베이터도 넓고 곳곳에 경사로가 잘 설치되어 있어요. 운동 후 휴게실에서 쉴 수 있어서 좋았습니다.",
  "장애인 전용 시설이 잘 갖춰져 있어서 안심하고 운동할 수 있었어요. 샤워실도 넓고 안전바가 설치되어 있어 편리했습니다!",
  "처음 방문했는데 안내를 너무 잘해주셨어요. 휠체어로 이동하기 편한 동선으로 설계되어 있고, 운동기구도 다양해서 만족합니다!",
  "대중교통 접근성이 좋고 시설도 현대적이에요. 장애인 화장실도 넓고 깨끗하며, 운동 프로그램도 다양해서 계속 다니고 싶네요!"
] as const;

/**
 * 랜덤한 리뷰 메시지를 반환하는 함수
 * @returns 랜덤하게 선택된 리뷰 메시지 객체
 */
export function getRandomReviewMessage(): { title: string; message: string } {
  const randomIndex = Math.floor(Math.random() * REVIEW_MESSAGES.length);
  
  return {
    title: '모둥이의 리뷰 정보 요약',
    message: `"${REVIEW_MESSAGES[randomIndex]}"`
  };
}

/**
 * 시설 ID를 기반으로 결정론적으로 리뷰 메시지를 반환하는 함수
 * 같은 시설은 항상 같은 리뷰 메시지를 받게 됩니다
 * @param facilityId - 시설 ID (문자열 또는 숫자)
 * @returns 시설 ID에 따라 결정된 리뷰 메시지 객체
 */
export function getReviewMessageByFacilityId(facilityId: string | number): { title: string; message: string } {
  let numericSeed: number;
  
  if (typeof facilityId === 'string') {
    // 문자열을 숫자 시드로 변환 (문자 코드 합계)
    numericSeed = facilityId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  } else {
    numericSeed = facilityId;
  }
  
  const messageIndex = numericSeed % REVIEW_MESSAGES.length;
  
  return {
    title: '모둥이의 리뷰 정보 요약',
    message: `"${REVIEW_MESSAGES[messageIndex]}"`
  };
}

/**
 * 모든 리뷰 메시지를 반환하는 함수
 * @returns 모든 리뷰 메시지 배열
 */
export function getAllReviewMessages(): readonly string[] {
  return REVIEW_MESSAGES;
}