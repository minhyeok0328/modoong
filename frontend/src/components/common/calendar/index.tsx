import React, { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { toDateString } from '@/utils/dates';
import TimeSlotSelector from '@/components/common/time-slot-selector';

// dayjs 플러그인 설정 (일요일 시작 주간 기준)
dayjs.extend(weekday);

export type ReservationMap = {
  [key: string]: React.ReactNode;
};

export interface CommonCalendarProps {
  /** 선택된 날짜 (제어 컴포넌트용, ISO 8601 또는 YYYY-MM-DD) */
  value?: string | null;
  /** 날짜 변경 시 호출 */
  onChange?: (value: string | null) => void;
  /** 특정 날짜에 표시할 예약 정보 */
  reservations?: ReservationMap;
  /** 추가 컨테이너 속성 */
  calendarProps?: React.HTMLAttributes<HTMLDivElement>;
  /** 최상위 컨테이너 className */
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  showTimeSlots?: boolean;
  timeValue?: string | null;
  onTimeChange?: (time: string) => void;
  startTime?: string;
  endTime?: string;
  interval?: number;
  disabledSlots?: { date: string | Date; times?: string[] }[];
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * dayjs 로 직접 구현한 달력 컴포넌트
 * 1. 오늘 이전 날짜는 선택할 수 없습니다.
 * 2. `reservations` prop 으로 전달된 날짜에 예약 정보를 표시합니다.
 */
const Calendar: React.FC<CommonCalendarProps> = ({
  value,
  onChange,
  reservations,
  calendarProps,
  className = '',
  minDate = dayjs().startOf('day').toDate(),
  maxDate,
  showTimeSlots = false,
  timeValue = null,
  onTimeChange,
  startTime = '06:00',
  endTime = '18:30',
  interval = 30,
  disabledSlots = [],
}) => {
  const today = dayjs(minDate).startOf('day');
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(
    value ? dayjs(value).startOf('month') : today.startOf('month')
  );

  useEffect(() => {
    if (value) {
      const month = dayjs(value).startOf('month');
      if (!month.isSame(currentMonth, 'month')) {
        setCurrentMonth(month);
      }
    }
  }, [value]);

  const selectedDate = value ? dayjs(value) : null;

  const days = useMemo(() => {
    const start = currentMonth.startOf('month').weekday(0); // 달력 시작: 해당 월의 첫 주 일요일
    return Array.from({ length: 42 }, (_, idx) => start.add(idx, 'day'));
  }, [currentMonth]);

  const handleDayClick = (d: dayjs.Dayjs) => {
    if (d.isBefore(dayjs(minDate), 'day') || (maxDate && d.isAfter(dayjs(maxDate), 'day'))) return;
    onChange?.(toDateString(d.toDate()));
  };

  // 네비게이션
  const changeMonth = (offset: number) => {
    setCurrentMonth((prev) => prev.add(offset, 'month'));
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`} {...calendarProps}>
      {/* Header */}
      <div className="flex items-center justify-between text-lg font-semibold">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="px-2 py-1 hover:text-gray-700"
          aria-label="이전 달"
        >
          ‹
        </button>
        <span>{currentMonth.format('YYYY년 M월')}</span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="px-2 py-1 hover:text-gray-700"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      {/* WeekDay header */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 border-b border-gray-200 pb-2">
        {WEEK_DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-2">
        {days.map((day) => {
          const inCurrentMonth = day.month() === currentMonth.month();
          const isToday = day.isSame(today, 'day');
          const isSelected = selectedDate ? day.isSame(selectedDate, 'day') : false;
          const disabled =
            day.isBefore(dayjs(minDate), 'day') || (maxDate && day.isAfter(dayjs(maxDate), 'day'));

          const key = toDateString(day.toDate());
          const reservation = reservations?.[key];

          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              aria-label={day.format('YYYY년 M월 D일')}
              aria-selected={isSelected}
              className={`relative w-full aspect-square text-sm rounded-md
                flex items-center justify-center
                ${isSelected ? 'text-black' : ''}
                ${!inCurrentMonth ? 'text-gray-400' : ''}
                ${disabled && inCurrentMonth ? 'text-gray-300' : ''}
                ${!disabled ? 'hover:bg-yellow-100' : ''}`}
            >
              <span
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center
                  ${isSelected ? 'bg-yellow-400 text-black' : ''}
                  ${isToday && !isSelected ? 'text-blue-600 font-semibold' : ''}`}
              >
                {day.date()}
              </span>
              {reservation && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-blue-600 whitespace-pre-line text-center truncate w-full px-1">
                  {reservation}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showTimeSlots && selectedDate && (
        <TimeSlotSelector
          selectedDate={selectedDate}
          value={timeValue}
          onChange={onTimeChange || (() => {})}
          startTime={startTime}
          endTime={endTime}
          interval={interval}
          disabledSlots={disabledSlots}
          minDate={minDate}
        />
      )}
    </div>
  );
};

export default Calendar;
