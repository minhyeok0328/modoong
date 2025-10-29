import type { Meta, StoryObj } from '@storybook/react';
import PostContent from './index';

const meta: Meta<typeof PostContent> = {
  title: 'Lounge/PostContent',
  component: PostContent,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isLiked: {
      control: 'boolean',
      description: '좋아요 상태',
    },
    commentCount: {
      control: 'number',
      description: '댓글 수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost = {
  id: 'story-1',
  title: '오늘 헬스장에서 운동하고 왔어요!',
  content: '오랜만에 운동을 했는데 정말 기분이 좋네요. 땀을 흘리며 운동하니 스트레스도 풀리고 건강해지는 느낌입니다.\n\n앞으로 꾸준히 운동해야겠어요.',
  author: '김철수',
  date: '10분 전',
  category: 'community' as const,
  subcategory: '일상톡톡' as any,
  share: true,
  isAIGenerated: false,
};

const mockAIPost = {
  ...mockPost,
  id: 'story-2',
  title: '운동을 통해 발견한 나만의 행복',
  isAIGenerated: true,
  share: false,
};

const mockPrivateAIPost = {
  ...mockPost,
  id: 'story-3',
  title: '나만의 운동 루틴을 찾아가는 여정',
  isAIGenerated: true,
  share: false,
};

export const Default: Story = {
  args: {
    post: mockPost,
    isLiked: false,
    commentCount: 3,
    onToggleLike: () => console.log('Toggle like'),
  },
};

export const Liked: Story = {
  args: {
    post: mockPost,
    isLiked: true,
    commentCount: 5,
    onToggleLike: () => console.log('Toggle like'),
  },
};

export const AIGenerated: Story = {
  args: {
    post: mockAIPost,
    isLiked: false,
    commentCount: 2,
    onToggleLike: () => console.log('Toggle like'),
  },
};

export const PrivatePost: Story = {
  args: {
    post: {
      ...mockPost,
      share: false,
    },
    isLiked: false,
    commentCount: 0,
    onToggleLike: () => console.log('Toggle like'),
  },
};

export const PrivateAIPost: Story = {
  args: {
    post: mockPrivateAIPost,
    isLiked: true,
    commentCount: 1,
    onToggleLike: () => console.log('Toggle like'),
  },
};

export const LongTitle: Story = {
  args: {
    post: {
      ...mockPost,
      title: '정말 긴 제목을 가진 게시글인데 이렇게 길어도 레이아웃이 깨지지 않고 잘 보이는지 확인해보는 테스트용 게시글입니다',
      isAIGenerated: true,
      share: false,
    },
    isLiked: false,
    commentCount: 12,
    onToggleLike: () => console.log('Toggle like'),
  },
};