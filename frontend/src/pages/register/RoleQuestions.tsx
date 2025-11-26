import { Input, Button, PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { registerFormAtom, isNextButtonEnabledAtom } from '@/atoms/register';
import { useEffect, useRef, useState } from 'react';

export default function RoleQuestions() {
    const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
    const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
    const headingRef = useRef<HTMLHeadingElement>(null);

    // Mock file upload state
    const [files, setFiles] = useState<Record<string, string>>({});

    const roles = registerForm.roles || [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles((prev) => ({ ...prev, [key]: e.target.files![0].name }));
        }
    };

    useEffect(() => {
        // Basic validation: check if required fields for selected roles are filled
        // For now, we'll be lenient and just check if the user has interacted or if it's optional
        // In a real app, you'd validate each field strictly.
        setIsNextButtonEnabled(true);
    }, [setIsNextButtonEnabled]);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col gap-8 pb-10">
            <PageTitle
                ref={headingRef}
                text={
                    <>
                        활동에 필요한{'\n'}
                        추가 정보를 입력해주세요
                    </>
                }
            />

            {roles.includes('volunteer') && (
                <section className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-primary">자원봉사자 정보</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">자원봉사 경험이 있으신가요?</label>
                        <div className="flex gap-2">
                            <Button
                                variant={registerForm.volunteerExperience ? 'primary' : 'outline'}
                                onClick={() => setRegisterForm(prev => ({ ...prev, volunteerExperience: true }))}
                                size="sm"
                            >
                                예
                            </Button>
                            <Button
                                variant={registerForm.volunteerExperience === false ? 'primary' : 'outline'}
                                onClick={() => setRegisterForm(prev => ({ ...prev, volunteerExperience: false }))}
                                size="sm"
                            >
                                아니요
                            </Button>
                        </div>
                    </div>

                    <Input
                        name="vmsId"
                        label="1365/VMS 아이디 (선택)"
                        placeholder="아이디를 입력해주세요"
                        value={registerForm.vmsId || ''}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, vmsId: e.target.value }))}
                    />
                </section>
            )}

            {roles.includes('assistant') && (
                <section className="flex flex-col gap-4 pt-6">
                    <h3 className="text-lg font-bold text-primary">활동보조인 정보</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">자격증/이수증 첨부</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="file"
                                id="assistant-cert"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'assistant')}
                            />
                            <label
                                htmlFor="assistant-cert"
                                className="px-4 py-2 border rounded-lg cursor-pointer bg-white hover:bg-gray-50"
                            >
                                파일 선택
                            </label>
                            <span className="text-sm text-gray-500">{files['assistant'] || '선택된 파일 없음'}</span>
                        </div>
                    </div>

                    <div>
                        <Input
                            name="hourlyRate"
                            label="희망 시급 (원)"
                            value={registerForm.hourlyRate || ''}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                            placeholder="예: 12000"
                            type="number"
                        />
                    </div>
                </section>
            )}

            {roles.includes('guardian') && (
                <section className="flex flex-col gap-4 pt-6">
                    <h3 className="text-lg font-bold text-primary">가족/보호자 정보</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">가족관계증명서 첨부</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="file"
                                id="guardian-cert"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'guardian')}
                            />
                            <label
                                htmlFor="guardian-cert"
                                className="px-4 py-2 border rounded-lg cursor-pointer bg-white hover:bg-gray-50"
                            >
                                파일 선택
                            </label>
                            <span className="text-sm text-gray-500">{files['guardian'] || '선택된 파일 없음'}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">알림 설정</label>
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setRegisterForm(prev => ({ ...prev, guardianNotifications: !prev.guardianNotifications }))}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${registerForm.guardianNotifications ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                {registerForm.guardianNotifications && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className="text-gray-700">예약/체크인/체크아웃 알림 받기</span>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
