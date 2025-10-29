import { forwardRef, HTMLAttributes, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { Post, SharedPost, likesAtom, toggleLikeAtom, commentsAtom } from '@/atoms/lounge';
import { IoEye } from 'react-icons/io5';

interface PostCardProps extends HTMLAttributes<HTMLDivElement> {
  post: Post | (SharedPost & { category: 'community' | 'expert'; isShared: true });
  to?: string;
}

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  ({ post, to, className = '', ...props }, ref) => {
    const navigate = useNavigate();
    const likes = useAtomValue(likesAtom);
    const allComments = useAtomValue(commentsAtom);
    const toggleLike = useSetAtom(toggleLikeAtom);

    const isLiked = useMemo(() => {
      const like = likes.find(l => l.postId === post.id);
      return like?.isLiked || false;
    }, [likes, post.id]);

    const commentCount = useMemo(() => {
      return allComments.filter(c => c.postId === post.id).length;
    }, [allComments, post.id]);

    const handleCardClick = () => {
      if (to) {
        navigate(to);
      }
    };

    const handleLikeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleLike(post.id);
    };
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl p-4 border border-gray-200 ${to ? 'cursor-pointer' : ''} ${className}`}
        onClick={handleCardClick}
        {...props}
      >
        <div className="mb-2">
          <span className="text-xs text-gray-500">
            {'subcategory' in post ? post.subcategory : '농구 - 지적발달'}
          </span>
        </div>

        <div className="flex items-start gap-2 mb-2">
          <h3 className="text-base font-medium text-gray-900 leading-tight flex-1">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {'share' in post && post.share === false && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                비공개
              </span>
            )}
            {'isAIGenerated' in post && post.isAIGenerated && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                AI
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {post.content}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <img src="/icons/profile-icon.png" alt="profile" className="w-4 h-4" />
            <span>{post.author}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <IoEye className="w-3 h-3" />
              <span>55</span>
            </div>
            <span>{post.date}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleLikeClick}
            className={`flex items-center space-x-1 text-xs transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>공감하기</span>
          </button>

          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>댓글 {commentCount}</span>
          </div>
        </div>
      </div>
    );
  }
);

PostCard.displayName = 'PostCard';

export default PostCard;
