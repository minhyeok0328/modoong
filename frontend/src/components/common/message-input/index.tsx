import { useState } from 'react';
import { IoSend } from 'react-icons/io5';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessage,
  placeholder = '메시지를 입력하세요...',
  disabled = false
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-100 bg-white">
      <div className="flex items-center space-x-3">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-3">
          <input
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent resize-none outline-none text-sm disabled:opacity-50"
          />
        </div>
        <button
          className={`rounded-full flex items-center justify-center transition-colors p-3 rotate-270 ${
            message.trim() && !disabled
              ? 'bg-yellow-400 hover:bg-yellow-500'
              : 'bg-gray-300 text-gray-500'
          }`}
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled}
        >
          <IoSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
