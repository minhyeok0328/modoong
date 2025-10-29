import { useMemo } from 'react';

interface UseSearchHighlightResult {
  isHighlighted: (text: string) => boolean;
  highlightText: (text: string) => React.ReactNode;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useSearchHighlight(searchTerm: string): UseSearchHighlightResult {
  const isHighlighted = useMemo(
    () => (text: string) => {
      if (!searchTerm.trim()) return false;
      return text.toLowerCase().includes(searchTerm.toLowerCase());
    },
    [searchTerm]
  );

  const highlightText = useMemo(
    () => (text: string) => {
      if (!searchTerm.trim()) return text;

      const escapedTerm = escapeRegExp(searchTerm);
      const parts = text.split(new RegExp(escapedTerm, 'gi'));

      const result = [];
      for (let i = 0; i < parts.length; i++) {
        result.push(parts[i]);
        if (i < parts.length - 1) {
          result.push(
            <span className="bg-yellow-300 font-bold" key={i}>
              {searchTerm}
            </span>
          );
        }
      }

      return result;
    },
    [searchTerm]
  );

  return { isHighlighted, highlightText };
}
