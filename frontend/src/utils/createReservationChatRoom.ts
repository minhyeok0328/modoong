import dayjs from 'dayjs';
import { ChatRoom, ChatMessage, ChatParticipant } from '@/types/chat';
import { generateRandomKoreanName } from './randomKoreanName';

interface ReservationChatData {
  reservationNumber: string;
  siDesc: string;
  date: string;
  time: string;
}

export function createReservationChatRoom(data: ReservationChatData): ChatRoom {
  const { reservationNumber, siDesc, date, time } = data;

  // 날짜 파싱 및 형식 변환 - 더 안전한 방법 사용
  let formattedDate = '';
  let dayOfWeek = '';
  
  try {
    // 다양한 날짜 형식 시도
    const dateRegex = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/;
    const match = date.match(dateRegex);
    
    if (match) {
      const [, year, month, day] = match;
      const parsedDate = dayjs(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      if (parsedDate.isValid()) {
        formattedDate = parsedDate.format('YYMMDD');
        dayOfWeek = parsedDate.format('(ddd)');
      }
    }
    
    // 위 방법이 실패하면 다른 방법 시도
    if (!formattedDate) {
      const dateStr = date.replace(/[년월일()]/g, '').replace(/\s+/g, ' ').trim();
      const parsedDate = dayjs(dateStr, 'YYYY MM DD ddd');
      if (parsedDate.isValid()) {
        formattedDate = parsedDate.format('YYMMDD');
        dayOfWeek = parsedDate.format('(ddd)');
      }
    }
  } catch (error) {
    console.error('Date parsing error:', error);
  }
  
  // 파싱에 실패한 경우 기본값 사용
  if (!formattedDate) {
    formattedDate = dayjs().format('YYMMDD');
    dayOfWeek = '(오늘)';
  }

  // 시간에서 시작 시간만 추출
  const startTime = time.split('-').shift()?.trim() || '';

  // 채팅방 제목 생성
  const chatTitle = `${formattedDate}_${dayOfWeek} ${startTime} ${siDesc}`;

  // 랜덤 참여자 3-5명 생성 (나 포함)
  const participantCount = Math.floor(Math.random() * 3) + 3; // 3-5명
  const participants: ChatParticipant[] = [
    { id: 'user-1', name: '나' }
  ];

  // 랜덤 참여자 추가
  for (let i = 1; i < participantCount; i++) {
    participants.push({
      id: `user-${Date.now()}-${i}`,
      name: generateRandomKoreanName()
    });
  }

  // 초기 메시지 템플릿
  const greetingMessages = [
    '안녕하세요!',
    '반갑습니다!',
    '운동 재밌게 해봅시다!',
    '오늘 날씨 좋네요~',
    '안녕하세요~ 잘 부탁드립니다!',
    '반가워요!',
    '함께 운동해요!',
    '화이팅!',
    '오늘도 건강하게!'
  ];

  // 각 참여자별로 랜덤 메시지 생성 (나 제외)
  const messages: ChatMessage[] = [];
  const now = Date.now();

  participants.slice(1).forEach((participant, index) => {
    const randomMessage = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
    messages.push({
      id: `msg-${now}-${index}`,
      content: randomMessage,
      timestamp: now - (participants.length - index - 1) * 30000, // 30초 간격
      senderId: participant.id,
      senderName: participant.name,
      isMe: false,
    });
  });

  const lastMessage = messages[messages.length - 1];

  return {
    id: `reservation-${reservationNumber}`,
    type: 'group',
    title: chatTitle,
    participants,
    messages,
    lastMessage,
    createdAt: now,
    updatedAt: lastMessage?.timestamp || now,
  };
}
