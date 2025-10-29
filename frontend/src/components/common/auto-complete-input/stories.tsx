import type { Meta, StoryObj } from '@storybook/react';
import AutoCompleteInput from './index';

const meta = {
  title: 'Components/Common/AutoCompleteInput',
  component: AutoCompleteInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '입력된 값',
    },
    onChange: {
      action: 'changed',
      description: '값이 변경될 때 호출되는 함수',
    },
    label: {
      control: 'text',
      description: '입력 필드 라벨',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    suggestions: {
      control: 'object',
      description: '자동완성 제안 목록',
    },
    id: {
      control: 'text',
      description: '입력 필드 ID',
    },
  },
} satisfies Meta<typeof AutoCompleteInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    label: '좋아하는 운동',
    placeholder: '운동을 입력해주세요',
    suggestions: ['축구', '농구', '배구', '테니스', '탁구', '배드민턴', '수영', '골프'],
    id: 'sport-input',
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    value: '축구',
    label: '좋아하는 운동',
    placeholder: '운동을 입력해주세요',
    suggestions: ['축구', '농구', '배구', '테니스', '탁구', '배드민턴', '수영', '골프'],
    id: 'sport-input',
    onChange: () => {},
  },
};

export const ManySuggestions: Story = {
  args: {
    value: '',
    label: '좋아하는 운동',
    placeholder: '운동을 입력해주세요',
    suggestions: [
      '축구', '농구', '배구', '테니스', '탁구', '배드민턴', '수영', '골프',
      '야구', '클라이밍', '요가', '필라테스', '헬스', '크로스핏', '복싱',
      '태권도', '유도', '검도', '사격', '양궁', '볼링', '당구', '승마'
    ],
    id: 'sport-input',
    onChange: () => {},
  },
};
