import { Input, Button, PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { registerFormAtom, isNextButtonEnabledAtom } from '@/atoms/register';
import { useEffect, useRef, useState } from 'react';
import { useInput } from '@/components/common/input/hooks/useInput';
import DaumPostcodeEmbed from 'react-daum-postcode';

export default function CommonOnboarding() {
    const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
    const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const nameInput = useInput({
        initialValue: registerForm.name,
        validator: (value) => value.length > 0,
    });

    const phoneInput = useInput({
        initialValue: registerForm.phoneNumber || '',
        validator: (value) => /^\d{10,11}$/.test(value),
    });

    const emailInput = useInput({
        initialValue: registerForm.email || '',
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    });

    const [isEmailBlurred, setIsEmailBlurred] = useState(false);

    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

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

        setRegisterForm((prev) => ({
            ...prev,
            address: fullAddress,
            location: {
                lat: 0, // Mock coordinates as we don't have geocoding yet
                lng: 0,
                address: fullAddress,
            },
        }));
        setIsPostcodeOpen(false);
    };

    useEffect(() => {
        setRegisterForm((prev) => ({
            ...prev,
            name: nameInput.value,
            phoneNumber: phoneInput.value,
            email: emailInput.value,
        }));
    }, [nameInput.value, phoneInput.value, emailInput.value, setRegisterForm]);

    useEffect(() => {
        const isValid =
            nameInput.isValid &&
            phoneInput.value !== '' &&
            (emailInput.value === '' || emailInput.isValid) && // Email is optional
            !!registerForm.gender &&
            !!registerForm.ageGroup &&
            !!registerForm.address;

        console.log('Validation Debug:', {
            nameValid: nameInput.isValid,
            phoneValid: phoneInput.isValid,
            emailValid: emailInput.isValid,
            emailValue: emailInput.value,
            gender: registerForm.gender,
            ageGroup: registerForm.ageGroup,
            address: registerForm.address,
            isValid
        });
        console.log('isValid: ', isValid)

        setIsNextButtonEnabled(isValid);
    }, [
        nameInput.isValid,
        phoneInput.value,
        emailInput.isValid,
        emailInput.value,
        registerForm.gender,
        registerForm.ageGroup,
        registerForm.address,
    ]);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col gap-6 pb-10">
            <PageTitle
                ref={headingRef}
                text={
                    <>
                        기본 정보를{'\n'}
                        입력해주세요
                    </>
                }
            />

            <Input
                name="name"
                label="이름"
                placeholder="실명을 입력해주세요"
                value={nameInput.value}
                onChange={nameInput.onChange}
                error={nameInput.isValid ? undefined : '이름을 입력해주세요'}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                <div className="flex gap-2">
                    {['남성', '여성'].map((g) => (
                        <Button
                            key={g}
                            variant={registerForm.gender === g ? 'primary' : 'outline'}
                            onClick={() => setRegisterForm((prev) => ({ ...prev, gender: g }))}
                            fullWidth
                        >
                            {g}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연령대</label>
                <div className="grid grid-cols-3 gap-2">
                    {['10대', '20대', '30대', '40대', '50대', '60대 이상'].map((age) => (
                        <Button
                            key={age}
                            variant={registerForm.ageGroup === age ? 'primary' : 'outline'}
                            onClick={() => setRegisterForm((prev) => ({ ...prev, ageGroup: age }))}
                            size="sm"
                        >
                            {age}
                        </Button>
                    ))}
                </div>
            </div>

            <Input
                name="phoneNumber"
                label="휴대폰 번호"
                placeholder="- 없이 입력해주세요"
                value={phoneInput.value}
                onChange={phoneInput.onChange}
                type="tel"
                error={phoneInput.value && !phoneInput.isValid ? '올바른 전화번호 형식이 아닙니다' : undefined}
            />

            <Input
                name="email"
                label="이메일 (선택)"
                placeholder="example@email.com"
                value={emailInput.value}
                onChange={emailInput.onChange}
                onBlur={() => setIsEmailBlurred(true)}
                type="email"
                error={isEmailBlurred && emailInput.value !== '' && !emailInput.isValid ? '올바른 이메일 형식으로 입력해주세요' : undefined}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">활동 지역</label>
                {!isPostcodeOpen ? (
                    <div className="flex gap-2">
                        <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                            {registerForm.address || '주소를 검색해주세요'}
                        </div>
                        <Button variant="outline" onClick={() => setIsPostcodeOpen(true)}>
                            주소 검색
                        </Button>
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <DaumPostcodeEmbed onComplete={handleComplete} autoClose={false} />
                        <Button
                            variant="outline"
                            fullWidth
                            className="mt-2"
                            onClick={() => setIsPostcodeOpen(false)}
                        >
                            닫기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
