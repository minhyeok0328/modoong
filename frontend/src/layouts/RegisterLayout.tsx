import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button, SimpleHeader, ProgressBar } from '@/components/common';
import { routes } from '@/routes';
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

  const registerRoot = routes.find((route) => route.path === REGISTER_BASE);
  const registerChildren = registerRoot?.children ?? [];

  const pathForIndex = (index: number | undefined) => {
    if (index === undefined || index < 0 || index >= registerChildren.length) return null;
    const child = registerChildren[index];
    return child.path === '' ? REGISTER_BASE : `${REGISTER_BASE}/${child.path}`;
  };

  // form 데이터 없이 진입 시 루트로 이동 (단, /register 루트는 예외)
  useEffect(() => {
    if (location.pathname !== REGISTER_BASE && !registerForm?.name) {
      navigate(REGISTER_BASE);
    }
  }, [registerForm, location.pathname, navigate]);

  const currentStepIndex = registerChildren.findIndex(
    (_, idx) => location.pathname === pathForIndex(idx)
  );
  const nextPath =
    location.pathname === REGISTER_BASE ? pathForIndex(1) : pathForIndex(currentStepIndex + 1);
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
            totalSteps={registerChildren.length}
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
            {currentStepIndex >= 0 && `회원가입 ${currentStepIndex + 1}단계 중 ${registerChildren.length}단계`}
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
          {isRegisterComplete ? '시작하기' : '다음'}
        </Button>
        {!isRegisterComplete && (
          <div id="next-button-desc" className="sr-only">
            {enableNextButton
              ? `다음 단계로 이동합니다. 현재 ${registerChildren.length}단계 중 ${currentStepIndex + 1}단계`
              : '필수 정보를 입력한 후 다음 단계로 진행할 수 있습니다.'
            }
          </div>
        )}
      </nav>
    </div>
  );
}
