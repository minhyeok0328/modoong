import { PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { isNextButtonEnabledAtom, registerFormAtom } from '@/atoms/register';
import { Checkbox } from '@/components/common';
import { useEffect, useRef } from 'react';

const SCHEDULE_LIST = [
  {
    name: 'dawn',
    ariaLabel: '새벽 오전 6시 부터 오전 8시',
    label: '새벽 (06:00~08:00)',
    value: 'dawn',
  },
  {
    name: 'morning',
    ariaLabel: '아침 오전 8시 부터 오후 12시',
    label: '아침 (08:00~12:00)',
    value: 'morning',
  },
  {
    name: 'noon',
    ariaLabel: '점심 오후 12시 부터 오후 2시',
    label: '점심 (12:00~14:00)',
    value: 'noon',
  },
  {
    name: 'afternoon',
    ariaLabel: '오후 2시 부터 오후 6시',
    label: '오후 (14:00~18:00)',
    value: 'afternoon',
  },
  {
    name: 'evening',
    ariaLabel: '저녁 오후 6시 부터 오후 10시',
    label: '저녁 (18:00~22:00)',
    value: 'evening',
  },
  {
    name: 'lateNight',
    ariaLabel: '늦은 밤 오후 10시 부터 오전 6시',
    label: '늦은 밤 (22:00~06:00)',
    value: 'lateNight',
  },
] as const;

type ScheduleKey = (typeof SCHEDULE_LIST)[number]['name'];

export default function ActivitySchedule() {
  const [registerForm, setRegisterForm] = useAtom(registerFormAtom);
  const [, setIsNextButtonEnabled] = useAtom(isNextButtonEnabledAtom);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const handleScheduleChange = (name: ScheduleKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      activitySchedule: {
        ...registerForm.activitySchedule,
        [name]: {
          ...registerForm.activitySchedule[name],
          selected: e.target.checked,
        },
      },
    });
  };

  useEffect(() => {
    headingRef.current?.focus();

    setIsNextButtonEnabled(true);
  }, []);

  return (
    <div>
      <PageTitle
        ref={headingRef}
        text={
          <>
            더 친해진 것 같아{'\n'}
            <strong>모둥이</strong>는 기분이 좋아요:){'\n'}
            {'\n'}
            <strong>{registerForm.name}님</strong>은 <strong>어느 시간대</strong>에{'\n'}
            주로 운동하세요?
          </>
        }
        aria-label={`더 친해진 것 같아 모둥이는 기분이 좋아요:) ${registerForm.name}님은 어느 시간대에 주로 운동하세요?`}
        className="mb-10"
      />
      <div className="flex flex-wrap justify-between gap-4">
        {SCHEDULE_LIST.map(({ name, label, ariaLabel }) => (
          <Checkbox
            key={name}
            name={name}
            label={label}
            checked={registerForm.activitySchedule[name].selected}
            onChange={handleScheduleChange(name)}
            aria-label={ariaLabel}
            className="mb-8 min-w-[45%]"
          />
        ))}
      </div>
    </div>
  );
}
