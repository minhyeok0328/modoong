import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { chatRoomsAtom } from '@/atoms/chat';

interface NotificationItem {
  id: string;
  type: 'new_message';
  chatRoomId: string;
  chatRoomTitle: string;
  senderName: string;
  messageContent: string;
  timestamp: number;
}

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
  className?: string;
}

export default function NotificationPopup({
  isOpen,
  onClose,
  triggerRef,
  className = ''
}: NotificationPopupProps) {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const [chatRooms] = useAtom(chatRoomsAtom);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          triggerRef?.current && !triggerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // 팝업 위치 동적 계산
  useEffect(() => {
    if (isOpen && triggerRef?.current && popupRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const root = document.getElementById('root');
      if (!root) return;
      const rootRect = root.getBoundingClientRect();
      let style: React.CSSProperties = { position: 'absolute', zIndex: 50 };

      // 기본: trigger의 하단에 right 정렬
      let top = triggerRect.bottom - rootRect.top + 8; // mt-2
      let left = triggerRect.right - popupRect.width - rootRect.left;

      // root 기준 우측이 벗어나면 left를 조정
      if (left + popupRect.width > rootRect.width) {
        left = rootRect.width - popupRect.width - 8; // 8px 여백
      }
      // root 기준 좌측이 벗어나면 left를 8로 고정
      if (left < 8) {
        left = 8;
      }
      // root 기준 하단이 벗어나면 위로 올림
      if (top + popupRect.height > rootRect.height) {
        top = triggerRect.top - rootRect.top - popupRect.height - 8;
      }
      style = { ...style, left, top };
      setPopupStyle(style);
    }
  }, [isOpen, triggerRef]);

  // 최근 메시지들을 알림으로 변환
  const getNotifications = (): NotificationItem[] => {
    const notifications: NotificationItem[] = [];

    chatRooms.forEach(room => {
      const recentMessages = room.messages
        .filter(msg => !msg.isMe && msg.timestamp > Date.now() - 24 * 60 * 60 * 1000) // 24시간 내 메시지
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 3); // 최근 3개

      recentMessages.forEach(message => {
        notifications.push({
          id: `${room.id}-${message.id}`,
          type: 'new_message',
          chatRoomId: room.id,
          chatRoomTitle: room.title,
          senderName: message.senderName,
          messageContent: message.content,
          timestamp: message.timestamp
        });
      });
    });

    return notifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5); // 최대 5개
  };

  const notifications = getNotifications();

  const handleNotificationClick = (notification: NotificationItem) => {
    navigate(`/chat/${notification.chatRoomId}`);
    onClose();
  };

  const formatTime = (timestamp: number) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={`absolute z-50 ${className}`}
      style={{
        ...popupStyle,
        animation: isOpen ? 'var(--animate-popup-in)' : 'var(--animate-popup-out)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 min-w-[320px] max-w-[400px]">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">알림</h3>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              새로운 알림이 없습니다
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {notification.senderName.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm">
                        {notification.senderName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 mb-1">
                      {notification.chatRoomTitle}
                    </div>

                    <div className="text-sm text-gray-700 line-clamp-2">
                      {notification.messageContent}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => {
                navigate('/chat');
                onClose();
              }}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              모든 채팅 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
