import type { Meta, StoryObj } from '@storybook/react';
import Radio from './index';
import { useState } from 'react';

const meta: Meta<typeof Radio> = {
  title: 'Common/Radio',
  component: Radio,
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('card');
    return (
      <div className="flex flex-col gap-2">
        <Radio
          {...args}
          name="payment"
          value="card"
          label="신용·체크카드"
          checked={value === 'card'}
          onChange={() => setValue('card')}
        />
        <Radio
          {...args}
          name="payment"
          value="bank"
          label="무통장입금"
          checked={value === 'bank'}
          onChange={() => setValue('bank')}
        />
      </div>
    );
  },
};
