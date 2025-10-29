import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom, registerFormAtom } from '@/atoms/register';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { Button } from '@/components/common';

export default function ActivityRegion() {
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
  const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setRegisterForm({
      ...registerForm,
      address: fullAddress,
    });
  };

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (registerForm.name.length < 1) {
      navigate('/register');
      return;
    }

    setIsNextButtonEnabled(registerForm.address.length > 0);
  }, [registerForm.address]);

  return (
    <div>
      <PageTitle
        ref={headingRef}
        text={
          <>
            동의해 주셔서 감사합니다.{'\n'}
            {'\n'}
            <strong>{registerForm.name}님</strong>은 <strong>어디에서</strong>
            {'\n'}
            주로 활동하고 계신가요?
          </>
        }
        aria-label={`동의해 주셔서 감사합니다. ${registerForm.name}님은 어디에서 주로 활동하고 계신가요?`}
        className="mb-4"
      />
      {registerForm.address.length > 0 ? (
        <div className="mb-4 mt-8" role="region" aria-label="선택된 활동 지역 정보">
          <p className="text-lg font-bold text-gray-500 mb-4 whitespace-pre-line" aria-label="선택하신 주소">
            {registerForm.address.split('(').join(`\n(`)}
          </p>
          <Button
            onClick={() => setRegisterForm({ ...registerForm, address: '' })}
            aria-label="주소 다시 선택하기"
          >
            주소 수정
          </Button>
        </div>
      ) : (
        <div
          role="application"
          aria-label="주소 검색"
          aria-describedby="address-search-desc"
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <div id="address-search-desc" className="sr-only">
            주소 검색을 위한 우편번호 서비스입니다.
            검색창에 주소를 입력하거나 도로명, 지번으로 검색할 수 있습니다.
          </div>
          <DaumPostcodeEmbed onComplete={handleComplete} />
        </div>
      )}
    </div>
  );
}
