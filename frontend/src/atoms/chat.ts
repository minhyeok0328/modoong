import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { ChatRoom, ChatMessage, CreateMessageInput } from '@/types/chat';
import { defaultChatRooms } from '@/mocks/chat';

// Mock current user
export const currentUserAtom = atom({
  id: 'user-1',
  name: '나',
});


const localJSONStorage = createJSONStorage<ChatRoom[]>(() => localStorage);

// Chat rooms atom with localStorage persistence
export const chatRoomsAtom = atomWithStorage<ChatRoom[]>(
  'chatRooms',
  defaultChatRooms,
  localJSONStorage
);

// Selected chat room atom
export const selectedChatRoomIdAtom = atom<string | null>(null);

// Get selected chat room
export const selectedChatRoomAtom = atom((get) => {
  const rooms = get(chatRoomsAtom);
  const selectedId = get(selectedChatRoomIdAtom);
  return rooms.find(room => room.id === selectedId) || null;
});

// Chat actions
export const sendMessageAtom = atom(
  null,
  (get, set, input: CreateMessageInput) => {
    const rooms = get(chatRoomsAtom);
    const currentUser = get(currentUserAtom);

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: input.content,
      timestamp: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      isMe: true,
    };

    const updatedRooms = rooms.map(room => {
      if (room.id === input.roomId) {
        return {
          ...room,
          messages: [...room.messages, newMessage],
          lastMessage: newMessage,
          updatedAt: Date.now(),
        };
      }
      return room;
    });

    set(chatRoomsAtom, updatedRooms);
  }
);

// Create new chat room for reservation
export const createReservationChatRoomAtom = atom(
  null,
  (get, set, chatRoom: ChatRoom) => {
    const rooms = get(chatRoomsAtom);
    
    // Check if room already exists
    const existingRoom = rooms.find(room => room.id === chatRoom.id);
    if (existingRoom) {
      return false;
    }
    
    // Add new room to the beginning of the list
    set(chatRoomsAtom, [chatRoom, ...rooms]);
    return true;
  }
);

// Create new personal chat room
export const createPersonalChatRoomAtom = atom(
  null,
  (get, set, friendData: { id: number; name: string }) => {
    const rooms = get(chatRoomsAtom);
    const currentUser = get(currentUserAtom);
    
    // Create unique chat room ID based on friend ID
    const chatRoomId = `personal-${friendData.id}`;
    
    // Check if room already exists
    const existingRoom = rooms.find(room => room.id === chatRoomId);
    if (existingRoom) {
      return { success: false, roomId: chatRoomId };
    }
    
    // Create new personal chat room
    const newChatRoom: ChatRoom = {
      id: chatRoomId,
      type: 'personal',
      title: friendData.name,
      participants: [
        { id: currentUser.id, name: currentUser.name },
        { id: `friend-${friendData.id}`, name: friendData.name }
      ],
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // Add new room to the beginning of the list
    set(chatRoomsAtom, [newChatRoom, ...rooms]);
    return { success: true, roomId: chatRoomId };
  }
);
