import dayjs from 'dayjs';

export const toDateString = (date: Date = new Date()): string => {
  return dayjs(date).format('YYYY-MM-DD');
};
