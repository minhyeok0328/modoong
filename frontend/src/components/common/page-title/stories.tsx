import type { Meta, StoryObj } from '@storybook/react';
import PageTitle from '.';

const meta = {
  title: 'Common/PageTitle',
  component: PageTitle,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: (
      <>
        <b>모둥이</b>가 <b>회원님</b>을 위한{'\n'}
        <b>운동 플랜</b>을 준비했어요!
      </>
    ),
  },
};

export const WithClassName: Story = {
  args: {
    text: '페이지 제목',
    className: 'bg-gray-100 p-4',
  },
};

export const WithAriaLabel: Story = {
  args: {
    text: '페이지 제목',
    'aria-label': '페이지 제목 레이블',
  },
};
