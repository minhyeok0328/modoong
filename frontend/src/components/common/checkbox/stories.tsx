import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './index';

const meta: Meta<typeof Checkbox> = {
  title: 'Common/Checkbox',
  component: Checkbox,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    name: 'checkbox',
    label: '체크박스',
    onChange: () => {},
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox {...args} size="sm" name="sm" label="Small" />
      <Checkbox {...args} size="md" name="md" label="Medium" />
      <Checkbox {...args} size="lg" name="lg" label="Large" />
    </div>
  ),
  args: {},
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    label: 'Disabled',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    name: 'required',
    label: '필수',
    required: true,
  },
};
