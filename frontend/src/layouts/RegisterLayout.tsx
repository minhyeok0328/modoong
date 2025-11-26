import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button, SimpleHeader, ProgressBar } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom, registerFormAtom } from '@/atoms/register';
import { useEffect } from 'react';

const REGISTER_BASE = '/register';
const COMPLETE_PATH = `${REGISTER_BASE}/register-complete`;

export default function RegisterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enableNextButton, setEnableNextButton] = useAtom(isNextButtonEnabledAtom);
  const [registerForm] = useAtom(registerFormAtom);





  // form 데이터 없이 진입 시 루트로 이동 (단, /register 루트는 예외)
  useEffect(() => {
    // UserType 2 collects name in common-onboarding, so we allow it without name
    const isCommonOnboarding = location.pathname.includes('common-onboarding');

    if (location.pathname !== REGISTER_BASE && !registerForm?.name && !isCommonOnboarding) {
      navigate(REGISTER_BASE);
    }
  }, [registerForm, location.pathname, navigate]);

  // Define steps for each user type
  const TYPE1_STEPS = [
    '', // Intro
    'privacy-agreement',
    'activity-region',
    'activity-preference',
    'sport-preference',
    'activity-schedule',
    'register-complete',
  ];

  const TYPE2_STEPS = [
    '', // Intro
    'common-onboarding',
    'role-selection',
    'terms-and-conditions',
    'role-questions',
    'welcome',
    'promises',
    'register-complete', // Reusing complete page or create new one if needed
  ];

  const currentSteps = registerForm.userType === 2 ? TYPE2_STEPS : TYPE1_STEPS;

  // Find current step index in the specific flow
  const currentStepIndex = currentSteps.findIndex((path) => {
    const fullPath = path === '' ? REGISTER_BASE : `${REGISTER_BASE}/${path}`;
    return location.pathname === fullPath;
  });

  const nextPath =
    currentStepIndex >= 0 && currentStepIndex < currentSteps.length - 1
      ? currentSteps[currentStepIndex + 1] === ''
        ? REGISTER_BASE
        : `${REGISTER_BASE}/${currentSteps[currentStepIndex + 1]}`
      : null;

  const isRegisterComplete = location.pathname === COMPLETE_PATH;

  const handleBackClick = () => {
    if (location.pathname === REGISTER_BASE) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const handleButtonClick = () => {
    if (isRegisterComplete) {
      navigate('/');
      return;
    }

    if (nextPath) {
      navigate(nextPath);
      setEnableNextButton(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <SimpleHeader title="회원가입" onBackClick={handleBackClick} />
        {/* Progress indicator */}
        {currentStepIndex >= 0 && !isRegisterComplete && (
          <ProgressBar
            currentStep={currentStepIndex + 1}
            totalSteps={currentSteps.length}
            label="회원가입 진행률"
          />
        )}

        <main
          className="animate-fade-in px-6 py-4"
          style={{ opacity: 0, animationDelay: '0.2s' }}
          role="main"
          aria-label={`회원가입 ${currentStepIndex + 1}단계`}
        >
          {/* Live region for step announcements */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            role="status"
          >
            {currentStepIndex >= 0 && `회원가입 ${currentStepIndex + 1}단계 중 ${currentSteps.length}단계`}
          </div>
          <Outlet />
        </main>
      </div>
      <nav
        className="flex justify-center w-full animate-fade-in px-6 py-4"
        style={{ opacity: 0, animationDelay: '0.5s' }}
        aria-label="회원가입 진행 내비게이션"
      >
        <Button
          className="mt-4 mx-8 mb-2"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleButtonClick}
          disabled={isRegisterComplete ? false : !enableNextButton}
          aria-describedby={isRegisterComplete ? undefined : "next-button-desc"}
        >
          {isRegisterComplete
            ? (registerForm.userType === 2 ? '뛰러 가기' : '시작하기')
            : location.pathname.includes('promises') ? '약속할게요' : '다음'}
        </Button>
        {!isRegisterComplete && (
          <div id="next-button-desc" className="sr-only">
            {enableNextButton
              ? `다음 단계로 이동합니다. 현재 ${currentSteps.length}단계 중 ${currentStepIndex + 1}단계`
              : '필수 정보를 입력한 후 다음 단계로 진행할 수 있습니다.'
            }
          </div>
        )}
      </nav>
    </div>
  );
}
