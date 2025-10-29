import { Outlet } from 'react-router-dom';
import { Header, Navigation } from '@/components/common';

export default function Default() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header className="flex-shrink-0 h-12 px-6" />
      <main
        className="flex-1 overflow-y-auto px-6 py-4 animate-fade-in"
        style={{ opacity: 0, animationDelay: '0.2s' }}
      >
        <Outlet />
      </main>
      <Navigation className="flex-shrink-0" />
    </div>
  );
}
