import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SearchBar from './index';

const meta: Meta<typeof SearchBar> = {
  title: 'Menu/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <SearchBar value={value} onChange={setValue} />;
  },
};

export const WithSearch: Story = {
  render: () => {
    const [value, setValue] = useState('예약');
    return <SearchBar value={value} onChange={setValue} />;
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <SearchBar value={value} onChange={setValue} placeholder="검색어를 입력하세요" />;
  },
};
