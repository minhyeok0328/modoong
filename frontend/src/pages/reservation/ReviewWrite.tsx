import { useState, useEffect } from 'react';
import { Card, Button, PageTitle } from '@/components/common';
import { FaMapPin, FaCalendarAlt, FaClock, FaStar, FaGift, FaUser } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ReviewWrite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [popupAnimated, setPopupAnimated] = useState(false);

  const startTime = searchParams.get('time') || '10:00';
  const type = searchParams.get('type') || 'facility';

  const reservationInfo = {
    facilityName: searchParams.get('facilityName') || '수원종합운동장 수영장',
    address: searchParams.get('address') || '경기도 수원시 기흥구 통일로 1050',
    date: searchParams.get('date') || '2024년 3월 24일 (월)',
    time: startTime || '15:00 - 15:30',
    reservationNumber: searchParams.get('reservationNumber') || 'R2024032401',
    courseTitle: searchParams.get('courseTitle') || '',
    instructor: searchParams.get('instructor') || '',
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleStarHover = (star: number) => {
    setHoveredRating(star);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    if (reviewText.trim().length < 10) {
      alert('리뷰는 10자 이상 작성해주세요.');
      return;
    }

    setIsLoading(true);

    // 가상의 API 호출 (실제로는 GraphQL mutation을 사용)
    setTimeout(() => {
      setIsLoading(false);
      setShowPointsPopup(true);
    }, 1000);
  };

  const handlePointsPopupClose = () => {
    setShowPointsPopup(false);
    setPopupAnimated(false);
    navigate('/');
  };

  useEffect(() => {
    if (showPointsPopup) {
      // 팝업이 보여질 때 약간의 딜레이 후 애니메이션 시작
      const timer = setTimeout(() => {
        setPopupAnimated(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showPointsPopup]);

  return (
    <div>
      <PageTitle text="리뷰 작성" className="mt-4 mb-8 font-bold px-4" />

      <div className="max-w-md mx-auto space-y-6 px-4">
        {/* 예약/신청 정보 카드 */}
        <Card className="w-full" bgColorClassName="bg-blue-50">
          <Card.Column>
            <Card.Title className="text-lg">
              {type === 'course' ? '신청 정보' : '예약 정보'}
            </Card.Title>

            <div className="space-y-3 mt-4">
              {type === 'course' ? (
                // 스포츠강좌 정보
                <>
                  <div className="flex items-start gap-3">
                    <FaMapPin className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{reservationInfo.courseTitle}</p>
                      <p className="text-sm text-gray-600">{reservationInfo.facilityName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaUser className="text-blue-600 flex-shrink-0" />
                    <p className="font-medium">{reservationInfo.instructor}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaMapPin className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{reservationInfo.address}</p>
                    </div>
                  </div>
                </>
              ) : (
                // 체육시설 정보
                <>
                  <div className="flex items-start gap-3">
                    <FaMapPin className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{reservationInfo.facilityName}</p>
                      <p className="text-sm text-gray-600">{reservationInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-blue-600 flex-shrink-0" />
                    <p className="font-medium">{reservationInfo.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaClock className="text-blue-600 flex-shrink-0" />
                    <p className="font-medium">{reservationInfo.time}</p>
                  </div>
                </>
              )}
            </div>
          </Card.Column>
        </Card>

        {/* 별점 평가 카드 */}
        <Card className="w-full" bgColorClassName="bg-white">
          <Card.Column>
            <Card.Title className="text-lg">평점을 선택해주세요</Card.Title>
            <div className="flex justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="text-3xl transition-colors duration-200"
                >
                  <FaStar
                    className={`${
                      star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-400'
                    } hover:text-yellow-400`}
                  />
                </button>
              ))}
            </div>
          </Card.Column>
        </Card>

        {/* 리뷰 작성 카드 */}
        <Card className="w-full" bgColorClassName="bg-white">
          <Card.Column>
            <Card.Title className="text-lg">리뷰 작성</Card.Title>
            <div className="mt-4">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={
                  type === 'course'
                    ? "참여하신 스포츠강좌에 대한 솔직한 리뷰를 작성해주세요. (최소 10자 이상)"
                    : "이용하신 체육시설에 대한 솔직한 리뷰를 작성해주세요. (최소 10자 이상)"
                }
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">{reviewText.length}/500</span>
                <span className="text-sm text-gray-500">
                  {reviewText.length >= 10 ? '✓' : '최소 10자 이상'}
                </span>
              </div>
            </div>
          </Card.Column>
        </Card>

        {/* 제출 버튼 */}
        <Button
          fullWidth
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || rating === 0 || reviewText.trim().length < 10}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
        >
          {isLoading ? '리뷰 작성 중...' : '리뷰 작성 완료'}
        </Button>

        {/* 포인트 획득 팝업 */}
        {showPointsPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`bg-white rounded-lg p-6 mx-4 max-w-sm w-full transform transition-all duration-300 ease-out ${popupAnimated ? 'scale-100' : 'scale-0'}`}
            >
              <div className="text-center">
                <FaGift className="text-yellow-500 text-6xl mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">포인트 획득!</h2>
                <p className="text-gray-600 mb-4">
                  리뷰 작성으로 <span className="font-bold text-blue-600">100P</span>를
                  획득하였습니다!
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800">
                    💡 다음 예약 시 포인트를 사용하여 할인받으실 수 있습니다!
                  </p>
                </div>
                <Button
                  fullWidth
                  variant="primary"
                  onClick={handlePointsPopupClose}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  확인
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
