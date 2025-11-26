import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom, registerFormAtom } from '@/atoms/register';
import { useMutation, useQuery } from '@apollo/client';
import { SIGN_UP } from '@/graphql/mutations/auth';
import { useEffect, useRef, useState } from 'react';
import { GET_TOKEN_PAYLOAD } from '@/graphql/queries';

export default function RegisterComplete() {
  const [registerForm] = useAtom(registerFormAtom);
  const [signUp] = useMutation(SIGN_UP);
  const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const isRequestSent = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (registerForm.name && !isRequestSent.current) {
      setRegistrationStatus('회원가입을 진행하고 있습니다...');
      signUp({
        variables: {
          signUpUserInput: registerForm,
        },
      }).then(() => {
        setRegistrationStatus('회원가입이 완료되었습니다!');
        // 회원가입 성공 후 토큰 정보 수동으로 가져오기
        refetch();
      }).catch(() => {
        setRegistrationStatus('회원가입 중 오류가 발생했습니다.');
      });
    }
    isRequestSent.current = true;
    setIsNextButtonEnabled(true);
  }, [registerForm, signUp]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // 토큰 정보 가져오기
  const { refetch } = useQuery(GET_TOKEN_PAYLOAD, {
    skip: true, // 초기에는 실행하지 않고 수동으로 실행
  });

  return (
    <div>
      {/* Live region for registration status announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {registrationStatus}
      </div>

      <PageTitle
        ref={headingRef}
        text={
          registerForm.userType === 2 ? (
            <>
              자, 이제{'\n'}
              <b>모두의 운동장</b>에서{'\n'}
              함께 뛰어볼까요?
            </>
          ) : (
            <>
              <b>{registerForm.name}님,</b>
              {'\n'}
              저희와 함께해줘서{'\n'}
              너무 고마워요:){'\n'}
              {'\n'}
              도움이 필요하면{'\n'}
              언제든 <b>모둥이</b>를{'\n'}
              불러주세요!
            </>
          )
        }
        subText={
          registerForm.userType === 2
            ? '지금 가까운 곳에서 도움이 필요한 운동 일정을 확인하고,\n첫 걸음을 함께 시작해 보세요.'
            : undefined
        }
        aria-label={
          registerForm.userType === 2
            ? '자, 이제 모두의 운동장에서 함께 뛰어볼까요? 지금 가까운 곳에서 도움이 필요한 운동 일정을 확인하고, 첫 걸음을 함께 시작해 보세요.'
            : `${registerForm.name}님, 저희와 함께해줘서 너무 고마워요:) 도움이 필요하면 언제든 모둥이를 불러주세요!`
        }
        className="mb-8"
      />
      {registerForm.userType !== 2 && (
        <p className="text-sm text-gray-500" role="note">
          '안녕 모둥이' 라고 말하면 AI 비서 모둥이가 등장해요
        </p>
      )}
    </div>
  );
}
