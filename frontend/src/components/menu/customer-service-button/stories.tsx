import type { Meta, StoryObj } from '@storybook/react';
import CustomerServiceButton from './index';

const meta: Meta<typeof CustomerServiceButton> = {
  title: 'Menu/CustomerServiceButton',
  component: CustomerServiceButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomerServiceButton>;

export const Default: Story = {
  args: {
    onClick: () => alert('고객센터 연결 중...'),
  },
};

export const WithCustomClass: Story = {
  args: {
    onClick: () => console.log('Customer service clicked'),
    className: 'shadow-lg',
  },
};

export const InContainer: Story = {
  render: (args) => (
    <div className="w-80 p-4">
      <CustomerServiceButton {...args} />
    </div>
  ),
  args: {
    onClick: () => alert('고객센터 연결 중...'),
  },
};
