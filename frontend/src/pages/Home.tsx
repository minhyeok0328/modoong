import { useAtom } from 'jotai';
import { userAtom, appInitializationAtom } from '../atoms/user';
import { createPersonalChatRoomAtom } from '../atoms/chat';
import { PageTitle, ProfileCard, useProfileCardSwiper, Button } from '@/components/common';
import { FacilityCard } from '@/components/reservation';
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { GET_NEARBY_FACILITIES, NearbyFacility } from '@/graphql/queries/nearbySportsFacilities';
import { GET_SPORTS_FACILITY_TYPES } from '@/graphql/queries/sportsFacilityTypes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate } from 'react-router-dom';
import { generateFriendData, FriendData } from '@/utils/mock-data';

dayjs.locale('ko');


// 친구 추천 데이터 생성
const friendsData: FriendData[] = generateFriendData(4);

export default function Home() {
  const [user] = useAtom(userAtom);
  const [appInitialization] = useAtom(appInitializationAtom);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeFacilityIndex, setActiveFacilityIndex] = useState(0);
  const navigate = useNavigate();
  const friendSwiper = useProfileCardSwiper();
  const [, createPersonalChatRoom] = useAtom(createPersonalChatRoomAtom);
  
  // 체육시설 타입 목록 조회
  const { data: facilityTypesData } = useQuery(GET_SPORTS_FACILITY_TYPES);
  const validFacilityTypes = facilityTypesData?.sportsFacilityTypes || [];
  
  // 사용자 스포츠 선호도에서 유효한 타입만 사용
  const getUserFacilityType = () => {
    const userPreference = user?.sportPreference?.split(',').shift()?.trim();
    if (userPreference && validFacilityTypes.includes(userPreference)) {
      return userPreference;
    }
    return undefined;
  };
  
  const facilityType = getUserFacilityType();
  const { loading, error, data } = useQuery(GET_NEARBY_FACILITIES, {
    variables: {
      paginationInput: {
        skip: 0,
        take: 10,
        facilityType,
      },
    },
    skip: appInitialization.isInitializing,
  });

  const facilities: NearbyFacility[] = data?.nearbySportsFacilitiesForUser?.facilities || [];
  
  // 랜덤 시간 생성 함수
  const generateActivityTime = useCallback(() => {
    const parseTime = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const formatTime = (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const generateRandomTime = (startTime: string, endTime: string) => {
      const startMinutes = parseTime(startTime);
      const endMinutes = parseTime(endTime);
      
      // 30분 단위로 가능한 시간 슬롯 생성
      const timeSlots = [];
      for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
        timeSlots.push(minutes);
      }
      
      // 랜덤하게 선택
      const randomIndex = Math.floor(Math.random() * timeSlots.length);
      return formatTime(timeSlots[randomIndex]);
    };

    // 사용자의 activitySchedule이 있는지 확인
    if (user?.activitySchedule) {
      const selectedSchedules = Object.entries(user.activitySchedule)
        .filter(([_, schedule]) => schedule.selected);

      if (selectedSchedules.length > 0) {
        // 선택된 스케줄 중 하나를 랜덤하게 선택
        const randomSchedule = selectedSchedules[Math.floor(Math.random() * selectedSchedules.length)];
        const schedule = randomSchedule[1];
        
        // 해당 스케줄의 시작~종료 시간 범위에서 랜덤 시간 생성
        return generateRandomTime(schedule.start, schedule.end);
      }
    }

    // activitySchedule이 없거나 선택된 스케줄이 없으면 13:00 ~ 17:00 사이에서 랜덤
    return generateRandomTime('13:00', '17:00');
  }, [user?.activitySchedule]);

  // 각 시설별로 미리 생성된 랜덤 시간 맵
  const facilityTimeMap = useMemo(() => {
    const timeMap = new Map<string, string>();
    facilities.forEach(facility => {
      timeMap.set(facility.id, generateActivityTime());
    });
    return timeMap;
  }, [facilities, generateActivityTime]);

  // 동적 메시지 생성 함수
  const generateActivityMessage = (facility: NearbyFacility) => {
    const tomorrow = dayjs().add(1, 'day');
    const activityTime = facilityTimeMap.get(facility.id) || '14:00';
    const facilityType = facility?.facltTypeNm !== '기타' ? facility.facltTypeNm : '운동';

    return `<b>${tomorrow.format('M월 D일 dddd')}<br /> ${activityTime} ${facilityType}</b> 어때요?`;
  };

  // 채팅 생성 및 이동 함수
  const handleMessageClick = (friend: FriendData) => {
    const result = createPersonalChatRoom({ id: friend.id, name: friend.name });
    if (result.success) {
      navigate(`/chat/${result.roomId}`);
    } else {
      // 이미 존재하는 채팅방으로 이동
      navigate(`/chat/${result.roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <span
        className="text-xs text-gray-500 text-left w-full mb-10"
        aria-label={`${user?.username}님의 활동 주소는 ${user?.address} 근방 입니다.`}
      >
        <div aria-hidden="true" className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-sm" />
          {user?.address?.slice(0, 30).concat('...')}
        </div>
      </span>
      <PageTitle
        className="w-full mb-4"
        text={
          <>
            <b>모둥이</b>가 <b>{user?.username}님</b>을 위한{'\n'}
            <b>운동 플랜</b>을 준비했어요!
          </>
        }
      />

      {/* 체육시설 추천 카드 슬라이더 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p>에러 발생: {error.message}</p>
      ) : (
        <div className="w-full relative">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.facility-prev',
              nextEl: '.facility-next',
            }}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full"
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
              setActiveFacilityIndex(swiper.activeIndex);
            }}
            onSwiper={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
              setActiveFacilityIndex(swiper.activeIndex);
            }}
          >
            {facilities.map((facility: NearbyFacility, index: number) => (
              <SwiperSlide key={index}>
                <FacilityCard
                  facility={facility}
                  hideReview={true}
                  to={`/reservation/facility/${facility.id}?date=${dayjs().add(1, 'day').format('YYYY-MM-DD')}&times=${facilityTimeMap.get(facility.id) || '14:00'}`}
                  className="pb-18"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 하단 네비게이션 버튼들 */}
          <div className="flex items-center justify-between w-full absolute bottom-10 z-1">
            <div
              className={`
                flex items-center justify-center w-12 h-12 relative z-2 left-6
                text-white bg-black/30 backdrop-blur-sm rounded-full facility-prev ${isBeginning ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <FaArrowLeft className="text-lg" />
            </div>

            <div className="absolute w-full flex justify-center">
              {facilities.length > 0 && facilities[activeFacilityIndex] && (
                <div className="w-full flex justify-center">
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/reservation/facility/${facilities[activeFacilityIndex].id}?date=${dayjs().add(1, 'day').format('YYYY-MM-DD')}&times=${facilityTimeMap.get(facilities[activeFacilityIndex].id) || '14:00'}`)}
                    rounded="3xl"
                    className="w-full mx-4 font-normal"
                  >
                    <div className="text-center" dangerouslySetInnerHTML={{ __html: generateActivityMessage(facilities[activeFacilityIndex]).replace('<br />', '<br/>') }} />
                  </Button>
                </div>
              )}
            </div>

            <div
              className={`
                flex items-center justify-center w-12 h-12 relative z-2 right-6
                text-white bg-black/30 backdrop-blur-sm rounded-full facility-next ${isEnd ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <FaArrowRight className="text-lg" />
            </div>
          </div>
        </div>
      )}
      <div className="w-full bg-gray-200 mt-6 mb-8 h-0.5"></div>
      <PageTitle
        className="w-full mb-4"
        text={
          <>
            <b>모둥이</b>가 <b>{user?.username}님</b>과 어울리는{'\n'}
            <b>운동 친구</b>를 추천했어요!
          </>
        }
      />

      {/* 친구 추천 카드 */}
      <div className="w-full mb-4">
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full"
            onSlideChange={friendSwiper.handleSlideChange}
            onSwiper={friendSwiper.handleSwiper}
          >
            {friendsData.map((friend, index) => (
              <SwiperSlide key={friend.id}>
                <ProfileCard className="">
                   <ProfileCard.Image
                     src={friend.src}
                     alt={friend.name}
                     className={index === friendsData.length - 1 ? "backdrop-blur-sm filter blur-[3px]" : ""}
                   />
                  <ProfileCard.Overlay />
                  {index === friendsData.length - 1 ? (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Button
                        onClick={() => navigate('/mate/friend-finder')}
                        variant="outline"
                        size="md"
                        className="text-white bg-black/50 backdrop-blur-sm border-none"
                      >
                        더 많은 친구 만나기
                      </Button>
                    </div>
                  ) : (
                  <ProfileCard.Info
                    name={friend.name}
                    age={friend.age}
                    disability={friend.disability}
                    distance={friend.distance}
                    sport={friend.sport}
                    mbti={friend.mbti}
                  />
                )}
              </ProfileCard>
            </SwiperSlide>
            ))}
          </Swiper>

          {/* 고정 버튼들 */}
          <ProfileCard.Actions>
            <ProfileCard.PrevButton
              onClick={friendSwiper.slidePrev}
              disabled={friendSwiper.isBeginning}
            />
            <ProfileCard.CloseButton
              onClick={() => console.log('Close clicked')}
              disabled={friendSwiper.isEnd}
            />
            <ProfileCard.MessageButton
              onClick={() => {
                // @ts-ignore
                const currentIndex = friendSwiper.swiper?.activeIndex || 0;
                if (currentIndex < friendsData.length - 1) {
                  handleMessageClick(friendsData[currentIndex]);
                }
              }}
              disabled={friendSwiper.isEnd}
            />
            <ProfileCard.HeartButton
              onClick={() => console.log('Heart clicked')}
              disabled={friendSwiper.isEnd}
            />
            <ProfileCard.NextButton
              onClick={friendSwiper.slideNext}
              disabled={friendSwiper.isEnd}
            />
          </ProfileCard.Actions>
        </div>
      </div>
    </div>
  );
}
