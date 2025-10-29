import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/user';

export default function FinderStep1() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    { id: 'tutorial', label: '대중교통(버스, 지하철)을 이용해야 해요' },
    { id: 'challenge', label: '장애인 택시를 이용해야 해요' },
    { id: 'exercise', label: '의족을 빼고 운동해요' },
    { id: 'support', label: '동행 또는 신체활동을 도와줘야 해요' },
    { id: 'other', label: '그 외 다른 도움이 필요해요' }
  ];

  const handleCheckboxChange = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleNext = () => {
    navigate('/mate/finder/step2');
  };

  const isNextEnabled = selectedOptions.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6">
        <PageTitle
        className="w-full mb-12"
        text={
          <>
            <b>{user?.username}</b>님! 모둥메이트가 <br />무엇을 도와드리면 될까요?
          </>
        }
      />

        <div className="grid grid-cols-1 gap-8">
          {options.map((option) => (
            <Checkbox
              key={option.id}
              name={option.id}
              label={option.label}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleCheckboxChange(option.id)}
              size="lg"
              className="block"
            />
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
