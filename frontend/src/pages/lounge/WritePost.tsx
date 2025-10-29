import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { postsAtom } from '@/atoms/lounge';
import { CategorySelector } from '@/components/lounge';
import { Input, SimpleHeader, SpeechBubble } from '@/components/common';

export default function WritePost() {
  const navigate = useNavigate();
  const setPosts = useSetAtom(postsAtom);
  const aiButtonRef = useRef<HTMLButtonElement>(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const communityCategories = [
    { id: '모임찾기', name: '모임찾기', icon: '/icons/group.png' },
    { id: '일상톡톡', name: '일상톡톡', icon: '/icons/home.png' },
    { id: '번개해요', name: '번개해요', icon: '/icons/lightning.png' },
    { id: '에세이', name: '에세이', icon: '/icons/write.png' },
  ];

  const canSubmit = selectedCategory && title.trim() && content.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;

    const newPost = {
      id: `community-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: '나',
      date: '방금 전',
      category: 'community' as const,
      subcategory: selectedCategory as any,
      share: true,
    };

    setPosts(prev => [newPost, ...prev]);

    alert('글 작성이 완료되었습니다!');
    navigate(`/lounge/${newPost.id}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <SimpleHeader
        title="글쓰기"
        onBackClick={() => navigate(-1)}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Category Selection */}
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">주제 선택</h2>
          <CategorySelector
            categories={communityCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            columns={communityCategories.length}
          />
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">제목</h2>
          <Input
            name="title"
            label=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            className="w-full"
          />
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">내용</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요"
            rows={8}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-white">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl font-medium transition-colors ${
            canSubmit
              ? 'bg-yellow-400 hover:bg-yellow-500'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          글 작성하기
        </button>
      </div>

      {/* AI Essay Button */}
      <div className="relative">
        <SpeechBubble
          position="top"
          className="absolute bottom-38 right-4"
        >
          모둥이랑 같이 에세이 쓸래요?
        </SpeechBubble>

        <button
          ref={aiButtonRef}
          onClick={() => navigate('/lounge/ai-essay')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-10"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
