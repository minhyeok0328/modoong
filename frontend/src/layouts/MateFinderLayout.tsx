import { Outlet, useLocation } from 'react-router-dom';
import { Navigation, SimpleHeader, ProgressBar } from '@/components/common';

export default function MateFinderLayout() {
  const location = useLocation();

  // URL에서 현재 step 추출 (예: /mate/finder/step3 -> 3)
  const currentStepMatch = location.pathname.match(/step(\d+)/);
  const currentStep = currentStepMatch ? parseInt(currentStepMatch[1], 10) : 1;

  // Step5까지만 진행률 표시 (Step6은 완료 페이지)
  const shouldShowProgress = currentStep <= 5;
  const totalSteps = 5;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SimpleHeader title="모둥메이트 찾기" />

      {/* Progress indicator - Step5까지만 표시 */}
      {shouldShowProgress && (
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          label="모둥메이트 찾기 진행률"
        />
      )}

      <main
        className="flex-1 overflow-y-auto px-6 py-4 animate-fade-in"
        style={{ opacity: 0, animationDelay: '0.2s' }}
        role="main"
        aria-label={shouldShowProgress ? `모둥메이트 찾기 ${currentStep}단계` : '모둥메이트 찾기 완료'}
      >
        {/* Live region for step announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {shouldShowProgress && `모둥메이트 찾기 ${currentStep}단계 중 ${totalSteps}단계`}
        </div>
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
