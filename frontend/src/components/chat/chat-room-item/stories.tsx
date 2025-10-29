import type { Meta, StoryObj } from '@storybook/react';
import ChatRoomItem from './index';
import { ChatRoom } from '@/types/chat';

const meta: Meta<typeof ChatRoomItem> = {
  title: 'Chat/ChatRoomItem',
  component: ChatRoomItem,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockGroupRoom: ChatRoom = {
  id: '1',
  type: 'group',
  title: '<서울의어떤야구장> 천운동 야구팀 ⚾ 200',
  participants: [
    { id: 'user-1', name: '나' },
    { id: 'user-2', name: '홍길동' },
    { id: 'user-3', name: '김철수' },
  ],
  messages: [],
  lastMessage: {
    id: 'msg-1',
    content: '오늘 경기 어떻게 할까요?',
    timestamp: Date.now() - 3600000,
    senderId: 'user-2',
    senderName: '홍길동',
    isMe: false,
  },
  createdAt: Date.now() - 86400000,
  updatedAt: Date.now() - 3600000,
};

const mockPersonalRoom: ChatRoom = {
  id: '2',
  type: 'personal',
  title: '함태하',
  participants: [
    { id: 'user-1', name: '나' },
    { id: 'user-6', name: '함태하' },
  ],
  messages: [],
  lastMessage: {
    id: 'msg-2',
    content: '안녕하세요! 렌탈 관련해서 연락드렸습니다.',
    timestamp: Date.now() - 1800000,
    senderId: 'user-6',
    senderName: '함태하',
    isMe: false,
  },
  createdAt: Date.now() - 259200000,
  updatedAt: Date.now() - 1800000,
};

export const GroupRoom: Story = {
  args: {
    room: mockGroupRoom,
    onClick: (roomId: string) => console.log('Room clicked:', roomId),
  },
};

export const PersonalRoom: Story = {
  args: {
    room: mockPersonalRoom,
    onClick: (roomId: string) => console.log('Room clicked:', roomId),
  },
};

export const NoLastMessage: Story = {
  args: {
    room: {
      ...mockGroupRoom,
      lastMessage: undefined,
    },
    onClick: (roomId: string) => console.log('Room clicked:', roomId),
  },
};