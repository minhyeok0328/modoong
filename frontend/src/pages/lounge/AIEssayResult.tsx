import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { currentStoryAtom, postsAtom, addCommentAtom } from '@/atoms/lounge';
import { SimpleHeader } from '@/components/common';

export default function AIEssayResult() {
  const navigate = useNavigate();
  const currentStory = useAtomValue(currentStoryAtom);
  const setPosts = useSetAtom(postsAtom);
  const setCurrentStory = useSetAtom(currentStoryAtom);
  const addComment = useSetAtom(addCommentAtom);
  const [aiGeneratedTitle, setAiGeneratedTitle] = useState("운동을 통해 발견한 나만의 행복");
  const [aiGeneratedContent, setAiGeneratedContent] = useState(`오늘 헬스장에서 땀을 흘리며 운동을 마쳤을 때, 마음 속 깊은 곳에서 올라오는 뿌듯함을 느꼈습니다.

처음엔 무거운 중량이 부담스러웠지만, 한 세트씩 완주할 때마다 성취감이 차올랐습니다. 거울 속 내 모습을 보며 '해낼 수 있다'는 자신감이 생겼어요.

운동은 단순히 몸을 단련하는 것이 아니라, 마음의 힘을 기르는 시간이었습니다. 매일의 작은 도전들이 모여 더 나은 내가 되어가는 과정이라는 것을 깨달았습니다.

앞으로도 꾸준히 운동하며, 몸과 마음 모두 건강한 사람이 되고 싶습니다.`);
  const [aiGeneratedComment, setAiGeneratedComment] = useState("정말 감동적인 글이네요! 운동을 통해 얻은 성취감이 잘 전해집니다. 저도 꾸준히 운동해야겠어요 💪");

  useEffect(() => {
    // currentStoryAtom에서 AI 생성 결과 읽어오기
    if (currentStory.aiGeneratedTitle && currentStory.aiGeneratedContent) {
      setAiGeneratedTitle(currentStory.aiGeneratedTitle);
      setAiGeneratedContent(currentStory.aiGeneratedContent);
    }
    if (currentStory.aiGeneratedComment) {
      setAiGeneratedComment(currentStory.aiGeneratedComment);
    }
  }, [currentStory]);

  const handleSaveAndComplete = () => {
    const newPostId = `ai-essay-${Date.now()}`;
    const newPost = {
      id: newPostId,
      title: aiGeneratedTitle,
      content: aiGeneratedContent,
      author: '나',
      date: '방금 전',
      category: 'community' as const,
      subcategory: '에세이' as any,
      share: false, // 기본값은 나만보기
      isAIGenerated: true
    };

    setPosts(prev => [newPost, ...prev]);

    // 댓글을 commentsAtom에 추가
    addComment({ postId: newPostId, content: aiGeneratedComment, author: '모둥이' });

    // temp-story 삭제 (초기화)
    setCurrentStory({ title: '', content: '' });

    navigate(`/lounge/ai-essay/complete?id=${newPost.id}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <SimpleHeader
        title="AI 에세이"
        onBackClick={() => navigate(-1)}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* AI Generated Essay */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4 leading-tight">
            {aiGeneratedTitle}
          </h2>

          <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {aiGeneratedContent}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <span>AI 모둥이</span>
            </div>
            <span>방금 전</span>
          </div>
        </div>

        {/* Input Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">작성한 내용</h3>
          <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
            {currentStory.content}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-white space-y-3">
        <button
          onClick={() => {
            // currentStoryAtom에서 이전 입력값들을 가져와서 쿼리 파라미터로 전달
            const { originalInput } = currentStory;
            if (originalInput) {
              const params = new URLSearchParams({
                exerciseRecord: originalInput.exerciseRecord || '',
                emotion: originalInput.emotion || '',
                story: originalInput.story || ''
              });
              navigate(`/lounge/ai-essay?${params.toString()}`);
            } else {
              navigate('/lounge/ai-essay');
            }
          }}
          className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          다시 쓸래요
        </button>

        <button
          onClick={handleSaveAndComplete}
          className="w-full py-3 rounded-xl bg-yellow-400 text-black font-medium hover:bg-yellow-500 transition-colors"
        >
          맘에 들어요
        </button>
      </div>
    </div>
  );
}
