import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PageTitle } from '@/components/common';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/user';

export default function FinderStep3() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHour, setSelectedHour] = useState<number>(21);
  const [selectedMinute, setSelectedMinute] = useState<number>(50);
  const [selectedQuickTime, setSelectedQuickTime] = useState<string>('');

  // 기본값 다음 날로 설정
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const dayName = ['일', '월', '화', '수', '목', '금', '토'][tomorrow.getDay()];
    setSelectedDate(`${month}/${day}(${dayName})`);
  }, []);

  // 빠른 시간 선택 옵션
  const quickTimeOptions = [
    { id: '30min', label: '+30분' },
    { id: '1hour', label: '+1시간' },
    { id: '1day', label: '+1일' }
  ];

  // 날짜 옵션 (동적으로 생성)
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      const dateString = `${month}/${day}(${dayName})`;

      dates.push({
        value: dateString,
        label: dateString,
        date: date
      });
    }
    return dates;
  };

  const dates = generateDates();

  const hours = Array.from({ length: 24 }, (_, i) => i + 1);
  const minutes = [0, 10, 20, 30, 40, 50];

  const handleNext = () => {
    navigate('/mate/finder/step4');
  };

  // 빠른 시간 선택 핸들러
  const handleQuickTimeSelect = (timeId: string) => {
    setSelectedQuickTime(timeId);
    const now = new Date();

    switch (timeId) {
      case '30min':
        now.setMinutes(now.getMinutes() + 30);
        break;
      case '1hour':
        now.setHours(now.getHours() + 1);
        break;
      case '1day':
        now.setDate(now.getDate() + 1);
        break;
    }

    // 시간과 분 업데이트
    setSelectedHour(now.getHours());
    setSelectedMinute(Math.floor(now.getMinutes() / 10) * 10); // 10분 단위로 반올림

    // 날짜 업데이트 (1일 선택시에만)
    if (timeId === '1day') {
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dayName = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
      setSelectedDate(`${month}/${day}(${dayName})`);
    }
  };

  const TimeScrollPicker = ({
    items,
    onSelect,
    type
  }: {
    items: any[],
    selectedValue: any,
    onSelect: (value: any) => void,
    type: 'date' | 'hour' | 'minute'
  }) => {
    return (
      <div className="flex-1 h-48 overflow-y-auto snap-y snap-mandatory">
        <div className="px-2">
          {items.map((item, index) => {
            const isSelected = type === 'date'
              ? item.value === selectedDate
              : type === 'hour'
                ? item === selectedHour
                : type === 'minute'
                  ? item === selectedMinute
                  : false;

            return (
              <div
                key={index}
                className={`py-3 text-center cursor-pointer snap-center transition-all duration-200 ${
                  isSelected
                    ? 'text-blue-500 font-bold text-xl'
                    : 'text-gray-400 text-lg'
                }`}
                onClick={() => {
                  if (type === 'date') onSelect(item.value);
                  else if (type === 'hour') onSelect(item);
                  else if (type === 'minute') onSelect(item);
                }}
              >
                {type === 'date' ? item.label :
                 type === 'hour' ? String(item).padStart(2, '0') :
                 String(item).padStart(2, '0')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6">
        <PageTitle
          className="w-full mb-12"
          text={
            <>
              <b>{user?.username}</b>님!<br /> 정확한 시각을 알려주세요!
            </>
          }
        />

        <div className="mt-8">
          <div className="flex items-center justify-center gap-4 mb-4 text-sm">
            {quickTimeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleQuickTimeSelect(option.id)}
                className={`w-24 py-2 text-center border rounded-md transition-colors ${
                  selectedQuickTime === option.id
                    ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex border-t border-b border-gray-200">
            <TimeScrollPicker
              items={dates}
              selectedValue={selectedDate}
              onSelect={setSelectedDate}
              type="date"
            />
            <div className="w-px bg-gray-200"></div>
            <TimeScrollPicker
              items={hours}
              selectedValue={selectedHour}
              onSelect={setSelectedHour}
              type="hour"
            />
            <div className="w-px bg-gray-200"></div>
            <TimeScrollPicker
              items={minutes}
              selectedValue={selectedMinute}
              onSelect={setSelectedMinute}
              type="minute"
            />
          </div>
        </div>
      </div>

      <div className="pb-6">
        <Button
          fullWidth
          size="lg"
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
