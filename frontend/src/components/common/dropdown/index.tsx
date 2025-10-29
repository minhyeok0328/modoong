import { forwardRef, SelectHTMLAttributes, useId, useState } from 'react';

interface DropdownOption {
  /** 실제 값 */
  value: string;
  /** 사용자에게 보여질 라벨 */
  label: string;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export interface DropdownProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** 이름(id) */
  name: string;
  /** 드롭다운 옵션 목록 */
  options: DropdownOption[];
  /** 라벨 텍스트 (시각적 표시용, 선택) */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helpText?: string;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 선택되지 않았을 때 표시할 플레이스홀더 */
  placeholderLabel?: string;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  (
    {
      name,
      options,
      label,
      error,
      helpText,
      required = false,
      disabled = false,
      className = '',
      size = 'md',
      fullWidth = true,
      id,
      placeholderLabel,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const internalId = useId();
    const selectId = id ?? internalId;

    const [touched, setTouched] = useState(false);
    const [showRequiredError, setShowRequiredError] = useState(false);

    const hasError = touched && showRequiredError;

    const sizeClasses = {
      sm: 'px-2 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-2.5 text-lg',
    } as const;

    const baseStyles =
      'block rounded-lg border bg-white text-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';
    const errorStyles = hasError
      ? 'border-red-500 focus:border-red-500 text-red-900'
      : 'border-gray-300';

    const widthStyle = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'}`}>
        {label && (
          <label htmlFor={selectId} className="block mb-2 text-sm font-medium text-gray-900">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          value={value}
          defaultValue={defaultValue}
          className={`${baseStyles} ${errorStyles} ${sizeClasses[size]} ${widthStyle} ${className}`}
          onBlur={(e) => {
            setTouched(true);
            if (required && e.target.value === '') {
              setShowRequiredError(true);
            }
          }}
          onChange={(e) => {
            if (showRequiredError && e.target.value !== '') {
              setShowRequiredError(false);
            }
            onChange?.(e);
          }}
          {...props}
        >
          {placeholderLabel && (
            <option value="" disabled hidden>
              {placeholderLabel}
            </option>
          )}
          {options.map(({ value: optionValue, label: optionLabel, disabled: optionDisabled }) => (
            <option key={optionValue} value={optionValue} disabled={optionDisabled}>
              {optionLabel}
            </option>
          ))}
        </select>

        {/* Help text */}
        {helpText && (
          <p id={`${selectId}-help`} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}

        {/* Error message */}
        {hasError && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error ?? '값을 선택해주세요.'}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
