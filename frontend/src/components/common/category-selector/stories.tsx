import type { Meta, StoryObj } from '@storybook/react';
import CategorySelector from './index';
import { FaBasketballBall, FaSwimmer, FaRunning, FaTableTennis } from 'react-icons/fa';
import { GiSoccerBall } from 'react-icons/gi';

const meta: Meta<typeof CategorySelector> = {
  title: 'Common/CategorySelector',
  component: CategorySelector,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategorySelector>;

const sportsOptions = [
  { value: 'soccer', label: '축구', icon: <GiSoccerBall /> },
  { value: 'basketball', label: '농구', icon: <FaBasketballBall /> },
  { value: 'swimming', label: '수영', icon: <FaSwimmer /> },
  { value: 'running', label: '달리기', icon: <FaRunning /> },
  { value: 'table_tennis', label: '탁구', icon: <FaTableTennis /> },
];

export const Default: Story = {
  render: (args) => <CategorySelector {...args} />,
  args: {
    name: 'sports',
    options: sportsOptions,
    defaultValue: 'soccer',
  },
};
