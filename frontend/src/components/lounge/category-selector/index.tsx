import { HTMLAttributes } from 'react';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategorySelectorProps extends HTMLAttributes<HTMLDivElement> {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  columns?: number;
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onCategorySelect,
  columns = 3,
  className = '',
  ...props
}: CategorySelectorProps) {
  const gridClass = columns === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <div className={`grid ${gridClass} gap-4 ${className}`} {...props}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
            selectedCategory === category.id
              ? 'bg-yellow-400'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <img src={category.icon} alt={category.name} className="w-8 h-8 mb-1" />
          <span className="text-xs text-center">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
