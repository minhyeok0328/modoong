import type { Meta, StoryObj } from '@storybook/react';
import MessageBubble from './index';
import { ChatMessage } from '@/types/chat';

const meta: Meta<typeof MessageBubble> = {
  title: 'Chat/MessageBubble',
  component: MessageBubble,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const myMessage: ChatMessage = {
  id: 'msg-1',
  content: '안녕하세요! 오늘 날씨가 정말 좋네요.',
  timestamp: Date.now(),
  senderId: 'user-1',
  senderName: '나',
  isMe: true,
};

const otherMessage: ChatMessage = {
  id: 'msg-2',
  content: '네, 맞아요! 산책하기 딱 좋은 날씨입니다.',
  timestamp: Date.now() - 60000,
  senderId: 'user-2',
  senderName: '홍길동',
  isMe: false,
};

const longMessage: ChatMessage = {
  id: 'msg-3',
  content: '안녕하세요! 오늘 야구 경기 관련해서 몇 가지 안내사항이 있어서 연락드립니다. 경기 시간이 오후 2시로 변경되었고, 장소는 기존과 동일하게 천호공원 야구장입니다. 참가비는 1만원이고, 음료수와 간식은 준비해서 가져갈 예정입니다.',
  timestamp: Date.now() - 120000,
  senderId: 'user-3',
  senderName: '김철수',
  isMe: false,
};

export const MyMessage: Story = {
  args: {
    message: myMessage,
    showSenderName: false,
    showAvatar: false,
  },
};

export const OtherMessage: Story = {
  args: {
    message: otherMessage,
    showSenderName: true,
    showAvatar: true,
  },
};

export const LongMessage: Story = {
  args: {
    message: longMessage,
    showSenderName: true,
    showAvatar: true,
  },
};

export const PersonalChatMessage: Story = {
  args: {
    message: otherMessage,
    showSenderName: false,
    showAvatar: false,
  },
};