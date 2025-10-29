import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import MenuCategory from './index';
import MenuItem from '../menu-item/index';

const meta: Meta<typeof MenuCategory> = {
  title: 'Menu/MenuCategory',
  component: MenuCategory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="w-96">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MenuCategory>;

export const ReservationCategory: Story = {
  args: {
    title: '예약하기',
    searchTerm: '',
    children: (
      <>
        <MenuItem label="시설찾기" path="/reservation" searchTerm="" />
        <MenuItem label="예약내역" path="/reservation/history" searchTerm="" />
        <MenuItem label="신청내역" path="/reservation/applications" searchTerm="" />
      </>
    ),
  },
};

export const MatchingCategory: Story = {
  args: {
    title: '매칭하기',
    searchTerm: '',
    children: (
      <>
        <MenuItem label="운동 친구 찾기" path="/mate/friend-finder" searchTerm="" />
        <MenuItem label="모둥메이트 찾기" path="/mate/group" searchTerm="" />
      </>
    ),
  },
};

export const LoungeCategory: Story = {
  args: {
    title: '라운지',
    searchTerm: '',
    children: (
      <>
        <MenuItem label="모두의 라운지" path="/lounge" searchTerm="" />
        <MenuItem label="전문가 라운지" path="/lounge/expert" searchTerm="" />
      </>
    ),
  },
};

export const CategoryWithSearch: Story = {
  args: {
    title: '예약하기',
    searchTerm: '예약',
    children: (
      <>
        <MenuItem label="시설찾기" path="/reservation" searchTerm="예약" />
        <MenuItem label="예약내역" path="/reservation/history" searchTerm="예약" />
        <MenuItem label="신청내역" path="/reservation/applications" searchTerm="예약" />
      </>
    ),
  },
};
