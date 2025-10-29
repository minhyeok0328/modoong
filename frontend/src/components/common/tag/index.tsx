import { HTMLAttributes } from 'react';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary';
}

export default function Tag({ children, className = '', variant = 'default', ...props }: TagProps) {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-yellow-400 text-black',
    secondary: 'bg-blue-200 text-blue-800',
  } as const;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
