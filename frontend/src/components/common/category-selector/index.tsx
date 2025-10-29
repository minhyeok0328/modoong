import { forwardRef, ReactNode, useId, useState, HTMLAttributes } from 'react';

interface CategoryOption {
  /** 고유 값 */
  value: string;
  /** 사용자에게 표시될 라벨 */
  label: string;
  /** react-icons 등 Icon 컴포넌트 */
  icon?: ReactNode;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export interface CategorySelectorProps extends HTMLAttributes<HTMLDivElement> {
  /** 라디오 그룹 이름. 같은 이름일 경우 하나만 선택됩니다. */
  name: string;
  /** 선택지 목록 */
  options: CategoryOption[];
  /** 선택된 값 (controlled) */
  value?: string;
  /** 초기값 (uncontrolled) */
  defaultValue?: string;
  /** 변경 콜백 */
  onValueChange?: (value: string) => void;
  /** 아이템 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 className */
  className?: string;
}

const CategorySelector = forwardRef<HTMLDivElement, CategorySelectorProps>(
  (
    { name, options, value, defaultValue, onValueChange, size = 'md', className = '', ...props },
    ref
  ) => {
    const internalId = useId();
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);

    const selectedValue = isControlled ? value : uncontrolledValue;

    const handleChange = (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    };

    const sizeClasses = {
      sm: 'w-16 h-16 text-xs',
      md: 'w-20 h-20 text-sm',
      lg: 'w-24 h-24 text-base',
    } as const;

    return (
      <div ref={ref} className={`flex flex-wrap gap-3 ${className}`} {...props}>
        {options.map(({ value: optionValue, label, icon, disabled }) => {
          const inputId = `${internalId}-${optionValue}`;
          const checked = selectedValue === optionValue;
          return (
            <div key={optionValue} className="inline-block">
              <input
                id={inputId}
                type="radio"
                name={name}
                value={optionValue}
                className="peer sr-only"
                checked={checked}
                disabled={disabled}
                onChange={() => handleChange(optionValue)}
                aria-label={label}
              />
              <label
                htmlFor={inputId}
                className={`flex flex-col items-center justify-center rounded-lg bg-gray-100 text-gray-700 shadow-sm cursor-pointer select-none transition-colors duration-150 ${sizeClasses[size]}
                  peer-checked:bg-yellow-400 peer-checked:text-gray-900 peer-checked:shadow-md peer-checked:font-bold
                  peer-disabled:bg-gray-100 peer-disabled:text-gray-400 peer-disabled:cursor-not-allowed`}
                aria-hidden="true"
              >
                {icon && <span className="text-2xl mb-1">{icon}</span>}
                <span>{label}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  }
);

CategorySelector.displayName = 'CategorySelector';

export default CategorySelector;
