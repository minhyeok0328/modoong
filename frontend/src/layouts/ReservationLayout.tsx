import { Outlet } from 'react-router-dom';
import { Navigation, SimpleHeader } from '@/components/common';

export default function ReservationLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SimpleHeader title="예약하기" />
      <main
        className="flex-1 overflow-x-hidden animate-fade-in"
        style={{ opacity: 0, animationDelay: '0.2s' }}
      >
        <Outlet />
      </main>
      <Navigation className="flex-shrink-0" />
    </div>
  );
}
