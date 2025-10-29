import { SlArrowLeft } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';

interface SimpleHeaderProps {
  title: string;
  onBackClick?: () => void;
}

export default function SimpleHeader({ title, onBackClick }: SimpleHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    navigate(-1);
  };

  return (
    <header className="grid grid-cols-3 gap-4 px-6 py-2 items-center text-center h-12">
      <button
        aria-label="이전 페이지로 이동"
        onClick={handleBackClick}
        className="w-8 cursor-pointer flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <SlArrowLeft aria-hidden="true" />
      </button>
      <h1 className="text-xl font-bold whitespace-nowrap" role="banner">{title}</h1>
      <div aria-hidden="true"></div> {/* Grid 균형을 위한 빈 요소 */}
    </header>
  );
}
