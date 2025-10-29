import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SimpleHeader, Navigation } from '@/components/common';

export default function LoungeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 메인 페이지에서만 floating button 표시
  const showFloatingButton = location.pathname === '/lounge';

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <SimpleHeader title="라운지" />
      <main
        className="flex-1 overflow-y-auto animate-fade-in"
        style={{ opacity: 0, animationDelay: '0.2s' }}
      >
        <Outlet />
      </main>
      <Navigation className="flex-shrink-0" />

      {/* Floating Write Button */}
      {showFloatingButton && (
        <button
          onClick={() => navigate('/lounge/write')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-500 transition-colors z-50"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}
