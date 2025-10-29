import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { postsAtom, commentsAtom, likesAtom, addCommentAtom, toggleLikeAtom } from '@/atoms/lounge';
import { MessageInput } from '@/components/common';
import { PostContent } from '@/components/lounge';
import { mockPostsAtom } from '@/mocks/lounge';

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const mockPosts = useAtomValue(mockPostsAtom);
  const userPosts = useAtomValue(postsAtom);

  // mockPosts와 userPosts를 합쳐서 사용
  const posts = [...userPosts, ...mockPosts];
  const allComments = useAtomValue(commentsAtom);
  const likes = useAtomValue(likesAtom);
  const addComment = useSetAtom(addCommentAtom);
  const toggleLike = useSetAtom(toggleLikeAtom);

  const comments = useMemo(() => {
    return allComments.filter(c => c.postId === postId);
  }, [allComments, postId]);

  const isLiked = useMemo(() => {
    const like = likes.find(l => l.postId === postId);
    return like?.isLiked || false;
  }, [likes, postId]);

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;

    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  const post = posts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 mb-4">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/lounge')}
            className="px-4 py-2 bg-yellow-400 text-white rounded-lg"
          >
            라운지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleAddComment = (content: string) => {
    if (!postId) return;
    addComment({ postId, content });
  };

  const handleToggleLike = () => {
    if (!postId) return;
    toggleLike(postId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-12">
        <div className="p-4">
          {/* Post Content */}
          <PostContent
            post={post}
            isLiked={isLiked}
            commentCount={comments.length}
            onToggleLike={handleToggleLike}
          />

          {/* Comments Section */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900">댓글 {comments.length}</h3>

            {comments.map((comment) => (
              <div key={comment.id} className="flex justify-start">
                <div className="max-w-xs">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 mr-2 flex-shrink-0 flex items-center justify-center text-white text-xs">
                      👤
                    </div>
                    <span className="text-xs text-gray-600">{comment.author}</span>
                  </div>
                  <div className="ml-8">
                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {formatRelativeTime(comment.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <MessageInput
        onSendMessage={handleAddComment}
        placeholder="댓글을 입력하세요..."
      />
    </div>
  );
}
