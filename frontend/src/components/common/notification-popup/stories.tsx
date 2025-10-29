import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import NotificationPopup from './index';
import { Provider } from 'jotai';
import { useSetAtom } from 'jotai';
import { chatRoomsAtom } from '@/atoms/chat';
import { ChatRoom } from '@/types/chat';

const mockChatRooms: ChatRoom[] = [
  {
    id: 'room-1',
    type: 'group',
    title: '농구 같이 해요! 🏀',
    participants: [
      { id: 'user-1', name: '나' },
      { id: 'user-2', name: '김철수' },
      { id: 'user-3', name: '이영희' }
    ],
    messages: [
      {
        id: 'msg-1',
        content: '내일 오후 3시에 만나요!',
        timestamp: Date.now() - 30 * 60 * 1000, // 30분 전
        senderId: 'user-2',
        senderName: '김철수',
        isMe: false
      },
      {
        id: 'msg-2',
        content: '네, 좋습니다!',
        timestamp: Date.now() - 25 * 60 * 1000, // 25분 전
        senderId: 'user-1',
        senderName: '나',
        isMe: true
      }
    ],
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    updatedAt: Date.now() - 25 * 60 * 1000
  },
  {
    id: 'room-2',
    type: 'personal',
    title: '박민수',
    participants: [
      { id: 'user-1', name: '나' },
      { id: 'user-4', name: '박민수' }
    ],
    messages: [
      {
        id: 'msg-3',
        content: '안녕하세요! 테니스 같이 치실래요?',
        timestamp: Date.now() - 10 * 60 * 1000, // 10분 전
        senderId: 'user-4',
        senderName: '박민수',
        isMe: false
      }
    ],
    createdAt: Date.now() - 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 60 * 1000
  }
];

const WithMockData = ({ children }: { children: React.ReactNode }) => {
  const setChatRooms = useSetAtom(chatRoomsAtom);
  
  // 목업 데이터 설정
  setChatRooms(mockChatRooms);
  
  return <>{children}</>;
};

const NotificationPopupWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);
  
  return (
    <Provider>
      <WithMockData>
        <div className="p-8">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            알림 토글
          </button>
          <div className="relative inline-block mt-4">
            <NotificationPopup 
              {...args}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      </WithMockData>
    </Provider>
  );
};

const meta: Meta<typeof NotificationPopup> = {
  title: 'Common/NotificationPopup',
  component: NotificationPopup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '채팅 메시지 알림을 표시하는 팝업 컴포넌트입니다. 헤더의 알림 버튼에서 사용됩니다.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '팝업 열림/닫힘 상태'
    },
    onClose: {
      action: 'closed',
      description: '팝업 닫기 콜백 함수'
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스'
    }
  },
};

export default meta;
type Story = StoryObj<typeof NotificationPopup>;

export const Default: Story = {
  render: NotificationPopupWrapper,
  args: {
    isOpen: true,
    className: ''
  }
};

export const WithNoNotifications: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    
    return (
      <Provider>
        <div className="p-8">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            알림 토글 (알림 없음)
          </button>
          <div className="relative inline-block mt-4">
            <NotificationPopup 
              {...args}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      </Provider>
    );
  },
  args: {
    isOpen: true,
    className: ''
  }
};

export const Closed: Story = {
  render: NotificationPopupWrapper,
  args: {
    isOpen: false,
    className: ''
  }
};