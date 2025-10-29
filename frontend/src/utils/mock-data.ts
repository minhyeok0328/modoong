import { generateRandomKoreanName } from './randomKoreanName';
import { generateRandomMBTI } from './mbti-generator';
import { formatDistance } from './distance';
import { getRandomFacilityImage } from './facilityImages';

// 친구 추천 데이터 상수
const ages = ['20대', '30대', '40대', '50대'];
const disabilities = ['지체(휠체어)', '시각', '청각', '지적', '뇌병변'];
const distances = [1.2, 1.5, 2.1, 3.2, 4.5, 5.6, 6.7, 7.8, 8.9, 9.0];
const sports = ['축구', '농구', '배드민턴', '탁구', '수영', '테니스', '배구', '야구'];
const profileImages = [
  '/profile/profile1.png',
  '/profile/profile2.png',
  '/profile/profile3.png',
  '/profile/profile4.png',
  '/profile/profile5.png',
  '/profile/profile6.png',
];

export interface FriendData {
  id: number;
  name: string;
  age: string;
  disability: string;
  distance: string;
  sport: string;
  mbti: string;
  src: string;
}

// 친구 추천 데이터 생성
export const generateFriendData = (count: number = 10): FriendData[] => {
  const friends = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: generateRandomKoreanName(),
    age: ages[Math.floor(Math.random() * ages.length)],
    disability: disabilities[Math.floor(Math.random() * disabilities.length)],
    distance: formatDistance(distances[index % distances.length]),
    sport: sports[Math.floor(Math.random() * sports.length)],
    mbti: generateRandomMBTI(),
    src: profileImages[Math.floor(Math.random() * profileImages.length)],
  }));

  return friends.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

export const TMP_IMAGE = {
  src: getRandomFacilityImage(),
  profile: '/images/profile.png',
  // Keep the default for backward compatibility
  default: '/images/356824_168381_1731.jpg',
} as const;
