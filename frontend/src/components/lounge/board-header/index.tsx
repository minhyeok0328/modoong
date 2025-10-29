import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface BoardHeaderProps {
  title: string;
  description: string;
  backLink?: string;
  children?: ReactNode;
}

export function BoardHeader({
  title,
  description,
  backLink = '/lounge',
  children,
}: BoardHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <Link to={backLink} className="mr-4 p-2 text-gray-600 hover:text-gray-900">
          <FaArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      {children && <div className="flex justify-center mt-4">{children}</div>}
    </div>
  );
}
