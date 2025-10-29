import { Link } from 'react-router-dom';
import { FaUserFriends, FaHandsHelping } from 'react-icons/fa';
import { PageTitle, SimpleHeader } from '@/components/common';

export default function Matching() {
  return (
    <div className="h-full">
      {/* Main Content */}
      <div className="bg-white">
        <SimpleHeader
          title="매칭"
        />
        <PageTitle
          className="mb-4 font-bold mt-12 mb-4 px-6"
          text="오늘은 누구랑 함께 운동할까요?"
        />

        <div className="grid grid-cols-1 gap-4 px-6">
          <Link
            to="/mate/friend-finder"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <FaUserFriends className="text-purple-600" size={20} />
            </div>
            <span className="text-lg font-bold text-black">운동친구 찾기</span>
            <p className="text-xs text-gray-500">같이 운동하고 싶어요!</p>
          </Link>

          <Link
            to="/mate/finder/step1"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <FaHandsHelping className="text-orange-600" size={20} />
            </div>
            <span className="text-lg font-bold text-black">모둠메이트 찾기</span>
            <p className="text-xs text-gray-500">도움이 필요해요!</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
