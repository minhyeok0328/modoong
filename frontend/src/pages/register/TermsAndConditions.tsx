import { PageTitle, CheckItem } from '@/components/common';
import { useAtom } from 'jotai';
import { registerFormAtom, isNextButtonEnabledAtom } from '@/atoms/register';
import { useEffect, useRef, useState } from 'react';

export default function TermsAndConditions() {
    const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
    const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const [agreements, setAgreements] = useState({
        common: false,
        sensitive: false,
        documents: false,
    });

    const roles = registerForm.roles || [];
    const needsSensitive = true; // All helper roles might need this
    const needsDocuments = roles.includes('assistant') || roles.includes('guardian');

    const toggleAgreement = (key: keyof typeof agreements) => {
        setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAllAgree = () => {
        const allAgreed = !isAllAgreed;
        setAgreements({
            common: allAgreed,
            sensitive: allAgreed,
            documents: allAgreed,
        });
    };

    const isAllAgreed =
        agreements.common &&
        (!needsSensitive || agreements.sensitive) &&
        (!needsDocuments || agreements.documents);

    useEffect(() => {
        setRegisterForm((prev) => ({ ...prev, agreement: isAllAgreed }));
        setIsNextButtonEnabled(isAllAgreed);
    }, [isAllAgreed, setRegisterForm, setIsNextButtonEnabled]);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <PageTitle
                ref={headingRef}
                text={
                    <>
                        서비스 이용을 위해{'\n'}
                        약관에 동의해주세요
                    </>
                }
            />

            <div className="flex flex-col gap-4">
                <div
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
                    onClick={handleAllAgree}
                >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isAllAgreed ? 'bg-yellow-400 border-yellow-400' : 'border-gray-300'}`}>
                        {isAllAgreed && <span className="text-white text-sm">✓</span>}
                    </div>
                    <span className="font-bold text-lg">전체 동의하기</span>
                </div>

                <div className="h-px bg-gray-200 my-2" />

                <CheckItem
                    label="[필수] 서비스 이용약관 동의"
                    checked={agreements.common}
                    onToggle={() => toggleAgreement('common')}
                />

                {needsSensitive && (
                    <CheckItem
                        label="[필수] 민감정보 수집 및 이용 동의"
                        checked={agreements.sensitive}
                        onToggle={() => toggleAgreement('sensitive')}
                    />
                )}

                {needsDocuments && (
                    <CheckItem
                        label="[필수] 증빙서류 제출 및 검토 동의"
                        checked={agreements.documents}
                        onToggle={() => toggleAgreement('documents')}
                    />
                )}
            </div>
        </div>
    );
}


