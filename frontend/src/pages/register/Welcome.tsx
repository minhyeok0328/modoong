import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom } from '@/atoms/register';
import { useEffect, useRef } from 'react';

export default function Welcome() {
    const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        setIsNextButtonEnabled(true);
    }, [setIsNextButtonEnabled]);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col gap-6 h-full justify-center pb-20">
            <PageTitle
                ref={headingRef}
                text={
                    <>
                        모둥메이트가{'\n'}
                        되신 것을 환영합니다
                    </>
                }
                className="text-center"
            />

            <div className="text-center space-y-4 text-gray-700">
                <p>
                    모둥메이트는 장애인분들과 함께하는<br />
                    <strong>소중한 파트너</strong>입니다.
                </p>

                <div className="bg-gray-50 p-6 rounded-2xl my-6 space-y-2">
                    <p>모두의운동장에서:</p>
                    <ul className="space-y-1 font-medium text-primary">
                        <li>• 시설 이용을 돕고</li>
                        <li>• 함께 운동하고</li>
                        <li>• 안전한 이동을 지원하는</li>
                    </ul>
                    <p className="pt-2 font-bold">중요한 역할을 맡습니다.</p>
                </div>
            </div>
        </div>
    );
}
