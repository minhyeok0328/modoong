import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { userAtom } from '@/atoms/user';
import { FaBars, FaUser, FaClock, FaMapMarkerAlt, FaFootballBall, FaEdit, FaCalendarAlt, FaUserFriends, FaHandsHelping, FaComments, FaUserTie } from 'react-icons/fa';

export default function MyPage() {
  const [user] = useAtom(userAtom);

  // 선택된 활동 시간대 필터링
  const selectedTimeSlots = user.activitySchedule
    ? Object.entries(user.activitySchedule)
        .filter(([_, timeSlot]) => timeSlot.selected)
        .map(([key, timeSlot]) => {
          const timeLabels: Record<string, string> = {
            dawn: '새벽',
            morning: '오전',
            noon: '점심',
            afternoon: '오후',
            evening: '저녁',
            lateNight: '늦은밤'
          };
          return `${timeLabels[key]} (${timeSlot.start}-${timeSlot.end})`;
        })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
          <Link
            to="/all-menu"
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <FaBars size={16} />
            전체메뉴
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user.username || '사용자'}
              </h2>
              <p className="text-gray-600 text-sm">
                체육시설 예약 서비스 이용중
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            {/* 주소 정보 */}
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-md font-bold text-gray-700">주소</p>
                <p className="text-gray-600 text-sm">
                  {user.address || '주소 정보가 없습니다'}
                </p>
              </div>
            </div>

            {/* 운동 선호도 */}
            <div className="flex items-start gap-3">
              <FaFootballBall className="text-gray-400 mt-1" size={16} />
              <div>
                <p className="text-md font-bold text-gray-700">선호 운동</p>
                {user.sportPreference && typeof user.sportPreference === 'string' && user.sportPreference.split(',').filter(Boolean).length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.sportPreference.split(',').filter(Boolean).map((sport: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-yellow-200 text-gray-700 rounded text-xs"
                      >
                        {sport.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">선호 운동이 설정되지 않았습니다</p>
                )}
                {user.otherSportDescription && (
                  <p className="text-gray-500 text-xs mt-1">
                    기타: {user.otherSportDescription}
                  </p>
                )}
              </div>
            </div>

            {/* 활동 시간대 */}
            <div className="flex items-start gap-3">
              <FaClock className="text-gray-400 mt-1" size={16} />
              <div>
                <p className="text-md font-bold text-gray-700">선호 활동 시간</p>
                <div className="text-gray-600 text-sm">
                  {selectedTimeSlots.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTimeSlots.map((timeSlot, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {timeSlot}
                        </span>
                      ))}
                    </div>
                  ) : (
                    '선호 시간대가 설정되지 않았습니다'
                  )}
                </div>
              </div>
            </div>

            {/* 접근성 상태 */}
            <div className="flex items-start gap-3">
              <FaEdit className="text-gray-400 mt-1" size={16} />
              <div>
                <p className="text-md font-bold text-gray-700">접근성 설정</p>
                {user.accessibilityStatus && Object.keys(user.accessibilityStatus).length > 0 ? (
                  <>
                    <p className="text-gray-600 text-sm">접근성 설정이 완료되었습니다</p>
                    {user.otherDisabilityDescription && (
                      <p className="text-gray-500 text-xs mt-1">
                        추가 정보: {user.otherDisabilityDescription}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600 text-sm">접근성 정보가 없습니다</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Services */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 서비스</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/reservation"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <FaCalendarAlt className="text-blue-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">시설찾기</span>
            </Link>

            <Link
              to="/reservation/history"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FaClock className="text-green-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">예약 내역</span>
            </Link>

            <Link
              to="/mate/friend-finder"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <FaUserFriends className="text-purple-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">운동 친구 찾기</span>
            </Link>

            <Link
              to="/mate/finder/step1"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <FaHandsHelping className="text-orange-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">모둥메이트 찾기</span>
            </Link>
          </div>

          {/* Additional Menu Items */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link
              to="/lounge?category=community"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                <FaComments className="text-pink-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">모두의 라운지</span>
            </Link>

            <Link
              to="/lounge?category=expert"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <FaUserTie className="text-indigo-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">전문가 라운지</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
