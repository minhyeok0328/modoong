interface MateCardProps {
  name: string;
  age: number;
  gender: string;
  temperature: string;
  experience: string;
  activity: string;
  volunteer: string;
  isVolunteer?: boolean;
  onNextTime: () => void;
  onApply: () => void;
}

export default function MateCard({
  name,
  age,
  gender,
  temperature,
  experience,
  activity,
  volunteer,
  isVolunteer = false,
  onNextTime,
  onApply
}: MateCardProps) {
  return (
    <div className="border-4 border-yellow-400 rounded-3xl p-6 bg-white max-w-sm mx-auto">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6">
        {/* Profile Image with Gray Background Circle */}
        <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center relative">
          <img src="/icons/profile-icon.png" alt="profile" className="w-full h-full" />
        </div>

        {/* Name */}
        <h3 className="text-2xl font-bold">{name}</h3>

        {/* Volunteer Badge */}
        {isVolunteer && (
          <div className="flex items-center mb-3">
            <span className="text-sm text-green-600 font-medium">{volunteer}</span>
            <span className="ml-1 text-green-600">✓</span>
          </div>
        )}

        {/* Info Grid */}
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-1">연령대</div>
            <div className="font-bold text-black text-lg">{age}대</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-1">성별</div>
            <div className="font-bold text-black text-lg">{gender}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-1">매너온도</div>
            <div className="font-bold text-gray-500 text-xs border-2 border-gray-400 rounded-full px-2 py-1">{temperature}</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Activity Info */}
      <div className="mb-6 text-center">
        <h4 className="font-bold text-lg mb-3">모둥메이트 정보</h4>
        <div className="flex justify-around text-base">
          <span className="font-medium">완료 <span className="font-bold">{experience}</span></span>
          <span className="font-medium">활동 <span className="font-bold">{activity}</span></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onNextTime}
          className="flex-1 py-4 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium text-base hover:bg-gray-300 transition-colors"
        >
          다음에 하기
        </button>
        <button
          onClick={onApply}
          className="flex-1 py-4 px-4 bg-yellow-400 text-black rounded-xl font-bold text-base hover:bg-yellow-500 transition-colors"
        >
          함께 하기
        </button>
      </div>
    </div>
  );
}
