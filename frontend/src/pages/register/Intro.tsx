import { Input, Button } from '@/components/common';
import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { registerFormAtom, isNextButtonEnabledAtom } from '@/atoms/register';
import { useEffect, useRef, useState } from 'react';
import { useInput } from '@/components/common/input/hooks/useInput';

export default function Register() {
  const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
  const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [showBusinessPopup, setShowBusinessPopup] = useState(false);

  const nameInput = useInput({
    initialValue: registerForm.name,
    validator: (value) => value.length > 0,
  });

  useEffect(() => {
    setRegisterForm({ ...registerForm, name: nameInput.value });

    // Enable next button logic:
    // Type 1: Needs Name + Type
    // Type 2: Needs Type only (Name is in next step)
    if (registerForm.userType === 1) {
      setIsNextButtonEnabled(nameInput.value.length > 0);
    } else {
      setIsNextButtonEnabled(registerForm.userType !== 0);
    }
  }, [nameInput.value, registerForm.userType]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleUserTypeSelect = (type: number) => {
    if (type === 3) {
      setShowBusinessPopup(true);
      return;
    }
    setRegisterForm({ ...registerForm, userType: type });
  };

  return (
    <div className="h-full flex flex-col justify-center relative">
      <PageTitle
        ref={headingRef}
        text={
          <>
            <b>모두의운동장</b>에{'\n'}
            오신 것을{'\n'}
            환영합니다:)
          </>
        }
        aria-label="모두의운동장에 오신 것을 환영합니다:)"
        className="mb-10"
      />

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">어떤 목적으로 오셨나요?</label>
        <div className="flex flex-col gap-3">
          <Button
            variant={registerForm.userType === 2 ? 'primary' : 'outline'}
            onClick={() => handleUserTypeSelect(2)}
            fullWidth
            className="h-auto py-4 flex flex-col items-start gap-1"
          >
            <span className="text-lg font-bold">운동을 도와줄래요</span>
            <span className="text-sm font-normal opacity-80 text-left">
              비장애인이거나 자원봉사, 활동보조,{'\n'}보호자/가족이에요!
            </span>
          </Button>

          <Button
            variant={registerForm.userType === 1 ? 'primary' : 'outline'}
            onClick={() => handleUserTypeSelect(1)}
            fullWidth
            className="h-auto py-4 flex flex-col items-start gap-1"
          >
            <span className="text-lg font-bold">운동을 함께할래요</span>
            <span className="text-sm font-normal opacity-80 text-left">
              장애인이거나 운동에 도움이 필요해요!
            </span>
          </Button>
        </div>
      </div>

      {registerForm.userType === 1 && (
        <div className="animate-fade-in">
          <Input
            name="name"
            label="성함"
            placeholder="성함을 입력해주세요."
            autoComplete="name"
            error={nameInput.value && !nameInput.isValid ? '성함을 입력해주세요.' : undefined}
            value={nameInput.value}
            onChange={nameInput.onChange}
            required
          />
        </div>
      )}



      {showBusinessPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[80%] max-w-sm shadow-xl animate-fade-in-up">
            <h3 className="text-lg font-bold text-center mb-4">알림</h3>
            <p className="text-center text-gray-600 mb-6">현재 개발 중입니다.</p>
            <Button
              fullWidth
              onClick={() => setShowBusinessPopup(false)}
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
