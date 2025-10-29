import { ReactNode } from 'react';

interface SpeechBubbleProps {
  children: ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function SpeechBubble({
  children,
  className = '',
  position = 'top',
}: SpeechBubbleProps) {
  const arrowStyles = {
    top: 'after:top-full after:right-5 after:-ml-2 after:border-l-transparent after:border-r-transparent after:border-b-transparent after:border-t-blue-500',
    bottom: 'after:bottom-full after:left-1/2 after:-ml-2 after:border-l-transparent after:border-r-transparent after:border-t-transparent after:border-b-blue-500',
    left: 'after:left-full after:top-1/2 after:-mt-2 after:border-t-transparent after:border-b-transparent after:border-r-transparent after:border-l-blue-500',
    right: 'after:right-full after:top-1/2 after:-mt-2 after:border-t-transparent after:border-b-transparent after:border-l-transparent after:border-r-blue-500',
  };

  return (
    <div
      className={`
        fixed z-50 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg
        after:content-[''] after:absolute after:w-0 after:h-0 after:border-[8px]
        ${arrowStyles[position]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
