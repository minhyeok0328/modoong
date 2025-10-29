import type { Meta, StoryObj } from '@storybook/react';
import Calendar, { ReservationMap } from './index';

const meta: Meta<typeof Calendar> = {
  title: 'Common/Calendar',
  component: Calendar,
  argTypes: {
    onChange: {
      action: 'changed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {},
};

export const WithReservations: Story = {
  args: {
    reservations: (() => {
      const today = new Date();
      const format = (d: Date) => d.toISOString().split('T')[0];

      const reservations: ReservationMap = {};
      reservations[format(today)] = '예약 3건';
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      reservations[format(tomorrow)] = '예약 1건';
      return reservations;
    })(),
  },
};
