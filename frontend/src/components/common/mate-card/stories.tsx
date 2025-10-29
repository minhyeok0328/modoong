import type { Meta, StoryObj } from '@storybook/react';
import MateCard from './index';

const meta: Meta<typeof MateCard> = {
  title: 'Components/Common/MateCard',
  component: MateCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onNextTime: { action: 'next time clicked' },
    onApply: { action: 'apply clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: '박민지',
    age: 50,
    gender: '여성',
    temperature: '36.4°C',
    experience: '3건',
    activity: '10시간',
    isVolunteer: true,
  },
};

export const WithoutVolunteer: Story = {
  args: {
    name: '김영수',
    age: 30,
    gender: '남성',
    temperature: '35.8°C',
    experience: '5건',
    activity: '15시간',
    isVolunteer: false,
  },
};