import { useState, useEffect } from 'react';

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
      <div className="flex items-center">
        <input
          id="select-all"
          type="checkbox"
          className="w-5 h-5 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          checked={allChecked}
          onChange={toggleAll}
          aria-checked={allChecked}
          aria-describedby="select-all-desc"
        />
        <label htmlFor="select-all" className="ml-2 text-sm font-medium text-gray-900">
          전체선택
        </label>
        <span id="select-all-desc" className="sr-only">
          모든 개인정보 이용 동의 항목을 한번에 선택하거나 해제합니다
        </span>
      </div>

      {/* Individual agreements */}
      {agreements.map(({ id, label, required }) => {
        const inputId = `agreement-${id}`;
        const descId = `agreement-${id}-desc`;
        const isChecked = checkedMap[id];
        return (
          <div key={id} className="flex items-center">
            <input
              id={inputId}
              type="checkbox"
              className="w-5 h-5 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              checked={isChecked}
              onChange={() => toggleOne(id)}
              aria-checked={isChecked}
              aria-describedby={descId}
              aria-required={required}
            />
            <label htmlFor={inputId} className="ml-2 text-sm font-medium text-gray-900 select-none">
              {label}
              {required && (
                <span className="text-red-500 ml-1" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            <span id={descId} className="sr-only">
              {required ? '필수 동의 항목입니다' : '선택 동의 항목입니다'}
            </span>
          </div>
        );
      })}
    </fieldset>
  );
}
