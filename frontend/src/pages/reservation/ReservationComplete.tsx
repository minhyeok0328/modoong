import { Button } from '@/components/common';
import { ReservationInfo } from '@/components/reservation';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { findReservationByNumberAtom } from '@/atoms/reservation';

export default function ReservationComplete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [findReservation] = useAtom(findReservationByNumberAtom);
  const reservationNumber = searchParams.get('reservationNumber') || '';
  const reservationData = findReservation(reservationNumber);

  if (!reservationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">예약 정보를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-4">예약 번호: {reservationNumber}</p>
          <Button onClick={() => navigate('/')} variant="primary">홈으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  // const handleReviewClick = () => {
  //   // 리뷰 작성 페이지로 이동하면서 예약 정보를 쿼리스트링으로 전달
  //   const queryParams = new URLSearchParams({
  //     facilityName: reservationData.type === 'facility' ? reservationData.siDesc || '' : reservationData.facilityName || '',
  //     address: reservationData.type === 'facility' ? reservationData.refineRoadnmAddr || '' : reservationData.facilityAddress || '',
  //     date: reservationData.date || '',
  //     time: reservationData.time || '',
  //     reservationNumber: reservationData.reservationNumber,
  //     type: reservationData.type,
  //     courseTitle: reservationData.type === 'course' ? reservationData.courseTitle || '' : '',
  //     instructor: reservationData.type === 'course' ? reservationData.facilityOwner || '' : '',
  //   });
  //   navigate(`/reservation/review-write?${queryParams.toString()}`);
  // };

  const handleMatchingClick = () => {
    navigate('/mate/friend-finder');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleMateFinderClick = () => {
    navigate('/mate/finder/step1');
  };

  const handleChatClick = () => {
    // 예약 번호로 생성된 채팅방 ID 생성
    const chatRoomId = `reservation-${reservationNumber}`;
    navigate(`/chat/${chatRoomId}`);
  };

  const sections = [
    {
      title: '우리 같이 운동해요!',
      buttons: [
        {
          title: '채팅방 이동하기',
          description: '같이 예약한 분들과 함께 해요',
          onClick: handleChatClick
        },
        {
          title: '운동 친구 찾기',
          description: '더 많은 친구들과 함께 해요',
          onClick: handleMatchingClick
        }
      ]
    },
    {
      title: '도움이 필요하면?',
      buttons: [
        {
          title: '모둥메이트 찾기',
          description: '자원봉사자 & 활동보조인 찾기',
          onClick: handleMateFinderClick
        },
        {
          title: '고객센터 연결하기',
          description: '예약 및 서비스 이용 관련 문의',
          onClick: () => {}
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      {/* 성공 아이콘 */}
      <div className="flex flex-col items-center gap-4">
        <FaCheckCircle className="text-green-500 text-6xl" />
        <h1 className="text-2xl font-bold text-center">
          {reservationData.type === 'course' ? '신청이 완료되었습니다!' : '예약이 완료되었습니다!'}
        </h1>
      </div>

      {/* 예약 정보 카드 */}
      <ReservationInfo
        type={reservationData.type}
        facilityName={reservationData.type === 'facility' ? reservationData?.siDesc : reservationData.facilityName}
        address={reservationData.type === 'facility' ? reservationData?.refineRoadnmAddr : reservationData.facilityAddress}
        date={reservationData.date}
        time={reservationData.time}
        amount={reservationData.amount}
        reservationNumber={reservationData.reservationNumber}
        courseTitle={reservationData.type === 'course' ? reservationData.courseTitle : undefined}
        courseInfo={reservationData.type === 'course' ? reservationData.courseInfo : undefined}
        coursePrice={reservationData.type === 'course' ? reservationData.coursePrice : undefined}
        instructor={reservationData.type === 'course' ? reservationData.facilityOwner || undefined : undefined}
        disabilitySportsFacility={reservationData.type === 'course' ? reservationData.disabilitySportsFacility : undefined}
      />

      {/* <Button onClick={handleReviewClick} variant="primary" size="sm">리뷰 작성하기</Button> */}

      {/* 섹션들 렌더링 */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">{section.title}</h2>
          <div className="space-y-3 items-center">
            {section.buttons.map((button, buttonIndex) => (
              <button
                key={buttonIndex}
                onClick={button.onClick}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black grid grid-cols-2 gap-5 text-left px-4 py-4 rounded-xl transition-colors items-center"
              >
                <span className="font-bold whitespace-nowrap">{button.title}</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">{button.description}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* 홈으로 가기 버튼 */}
      <Button fullWidth variant="secondary" onClick={handleHomeClick} className="mt-6 bg-gray-600 text-white">
        홈으로 가기
      </Button>
    </div>
  );
}
