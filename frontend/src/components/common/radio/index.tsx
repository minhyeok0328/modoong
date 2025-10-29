import { forwardRef, InputHTMLAttributes } from 'react';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 고유 식별자 및 네이밍 */
  name: string;
  /** 화면에 표시될 라벨 텍스트 */
  label: string;
  /** 추가적인 className */
  className?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ name, label, disabled = false, required = false, className = '', id, ...props }, ref) => {
    const inputId = id || `${name}-${props.value ?? label}`;

    return (
      <div className={`flex items-center ${className}`}>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="radio"
          disabled={disabled}
          required={required}
          className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400 disabled:opacity-50"
          {...props}
        />
        <label
          htmlFor={inputId}
          className="ml-2 text-sm cursor-pointer select-none disabled:cursor-not-allowed"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden>
              {' '}
              *
            </span>
          )}
        </label>
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
