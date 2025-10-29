const surnames: string[] = ['김', '이', '박', '최', '정', '강', '조'];
const firstNames: string[] = [
  '민준',
  '지훈',
  '예슬',
  '수민',
  '준호',
  '하윤',
  '서연',
  '도현',
  '은지',
  '우진',
  '지우',
  '현우',
  '서준',
  '예준',
  '지아',
  '하준',
  '시우',
  '민서',
  '예지',
  '동현',
];

const volunteerTypes: string[] = ['자원봉사자', '활동보조인', '사회복지사'];

export function generateRandomKoreanName(): string {
  const randomSurnameIndex = Math.floor(Math.random() * surnames.length);
  const randomFirstNameIndex = Math.floor(Math.random() * firstNames.length);

  const surname = surnames[randomSurnameIndex];
  let firstName = firstNames[randomFirstNameIndex];
  if (firstName.length === 2 && Math.random() > 0.5) {
    firstName = firstName.charAt(1) + firstName.charAt(0);
  }

  return `${surname}${firstName}`;
}

export function generateRandomAge(): number {
  const ageRanges = [20, 30, 40, 50];
  const randomIndex = Math.floor(Math.random() * ageRanges.length);
  return ageRanges[randomIndex];
}

export function generateRandomGender(): string {
  return Math.random() > 0.5 ? '남성' : '여성';
}

export function generateRandomTemperature(): string {
  const baseTemp = 36.0;
  const randomTemp = baseTemp + (Math.random() * 0.8); // 36.0-36.8
  return `${randomTemp.toFixed(1)}°C`;
}

export function generateRandomExperience(): string {
  const count = Math.floor(Math.random() * 20) + 1; // 1-20건
  return `${count}건`;
}

export function generateRandomActivity(): string {
  const hours = Math.floor(Math.random() * 50) + 1; // 1-50시간
  return `${hours}시간`;
}

export function generateRandomVolunteer(): string {
  const randomIndex = Math.floor(Math.random() * volunteerTypes.length);
  return volunteerTypes[randomIndex];
}

export function generateRandomMateData() {
  return {
    name: generateRandomKoreanName(),
    age: generateRandomAge(),
    gender: generateRandomGender(),
    temperature: generateRandomTemperature(),
    experience: generateRandomExperience(),
    activity: generateRandomActivity(),
    volunteer: generateRandomVolunteer(),
    isVolunteer: true,
  };
}
