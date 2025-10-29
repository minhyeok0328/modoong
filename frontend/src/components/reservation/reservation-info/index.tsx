import { Card, Tag } from '@/components/common';
import { FaMapPin, FaClock, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { DisabilitySportsFacility } from '@/graphql/queries/sportsFacility';

export interface ReservationInfoProps {
  type: 'facility' | 'course';
  facilityName?: string | null;
  address?: string | null;
  date?: string;
  time?: string;
  amount: number | string;
  reservationNumber: string;
  courseTitle?: string;
  courseInfo?: any;
  coursePrice?: string;
  instructor?: string;
  className?: string;
  disabilitySportsFacility?: DisabilitySportsFacility;
}

export function ReservationInfo({
  type,
  facilityName,
  address,
  date,
  time,
  amount,
  reservationNumber,
  courseTitle,
  courseInfo,
  coursePrice,
  instructor,
  className = '',
}: ReservationInfoProps) {
  return (
    <Card className={`w-full max-w-md ${className}`} bgColorClassName="bg-blue-50">
      <Card.Column>
        <Card.Title className="text-lg">
          {type === 'course' ? '신청 정보' : '예약 정보'}
        </Card.Title>

        <div className="space-y-3 mt-4">
          {type === 'course' ? (
            // 스포츠강좌 정보 (여러 개)
            <>
              {(Array.isArray(courseInfo) ? courseInfo : [courseInfo]).map((course, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <div className="flex items-start gap-3">
                    <FaMapPin className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{course?.title || courseTitle || '강좌 정보'}</p>
                      {course?.tags && (
                        <div className="flex flex-wrap gap-1 mt-2 mb-2">
                          {course.tags.map((tag: string, index: number) => (
                            <Tag key={index} className="text-xs">{tag}</Tag>
                          ))}
                        </div>
                      )}
                      {course?.info && (
                        <div className="text-sm text-gray-600 mt-2 space-y-1">
                          {course.info.map((item: any, index: number) => {
                            const key = Object.keys(item)[0];
                            const value = item[key];
                            return (
                              <div key={index} className="flex">
                                <span className="w-16 flex-shrink-0 text-gray-500">{key}:</span>
                                <span>{value || '미정'}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {course?.description && (
                        <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <FaUser className="text-blue-600 flex-shrink-0" />
                    <p className="font-medium">{instructor || '강사 정보 없음'}</p>
                  </div>
                  {facilityName && address && (
                    <div className="flex items-start gap-3 mt-2">
                      <FaMapPin className="text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{facilityName || '시설 정보 없음'}</p>
                        <p className="text-sm text-gray-600">{address || '주소 정보 없음'}</p>
                      </div>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">결제 금액</span>
                      <span className="font-bold text-lg">{course?.price || coursePrice || '4,000원'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">예약 번호</span>
                      <span className="text-sm font-medium">{reservationNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // 체육시설 정보
            <>
              <div className="flex items-start gap-3">
                <FaMapPin className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">{facilityName || '시설 정보 없음'}</p>
                  <p className="text-sm text-gray-600">{address || '주소 정보 없음'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-blue-600 flex-shrink-0" />
                <p className="font-medium">{date || '날짜 정보 없음'}</p>
              </div>

              <div className="flex items-center gap-3">
                <FaClock className="text-blue-600 flex-shrink-0" />
                <p className="font-medium">{time || '시간 정보 없음'}</p>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">결제 금액</span>
                  <span className="font-bold text-lg">
                    {typeof amount === 'number' ? `${amount.toLocaleString()}원` : amount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">예약 번호</span>
                  <span className="text-sm font-medium">{reservationNumber}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Card.Column>
    </Card>
  );
}
