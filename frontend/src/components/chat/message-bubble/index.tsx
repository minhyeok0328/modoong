import dayjs from 'dayjs';
import { ChatMessage } from '@/types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
  showSenderName?: boolean;
  showAvatar?: boolean;
}

export default function MessageBubble({
  message,
  showSenderName = false,
  showAvatar = false
}: MessageBubbleProps) {
  const formatTime = (timestamp: number) => {
    return dayjs(timestamp).format('오후 h:mm');
  };

  return (
    <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
      {!message.isMe && showAvatar && (
        <div className="w-8 h-8 rounded-full bg-yellow-400 mr-2 flex-shrink-0 flex items-center justify-center text-white text-xs">
          👤
        </div>
      )}
      <div className={`max-w-xs ${message.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        {!message.isMe && showSenderName && (
          <span className="text-xs text-gray-600 mb-1">{message.senderName}</span>
        )}
        <div
          className={`px-4 py-3 rounded-2xl max-w-xs shadow-sm ${
            message.isMe
              ? 'bg-yellow-400'
              : 'bg-white text-gray-800'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
