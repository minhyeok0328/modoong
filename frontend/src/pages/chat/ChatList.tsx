import { useState } from 'react';
import { useAtom } from 'jotai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { chatRoomsAtom } from '@/atoms/chat';
import { ChatType } from '@/types/chat';
import { SimpleHeader } from '@/components/common';
import { ChatRoomItem } from '@/components/chat';


export default function ChatList() {
  const [searchParams] = useSearchParams();
  const chatType = searchParams.get('type') as ChatType;
  const [activeTab, setActiveTab] = useState<ChatType>(chatType || 'group');
  const [chatRooms] = useAtom(chatRoomsAtom);
  const navigate = useNavigate();

  const filteredRooms = chatRooms.filter(room => room.type === activeTab);

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  const handleTabClick = (tab: ChatType) => {
    setActiveTab(tab);
    navigate(`/chat?type=${tab}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <SimpleHeader title="채팅" onBackClick={() => navigate('/')} />

      {/* Tabs */}
      <div className="flex bg-white">
        <button
          className={`flex-1 py-4 text-center transition-colors ${
            activeTab === 'group'
              ? 'border-b-2 border-yellow-400 font-semibold text-yellow-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabClick('group')}
        >
          단체
        </button>
        <button
          className={`flex-1 py-4 text-center transition-colors ${
            activeTab === 'personal'
              ? 'border-b-2 border-yellow-400 font-semibold text-yellow-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabClick('personal')}
        >
          개인
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.map((room) => (
          <ChatRoomItem
            key={room.id}
            room={room}
            onClick={handleRoomClick}
          />
        ))}
      </div>
    </div>
  );
}
