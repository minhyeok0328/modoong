import { useState, useEffect } from 'react';
import { CheckItem } from '@/components/common';

interface AgreementItem {
  id: string;
  label: string;
  required?: boolean;
}

interface AgreementProps {
  /**
   * List of agreements to be displayed underneath the "select all" checkbox.
   */
  agreements: AgreementItem[];
  /**
   * Callback that fires whenever the checked list changes.
   */
  onChange?: (checkedIds: string[]) => void;
  /**
   * Additional class names to attach to the root element.
   */
  className?: string;
}

export default function Agreement({ agreements, onChange, className }: AgreementProps) {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    agreements.forEach(({ id }) => {
      initial[id] = false;
    });
    return initial;
  });

  // Determine if every checkbox is checked
  const allChecked = Object.values(checkedMap).every(Boolean);

  useEffect(() => {
    const checkedIds = Object.entries(checkedMap)
      .filter(([, isChecked]) => isChecked)
      .map(([id]) => id);
    onChange?.(checkedIds);
  }, [checkedMap]);

  const toggleAll = () => {
    const next = !allChecked;
    setCheckedMap((prev) => {
      const updated: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = next;
      });
      return updated;
    });
  };

  const toggleOne = (id: string) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <fieldset className={`flex flex-col gap-4 ${className ?? ''}`}>
      <legend className="sr-only">개인정보 이용 동의 항목들</legend>
      {/* Select All */}
      <div
        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
        onClick={toggleAll}
      >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${allChecked ? 'bg-yellow-400 border-yellow-400' : 'border-gray-300'}`}>
          {allChecked && <span className="text-white text-sm">✓</span>}
        </div>
        <span className="font-bold text-lg">전체 동의하기</span>
      </div>

      <div className="h-px bg-gray-200 my-2" />

      {/* Individual agreements */}
      {agreements.map(({ id, label, required }) => {
        const isChecked = checkedMap[id];
        return (
          <CheckItem
            key={id}
            label={label}
            checked={isChecked}
            onToggle={() => toggleOne(id)}
            required={required}
          />
        );
      })}
    </fieldset>
  );
}
