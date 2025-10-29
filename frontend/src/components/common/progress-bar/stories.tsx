import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './index';

const meta: Meta<typeof ProgressBar> = {
  title: 'Common/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 10 },
      description: '현재 단계 (1부터 시작)',
    },
    totalSteps: {
      control: { type: 'number', min: 1, max: 10 },
      description: '전체 단계 수',
    },
    bgColor: {
      control: 'text',
      description: '진행률 바의 배경색 클래스',
    },
    fillColor: {
      control: 'text',
      description: '진행률 바의 채움색 클래스',
    },
    label: {
      control: 'text',
      description: '진행률 설명을 위한 라벨',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentStep: 3,
    totalSteps: 7,
    label: '회원가입',
  },
};

export const FirstStep: Story = {
  args: {
    currentStep: 1,
    totalSteps: 5,
    label: '설정',
  },
};

export const LastStep: Story = {
  args: {
    currentStep: 5,
    totalSteps: 5,
    label: '완료',
  },
};

export const CustomColors: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    bgColor: 'bg-blue-100',
    fillColor: 'bg-blue-500',
    label: '커스텀 진행률',
  },
};