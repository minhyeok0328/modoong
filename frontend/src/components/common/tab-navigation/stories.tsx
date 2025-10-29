import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TabNavigation from './index';

const meta = {
  title: 'Common/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

// Template for interactive stories
function TabNavigationTemplate(args: any) {
  const [activeTab, setActiveTab] = useState(args.activeTab);

  return (
    <div className="w-80">
      <TabNavigation
        {...args}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">Active tab: {activeTab}</p>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: TabNavigationTemplate,
  args: {
    tabs: [
      { id: 'tab1', label: '첫 번째 탭' },
      { id: 'tab2', label: '두 번째 탭' },
    ],
    activeTab: 'tab1',
    onTabChange: () => {},
  },
};

export const LoungeExample: Story = {
  render: TabNavigationTemplate,
  args: {
    tabs: [
      { id: 'community', label: '모두의 라운지' },
      { id: 'expert', label: '전문가 라운지' },
    ],
    activeTab: 'community',
    onTabChange: () => {},
  },
};

export const ThreeTabs: Story = {
  render: TabNavigationTemplate,
  args: {
    tabs: [
      { id: 'all', label: '전체' },
      { id: 'recent', label: '최신' },
      { id: 'popular', label: '인기' },
    ],
    activeTab: 'all',
    onTabChange: () => {},
  },
};

export const WithCustomClass: Story = {
  render: TabNavigationTemplate,
  args: {
    tabs: [
      { id: 'home', label: '홈' },
      { id: 'profile', label: '프로필' },
    ],
    activeTab: 'home',
    className: 'mb-6',
    onTabChange: () => {},
  },
};