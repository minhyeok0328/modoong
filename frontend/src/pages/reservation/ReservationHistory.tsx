import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabNavigation } from '@/components/common';
import { ReservationInfo } from '@/components/reservation';
import { FaSearch } from 'react-icons/fa';
import { useAtom } from 'jotai';
import { reservationsAtom, ReservationItem } from '@/atoms/reservation';

export default function ReservationHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'facility' | 'course'>('facility');
  const [reservations] = useAtom(reservationsAtom);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'facility', label: '체육시설' },
    { id: 'course', label: '스포츠강좌' },
  ];

  const filteredReservations = useMemo(() => {
    return reservations.filter(
      (reservation) =>
        reservation.type === activeTab &&
        (searchQuery === '' ||
          (reservation.type === 'facility'
            ? reservation.siDesc?.toLowerCase().includes(searchQuery.toLowerCase())
            : (reservation.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (Array.isArray(reservation.courseInfo)
                 ? reservation.courseInfo.some((course: any) => course.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                 : reservation.courseInfo?.title?.toLowerCase().includes(searchQuery.toLowerCase())))))
    );
  }, [reservations, activeTab, searchQuery]);

  const handleReservationClick = (reservation: ReservationItem) => {
    // 해당 체육시설 상세 페이지로 이동
    navigate(`/reservation/facility/${reservation.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6">
        {/* 검색바 */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="예약 내역 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 탭 버튼 */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'facility' | 'course')}
          className="mb-6"
        />

        {/* 예약 내역 개수 */}
        <p className="text-sm text-gray-600 mb-4">총 {filteredReservations.length}건</p>

        {/* 예약 내역 목록 */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeTab === 'facility' ? '체육시설 예약' : '스포츠강좌 신청'} 내역이 없습니다.
              </p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.reservationNumber}
                onClick={() => handleReservationClick(reservation)}
                className="cursor-pointer"
              >
                <ReservationInfo
                  type={reservation.type}
                  facilityName={
                    reservation.type === 'facility'
                      ? reservation.siDesc || ''
                      : reservation.facilityName || ''
                  }
                  address={
                    reservation.type === 'facility'
                      ? reservation.refineRoadnmAddr || ''
                      : reservation.facilityAddress || ''
                  }
                  date={reservation.date}
                  time={reservation.time}
                  amount={reservation.amount}
                  reservationNumber={reservation.reservationNumber}
                  courseTitle={reservation.type === 'course' ? (reservation.courseInfo?.title || reservation.courseTitle || '') : undefined}
                  courseInfo={reservation.type === 'course' ? reservation.courseInfo : undefined}
                  coursePrice={reservation.type === 'course' ? (reservation.courseInfo?.price || reservation.coursePrice || '') : undefined}
                  instructor={reservation.type === 'course' ? (reservation.courseInfo?.info?.find((i:any)=>i.key==='강사')?.value || reservation.instructor || reservation.facilityOwner || '') : undefined}
                  disabilitySportsFacility={reservation.type === 'course' ? reservation.disabilitySportsFacility : undefined}
                  className="w-full"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
