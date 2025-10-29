import { Agreement } from '@/components/register';
import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom, registerFormAtom } from '@/atoms/register';
import { useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef } from 'react';

export default function PrivacyAgreement() {
  const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
  const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();

  const agreements = [
    { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
    { id: 'data', label: '데이터 수집 및 이용 동의', required: true },
  ];

  const handleChange = (checkedIds: string[]) => {
    const isAllAgreed = checkedIds.length === agreements.length;
    setRegisterForm({ ...registerForm, agreement: isAllAgreed });
  };

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (registerForm.name.length < 1) {
      navigate('/register');
      return;
    }

    setIsNextButtonEnabled(registerForm.agreement);
  }, [registerForm.name, registerForm.agreement]);

  return (
    <div className="h-full flex flex-col justify-center">
      <PageTitle
        ref={headingRef}
        text={
          <>
            안녕하세요!
            {'\n'}
            {'\n'}
            <strong>{registerForm.name}님</strong>과 함께 할{'\n'}
            AI 비서 <strong>모둥이</strong> 입니다:){'\n'}
            {'\n'}더 깊은 대화를 위해{'\n'}
            <strong>개인정보이용</strong>을{'\n'}
            <strong>동의</strong>해주세요
          </>
        }
        aria-label={`안녕하세요! ${registerForm.name}님과 함께 할 AI 비서 모둥이 입니다:) 더 깊은 대화를 위해 개인정보이용을 동의해주세요`}
        className="mb-10"
      />

      <Agreement agreements={agreements} onChange={handleChange} />
    </div>
  );
}
