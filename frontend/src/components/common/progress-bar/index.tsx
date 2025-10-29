interface ProgressBarProps {
  /** 현재 단계 (1부터 시작) */
  currentStep: number;
  /** 전체 단계 수 */
  totalSteps: number;
  /** 진행률 바의 배경색 클래스 */
  bgColor?: string;
  /** 진행률 바의 채움색 클래스 */
  fillColor?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 진행률 설명을 위한 라벨 */
  label?: string;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  bgColor = 'bg-gray-200',
  fillColor = 'bg-yellow-400',
  className = '',
  label = '진행률',
}: ProgressBarProps) {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);
  const progressWidth = `${progressPercentage}%`;

  return (
    <div
      className={`px-6 py-2 ${className}`}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`${label}: ${totalSteps}단계 중 ${currentStep}단계`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          {currentStep} / {totalSteps}
        </span>
        <span className="text-sm text-gray-600">
          {progressPercentage}%
        </span>
      </div>
      <div className={`w-full ${bgColor} rounded-full h-2`}>
        <div
          className={`${fillColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
}
