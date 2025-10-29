import { useState } from 'react';
import { FaLink, FaShare, FaFacebookF } from 'react-icons/fa';
import { SiKakao } from 'react-icons/si';
import { useSharePopup } from './hooks/useSharePopup';

interface ShareOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

export interface SharePopupProps {
  /** 공유할 URL */
  url?: string;
  /** 공유할 제목 */
  title?: string;
  /** 공유할 설명 */
  description?: string;
  /** 팝업 열림 상태 */
  isOpen: boolean;
  /** 팝업 닫기 함수 */
  onClose: () => void;
  /** 트리거 버튼 ref */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 외부 클릭 감지 여부 */
  closeOnOutsideClick?: boolean;
}

const SharePopup = ({
  url = window.location.href,
  isOpen,
  onClose,
  triggerRef,
  className = '',
  closeOnOutsideClick = true,
}: SharePopupProps) => {
  const { popupRef } = useSharePopup({ isOpen, onClose, closeOnOutsideClick, triggerRef });
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('URL 복사 실패:', err);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'url',
      name: copiedUrl ? '복사완료!' : 'URL 복사',
      icon: <FaLink />,
      color: 'bg-gray-500',
      action: handleCopyUrl,
    },
    {
      id: 'kakao',
      name: '카카오톡',
      icon: <SiKakao />,
      color: 'bg-yellow-400',
      action: () => {
        alert('카카오톡 공유 기능은 추후 연동될 예정입니다.');
      },
    },
    {
      id: 'facebook',
      name: '페이스북',
      icon: <FaFacebookF />,
      color: 'bg-blue-600',
      action: () => {
        alert('페이스북 공유 기능은 추후 연동될 예정입니다.');
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={`absolute z-50 mt-2 ${className}`}
      style={{
        animation: isOpen ? 'var(--animate-popup-in)' : 'var(--animate-popup-out)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-4 min-w-[280px]">
        <div className="flex items-center gap-2 mb-3">
          <FaShare className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">공유하기</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
                option.action();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${option.color}`}>
                {option.icon}
              </div>
              <span className="text-xs text-gray-700 text-center">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
