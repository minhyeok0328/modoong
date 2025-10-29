import React from 'react';
import { FaCalendarAlt, FaUsers, FaCommentDots } from 'react-icons/fa';

interface MenuCategoryProps {
  title: string;
  children: React.ReactNode;
  searchTerm: string;
}

export default function MenuCategory({ title, children, searchTerm }: MenuCategoryProps) {
  const getIcon = (categoryTitle: string) => {
    switch (categoryTitle) {
      case '예약하기':
        return <FaCalendarAlt className="mr-2 text-primary" />;
      case '매칭하기':
        return <FaUsers className="mr-2 text-primary" />;
      case '라운지':
        return <FaCommentDots className="mr-2 text-primary" />;
      default:
        return null;
    }
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
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        {getIcon(title)}
        {highlightText(title)}
      </h2>
      <div className="grid gap-3">
        {children}
      </div>
    </div>
  );
}
