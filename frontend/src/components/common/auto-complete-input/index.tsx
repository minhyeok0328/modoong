import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/common';

interface AutoCompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  suggestions: string[];
  id: string;
}

function AutoCompleteInput({ value, onChange, label, placeholder, suggestions, id }: AutoCompleteInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    if (inputValue.length > 0 && isFocused) {
      const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [inputValue, suggestions, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showSuggestions) return;
      
      switch (event.key) {
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
            handleSuggestionClick(filteredSuggestions[selectedIndex]);
          }
          break;
      }
    };

    const handleFocusChange = () => {
      // 현재 포커스된 요소가 이 input이 아니면 자동완성 숨김
      if (document.activeElement !== inputRef.current) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusChange);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusChange);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (inputValue.length > 0) {
      const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as Node;
    if (!containerRef.current?.contains(relatedTarget)) {
      setIsFocused(false);
      setTimeout(() => setShowSuggestions(false), 150);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <Input
        ref={inputRef}
        id={id}
        name={id}
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        autoComplete="off"
        aria-expanded={showSuggestions}
        aria-haspopup="listbox"
        aria-owns={showSuggestions ? `${id}-suggestions` : undefined}
        aria-activedescendant={
          selectedIndex >= 0 ? `${id}-suggestion-${selectedIndex}` : undefined
        }
        role="combobox"
      />
      {showSuggestions && isFocused && (
        <ul
          id={`${id}-suggestions`}
          role="listbox"
          aria-label={`${label} 자동완성 목록`}
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              id={`${id}-suggestion-${index}`}
              ref={(el) => {
                if (el) {
                  suggestionRefs.current[index] = el;
                }
              }}
              role="option"
              aria-selected={selectedIndex === index}
              className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                selectedIndex === index 
                  ? 'bg-yellow-100 text-gray-900' 
                  : 'hover:bg-gray-100'
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutoCompleteInput;