import { useState, useRef } from 'react';
import { Swiper as SwiperType } from 'swiper';

export interface UseProfileCardSwiperReturn {
  // Swiper 상태
  isBeginning: boolean;
  isEnd: boolean;
  swiperRef: React.RefObject<SwiperType | null>;

  // Swiper 이벤트 핸들러
  handleSlideChange: (swiper: SwiperType) => void;
  handleSwiper: (swiper: SwiperType) => void;

  // 네비게이션 핸들러
  slidePrev: () => void;
  slideNext: () => void;
}

export const useProfileCardSwiper = (): UseProfileCardSwiperReturn => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSwiper = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    swiperRef.current = swiper;
  };

  const slidePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const slideNext = () => {
    swiperRef.current?.slideNext();
  };

  return {
    isBeginning,
    isEnd,
    swiperRef,
    handleSlideChange,
    handleSwiper,
    slidePrev,
    slideNext,
  };
};
