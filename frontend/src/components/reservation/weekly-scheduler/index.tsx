import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { useState } from 'react';
import TimeSlotSelector from '@/components/common/time-slot-selector';

dayjs.extend(weekday);

interface WeeklySchedulerProps {
  /** 현재 선택된 날짜+시간 (['YYYY-MM-DD','HH:mm']) */
  value?: [string, string] | null;
  /** 변경 시 호출되는 콜백. ['YYYY-MM-DD','HH:mm'] 형식 */
  onChange?: (value: [string, string]) => void;
  /** 시작 시간 (HH:mm), default '10:00' */
  startTime?: string;
  /** 종료 시간 (HH:mm), default '18:30' */
  endTime?: string;
  /** 간격(분) default 30 */
  interval?: number;
  /** 최소 선택 가능 날짜(포함). default 오늘 */
  minDate?: string | Date;
  /** 최대 선택 가능 날짜(포함). default minDate + 1달 */
  maxDate?: string | Date;
  /** className */
  className?: string;
  /**
   * 비활성화할 날짜/시간 목록
   * 예) [{ date: '2025-07-10', times: ['12:30', '13:00'] }]
   * - times 가 없거나 빈 배열이면 해당 날짜 전체 비활성화
   */
  disabledSlots?: { date: string | Date; times?: string[] }[];
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const parseTime = (str: string) => {
  const [h, m] = str.split(':').map(Number);
  return { h, m };
};

export default function WeeklyScheduler({
  value,
  onChange,
  startTime = '10:00',
  endTime = '18:30',
  interval = 30,
  minDate = dayjs().startOf('day').toDate(),
  maxDate,
  className = '',
  disabledSlots = [],
}: WeeklySchedulerProps) {
  const min = dayjs(minDate).startOf('day');
  const max = dayjs(maxDate ?? dayjs(min).add(1, 'month').toDate()).endOf('day');

  // 내부 state (제어되지 않을 때)
  const [internalDateTime, setInternalDateTime] = useState<[string, string] | null>(value ?? null);

  const selected = value ?? internalDateTime;
  const selectedDate = selected ? dayjs(`${selected[0]}T${selected[1]}`) : min;

  // 현재 주의 시작(일요일) 계산
  const weekStart = selectedDate.weekday(0);

  // month header 리스트 계산
  const months: dayjs.Dayjs[] = (() => {
    const arr: dayjs.Dayjs[] = [];
    let cur = min.startOf('month');
    while (cur.isBefore(max) || cur.isSame(max, 'month')) {
      arr.push(cur);
      cur = cur.add(1, 'month');
    }
    return arr;
  })();

  const handleDateClick = (date: dayjs.Dayjs) => {
    let target = date;
    // 만약 클릭된 날짜가 min 이전이지만 같은 달이라면, min 날짜로 대체
    if (target.isBefore(min, 'day')) {
      if (target.isSame(min, 'month')) {
        target = min;
      } else {
        return;
      }
    }
    // 최대 범위 초과 시 무시
    if (target.isAfter(max, 'day')) return;

    // 첫 선택 시간 계산 (비활성화 시 다음 시간으로)
    const { h: sh, m: sm } = parseTime(startTime);
    const { h: eh, m: em } = parseTime(endTime);

    let cur = target.hour(sh).minute(sm).second(0);
    const end = target.hour(eh).minute(em).second(0);

    const isSlotDisabled = (slot: dayjs.Dayjs) => {
      const timeStr = slot.format('HH:mm');
      const slotConf = disabledSlots.find((s) => dayjs(s.date).isSame(slot, 'day'));
      const disabledTimeByList =
        slotConf && slotConf.times ? slotConf.times.includes(timeStr) : false;
      const disabledDateWhole = slotConf && (!slotConf.times || slotConf.times.length === 0);
      return slot.isBefore(min) || disabledTimeByList || disabledDateWhole;
    };

    while (cur.isBefore(end) || cur.isSame(end)) {
      if (!isSlotDisabled(cur)) {
        updateValue(cur);
        break;
      }
      cur = cur.add(interval, 'minute');
    }
  };

  const handleTimeClick = (t: dayjs.Dayjs) => {
    if (t.isBefore(min)) return; // 과거 시간 선택 방지
    updateValue(t);
  };

  const updateValue = (d: dayjs.Dayjs) => {
    const localVal: [string, string] = [d.format('YYYY-MM-DD'), d.format('HH:mm')];
    if (!value) {
      setInternalDateTime(localVal);
    }
    onChange?.(localVal);
  };

  // time slots 계산 제거
  // const timeSlots: dayjs.Dayjs[] = (() => {
  //   const { h: sh, m: sm } = parseTime(startTime);
  //   const { h: eh, m: em } = parseTime(endTime);
  //   const list: dayjs.Dayjs[] = [];
  //   let cur = selectedDate.hour(sh).minute(sm).second(0);
  //   const end = selectedDate.hour(eh).minute(em).second(0);
  //   while (cur.isBefore(end) || cur.isSame(end)) {
  //     list.push(cur);
  //     cur = cur.add(interval, 'minute');
  //   }
  //   return list;
  // })();

  const isSelected = (d: dayjs.Dayjs) => selectedDate.isSame(d, 'day');

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Month Tabs */}
      <div className="flex gap-4 text-lg font-semibold">
        {months.map((m) => (
          <button
            key={m.format('YYYY-MM')}
            onClick={() => handleDateClick(m.startOf('month'))}
            className={
              selectedDate.isSame(m, 'month') ? 'text-black' : 'text-gray-400 hover:text-gray-700'
            }
          >
            {m.format('M월')}
          </button>
        ))}
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 border-b border-gray-200 pb-2">
        {WEEK_DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Date row */}
      <div className="grid grid-cols-7 text-center py-2">
        {Array.from({ length: 7 }).map((_, idx) => {
          const date = weekStart.add(idx, 'day');
          const slotConf = disabledSlots.find((s) => dayjs(s.date).isSame(date, 'day'));
          const disabledBySlot = slotConf && (!slotConf.times || slotConf.times.length === 0);
          const disabled = date.isBefore(min, 'day') || date.isAfter(max, 'day') || disabledBySlot;
          const today = dayjs().isSame(date, 'day');
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => handleDateClick(date)}
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm
                ${isSelected(date) ? 'bg-yellow-400 text-black' : ''}
                ${disabled ? 'text-gray-300' : today ? 'text-blue-600' : 'text-black'}`}
            >
              {date.date()}
            </button>
          );
        })}
      </div>

      {/* Today indicator */}
      {dayjs().isSame(selectedDate, 'day') && <span className="text-xs text-orange-500">오늘</span>}

      {/* Time slots */}
      <TimeSlotSelector
        selectedDate={selectedDate}
        value={selected ? selected[1] : null}
        onChange={(time) => {
          const [h, m] = time.split(':').map(Number);
          const t = selectedDate.hour(h).minute(m);
          handleTimeClick(t);
        }}
        startTime={startTime}
        endTime={endTime}
        interval={interval}
        disabledSlots={disabledSlots}
        minDate={minDate}
      />
    </div>
  );
}
