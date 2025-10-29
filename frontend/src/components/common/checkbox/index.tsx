import { forwardRef, InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** 고유 식별자 및 네이밍 */
  name: string;
  /** 화면에 표시될 라벨 텍스트 */
  label: string;
  /** 체크박스 크기 옵션 */
  size?: 'sm' | 'md' | 'lg';
  /** 추가적인 className */
  className?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      name,
      label,
      required = false,
      disabled = false,
      size = 'md',
      className = '',
      id = name,
      ...props
    },
    ref
  ) => {
    // 크기에 따른 레이블 스타일(패딩 및 글자 크기)
    const sizeClasses = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1.5',
      lg: 'text-base px-4 py-2',
    } as const;

    return (
      <div className={`inline-block ${className}`}>
        {/* 실제 체크박스는 화면에서 숨기고 접근성은 유지 - sr-only 커스텀으로 scroll 방지 */}
        <input
          ref={ref}
          id={id}
          name={name}
          type="checkbox"
          required={required}
          disabled={disabled}
          className="peer absolute w-px h-px p-0 overflow-hidden whitespace-nowrap border-0 -left-[9999px] -top-[9999px]"  // sr-only 핵심 + left/top으로 off-screen 푸시
          {...props}
        />

        {/* 체크박스 상태에 따라 스타일이 변하는 칩 형태의 레이블 */}
        <label
          htmlFor={id}
          className={`rounded-full border border-transparent bg-gray-100 text-gray-800 cursor-pointer select-none transition-colors mr-2 mb-2
                    peer-checked:bg-yellow-400 peer-checked:text-gray-900
                    peer-disabled:bg-gray-100 peer-disabled:text-gray-500 peer-disabled:cursor-not-allowed
                    ${sizeClasses[size]}`}
          aria-hidden="true"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
