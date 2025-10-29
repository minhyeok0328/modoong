import { Outlet } from 'react-router-dom';
import { Navigation, SimpleHeader } from '@/components/common';

export default function FriendFinderLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SimpleHeader title="운동친구 찾기" />
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
