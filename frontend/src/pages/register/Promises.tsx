import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom } from '@/atoms/register';
import { useEffect, useRef } from 'react';

const PROMISES = [
    { title: '1. 동등한 파트너로 대하기', desc: '도움을 주더라도, 항상 한 사람의 동료이자 친구로 존중합니다.' },
    { title: '2. 먼저 묻고 돕기', desc: '그냥 도와주기보다 "도와드려도 될까요?"라고 먼저 묻고, 방식도 함께 상의합니다.' },
    { title: '3. 스스로 결정할 권리 존중하기', desc: '어디로 갈지, 어떻게 운동할지 당사자가 선택할 수 있도록 대신 결정하지 않습니다.' },
    { title: '4. 안전과 비밀 지키기', desc: '이동·운동 중 안전을 최우선으로 하고, 개인 정보와 대화 내용은 허락 없이 외부에 공유하지 않습니다.' },
    { title: '5. 경청하고 피드백 주고받기', desc: '불편했던 점, 힘들었던 점을 편하게 말할 수 있도록 잘 들어주고, 본인도 솔직하게 의견을 나눕니다.' },
];

export default function Promises() {
    const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        // User must click the button to proceed, which is handled by the layout's next button.
        // We can enable it by default here as "I promise" is the action of clicking next.
        // Or we could add a checkbox. Let's assume the "Next" button label will be "약속할게요" (handled in layout or here).
        setIsNextButtonEnabled(true);
    }, [setIsNextButtonEnabled]);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col gap-6 pb-10">
            <PageTitle
                ref={headingRef}
                text={
                    <>
                        모둥메이트가 지켜야 할{'\n'}
                        5가지 약속
                    </>
                }
                subText="모둥메이트는 장애인을 '돕는 사람'이면서 동시에 '함께 운동하는 파트너'입니다."
            />

            <div className="flex flex-col gap-6">
                {PROMISES.map((promise, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg text-primary mb-2">{promise.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{promise.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
