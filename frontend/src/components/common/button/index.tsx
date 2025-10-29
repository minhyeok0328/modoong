import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  rounded?: 'xl' | '2xl' | '3xl';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      type = 'button',
      rounded = 'xl',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      `cursor-pointer inline-flex items-center justify-center rounded-${rounded} font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`;

    const variants = {
      primary: 'bg-yellow-400 text-black hover:bg-yellow-400',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      outline: 'border-2 border-black-600 text-black-600 hover:bg-black-50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const width = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="sr-only">로딩중...</span>
            <span className="animate-spin inline-block w-5 h-5 border-2 border-t-transparent border-yellow-200 rounded-full mr-3" />
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
