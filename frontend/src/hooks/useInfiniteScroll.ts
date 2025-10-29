import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (callback: () => void, options: IntersectionObserverInit = {}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      { threshold: 0.5, ...options }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return observerRef;
};
