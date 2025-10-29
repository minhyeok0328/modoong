import { useState } from 'react';
import { useAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { postsAtom } from '../../atoms/lounge';
import PostCard from '../../components/lounge/post-card';
import { CategorySelector } from '../../components/lounge';
import { TabNavigation } from '../../components/common';
import { mockPostsAtom } from '@/mocks/lounge';

export default function LoungeMain() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 쿼리스트링에서 초기값 가져오기
  const category = searchParams.get('category') || 'community';
  const subcategory = searchParams.get('subcategory');

  const [activeTab, setActiveTab] = useState<'community' | 'expert'>(category === 'expert' ? 'expert' : 'community');
  const [mockPosts] = useAtom(mockPostsAtom);
  const [userPosts] = useAtom(postsAtom);

  // mockPosts와 userPosts를 합쳐서 사용 (userPosts가 앞에 와서 최신 글이 위에 표시됨)
  const posts = [...userPosts, ...mockPosts];
  const tabs = [
    { id: 'community', label: '모두의 라운지' },
    { id: 'expert', label: '전문가 라운지' },
  ];

  const communityCategories = [
    { id: '모임찾기', name: '모임찾기', icon: '/icons/group.png' },
    { id: '일상톡톡', name: '일상톡톡', icon: '/icons/home.png' },
    { id: '번개해요', name: '번개해요', icon: '/icons/lightning.png' },
    { id: '에세이', name: '에세이', icon: '/icons/write.png' },
  ];

  const expertCategories = [
    { id: '운동정보', name: '운동정보', icon: '/icons/fitness.png' },
    { id: '정책정보', name: '정책정보', icon: '/icons/policy.png' },
    { id: '행사정보', name: '행사정보', icon: '/icons/megaphone.png' },
  ];

  // 쿼리스트링에서 서브카테고리 초기값 설정
  const [selectedCommunityCategory, setSelectedCommunityCategory] = useState(
    category === 'community' && subcategory && communityCategories.find(c => c.id === subcategory)
      ? subcategory
      : communityCategories[0].id
  );
  const [selectedExpertCategory, setSelectedExpertCategory] = useState(
    category === 'expert' && subcategory && expertCategories.find(c => c.id === subcategory)
      ? subcategory
      : expertCategories[0].id
  );

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    const newTab = tabId as 'community' | 'expert';
    setActiveTab(newTab);

    // 새 탭의 기본 카테고리로 설정
    const newSubcategory = newTab === 'community' ? communityCategories[0].id : expertCategories[0].id;

    setSearchParams({
      category: newTab,
      subcategory: newSubcategory
    });
  };

  // 카테고리 변경 핸들러
  const handleCategorySelect = (categoryId: string) => {
    if (activeTab === 'community') {
      setSelectedCommunityCategory(categoryId);
    } else {
      setSelectedExpertCategory(categoryId);
    }

    setSearchParams({
      category: activeTab,
      subcategory: categoryId
    });
  };

  const filteredPosts = posts.filter(post => {
    // 모든 게시글 표시 (share 값과 관계없이)
    if (activeTab === 'community') {
      if (selectedCommunityCategory === 'all') return post.category === 'community';
      return post.category === 'community' && post.subcategory === selectedCommunityCategory;
    } else {
      if (selectedExpertCategory === 'all') return post.category === 'expert';
      return post.category === 'expert' && post.subcategory === selectedExpertCategory;
    }
  });

  return (
    <div className="px-4 py-4">
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-4"
      />

      {/* Category Icons */}
      <CategorySelector
        categories={activeTab === 'community' ? communityCategories : expertCategories}
        selectedCategory={activeTab === 'community' ? selectedCommunityCategory : selectedExpertCategory}
        onCategorySelect={handleCategorySelect}
        columns={(activeTab === 'community' ? communityCategories : expertCategories).length}
        className="mb-6"
      />

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            className="mb-4"
            to={`/lounge/${post.id}`}
          />
        ))}
      </div>
    </div>
  );
}
