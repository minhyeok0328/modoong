import dayjs from 'dayjs';

interface TimeSlotSelectorProps {
  selectedDate: dayjs.Dayjs;
  value: string | null; // 'HH:mm'
  onChange: (time: string) => void;
  startTime?: string;
  endTime?: string;
  interval?: number;
  disabledSlots?: { date: string | Date; times?: string[] }[];
  minDate?: string | Date;
}

export default function TimeSlotSelector({
  selectedDate,
  value,
  onChange,
  startTime = '10:00',
  endTime = '18:30',
  interval = 30,
  disabledSlots = [],
  minDate = dayjs().toDate(),
}: TimeSlotSelectorProps) {
  const min = dayjs(minDate);

  const parseTime = (str: string) => {
    const [h, m] = str.split(':').map(Number);
    return { h, m };
  };

  // time slots 계산
  const timeSlots: dayjs.Dayjs[] = (() => {
    const { h: sh, m: sm } = parseTime(startTime);
    const { h: eh, m: em } = parseTime(endTime);
    const list: dayjs.Dayjs[] = [];
    let cur = selectedDate.hour(sh).minute(sm).second(0);
    const end = selectedDate.hour(eh).minute(em).second(0);
    while (cur.isBefore(end) || cur.isSame(end)) {
      list.push(cur);
      cur = cur.add(interval, 'minute');
    }
    return list;
  })();

  const isSlotDisabled = (slot: dayjs.Dayjs) => {
    if (selectedDate.isSame(dayjs(), 'day') && slot.isBefore(dayjs(), 'minute')) {
      return true;
    }
    const timeStr = slot.format('HH:mm');
    const slotConf = disabledSlots.find((s) => dayjs(s.date).isSame(slot, 'day'));
    const disabledTimeByList =
      slotConf && Array.isArray(slotConf.times) ? slotConf.times.includes(timeStr) : false;
    const disabledDateWhole =
      slotConf && Array.isArray(slotConf.times) && slotConf.times.length === 0;
    return slot.isBefore(min) || disabledTimeByList || disabledDateWhole;
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {timeSlots.map((slot) => {
        const timeStr = slot.format('HH:mm');
        const disabled = isSlotDisabled(slot);
        const isSelected = value === timeStr;
        return (
          <button
            key={timeStr}
            disabled={disabled}
            onClick={() => onChange(timeStr)}
            className={`border border-gray-200 rounded-md py-1 text-sm
              ${isSelected ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white'}
              ${disabled ? 'text-gray-400' : 'hover:bg-yellow-100'}
            `}
          >
            {timeStr}
          </button>
        );
      })}
    </div>
  );
}
