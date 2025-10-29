import { MateCard, PageTitle } from '@/components/common';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/user';
import { generateRandomMateData } from '@/utils/randomKoreanName';
import { useState } from 'react';

export default function FinderStep6() {
  const [user] = useAtom(userAtom);
  const [mateData] = useState(generateRandomMateData());

  const handleNextTime = () => {
    console.log('다음에 하기 클릭');
  };

  const handleApply = () => {
    console.log('함께 하기 클릭');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6">
        <PageTitle
          className="w-full mb-8"
          text={
            <>
              <b>{user?.username}</b>님과 함께 할 <br /><b>모둥메이트</b>를 찾았어요!
            </>
          }
        />

        <div className="mb-8">
          <MateCard
            name={mateData.name}
            age={mateData.age}
            gender={mateData.gender}
            temperature={mateData.temperature}
            experience={mateData.experience}
            activity={mateData.activity}
            volunteer={mateData.volunteer}
            isVolunteer={mateData.isVolunteer}
            onNextTime={handleNextTime}
            onApply={handleApply}
          />
        </div>

        {/* Comments Section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-start space-x-3 w-full">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <img src="/icons/smile.png" alt="smile" />
            </div>
            <div className="flex flex-col gap-2">
              <p><b>{mateData.name}님</b>이 받은 칭찬 메세지에요!</p>
              <p className="text-sm text-gray-600 bg-gray-100 p-4 rounded-md w-full">
                "말씀도 너무 차분하게 하시고, 저상 버스 <br /> 탑승도 너무 세심하게 도와주셨어요..."
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 w-full justify-end">
            <div className="w-6 h-6 flex items-center justify-center text-xl">
              <IoChatboxEllipsesOutline />
            </div>
            <div className="flex flex-col gap-2">
              <p><b>{mateData.name}님</b>이 직접 남긴 한마디에요!</p>
              <p className="text-sm text-black-600 bg-yellow-300 p-4 rounded-md w-full">
                "시각장애인 친구를 둔 자원봉사자입니다. <br />
                성심껏 도와드리겠습니다..."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
