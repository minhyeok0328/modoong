import { Card, Checkbox, Tag, Radio, Button, SharePopup } from '@/components/common';
import { CourseInfo } from '@/components/reservation';
import { FaEye, FaHeart, FaShareAlt, FaStar, FaBullhorn } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Calendar } from '@/components/common';
import useInitialDateTime from '@/components/common/calendar/hooks/useInitialDateTime';
import { useQuery } from '@apollo/client';
import {
  GET_SPORTS_FACILITY,
  GetSportsFacilityData,
  GetSportsFacilityVars,
} from '@/graphql/queries/sportsFacility';
import { facilityType, FacilityTypeProps } from '@/utils/facilityType';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { addReservationAtom, ReservationItem } from '@/atoms/reservation';
import { userAtom } from '@/atoms/user';
import { createReservationChatRoomAtom } from '@/atoms/chat';
import { createReservationChatRoom } from '@/utils/createReservationChatRoom';
import { filterSportsFacilityAmenities } from '@/utils/amenitiesFilter';
import { getFacilityImageBySeed } from '@/utils/facilityImages';
import { getReviewMessageByFacilityId } from '@/utils/reviewMessages';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ReportPopup } from '@/components/common/popup';
import { reportsAtom, reportPopupStateAtom } from '@/atoms/report';
import { getImageFromIDB } from '@/utils/indexedDB';

dayjs.locale('ko');

// Mock data. In real scenario, replace with API call.
const FACILITY_INFO = {
  name: '수원종합운동장 수영장',
  address: '경기도 수원시 기흥구 통일로 1050',
  time: '06:00~22:00',
  image: getFacilityImageBySeed('suwon-swimming-pool'),
  views: 18,
  likes: 0,
  rating: 4.7,
  reviewCount: 43,
  amenities: ['휠체어진입로', '엘리베이터', '장애인주차구역', '장애인편의점'],
};

const RoadviewContainer = ({ lat, lng }: { lat: number; lng: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const { kakao } = window as any;
    if (!kakao || !kakao.maps) return;

    const roadview = new kakao.maps.Roadview(containerRef.current);
    const roadviewClient = new kakao.maps.RoadviewClient();
    const position = new kakao.maps.LatLng(lat, lng);

    roadviewClient.getNearestPanoId(position, 50, (panoId: any) => {
      if (panoId) {
        roadview.setPanoId(panoId, position);
      }
    });
  }, [lat, lng]);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
};

export default function FacilityDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const queryDate = searchParams.get('date');
  const queryTime = searchParams.get('times');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const [, addReservation] = useAtom(addReservationAtom);
  const [, createChatRoom] = useAtom(createReservationChatRoomAtom);
  const reports = useAtomValue(reportsAtom);
  const setReportPopupState = useSetAtom(reportPopupStateAtom);
  const user = useAtomValue(userAtom);
  const [reportedImage, setReportedImage] = useState<string | null>(null);

  const initialDateTime = useInitialDateTime({
    disabledSlots: [{ date: dayjs().format('YYYY-MM-DD'), times: ['10:00', '11:00'] }],
    minDate: dayjs().startOf('day').toDate(),
  });
  const initialSelected =
    queryDate && queryTime && typeof queryDate === 'string' && typeof queryTime === 'string'
      ? ([queryDate, queryTime] as [string, string])
      : initialDateTime;
  const [selectedDate, setSelectedDate] = useState<[string, string] | null>(initialSelected);

  const { data, loading, error } = useQuery<GetSportsFacilityData, GetSportsFacilityVars>(
    GET_SPORTS_FACILITY,
    {
      variables: { id: id || '' },
      skip: !id,
    }
  );

  const report = reports[id || ''];

  useEffect(() => {
    if (report?.hasEntrancePhoto && id) {
      getImageFromIDB(id).then(setReportedImage);
    }
  }, [report, id]);


  // 주소복사 기능
  const handleCopyAddress = async () => {
    const address = data?.sportsFacility.refineRoadnmAddr || FACILITY_INFO.address;
    try {
      await navigator.clipboard.writeText(address);
      alert('주소가 클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('주소 복사 실패:', err);
    }
  };

  const handlePhoneCall = () => {
    const phoneNumber = data?.sportsFacility.facltTelno;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
      return;
    }

    alert('전화번호가 등록되어 있지 않습니다.');
  };

  const handleShareClick = () => {
    setIsSharePopupOpen(!isSharePopupOpen);
  };

  const handleReportClick = () => {
    if (id) {
      setReportPopupState({ isOpen: true, facilityId: id });
    }
  };



  const handleCourseSelect = (index: number) => {
    setSelectedCourses(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleClickCourseReservation = () => {
    const selectedCourseInfo = data?.sportsFacility?.disabilitySportsFacility;
    const reservationNumber = `R${Date.now()}`;
    const reservationData: ReservationItem = {
      ...selectedCourseInfo,
      reservationNumber,
      facilityImageBase64: null,
      id: data?.sportsFacility?.id || 'default-facility-id',
      type: 'course',
      createdAt: new Date().toISOString(),
      amount: 0,
    };

    addReservation(reservationData);
    navigate(`/reservation/reservation-complete?reservationNumber=${reservationNumber}`);
  }

  const handleClickFacilityReservation = () => {
    const reservationNumber = `R${Date.now()}`;
    const getTimeRange = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      const startMinutes = hour * 60 + minute;
      const endMinutes = startMinutes + 30;
      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;
      const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      return `${time} - ${endTimeStr}`;
    };

    const reservationData: ReservationItem = {
      ...data?.sportsFacility,
      streetViewPreview: null,
      type: 'facility',
      date: selectedDate ? dayjs(selectedDate[0]).format('YYYY년 MM월 DD일 (ddd)') : '',
      time: selectedDate ? getTimeRange(selectedDate[1]) : '',
      amount: 4000,
      reservationNumber: reservationNumber,
      createdAt: new Date().toISOString(),
      id: data?.sportsFacility?.id || 'default-facility-id',
    };

    addReservation(reservationData);

    // 채팅방 생성
    if (selectedDate && data?.sportsFacility?.siDesc) {
      const chatRoom = createReservationChatRoom({
        reservationNumber,
        siDesc: data.sportsFacility.siDesc,
        date: reservationData.date || '',
        time: reservationData.time || '',
      });
      createChatRoom(chatRoom);
    }

    navigate(`/reservation/reservation-complete?reservationNumber=${reservationNumber}`);
  }
  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-10">오류가 발생했습니다: {error.message}</div>;
  }

  // 스포츠강좌 시설 여부 확인
  const isSportsFacility = data?.sportsFacility?.disabilitySportsFacility !== null;
  const rawAmenities = data?.sportsFacility?.amenities?.length ? data?.sportsFacility.amenities : FACILITY_INFO.amenities;
  const filteredAmenities = filterSportsFacilityAmenities(rawAmenities);

  // 접근성 정보 처리
  let accessibilityItems: string[] = [];
  if (filteredAmenities.accessibility.length > 0) {
    accessibilityItems = filteredAmenities.accessibility.map(item => item.key);
  } else if (data?.sportsFacility?.disabilitySportsFacility?.disabilitySupport) {
    accessibilityItems = data.sportsFacility.disabilitySportsFacility.disabilitySupport.split(',').filter(item => item.trim() !== '');
  }

  // Merge reported amenities
  if (report) {
    if (report.disabledToilet) accessibilityItems.push('장애인 화장실');
    if (report.disabledParking) accessibilityItems.push('장애인 주차장');
    if (report.elevator) accessibilityItems.push('엘리베이터');
    if (report.ramp) accessibilityItems.push('경사로');
    if (report.wheelchairRental) accessibilityItems.push('휠체어 대여');
    if (report.brailleSign) accessibilityItems.push('점자 안내판');
    if (report.audioGuide) accessibilityItems.push('음성 안내 장치');
    if (report.stairHeight) accessibilityItems.push(`계단 높이: ${report.stairHeight}`);
    if (report.stairCount) accessibilityItems.push(`계단 수: ${report.stairCount}`);
    if (report.otherAccessibility) accessibilityItems.push(report.otherAccessibility);

    // Deduplicate
    accessibilityItems = [...new Set(accessibilityItems)];
  }

  const sportsFacility = {
    ...data?.sportsFacility,
    imageSrc: data?.sportsFacility?.disabilitySportsFacility?.facilityImageBase64 || data?.sportsFacility.imageSrc || FACILITY_INFO.image,
    facilityName: data?.sportsFacility?.siDesc || FACILITY_INFO.name,
    facilityAddress: data?.sportsFacility?.refineRoadnmAddr || FACILITY_INFO.address,
    facilityImage: data?.sportsFacility?.disabilitySportsFacility?.facilityImageBase64 || data?.sportsFacility.imageSrc || FACILITY_INFO.image,
  };
  const recommendation = getReviewMessageByFacilityId(id || 'default-facility');

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero Image */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-200">
        <img
          src={sportsFacility?.facilityImage}
          alt={sportsFacility?.facilityName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            className="bg-white/90 backdrop-blur-sm rounded-md px-3 py-1 text-sm font-medium shadow"
          >
            {facilityType(sportsFacility as unknown as FacilityTypeProps)}
          </button>
        </div>
      </div>

      {/* Facility Info */}
      <section className="flex flex-col gap-2 px-6">
        <h2 className="text-xl font-bold flex items-center gap-2 justify-between relative">
          {sportsFacility?.facilityName}
          <div className="flex gap-2 items-center">
            {user.userType === 2 && (
              <button
                onClick={handleReportClick}
                className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow"
              >
                <FaBullhorn className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <div className="relative">
              <button
                ref={shareButtonRef}
                onClick={handleShareClick}
                className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow"
              >
                <FaShareAlt className="w-4 h-4 text-gray-600" />
              </button>
              <div className="absolute top-10 right-0">
                <SharePopup
                  isOpen={isSharePopupOpen}
                  onClose={() => setIsSharePopupOpen(false)}
                  triggerRef={shareButtonRef}
                  title={sportsFacility?.facilityName}
                  description={sportsFacility?.facilityAddress}
                  className="right-0"
                />
              </div>
            </div>
          </div>
        </h2>
        <p className="text-sm text-gray-600 flex items-center">
          <FiMapPin className="mr-1" /> {sportsFacility?.facilityAddress}
        </p>
        <div className="flex gap-2 text-blue-600 text-xs font-medium">
          <button className="underline" onClick={handleCopyAddress}>
            주소복사
          </button>
          <span>|</span>
          <button className="underline">지도보기</button>
          {data?.sportsFacility.facltTelno && (
            <>
              <span>|</span>
              <button className="underline" onClick={handlePhoneCall}>
                전화하기
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-700">
          <div className="flex items-center gap-1">
            <FaEye /> {FACILITY_INFO.views}
          </div>
          <div className="flex items-center gap-1">
            <FaHeart className="text-red-500" /> {FACILITY_INFO.likes}
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" /> {FACILITY_INFO.rating.toFixed(1)} (
            {FACILITY_INFO.reviewCount})
          </div>
        </div>
      </section>

      {/* Recommendation Card */}
      <section className="px-6">
        <Card className="shadow-sm">
          <Card.Column>
            <Card.Title className="text-base">
              {recommendation.title}
            </Card.Title>
            <Card.Subtitle className="text-sm">{recommendation.message}</Card.Subtitle>
          </Card.Column>
        </Card>
      </section>

      {/* Convenience Section */}
      {filteredAmenities.amenities.length > 0 && (
        <section className="flex flex-col gap-3 mb-8 px-6">
          <h3 className="font-bold">편의시설</h3>
          <div className="flex flex-wrap gap-2">
            {filteredAmenities.amenities.map((item) => (
              <Tag key={item.value}>{item.key}</Tag>
            ))}
          </div>
        </section>
      )}

      {/* Accessibility Section */}
      {accessibilityItems.length > 0 && (
        <section className="flex flex-col gap-3 mb-8 px-6">
          <h3 className="font-bold">접근성</h3>
          <div className="flex flex-wrap gap-2">
            {accessibilityItems.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        </section>
      )}


      {/* Street View Section */}

      {(sportsFacility?.refineWgs84Lat && sportsFacility?.refineWgs84Logt) || reportedImage ? (
        <section className="flex flex-col gap-3 mb-8 px-6">
          <h3 className="font-bold">입구 정보</h3>
          <div className="w-full">
            <div className="w-full h-full relative rounded-lg overflow-hidden">
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={10}
                slidesPerView={1}
                className="w-full h-full [&_.swiper-button-next]:text-black [&_.swiper-button-prev]:text-black [&_.swiper-button-next]:drop-shadow-md [&_.swiper-button-prev]:drop-shadow-md"
              >
                {sportsFacility?.refineWgs84Lat && sportsFacility?.refineWgs84Logt && (
                  <SwiperSlide className='relative'>
                    <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold z-10">
                      로드뷰
                    </div>
                    <RoadviewContainer
                      lat={sportsFacility.refineWgs84Lat}
                      lng={sportsFacility.refineWgs84Logt}
                    />
                  </SwiperSlide>
                )}
                {reportedImage && (
                  <SwiperSlide>
                    <div className="relative w-full h-[300px]">
                      <img
                        src={reportedImage}
                        alt="제보된 입구 사진"
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                        제보된 사진
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </div>
        </section>
      ) : null}

      {/* Course Info Section */}
      {data?.sportsFacility?.disabilitySportsFacility && (
        <section className="px-6 mb-8">
          <h3 className="font-bold">스포츠강좌 정보</h3>
          <div className="text-sm text-gray-600 mt-4 mb-8">
            담당자: {data.sportsFacility.disabilitySportsFacility.facilityOwner} / 차량지원: {data.sportsFacility.disabilitySportsFacility.vehicleSupport}
          </div>
          <div className="flex flex-col gap-4">
            {data.sportsFacility.disabilitySportsFacility.courseInfo?.map(({ title, description, info, price, tags }, index) => (
              <CourseInfo
                key={index}
                title={title}
                description={description}
                info={info}
                price={price}
                tags={tags}
                isSelected={selectedCourses.includes(index)}
                onSelect={() => handleCourseSelect(index)}
              />
            ))}
          </div>
        </section>
      )}

      {!isSportsFacility && (
        <section className="flex flex-col gap-3 mb-8 px-6">
          <h3 className="font-bold">예약 시간</h3>
          <Calendar
            value={selectedDate ? selectedDate[0] : null}
            onChange={(date) => {
              if (date) {
                setSelectedDate([date, selectedDate?.[1] || '']);
              }
            }}
            showTimeSlots={true}
            timeValue={selectedDate ? selectedDate[1] : null}
            onTimeChange={(time) => {
              if (selectedDate) {
                setSelectedDate([selectedDate[0], time]);
              }
            }}
            minDate={dayjs().startOf('day').toDate()}
            maxDate={dayjs().add(1, 'month').endOf('day').toDate()}
            disabledSlots={[{ date: dayjs().format('YYYY-MM-DD') }]}
          />
        </section>
      )}
      <section className="flex flex-col gap-3 mb-8 px-6">
        <h3 className="font-bold">예약 알림</h3>
        <div className="grid grid-cols-1 gap-4">
          <Checkbox name="alarm1" label="보호자에게 알리기" />
          <Checkbox name="alarm2" label="복지관에 알리기" />
          <Checkbox name="alarm3" label="내 운동 친구 & 모임에 알리기" />
        </div>
      </section>

      {/* Payment Section */}
      <section className="flex flex-col gap-4 px-6">
        <h3 className="font-bold">결제 금액</h3>
        <div>
          <p className="text-lg font-bold">총 4,000원</p>
          <p className="text-xs text-gray-600">이용료 3,000원 + 수수료 1,000원</p>
        </div>

        <h3 className="font-bold mt-2">결제 방식</h3>
        <div className="flex flex-col gap-2">
          <Radio
            name="payment"
            value="card"
            label="신용·체크카드"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          <Radio
            name="payment"
            value="bank"
            label="무통장입금"
            checked={paymentMethod === 'bank'}
            onChange={() => setPaymentMethod('bank')}
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-gray-500 mt-2 mb-4">
          <button className="w-fit underline">결제 서비스 이용약관 &gt;</button>
          <button className="w-fit underline">개인정보 수집 및 이용 동의 &gt;</button>
          <button className="w-fit underline">개인정보 제3자 제공 안내 &gt;</button>
          <button className="w-fit underline">취소 및 환불 규정 &gt;</button>
          <span className="mt-1">구매 내용에 동의하시면 '신청하기' 버튼을 눌러주세요.</span>
        </div>
        {!isSportsFacility ? (
          <Button
            fullWidth
            className="mt-2"
            variant="primary"
            size="lg"
            disabled={!selectedDate || !selectedDate[0] || !selectedDate[1]}
            onClick={handleClickFacilityReservation}
          >
            {!selectedDate || !selectedDate[0] || !selectedDate[1]
              ? '날짜와 시간을 선택해주세요'
              : '신청하기'}
          </Button>
        ) : (
          <Button
            fullWidth
            className="mt-2"
            variant="primary"
            size="lg"
            disabled={selectedCourses.length === 0}
            onClick={handleClickCourseReservation}
          >
            {selectedCourses.length === 0 ? '강좌를 선택해주세요' : '강좌 신청하기'}
          </Button>
        )}
      </section>

      <ReportPopup />
    </div>
  );
}
