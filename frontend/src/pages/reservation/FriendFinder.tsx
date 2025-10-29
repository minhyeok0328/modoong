import { ProfileCard, PageTitle, useProfileCardSwiper } from '@/components/common';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { generateFriendData, FriendData } from '@/utils/mock-data';
import { useAtom } from 'jotai';
import { createPersonalChatRoomAtom } from '@/atoms/chat';
import { useNavigate } from 'react-router-dom';

  // 친구 데이터 생성 (3개 섹션 모두 같은 데이터 사용)
const friendsData: FriendData[] = generateFriendData(10);
const friendsData2: FriendData[] = generateFriendData(10);
const friendsData3: FriendData[] = generateFriendData(10);

export default function FriendFinder() {
  // 각 섹션별 Swiper 훅 사용
  const swiper1 = useProfileCardSwiper();
  const swiper2 = useProfileCardSwiper();
  const swiper3 = useProfileCardSwiper();
  const navigate = useNavigate();
  const [, createPersonalChatRoom] = useAtom(createPersonalChatRoomAtom);

  const handleCloseClick = () => {
    console.log('Close clicked');
  };

  const handleMessageClick = (friend: FriendData) => {
    const result = createPersonalChatRoom({ id: friend.id, name: friend.name });
    if (result.success) {
      navigate(`/chat/${result.roomId}`);
    } else {
      // 이미 존재하는 채팅방으로 이동
      navigate(`/chat/${result.roomId}`);
    }
  };

  const handleHeartClick = () => {
    console.log('Heart clicked');
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-4">
      {/* 첫 번째 섹션: 공감할 수 있는 지체(휠체어) 친구 */}
      <PageTitle
        className="w-full mb-8"
        text={
          <>
            나와 <b>공감할 수 있는</b>
            {'\n'}
            <b>지체(휠체어) 친구</b>를 추천해요!
          </>
        }
      />
      <div className="w-full mb-8 border-b border-gray-200 pb-8">
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full"
            onSlideChange={swiper1.handleSlideChange}
            onSwiper={swiper1.handleSwiper}
          >
            {friendsData.map((friend) => (
              <SwiperSlide key={`section1-${friend.id}`}>
                <ProfileCard>
                  <ProfileCard.Image src={friend.src} alt={friend.name} />
                  <ProfileCard.Overlay />
                  <ProfileCard.Info
                    name={friend.name}
                    age={friend.age}
                    disability={friend.disability}
                    distance={friend.distance}
                    sport={friend.sport}
                    mbti={friend.mbti}
                  />
                </ProfileCard>
              </SwiperSlide>
            ))}
          </Swiper>
          <ProfileCard.Actions>
            <ProfileCard.PrevButton onClick={swiper1.slidePrev} disabled={swiper1.isBeginning} />
            <ProfileCard.CloseButton onClick={handleCloseClick} />
                        <ProfileCard.MessageButton
              onClick={() => {
                const currentIndex = swiper1.swiperRef.current?.activeIndex || 0;
                handleMessageClick(friendsData[currentIndex]);
              }}
            />
            <ProfileCard.HeartButton onClick={handleHeartClick} />
            <ProfileCard.NextButton onClick={swiper1.slideNext} disabled={swiper1.isEnd} />
          </ProfileCard.Actions>
        </div>
      </div>

      {/* 두 번째 섹션: 운동 취향이 같은 탁구 친구 */}
      <PageTitle
        className="w-full mb-8"
        text={
          <>
            나와 <b>운동 취향이 같은</b>
            {'\n'}
            <b>탁구 친구</b>를 추천해요!
          </>
        }
      />
      <div className="w-full mb-8 border-b border-gray-200 pb-8">
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full"
            onSlideChange={swiper2.handleSlideChange}
            onSwiper={swiper2.handleSwiper}
          >
            {friendsData2.map((friend) => (
              <SwiperSlide key={`section2-${friend.id}`}>
                <ProfileCard>
                  <ProfileCard.Image src={friend.src} alt={friend.name} />
                  <ProfileCard.Overlay />
                  <ProfileCard.Info
                    name={friend.name}
                    age={friend.age}
                    disability={friend.disability}
                    distance={friend.distance}
                    sport={friend.sport}
                    mbti={friend.mbti}
                  />
                </ProfileCard>
              </SwiperSlide>
            ))}
          </Swiper>
          <ProfileCard.Actions>
            <ProfileCard.PrevButton onClick={swiper2.slidePrev} disabled={swiper2.isBeginning} />
            <ProfileCard.CloseButton onClick={handleCloseClick} />
            <ProfileCard.MessageButton
              onClick={() => {
                const currentIndex = swiper2.swiperRef.current?.activeIndex || 0;
                handleMessageClick(friendsData2[currentIndex]);
              }}
            />
            <ProfileCard.HeartButton onClick={handleHeartClick} />
            <ProfileCard.NextButton onClick={swiper2.slideNext} disabled={swiper2.isEnd} />
          </ProfileCard.Actions>
        </div>
      </div>

      {/* 세 번째 섹션: 거리가 가까운 동네 친구 */}
      <PageTitle
        className="w-full mb-8"
        text={
          <>
            나와 <b>거리가 가까운</b>
            {'\n'}
            <b>동네 친구</b>를 추천해요!
          </>
        }
      />
      <div className="w-full mb-4">
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full"
            onSlideChange={swiper3.handleSlideChange}
            onSwiper={swiper3.handleSwiper}
          >
            {friendsData3.map((friend) => (
              <SwiperSlide key={`section3-${friend.id}`}>
                <ProfileCard>
                  <ProfileCard.Image src={friend.src} alt={friend.name} />
                  <ProfileCard.Overlay />
                  <ProfileCard.Info
                    name={friend.name}
                    age={friend.age}
                    disability={friend.disability}
                    distance={friend.distance}
                    sport={friend.sport}
                    mbti={friend.mbti}
                  />
                </ProfileCard>
              </SwiperSlide>
            ))}
          </Swiper>
          <ProfileCard.Actions>
            <ProfileCard.PrevButton onClick={swiper3.slidePrev} disabled={swiper3.isBeginning} />
            <ProfileCard.CloseButton onClick={handleCloseClick} />
            <ProfileCard.MessageButton
              onClick={() => {
                const currentIndex = swiper3.swiperRef.current?.activeIndex || 0;
                handleMessageClick(friendsData3[currentIndex]);
              }}
            />
            <ProfileCard.HeartButton onClick={handleHeartClick} />
            <ProfileCard.NextButton onClick={swiper3.slideNext} disabled={swiper3.isEnd} />
          </ProfileCard.Actions>
        </div>
      </div>
    </div>
  );
}
