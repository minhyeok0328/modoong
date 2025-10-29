import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CategorySelector, { Category } from './index';

const meta: Meta<typeof CategorySelector> = {
  title: 'Lounge/CategorySelector',
  component: CategorySelector,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const communityCategories: Category[] = [
  { id: '모임찾기', name: '모임찾기', icon: '/icons/group.png' },
  { id: '일상톡톡', name: '일상톡톡', icon: '/icons/home.png' },
  { id: '번개해요', name: '번개해요', icon: '/icons/lightning.png' },
];

const expertCategories: Category[] = [
  { id: '운동정보', name: '운동정보', icon: '/icons/info.png' },
  { id: '정책정보', name: '정책정보', icon: '/icons/policy.png' },
  { id: '행사정보', name: '행사정보', icon: '/icons/event.png' },
];

export const CommunityCategories: Story = {
  render: (args) => {
    const [selected, setSelected] = useState('모임찾기');
    return (
      <CategorySelector
        {...args}
        categories={communityCategories}
        selectedCategory={selected}
        onCategorySelect={setSelected}
      />
    );
  },
};

export const ExpertCategories: Story = {
  render: (args) => {
    const [selected, setSelected] = useState('운동정보');
    return (
      <CategorySelector
        {...args}
        categories={expertCategories}
        selectedCategory={selected}
        onCategorySelect={setSelected}
      />
    );
  },
};

export const ThreeColumns: Story = {
  render: (args) => {
    const [selected, setSelected] = useState('모임찾기');
    return (
      <CategorySelector
        {...args}
        categories={communityCategories}
        selectedCategory={selected}
        onCategorySelect={setSelected}
        columns={3}
      />
    );
  },
};