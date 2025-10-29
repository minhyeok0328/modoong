import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { postsAtom } from '@/atoms/lounge';
import { TabNavigation } from '@/components/common';

export default function AIEssayComplete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  
  const posts = useAtomValue(postsAtom);
  const setPosts = useSetAtom(postsAtom);
  
  const [activeTab, setActiveTab] = useState('private');
  const [isAnimated, setIsAnimated] = useState(false);

  const post = posts.find(p => p.id === postId);

  const tabs = [
    { id: 'private', label: '나만보기' },
    { id: 'public', label: '공유하기' },
  ];

  useEffect(() => {
    // 페이지 로드 시 애니메이션 시작
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  useEffect(() => {
    if (!postId) return;

    // share 상태 업데이트
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, share: activeTab === 'public' }
        : p
    ));
  }, [activeTab, postId, setPosts]);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 mb-4">에세이를 찾을 수 없습니다.</p>
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div 
            className={`text-3xl font-bold text-gray-900 mb-8 transform transition-all duration-1000 ${
              isAnimated 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            에세이가 완성되었어요! 🎉
          </div>

          <div 
            className={`transform transition-all duration-1000 delay-300 ${
              isAnimated 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {post.content}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md">
              <button
                onClick={() => navigate(`/lounge/${postId}`)}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                내가 쓴 에세이 보러가기
              </button>
              <button
                onClick={() => navigate('/lounge')}
                className="flex-1 px-6 py-3 bg-yellow-400 text-black font-medium rounded-xl hover:bg-yellow-500 transition-colors shadow-sm"
              >
                라운지로 이동하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="bg-white border-t border-gray-200 p-4">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            {activeTab === 'private' 
              ? '나만 볼 수 있는 에세이입니다' 
              : '모든 사람이 볼 수 있는 에세이입니다'
            }
          </p>
        </div>
      </div>

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}