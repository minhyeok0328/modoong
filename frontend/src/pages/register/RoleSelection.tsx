import { Button, PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { registerFormAtom, isNextButtonEnabledAtom } from '@/atoms/register';
import { useEffect, useRef } from 'react';

const ROLES = [
    { id: 'volunteer', label: '자원봉사자로 활동하고 싶어요', sub: '1365/VMS 계정 연동이 필요해요' },
    { id: 'assistant', label: '활동보조인으로 활동하고 있어요', sub: '자격증 또는 이수증이 필요해요' },
    { id: 'guardian', label: '가족/보호자로서 함께하고 싶어요', sub: '가족관계증명서가 필요해요' },
];

export default function RoleSelection() {
    const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
    const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const toggleRole = (roleId: string) => {
        setRegisterForm((prev) => {
            const currentRoles = prev.roles || [];
            const newRoles = currentRoles.includes(roleId)
                ? currentRoles.filter((r) => r !== roleId)
                : [...currentRoles, roleId];
            return { ...prev, roles: newRoles };
        });
    };

    useEffect(() => {
        setIsNextButtonEnabled((registerForm.roles?.length || 0) > 0);
    }, [registerForm.roles, setIsNextButtonEnabled]);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <PageTitle
                ref={headingRef}
                text={
                    <>
                        어떤 역할로{'\n'}
                        참여하시나요?
                    </>
                }
                subText="중복 선택이 가능합니다."
            />

            <div className="flex flex-col gap-3">
                {ROLES.map((role) => {
                    const isSelected = registerForm.roles?.includes(role.id);
                    return (
                        <Button
                            key={role.id}
                            variant={isSelected ? 'primary' : 'outline'}
                            onClick={() => toggleRole(role.id)}
                            className="h-auto py-4 flex flex-col items-start gap-1"
                            fullWidth
                        >
                            <span className="text-lg font-bold">{role.label}</span>
                            <span className={`text-sm font-normal ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                                {role.sub}
                            </span>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
