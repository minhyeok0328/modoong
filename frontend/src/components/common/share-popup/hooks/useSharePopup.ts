import { useEffect, useRef } from 'react';

interface UseSharePopupOptions {
  /** 팝업 열림 상태 */
  isOpen: boolean;
  /** 팝업 닫기 함수 */
  onClose: () => void;
  /** 외부 클릭 감지 여부 */
  closeOnOutsideClick?: boolean;
  /** 트리거 버튼 ref */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function useSharePopup({ isOpen, onClose, closeOnOutsideClick = true, triggerRef }: UseSharePopupOptions) {
  const popupRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 팝업 영역이나 트리거 버튼 클릭시에는 닫지 않음
      if (
        popupRef.current?.contains(target) ||
        triggerRef?.current?.contains(target)
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, closeOnOutsideClick]);

  // ESC 키 감지
  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  return {
    popupRef,
  };
}
