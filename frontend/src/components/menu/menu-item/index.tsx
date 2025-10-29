import { Link } from 'react-router-dom';

interface MenuItemProps {
  label: string;
  path: string;
  searchTerm: string;
}

export default function MenuItem({ label, path, searchTerm }: MenuItemProps) {
  const isHighlighted = (text: string) => {
    if (!searchTerm.trim()) return false;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const highlightText = (text: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 font-bold">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <Link
      to={path}
      className={`block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
        isHighlighted(label) ? 'bg-yellow-50 border-yellow-200' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-gray-900 ${isHighlighted(label) ? 'font-bold' : ''}`}>
          {highlightText(label)}
        </span>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
