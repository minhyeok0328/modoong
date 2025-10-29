import { useState, useRef, useEffect } from 'react';

interface UseVirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  viewportHeight: number;
  overscanCount?: number;
  getItemId?: (item: T) => string | number;
}

export const useVirtualScroll = <T>({
  items,
  itemHeight,
  viewportHeight,
  overscanCount = 5,
  getItemId,
}: UseVirtualScrollProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);

  // 중복 제거된 아이템들
  const deduplicatedItems = getItemId
    ? Array.from(new Map(items.map((item) => [getItemId(item), item])).values())
    : items;

  const totalHeight = deduplicatedItems.length * itemHeight;

  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + overscanCount, deduplicatedItems.length);

  const slicedItems = deduplicatedItems.slice(Math.max(0, startIndex - overscanCount), endIndex);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getItemStyle = (index: number) => ({
    position: 'absolute' as const,
    top: `${index * itemHeight}px`,
    width: '100%',
  });

  return {
    containerRef,
    totalHeight,
    slicedItems,
    getItemStyle,
    slicedStartIndex: Math.max(0, startIndex - overscanCount),
  };
};
