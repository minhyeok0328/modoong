import { Input } from '@/components/common';
import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { registerFormAtom, isNextButtonEnabledAtom } from '@/atoms/register';
import { useEffect, useRef } from 'react';
import { useInput } from '@/components/common/input/hooks/useInput';

const INPUT_OPTIONS = {
  name: 'name',
  label: '성함',
  placeholder: '성함을 입력해주세요.',
  autoComplete: 'name',
  error: '성함을 입력해주세요.',
};

export default function Register() {
  const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
  const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const nameInput = useInput({
    initialValue: registerForm.name,
    validator: (value) => value.length > 0,
  });

  useEffect(() => {
    setRegisterForm({ ...registerForm, name: nameInput.value });
    setIsNextButtonEnabled(nameInput.value.length > 0);
  }, [nameInput.value]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="h-full flex flex-col justify-center">
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
      <div>
        <Input
          {...INPUT_OPTIONS}
          required={true}
          value={nameInput.value}
          onChange={nameInput.onChange}
        />
      </div>
    </div>
  );
}
