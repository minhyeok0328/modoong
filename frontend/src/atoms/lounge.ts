import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { atom } from 'jotai';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'community' | 'expert';
  subcategory: '모임찾기' | '일상톡톡' | '번개해요' | '운동정보' | '정책정보' | '행사정보' | '에세이';
  isShared?: boolean;
  share?: boolean;
  isAIGenerated?: boolean;
}

export interface SharedPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface TempStory {
  title: string;
  content: string;
  aiGeneratedTitle?: string;
  aiGeneratedContent?: string;
  aiGeneratedComment?: string;
  originalInput?: {
    exerciseRecord: string;
    emotion: string;
    story: string;
  };
}

export interface PostComment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: number;
}

export interface PostLike {
  postId: string;
  isLiked: boolean;
}

const sharedPostsStorage = createJSONStorage<SharedPost[]>(() => localStorage);
const tempStoryStorage = createJSONStorage<TempStory>(() => localStorage);
const postsStorage = createJSONStorage<Post[]>(() => localStorage);
const commentsStorage = createJSONStorage<PostComment[]>(() => localStorage);
const likesStorage = createJSONStorage<PostLike[]>(() => localStorage);

// 에세이 게시판에 공유된 글들을 저장하는 atom
export const sharedPostsAtom = atomWithStorage<SharedPost[]>(
  'shared-posts',
  [],
  sharedPostsStorage
);

// 현재 작성중인 AI 스토리 임시 저장용
export const currentStoryAtom = atomWithStorage<TempStory>(
  'temp-story',
  { title: '', content: '' },
  tempStoryStorage
);

// 게시글들을 localStorage에 저장하는 atom
export const postsAtom = atomWithStorage<Post[]>(
  'lounge-posts',
  [],
  postsStorage
);

// 댓글들을 localStorage에 저장하는 atom
export const commentsAtom = atomWithStorage<PostComment[]>(
  'post-comments',
  [
    { id: '1', postId: 'community-1', author: '김영희', content: '좋은 정보 감사해요!', timestamp: Date.now() - 60000 },
    { id: '2', postId: 'community-1', author: '박철수', content: '저도 참여하고 싶어요', timestamp: Date.now() - 300000 },
    { id: '3', postId: 'community-1', author: '이민정', content: '언제 어디서 하나요?', timestamp: Date.now() - 600000 }
  ],
  commentsStorage
);

// 좋아요 상태를 localStorage에 저장하는 atom
export const likesAtom = atomWithStorage<PostLike[]>(
  'post-likes',
  [],
  likesStorage
);

// 댓글 추가 액션
export const addCommentAtom = atom(
  null,
  (get, set, { postId, content, author = '나' }: { postId: string; content: string, author?: string }) => {
    const comments = get(commentsAtom);
    const newComment: PostComment = {
      id: Date.now().toString(),
      postId,
      author,
      content,
      timestamp: Date.now()
    };
    set(commentsAtom, [newComment, ...comments]);
  }
);

// 좋아요 토글 액션
export const toggleLikeAtom = atom(
  null,
  (get, set, postId: string) => {
    const likes = get(likesAtom);
    const existingLike = likes.find(like => like.postId === postId);

    if (existingLike) {
      set(likesAtom, likes.map(like =>
        like.postId === postId
          ? { ...like, isLiked: !like.isLiked }
          : like
      ));
    } else {
      set(likesAtom, [...likes, { postId, isLiked: true }]);
    }
  }
);

