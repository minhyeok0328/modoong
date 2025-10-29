import type { Meta, StoryObj } from '@storybook/react';
import { ReservationInfo } from './index';

const meta: Meta<typeof ReservationInfo> = {
  title: 'reservation/ReservationInfo',
  component: ReservationInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FacilityReservation: Story = {
  args: {
    type: 'facility',
    facilityName: '수원종합운동장 수영장',
    address: '경기도 수원시 기흥구 통일로 1050',
    date: '2024년 3월 24일 (월)',
    time: '10:00 - 10:30',
    amount: 4000,
    reservationNumber: 'R2024032401',
  },
};

export const CourseReservation: Story = {
  args: {
    type: 'course',
    facilityName: '수원종합운동장 수영장',
    address: '경기도 수원시 기흥구 통일로 1050',
    courseTitle: '장애인 수영 교실',
    courseInfo: '매주 월, 수, 금 14:00-15:00',
    coursePrice: '월 50,000원',
    instructor: '김수영',
    amount: 50000,
    reservationNumber: 'C2024032401',
  },
};
