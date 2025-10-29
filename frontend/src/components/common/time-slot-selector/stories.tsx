import { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';
import TimeSlotSelector from './index';

// Meta 설정
export default {
  title: 'Common/TimeSlotSelector',
  component: TimeSlotSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} as Meta<typeof TimeSlotSelector>;

type Story = StoryObj<typeof TimeSlotSelector>;

// 기본 스토리
export const Default: Story = {
  args: {
    selectedDate: dayjs(),
    value: null,
    onChange: (time) => console.log('Selected time:', time),
  },
};

// 비활성화된 슬롯 스토리
export const WithDisabledSlots: Story = {
  args: {
    selectedDate: dayjs(),
    value: null,
    onChange: (time) => console.log('Selected time:', time),
    disabledSlots: [{ date: dayjs().format('YYYY-MM-DD'), times: ['10:00', '10:30'] }],
  },
};

// 다른 시간 범위 스토리
export const CustomTimeRange: Story = {
  args: {
    selectedDate: dayjs(),
    value: null,
    onChange: (time) => console.log('Selected time:', time),
    startTime: '09:00',
    endTime: '17:00',
    interval: 60,
  },
};
