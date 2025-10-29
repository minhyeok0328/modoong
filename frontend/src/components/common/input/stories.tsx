import type { Meta, StoryObj } from '@storybook/react';
import Input from './index';

const meta: Meta<typeof Input> = {
  title: 'Common/Input',
  component: Input,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    error: { control: 'text' },
    helpText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    name: 'default',
    label: 'Label',
    placeholder: '입력하세요',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Input {...args} size="sm" name="sm" label="Small" />
      <Input {...args} size="md" name="md" label="Medium" />
      <Input {...args} size="lg" name="lg" label="Large" />
    </div>
  ),
  args: {},
};

export const WithError: Story = {
  args: {
    name: 'error',
    label: 'Label',
    error: '에러 메시지',
    placeholder: '에러 발생',
  },
};

export const WithHelpText: Story = {
  args: {
    name: 'help',
    label: 'Label',
    helpText: '도움말 텍스트',
    placeholder: '입력하세요',
  },
};

export const FullWidth: Story = {
  args: {
    name: 'fullwidth',
    label: 'Full Width',
    fullWidth: true,
    placeholder: '전체 너비',
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    label: 'Disabled',
    disabled: true,
    placeholder: '비활성화',
  },
};
