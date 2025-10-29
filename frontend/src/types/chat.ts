export interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  senderId: string;
  senderName: string;
  isMe: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
}

export type ChatType = 'group' | 'personal';

export interface ChatRoom {
  id: string;
  type: ChatType;
  title: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  createdAt: number;
  updatedAt: number;
}

export interface CreateMessageInput {
  content: string;
  roomId: string;
}