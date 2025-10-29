import type { Meta, StoryObj } from '@storybook/react';
import PostCard from './index';

const meta: Meta<typeof PostCard> = {
  title: 'Lounge/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PostCard>;

// 전문가 라운지 카드
export const ExpertPost: Story = {
  args: {
    post: {
      id: 'expert-1',
      title: '장애인 체육활동 시 주의사항',
      content:
        '장애인 체육활동 시 안전을 위한 주의사항들을 알려드립니다. 운동 전 충분한 준비운동과 전문가의 지도를 받는 것이 중요합니다.',
      author: '김전문가',
      date: '2024-01-15',
      category: 'expert',
      subcategory: '운동정보',
    },
  },
};

// 모두의 라운지 카드
export const CommunityPost: Story = {
  args: {
    post: {
      id: 'community-1',
      title: '오늘 처음 탁구 쳐봤어요!',
      content:
        '오늘 처음으로 탁구를 쳐봤는데 정말 재미있었어요. 다음에 또 하고 싶어요! 같이 탁구 치실 분들 있으면 연락주세요.',
      author: '운동초보',
      date: '2024-01-15',
      category: 'community',
      subcategory: '일상톡톡',
    },
  },
};

// 모임찾기 카드
export const MeetupPost: Story = {
  args: {
    post: {
      id: 'community-2',
      title: '휠체어 농구 동호회 새 멤버 모집',
      content:
        '매주 토요일마다 함께 농구를 즐기실 분들을 찾고 있어요! 초보자도 환영합니다.',
      author: '농구동호회',
      date: '2024-01-15',
      category: 'community',
      subcategory: '모임찾기',
    },
  },
};

// AI 스토리 공유 게시글 (SharedPost 타입)
export const AIStoryPost: Story = {
  args: {
    post: {
      id: 'shared-1',
      title: '운동을 통해 찾은 새로운 나',
      content:
        '오늘은 모둥 AI와 함께 작성한 글을 공유해요. 운동을 시작하면서 달라진 나의 모습들을 되돌아보는 시간을 가져보았습니다.',
      author: '나',
      date: '2024-01-15',
      category: 'community',
      isShared: true,
    },
  },
};

// 긴 제목과 내용
export const LongContentPost: Story = {
  args: {
    post: {
      id: 'long-1',
      title: '매우 긴 제목입니다. 이렇게 긴 제목이 어떻게 표시되는지 확인해보겠습니다.',
      content:
        '매우 긴 내용입니다. 이 내용이 어떻게 표시되는지 확인해보겠습니다. 일반적으로 카드에서는 내용이 2줄 이상일 때 truncate되어 표시됩니다. 이런 긴 내용이 어떻게 처리되는지 확인하기 위해 더 많은 텍스트를 추가해보겠습니다. 여기서 더 많은 내용을 써보겠습니다.',
      author: '긴내용작성자',
      date: '2024-01-15',
      category: 'community',
      subcategory: '일상톡톡',
    },
  },
};

// 전체 리스트 (스토리북에서 여러 카드 확인용)
export const AllPostTypes: Story = {
  render: () => (
    <div className="space-y-4 max-w-4xl">
      <PostCard
        post={{
          id: 'expert-1',
          title: '장애인 체육활동 시 주의사항',
          content: '장애인 체육활동 시 안전을 위한 주의사항들을 알려드립니다.',
          author: '김전문가',
          date: '2024-01-15',
          category: 'expert',
          subcategory: '운동정보',
        }}
      />
      <PostCard
        post={{
          id: 'community-1',
          title: '오늘 처음 탁구 쳐봤어요!',
          content: '오늘 처음으로 탁구를 쳐봤는데 정말 재미있었어요. 다음에 또 하고 싶어요!',
          author: '운동초보',
          date: '2024-01-15',
          category: 'community',
          subcategory: '일상톡톡',
        }}
      />
      <PostCard
        post={{
          id: 'community-2',
          title: '휠체어 농구 동호회 모집',
          content: '매주 토요일마다 함께 농구를 즐기실 분들을 찾고 있어요!',
          author: '농구동호회',
          date: '2024-01-15',
          category: 'community',
          subcategory: '모임찾기',
        }}
      />
      <PostCard
        post={{
          id: 'shared-1',
          title: '운동을 통해 찾은 새로운 나',
          content: '오늘은 모둥 AI와 함께 작성한 글을 공유해요.',
          author: '나',
          date: '2024-01-15',
          category: 'community',
          isShared: true,
        }}
      />
    </div>
  ),
};
