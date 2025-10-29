import { forwardRef, InputHTMLAttributes, useState } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string;
  label: string;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      error,
      helpText,
      required = false,
      disabled = false,
      className = '',
      placeholder,
      type = 'text',
      size = 'md',
      fullWidth = true,
      id = name,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: 'px-2 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-2.5 text-lg',
    };

    // Track whether the input has been interacted with (blurred once).
    const [touched, setTouched] = useState(false);
    const [showRequiredError, setShowRequiredError] = useState(false);

    // Error styles appear only after blur and when the field is still empty.
    const hasError = touched && showRequiredError;

    const baseInputStyles =
      'block rounded-lg border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    const errorStyles = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    const widthStyle = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'}`}>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="relative">
          <input
            ref={ref}
            type={type}
            id={id}
            name={name}
            aria-describedby={`${id}-help ${id}-error`}
            aria-invalid={hasError}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`
                        ${baseInputStyles}
                        ${errorStyles}
                        ${sizes[size]}
                        ${widthStyle}
                        ${className}
                    `}
            onBlur={(e) => {
              setTouched(true);
              if (required && e.target.value.trim() === '') {
                setShowRequiredError(true);
              }
              onBlur?.(e);
            }}
            onChange={(e) => {
              if (showRequiredError && e.target.value.trim() !== '') {
                setShowRequiredError(false);
              }
              onChange?.(e);
            }}
            {...props}
          />
        </div>

        {/* Help text */}
        {helpText && (
          <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}

        {/* Error message */}
        {hasError && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error ?? '값을 입력해주세요.'}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
