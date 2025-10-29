import { Outlet } from 'react-router-dom';
import { Navigation, SimpleHeader } from '@/components/common';

export default function MateApplicationLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SimpleHeader title="모둥메이트 신청" />
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
