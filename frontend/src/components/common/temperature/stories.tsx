import type { Meta, StoryObj } from '@storybook/react';
import Temperature from '.';

const meta = {
  title: 'Common/Temperature',
  component: Temperature,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Temperature>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 24.5,
  },
};

export const Cold: Story = {
  args: {
    value: 0.0,
  },
};

export const Hot: Story = {
  args: {
    value: 35.8,
  },
};

export const WithCustomClass: Story = {
  args: {
    value: 22.3,
    className: 'bg-blue-500/50',
  },
};
