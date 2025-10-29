import { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { IoSettingsOutline } from 'react-icons/io5';
import { SlArrowLeft } from 'react-icons/sl';
import { selectedChatRoomIdAtom, selectedChatRoomAtom, sendMessageAtom } from '@/atoms/chat';
import { MessageBubble, ChatInput, ParticipantList } from '@/components/chat';

export default function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [, setSelectedRoomId] = useAtom(selectedChatRoomIdAtom);
  const [selectedRoom] = useAtom(selectedChatRoomAtom);
  const [, sendMessage] = useAtom(sendMessageAtom);
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (roomId) {
      setSelectedRoomId(roomId);
    }
  }, [roomId, setSelectedRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedRoom?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (message: string) => {
    if (!roomId) return;

    sendMessage({
      content: message,
      roomId,
    });
  };

  const formatDateSeparator = (timestamp: number) => {
    return dayjs(timestamp).format('YYYY년 M월 D일 dddd');
  };

  if (!selectedRoom) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>채팅방을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => navigate('/chat')}
        >
          <SlArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold truncate flex-1 mx-4 text-center">
          {selectedRoom.title}
        </h1>
        {selectedRoom.type === 'group' && (
          <button
            ref={settingsButtonRef}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <IoSettingsOutline className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Participants Panel */}
      <ParticipantList
        participants={selectedRoom.participants}
        isVisible={showParticipants && selectedRoom.type === 'group'}
        onClose={() => setShowParticipants(false)}
        triggerRef={settingsButtonRef}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Separator */}
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            {formatDateSeparator(selectedRoom.messages[0]?.timestamp || Date.now())}
          </span>
        </div>

        {/* Messages */}
        {selectedRoom.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            showSenderName={!msg.isMe && selectedRoom.type === 'group'}
            showAvatar={!msg.isMe}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
