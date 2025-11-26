import { forwardRef } from 'react';

interface CheckItemProps {
    label: string;
    checked: boolean;
    onToggle: () => void;
    className?: string;
    required?: boolean;
}

const CheckItem = forwardRef<HTMLDivElement, CheckItemProps>(
    ({ label, checked, onToggle, className = '', required = false }, ref) => {
        return (
            <div
                ref={ref}
                className={`flex items-center justify-between py-2 cursor-pointer ${className}`}
                onClick={onToggle}
                role="checkbox"
                aria-checked={checked}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggle();
                    }
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-yellow-400 border-yellow-400' : 'border-gray-300'
                            }`}
                    >
                        {checked && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-gray-700 font-medium">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                </div>
                <span className="text-gray-400 text-sm underline">보기</span>
            </div>
        );
    }
);

CheckItem.displayName = 'CheckItem';

export default CheckItem;
