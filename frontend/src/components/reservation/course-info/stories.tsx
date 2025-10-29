import type { Meta, StoryObj } from '@storybook/react';
import CourseInfo from './index';

const meta = {
  title: 'Components/Reservation/CourseInfo',
  component: CourseInfo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    description: {
      description: '강좌 설명',
    },
    title: {
      description: '강좌 제목',
    },
    tags: {
      description: '강좌 태그들',
    },
    price: {
      description: '강좌 가격',
    },
    info: {
      description: '강좌 상세 정보',
    },
  },
} satisfies Meta<typeof CourseInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '[7월] 특수체육 및 장애인스포츠팀',
    tags: ['중합체육시설', '대면', '지체, 청각/언어', '지적/자폐', '뇌병변', '기타'],
    info: [
      { key: '시간', value: '09:00 ~ 22:00' },
      { key: '요일', value: '월,화,수,목,금' },
      { key: '강사', value: '김강사' },
      { key: '기간', value: '2025.07.01 ~ 2025.07.31' },
    ],
    description: '개별 연령 수준과 필요성을 바탕으로 목표를 수립하여, 다양한 스포츠와 신체활동을 기반으로 하여 1:1 맞춤 프로그램 개별맞춤 운동합니다.',
    price: '110000',
  },
};

export const WithLongTitle: Story = {
  args: {
    title: '[7월] 특수체육 및 장애인스포츠팀 - 매우 긴 제목의 강좌입니다 테스트용',
    tags: ['중합체육시설', '대면', '지체, 청각/언어', '지적/자폐', '뇌병변', '기타'],
    info: [
      { key: '시간', value: '09:00 ~ 22:00' },
      { key: '요일', value: '월,화,수,목,금' },
      { key: '강사', value: '김강사' },
      { key: '기간', value: '2025.07.01 ~ 2025.07.31' },
    ],
    description: '개별 연령 수준과 필요성을 바탕으로 목표를 수립하여, 다양한 스포츠와 신체활동을 기반으로 하여 1:1 맞춤 프로그램 개별맞춤 운동합니다.',
    price: '150000',
  },
};

export const WithFewTags: Story = {
  args: {
    title: '[8월] 수영 강좌',
    tags: ['수영장', '대면'],
    info: [
      { key: '시간', value: '14:00 ~ 16:00' },
      { key: '요일', value: '화,목' },
      { key: '강사', value: '이강사' },
      { key: '기간', value: '2025.08.01 ~ 2025.08.31' },
    ],
    description: '기초 수영부터 고급 수영까지 단계별 맞춤 수영 강좌입니다.',
    price: '80000',
  },
};

export const Selected: Story = {
  args: {
    title: '[9월] 농구 강좌',
    tags: ['농구장', '대면', '초급'],
    info: [
      { key: '시간', value: '19:00 ~ 21:00' },
      { key: '요일', value: '월,수,금' },
      { key: '강사', value: '박강사' },
      { key: '기간', value: '2025.09.01 ~ 2025.09.30' },
    ],
    description: '농구 기초부터 배우는 초급자 맞춤 강좌입니다.',
    price: '120000',
    isSelected: true,
  },
};
