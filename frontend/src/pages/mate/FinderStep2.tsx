import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/user';

export default function FinderStep2() {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const options = [
    { id: 'immediate', label: '지금 당장 도움이 필요해요' },
    { id: 'reservation', label: '미리 예약하고 싶어요' }
  ];

  const handleOptionChange = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (selectedOption === 'immediate') {
      navigate('/mate/finder/step4');
    } else if (selectedOption === 'reservation') {
      navigate('/mate/finder/step3');
    }
  };

  const isNextEnabled = selectedOption !== '';

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6">
        <PageTitle
          className="w-full mb-12"
          text={
            <>
              <b>{user?.username}</b>님! 모둥메이트가<br /> 언제 도와드리면 될까요?
            </>
          }
        />

        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="block">
              <input
                type="radio"
                id={option.id}
                name="timing"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => handleOptionChange(option.id)}
                className="peer absolute w-px h-px p-0 overflow-hidden whitespace-nowrap border-0 -left-[9999px] -top-[9999px]"
              />
              <label
                htmlFor={option.id}
                className={`block rounded-full border border-transparent bg-gray-200 text-gray-700 cursor-pointer select-none transition-colors px-4 py-2 text-base mb-2
                          peer-checked:bg-yellow-400 peer-checked:text-gray-900`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-6">
        <Button
          fullWidth
          size="lg"
          disabled={!isNextEnabled}
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
