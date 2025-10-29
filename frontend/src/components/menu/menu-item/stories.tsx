import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import MenuItem from './index';

const meta: Meta<typeof MenuItem> = {
  title: 'Menu/MenuItem',
  component: MenuItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="w-80">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

export const Default: Story = {
  args: {
    label: '시설찾기',
    path: '/reservation',
    searchTerm: '',
  },
};

export const Highlighted: Story = {
  args: {
    label: '시설찾기',
    path: '/reservation',
    searchTerm: '시설',
  },
};

export const LongLabel: Story = {
  args: {
    label: '매우 긴 메뉴 이름입니다. 이것이 어떻게 표시되는지 확인해보겠습니다.',
    path: '/reservation',
    searchTerm: '',
  },
};

export const PartialHighlight: Story = {
  args: {
    label: '예약내역 확인하기',
    path: '/reservation/history',
    searchTerm: '예약',
  },
};
