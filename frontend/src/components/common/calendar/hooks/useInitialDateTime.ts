import { useMemo } from 'react';
import dayjs from 'dayjs';

interface UseInitialDateTimeProps {
  startTime?: string;
  endTime?: string;
  interval?: number;
  disabledSlots?: { date: string | Date; times?: string[] }[];
  minDate?: string | Date;
}

export default function useInitialDateTime({
  startTime = '10:00',
  endTime = '18:30',
  interval = 30,
  disabledSlots = [],
  minDate = dayjs().toDate(),
}: UseInitialDateTimeProps = {}): [string, string] | null {
  return useMemo(() => {
    const today = dayjs(minDate).startOf('day');

    const parseTime = (str: string) => {
      const [h, m] = str.split(':').map(Number);
      return { h, m };
    };

    const { h: sh, m: sm } = parseTime(startTime);
    const { h: eh, m: em } = parseTime(endTime);
    let cur = today.hour(sh).minute(sm);
    const end = today.hour(eh).minute(em);

    const isSlotDisabled = (slot: dayjs.Dayjs) => {
      if (slot.isBefore(dayjs(), 'minute')) return true;
      const timeStr = slot.format('HH:mm');
      const slotConf = disabledSlots.find((s) => dayjs(s.date).isSame(slot, 'day'));
      const disabledTimeByList =
        slotConf && slotConf.times ? slotConf.times.includes(timeStr) : false;
      const disabledDateWhole = slotConf && (!slotConf.times || slotConf.times.length === 0);
      return slot.isBefore(dayjs(minDate)) || disabledTimeByList || disabledDateWhole;
    };

    while (cur.isBefore(end) || cur.isSame(end)) {
      if (!isSlotDisabled(cur)) {
        return [today.format('YYYY-MM-DD'), cur.format('HH:mm')];
      }
      cur = cur.add(interval, 'minute');
    }
    return null; // 유효한 시간이 없음
  }, [startTime, endTime, interval, disabledSlots, minDate]);
}
