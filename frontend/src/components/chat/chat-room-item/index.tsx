import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { ChatRoom } from '@/types/chat';

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface ChatRoomItemProps {
  room: ChatRoom;
  onClick: (roomId: string) => void;
}

export default function ChatRoomItem({ room, onClick }: ChatRoomItemProps) {
  const formatTime = (timestamp: number) => {
    return dayjs(timestamp).fromNow();
  };

  const getParticipantCount = (room: ChatRoom) => {
    if (room.type === 'personal') return '';
    return room.participants.length;
  };

  return (
    <div
      className="flex items-center p-4 my-2 bg-white rounded-lg transition-shadow cursor-pointer border-b border-gray-200"
      onClick={() => onClick(room.id)}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full mr-3 flex-shrink-0">
        {room.type === 'group' ? (
          <div className="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs font-bold">
            그룹
          </div>
        ) : (
          <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
            👤
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center min-w-0 flex-1 mr-2">
            <h3 className="font-semibold text-base truncate mr-2 flex-shrink">
              {room.title}
            </h3>
            {room.type === 'group' && (
              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                {getParticipantCount(room)}명
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
            {formatTime(room.lastMessage?.timestamp || room.updatedAt)}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate mt-1">
          {room.lastMessage?.content || [...room.messages].pop()?.content || '메시지가 없습니다.'}
        </p>
      </div>
    </div>
  );
}
