import { Tag } from '@/components/common';
import { CourseInfo as CourseInfoType } from '@/graphql/queries/sportsFacility';

interface CourseInfoProps extends CourseInfoType {
  isSelected?: boolean;
  onSelect?: () => void;
  hideCheckbox?: boolean;
}

export default function CourseInfo({ description, info, price, tags, title, isSelected = false, onSelect, hideCheckbox = false }: CourseInfoProps) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm relative cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={onSelect}
    >
      {/* 체크박스 */}
      {!hideCheckbox && (
        <div className="absolute top-4 right-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-5 h-5 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
      <h4 className="text-lg font-bold text-gray-900 pr-8">
          {title}
        </h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags?.map((tag, index) => (
            <Tag
              key={index}
              className={
                index % 3 === 0
                  ? "bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  : index % 3 === 1
                  ? "bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  : "bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium"
              }
            >
              {tag}
            </Tag>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-y-3 text-sm">
          {info?.map((test, index) => (
            <div key={index} className="flex items-start">
              <span className="text-gray-600 w-16 flex-shrink-0">{Object.keys(test)[0]}</span>
              <span className="text-gray-900">{(Object.values(test)[0]?.length ? Object.values(test)[0] : '미정')}</span>
            </div>
          ))}
        </div>

        {description && (
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start gap-2 text-sm text-blue-700">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0">
              i
            </div>
            <span>{description}</span>
          </div>
        </div>)}

        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
            </div>
            <div className="text-xl font-bold text-blue-600">
              ₩ {price}원
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
