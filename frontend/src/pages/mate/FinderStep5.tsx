import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FinderStep5() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/mate/finder/step6');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleCancel = () => {
    navigate('/mate/finder/step4');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 animate-pulse">
            모둥메이트를 찾고 있습니다
          </h2>
          <p className="text-lg animate-bounce">
            잠시만 기다려주세요!
          </p>
          
          {/* Loading dots animation */}
          <div className="flex justify-center items-center mt-8 space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* Spinning circle */}
          <div className="mt-8">
            <div className="w-12 h-12 mx-auto border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      <div className="pb-6 px-6">
        <button
          onClick={handleCancel}
          className="w-full py-3 px-4 text-gray-600 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          취소하기
        </button>
      </div>
    </div>
  );
}