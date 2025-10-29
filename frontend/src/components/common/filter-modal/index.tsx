import { forwardRef, useState, useEffect } from 'react';
import { Button } from '@/components/common';
import { FaXmark } from 'react-icons/fa6';
interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FilterSection {
  title: string;
  subtitle?: string;
  options: FilterOption[];
  value: string | string[];
  onChange: (value: string) => void;
  allowEmpty?: boolean;
  multiSelect?: boolean;
}

interface FilterModalProps {
  title: string;
  sections: FilterSection[];
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterModal = forwardRef<HTMLDivElement, FilterModalProps>(
  ({ title, sections, isOpen, onClose, onApply, onReset }, ref) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setIsClosing(false);
      }
    }, [isOpen]);

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 150);
    };

    const handleApply = () => {
      setIsClosing(true);
      setTimeout(() => {
        onApply();
        setIsClosing(false);
      }, 250);
    };

    if (!isOpen && !isClosing) return null;

        return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        onClick={handleClose}
      >
        <div
          ref={ref}
          className="bg-white rounded-2xl p-6 max-w-[90%] w-full max-h-[500px] overflow-y-auto absolute left-1/2 -translate-x-1/2 bottom-4"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: isClosing ? 'popup-out 0.15s ease-in forwards' : 'popup-in 0.25s ease-out forwards'
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <FaXmark />
            </button>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <FilterSection key={index} {...section} />
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex-1"
            >
              초기화
            </Button>
            <Button
              variant="primary"
              onClick={handleApply}
              className="flex-1"
            >
              필터 적용
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

const FilterSection = ({ subtitle, options, value, onChange, allowEmpty = true, multiSelect = false }: FilterSection) => {
  const isMultiSelect = multiSelect && Array.isArray(value);

  return (
    <div>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
        {options.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            isSelected={isMultiSelect ? value.includes(option.value) : value === option.value}
            disabled={option.disabled}
            onClick={() => {
              if (isMultiSelect) {
                onChange(option.value);
              } else {
                const newValue = value === option.value && allowEmpty ? '' : option.value;
                onChange(newValue);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const FilterButton = ({ label, isSelected, disabled, onClick }: FilterButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 h-10 rounded-lg text-sm font-medium border transition-colors duration-200 ${
        isSelected
          ? 'bg-yellow-400 border-yellow-400 text-black'
          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {label}
    </button>
  );
};

FilterModal.displayName = 'FilterModal';

export default FilterModal;
