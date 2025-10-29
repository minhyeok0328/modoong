import type { Meta, StoryObj } from '@storybook/react';
import ParticipantList from './index';
import { ChatParticipant } from '@/types/chat';

const meta: Meta<typeof ParticipantList> = {
  title: 'Chat/ParticipantList',
  component: ParticipantList,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParticipants: ChatParticipant[] = [
  { id: 'user-1', name: '나' },
  { id: 'user-2', name: '홍길동' },
  { id: 'user-3', name: '김철수' },
  { id: 'user-4', name: '이영희' },
  { id: 'user-5', name: '박민수' },
];

const fewParticipants: ChatParticipant[] = [
  { id: 'user-1', name: '나' },
  { id: 'user-2', name: '홍길동' },
];

export const Visible: Story = {
  args: {
    participants: mockParticipants,
    isVisible: true,
    onClose: () => console.log('Close clicked'),
  },
};

export const Hidden: Story = {
  args: {
    participants: mockParticipants,
    isVisible: false,
    onClose: () => console.log('Close clicked'),
  },
};

export const FewParticipants: Story = {
  args: {
    participants: fewParticipants,
    isVisible: true,
    onClose: () => console.log('Close clicked'),
  },
};

export const ManyParticipants: Story = {
  args: {
    participants: [
      ...mockParticipants,
      { id: 'user-6', name: '최영수' },
      { id: 'user-7', name: '정혜린' },
      { id: 'user-8', name: '송민호' },
      { id: 'user-9', name: '김지은' },
      { id: 'user-10', name: '이준호' },
    ],
    isVisible: true,
    onClose: () => console.log('Close clicked'),
  },
};