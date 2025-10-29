import { useState, useRef } from 'react';
import { CiBellOn } from 'react-icons/ci';
import { FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { chatRoomsAtom } from '@/atoms/chat';
import NotificationPopup from '../notification-popup';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [chatRooms] = useAtom(chatRoomsAtom);

  // 읽지 않은 메시지 개수 계산
  const getUnreadRoomCount = () => {
    let count = 0;
    chatRooms.forEach(room => {
      const hasUnread = room.messages.some(msg =>
        !msg.isMe && msg.timestamp > Date.now() - 24 * 60 * 60 * 1000
      );
      if (hasUnread) count += 1;
    });
    return Math.min(count, 99);
  };

  const unreadCount = getUnreadRoomCount();
  return (
    <header className={className}>
      <ul className="flex items-center justify-between py-2">
        <li className="text-xl font-extrabold text-yellow-400" onClick={() => navigate('/')}>modOOng</li>
        <li className="flex items-center gap-4">
          <button
            ref={notificationButtonRef}
            className="cursor-pointer relative"
            type="button"
            aria-label="알림목록 보기"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <CiBellOn className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          <button
            className="cursor-pointer relative"
            type="button"
            aria-label="채팅으로 이동"
            onClick={() => navigate('/chat')}
          >
            <FaCommentDots className="text-xl text-gray-600" />
          </button>
          <NotificationPopup
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            triggerRef={notificationButtonRef as React.RefObject<HTMLElement>}
          />
        </li>
      </ul>
    </header>
  );
}
