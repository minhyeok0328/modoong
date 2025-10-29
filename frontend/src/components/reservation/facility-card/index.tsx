import { FaMapMarkerAlt, FaShareAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { NearbyFacility } from '@/graphql/queries/nearbySportsFacilities';
import { formatDistance } from '@/utils/distance';
import { facilityType } from '@/utils/facilityType';
import { getFacilityImage } from '@/utils/facilityImages';
import { SharePopup } from '@/components/common';
import { Button } from '@/components/common';

interface FacilityCardProps {
  facility: NearbyFacility;
  to: string;
  state?: any;
  style?: React.CSSProperties;
  hideReview?: boolean;
  className?: string;
  message?: string;
  homeMessage?: React.ReactNode;
}

export default function FacilityCard({ facility, to, state, style, hideReview = false, className = '', message = '', homeMessage = '' }: FacilityCardProps) {
  const navigate = useNavigate();
  const facilityTypeText = facilityType(facility);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const getImageSrc = () => {
    return getFacilityImage({
      imageSrc: facility.imageSrc,
      facilityImageBase64: facility.facilityImageBase64,
      facilityId: facility.id,
    });
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsSharePopupOpen(!isSharePopupOpen);
  };

  return (
    <div className="block mb-4 relative" style={style}>
      <Link
        to={to}
        state={state}
        className="block"
      >
        <div className={`bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm ${className}`}>
          {/* 이미지 컨테이너 */}
          <div className="relative">
            <img
              src={getImageSrc()}
              alt={facility.siDesc ?? facility.facltTypeNm ?? facility.facltDivNm ?? ''}
              className="w-full h-55 object-cover"
            />

            {/* 우측 상단 시설 타입 오버레이 */}
            <div className="absolute top-3 right-3">
              <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {facilityTypeText}
              </span>
            </div>

            {/* 우측 하단 공유 버튼 */}
            <div className="absolute bottom-3 right-3">
              <button
                ref={shareButtonRef}
                onClick={handleShareClick}
                className="bg-white bg-opacity-90 rounded-full p-2 shadow-sm hover:bg-opacity-100 transition-all z-10 relative"
              >
                <FaShareAlt className="w-4 h-4 text-gray-600" />
              </button>
              <SharePopup
                isOpen={isSharePopupOpen}
                onClose={() => setIsSharePopupOpen(false)}
                triggerRef={shareButtonRef}
                title={facility.siDesc ?? '체육시설'}
                description={facility.refineRoadnmAddr || facility.refineLotnoAddr || `${facility.sidoNm ?? ''} ${facility.signguNm ?? ''}`}
                url={`${window.location.origin}/reservation/facility/${facility.id}`}
                className="right-0"
              />
            </div>
          </div>

        {/* 컨텐츠 영역 */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-black mb-2">
            {facility.siDesc ?? '체육시설'}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <FaMapMarkerAlt className="w-3 h-3" />
            <span>
              {facility.distance != null
                ? formatDistance(facility.distance)
                : '정보 없음'}
            </span>
            <span className="flex items-center gap-1 ml-2 text-yellow-400">
              ★★★★★
            </span>
            (43)
          </div>

          {/* 편의시설 아이콘들 */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1 max-[440px]:mt-2">
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <img src="/icons/blind_ok.png" alt="blind" className="w-5 h-5" />
              </span>
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <img src="/icons/hear_ok.png" alt="hear" className="w-5 h-5" />
              </span>
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <img src="/icons/wheel_ok.png" alt="wheel" className="w-5 h-5" />
              </span>
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <img src="/icons/wheel_park.png" alt="wheel_park" className="w-5 h-5" />
              </span>
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <img src="/icons/wheel_rent.png" alt="wheel_rent" className="w-5 h-5" />
              </span>
            </div>
            {message && (
              <button
                className="max-[440px]:mt-4 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium"
                dangerouslySetInnerHTML={{ __html: message }}
              />
            )}
          </div>

          {homeMessage && (
            <div className="w-full flex justify-center pt-4">
              <Button
                variant="primary"
                onClick={() => navigate(to)}
                rounded="3xl"
                style={{
                  width: '62%',
                }}
              >
                <div className="text-center" dangerouslySetInnerHTML={{ __html: homeMessage }} />
              </Button>
            </div>
          )}
          {/* 리뷰 텍스트 */}
          {!hideReview && (
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                "저상버스가 다니는 정류장이 근처에 있어서 너무 좋아요! 입구도 1층이라 휠체어 끌고..."
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  </div>
);
}
