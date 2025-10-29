import type { Meta, StoryObj } from '@storybook/react';
import Agreement from './index';

const meta: Meta<typeof Agreement> = {
  title: 'Register/Agreement',
  component: Agreement,
  argTypes: {
    agreements: { control: 'object' },
  },
  args: {
    agreements: [
      { id: 'privacy', label: '개인정보이용약관 동의', required: true },
      { id: 'marketing', label: '마케팅 정보 수신 동의 (선택)' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Agreement>;

export const Default: Story = {
  args: {
    onChange: () => {},
  },
};
