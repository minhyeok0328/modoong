import type { Meta, StoryObj } from '@storybook/react';
import Dropdown from './index';

const meta: Meta<typeof Dropdown> = {
  title: 'Common/Dropdown',
  component: Dropdown,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    helpText: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

const sportsOptions = [
  { value: 'soccer', label: '축구' },
  { value: 'basketball', label: '농구' },
  { value: 'swimming', label: '수영' },
  { value: 'running', label: '달리기' },
];

export const Default: Story = {
  args: {
    name: 'sports',
    label: '운동 종목',
    placeholderLabel: '선택하세요',
    options: sportsOptions,
    required: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Dropdown {...args} size="sm" name="size-sm" label="Small" />
      <Dropdown {...args} size="md" name="size-md" label="Medium" />
      <Dropdown {...args} size="lg" name="size-lg" label="Large" />
    </div>
  ),
  args: {
    options: sportsOptions,
    placeholderLabel: '선택',
  },
};

export const WithError: Story = {
  args: {
    name: 'with-error',
    label: '에러 예시',
    options: sportsOptions,
    error: '필수 항목입니다.',
    required: true,
  },
};

export const WithHelpText: Story = {
  args: {
    name: 'with-help',
    label: '도움말 예시',
    options: sportsOptions,
    helpText: '선호하는 종목을 선택하세요.',
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    label: '비활성화',
    options: sportsOptions,
    disabled: true,
  },
};
