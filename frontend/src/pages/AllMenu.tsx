import { useState } from 'react';
import { SearchBar, MenuCategory, MenuItem, CustomerServiceButton } from '@/components/menu';

interface MenuItemData {
  label: string;
  path: string;
}

interface MenuCategoryData {
  title: string;
  items: MenuItemData[];
}

export default function AllMenu() {
  const [searchTerm, setSearchTerm] = useState('');

  const menuCategories: MenuCategoryData[] = [
    {
      title: '예약하기',
      items: [
        { label: '시설찾기', path: '/reservation' },
        { label: '예약내역', path: '/reservation/history' },
      ],
    },
    {
      title: '매칭하기',
      items: [
        { label: '운동 친구 찾기', path: '/mate/friend-finder' },
        { label: '모둥메이트 찾기', path: '/mate/finder/step1' },
      ],
    },
    {
      title: '라운지',
      items: [
        { label: '모두의 라운지', path: '/lounge?category=community' },
        { label: '전문가 라운지', path: '/lounge?category=expert' },
      ],
    },
  ];

  const handleCustomerServiceClick = () => {
    alert('고객센터 연결 중...');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">전체메뉴</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Menu Categories */}
      <div className="px-4 py-6">
        {menuCategories.map((category, categoryIndex) => (
          <MenuCategory key={categoryIndex} title={category.title} searchTerm={searchTerm}>
            {category.items.map((item, itemIndex) => (
              <MenuItem
                key={itemIndex}
                label={item.label}
                path={item.path}
                searchTerm={searchTerm}
              />
            ))}
          </MenuCategory>
        ))}
      </div>

      {/* Customer Service Button */}
      <div className="px-4 pb-8">
        <CustomerServiceButton onClick={handleCustomerServiceClick} />
      </div>
    </div>
  );
}
