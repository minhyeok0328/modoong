import { FaPhone } from 'react-icons/fa';

interface CustomerServiceButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function CustomerServiceButton({ onClick, className = '' }: CustomerServiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-yellow-400 py-4 px-6 rounded-lg text-lg font-extrabold flex items-center justify-center hover:bg-yellow-300 transition-colors ${className}`}
    >
      <FaPhone className="mr-2" />
      고객센터 바로가기
    </button>
  );
}
