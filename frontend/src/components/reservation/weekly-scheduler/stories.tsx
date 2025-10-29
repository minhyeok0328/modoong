import type { Meta, StoryObj } from '@storybook/react';
import WeeklyScheduler from './index';
import { useState } from 'react';

const meta: Meta<typeof WeeklyScheduler> = {
  title: 'Reservation/WeeklyScheduler',
  component: WeeklyScheduler,
  argTypes: {
    startTime: { control: 'text' },
    endTime: { control: 'text' },
    interval: { control: 'number' },
    disabledSlots: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof WeeklyScheduler>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<[string, string] | null>(null);
    return <WeeklyScheduler {...args} value={value} onChange={setValue} />;
  },
  args: {
    startTime: '10:00',
    endTime: '18:30',
    disabledSlots: [{ date: '2025-07-10', times: ['12:30', '13:00'] }, { date: '2025-07-11' }],
  },
};
