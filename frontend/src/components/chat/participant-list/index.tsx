import { useEffect, useRef } from 'react';
import { ChatParticipant } from '@/types/chat';

interface ParticipantListProps {
  participants: ChatParticipant[];
  isVisible: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function ParticipantList({ participants, isVisible, onClose, triggerRef }: ParticipantListProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose, triggerRef]);

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-16 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px] max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs">
          👤
        </div>
        <h3 className="font-semibold text-gray-800">참여자 ({participants.length}명)</h3>
      </div>

      <div className="space-y-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white text-sm">
              👤
            </div>
            <span className="font-medium text-gray-700">{participant.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
