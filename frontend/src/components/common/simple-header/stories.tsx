import type { Meta, StoryObj } from '@storybook/react';
import SimpleHeader from '.';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Common/SimpleHeader',
  component: SimpleHeader,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SimpleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '예약하기',
  },
};

export const WithCustomBackAction: Story = {
  args: {
    title: '예약하기',
    onBackClick: () => alert('뒤로가기'),
  },
};
