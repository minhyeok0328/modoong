import { forwardRef, HTMLAttributes } from 'react';
import { Post } from '@/atoms/lounge';
import { IoEye } from 'react-icons/io5';

interface PostContentProps extends HTMLAttributes<HTMLDivElement> {
  post: Post;
  isLiked: boolean;
  commentCount: number;
  onToggleLike: () => void;
}

const PostContent = forwardRef<HTMLDivElement, PostContentProps>(
  ({ post, isLiked, commentCount, onToggleLike, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl p-4 border border-gray-200 mb-4 ${className}`}
        {...props}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">
            {'subcategory' in post ? post.subcategory : '농구 - 지적발달'}
          </span>
          <div className="flex items-center gap-2">
            {post.share === false && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                비공개
              </span>
            )}
            {post.isAIGenerated && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                AI 에세이
              </span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-medium text-gray-900 leading-tight mb-4">
          {post.title}
        </h2>

        <p className="text-base text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <img src="/icons/profile-icon.png" alt="profile" className="w-4 h-4" />
            <span>{post.author}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <IoEye className="w-4 h-4" />
              <span>55</span>
            </div>
            <span>{post.date}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={onToggleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'
            }`}
          >
            <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>공감하기</span>
          </button>

          <div className="flex items-center space-x-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>댓글 {commentCount}</span>
          </div>
        </div>
      </div>
    );
  }
);

PostContent.displayName = 'PostContent';

export default PostContent;
