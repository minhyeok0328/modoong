import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom, registerFormAtom } from '@/atoms/register';
import { Checkbox, Input } from '@/components/common';
import { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DISABILITY_TYPES, GetDisabilityTypesData } from '@/graphql/queries';

export default function ActivityPreference() {
  const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
  const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { data, loading } = useQuery<GetDisabilityTypesData>(GET_DISABILITY_TYPES);

  const handleAccessibilityStatus = (code: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      accessibilityStatus: {
        ...registerForm.accessibilityStatus,
        [code]: e.target.checked,
      },
    });
  };

  const handleOtherImpairmentDescription = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      otherDisabilityDescription: target.value,
    });
  };

  useEffect(() => {
    headingRef.current?.focus();
    setIsNextButtonEnabled(true);
  }, []);

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="flex items-center justify-center py-8">
        <span className="text-lg">장애 유형 정보를 불러오고 있습니다...</span>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        ref={headingRef}
        text={
          <>
            <strong>{registerForm.name}님</strong>의 <strong>운동</strong>을{'\n'}
            도와 드리기 위해{'\n'}
            {'\n'}
            <strong>모둥이</strong>가 <strong>참고</strong>해야 할{'\n'}
            부분이 있을까요?
          </>
        }
        aria-label={`${registerForm.name}님의 체육활동을 도와 드리기 위해 모둥이가 참고해야 할 부분이 있을까요?`}
        className="mb-8"
      />
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap justify-between gap-4">
          {data?.disabilityTypes.map(({ code, name }) => (
            <Checkbox
              key={code}
              name={code}
              label={name}
              checked={Boolean(registerForm.accessibilityStatus[code])}
              onChange={handleAccessibilityStatus(code)}
              size="md"
              className="mb-4 min-w-[45%]"
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <Input
            name="otherImpairmentDescription"
            label="그 외에 다른 불편함이 있어요"
            id="otherImpairmentDescription"
            value={registerForm.otherDisabilityDescription}
            onChange={handleOtherImpairmentDescription}
          />
        </div>
      </div>
    </div>
  );
}
