import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/common';

export default function LoungePostLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main
        className="flex-1 overflow-y-auto animate-fade-in"
        style={{ opacity: 0, animationDelay: '0.2s' }}
      >
        <Outlet />
      </main>
      <Navigation className="flex-shrink-0" />
    </div>
  );
}
