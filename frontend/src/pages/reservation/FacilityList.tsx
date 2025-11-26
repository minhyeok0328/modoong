import { FilterModal, Button } from '@/components/common';
import { ReportPopup } from '@/components/common/popup';
import { FacilityCard } from '@/components/reservation';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_NEARBY_FACILITIES,
  GetNearbyFacilitiesData,
  GetNearbyFacilitiesVars,
  NearbyFacility,
} from '@/graphql/queries';
import {
  GET_SPORTS_FACILITY_TYPES,
  GetSportsFacilityTypesData,
} from '@/graphql/queries/sportsFacilityTypes';
import { GET_SPORTS_FACILITY_AMENITIES, GetSportsFacilityAmenitiesData } from '@/graphql/queries/amenitiesType';
import { useInfiniteScroll, useVirtualScroll } from '@/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { DISTANCE_OPTIONS } from '@/utils/facilityConstants';
import { createAmenitiesList, createFacilityOptionsList, handleArrayToggle } from '@/utils/facilityUtils';

const FACILITY_LIST_FILTER = [
  { label: '공공', value: 'public' },
  { label: '장애인', value: 'disability' },
  { label: '일반', value: 'others' },
  { label: '스포츠강좌', value: 'sports' },
] as const;


export default function FacilityList() {
  const location = useLocation();
  const navigate = useNavigate();
  const SCROLL_POSITION_KEY = `facilityListScrollTop_${location.key}`;
  const SEARCH_CONDITIONS_KEY = `facilityListSearchConditions`;

  const { data: typesData } = useQuery<GetSportsFacilityTypesData>(GET_SPORTS_FACILITY_TYPES);
  const { data: sportsFacilityAmenitiesData } = useQuery<GetSportsFacilityAmenitiesData>(GET_SPORTS_FACILITY_AMENITIES);

  const facilityTypeOptions = [
    ...(typesData?.sportsFacilityTypes.map((type) => ({ value: type, label: type })) ?? []),
  ];

  const amenitiesList = createAmenitiesList(sportsFacilityAmenitiesData?.sportsFacilityAmenities);

  const facilityOptionsList = createFacilityOptionsList(sportsFacilityAmenitiesData?.sportsFacilityAmenities);

  // 쿼리스트링에서 검색 조건들을 추출하거나 sessionStorage에서 복원
  const urlParams = new URLSearchParams(location.search);
  const distanceParam = urlParams.get('distance');
  const filterParam = urlParams.get('filter');
  const facilityTypeParam = urlParams.get('facilityType');
  const accessibilityParam = urlParams.get('accessibility');
  const facilityOptionsParam = urlParams.get('facilityOptions');

  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>(
    accessibilityParam ? JSON.parse(accessibilityParam) : []
  );
  const [selectedFacilityOptions, setSelectedFacilityOptions] = useState<string[]>(
    facilityOptionsParam ? JSON.parse(facilityOptionsParam) : []
  );

  // sessionStorage에서 저장된 검색 조건들 복원
  const savedConditions = sessionStorage.getItem(SEARCH_CONDITIONS_KEY);
  const parsedConditions = savedConditions ? JSON.parse(savedConditions) : {};

  const [selectedFilter, setSelectedFilter] = useState<string>(
    filterParam || parsedConditions.filter || ''
  );
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>(
    facilityTypeParam || parsedConditions.facilityType || ''
  );
  const [selectedDistance, setSelectedDistance] = useState<string>(
    distanceParam || parsedConditions.distance || ''
  );
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight - 200);
  const [isFacilityTypeModalOpen, setIsFacilityTypeModalOpen] = useState(false);
  const [isDistanceModalOpen, setIsDistanceModalOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isFacilityOptionsModalOpen, setIsFacilityOptionsModalOpen] = useState(false);

  const maxDistance =
    selectedDistance && selectedDistance !== 'free1' ? parseInt(selectedDistance, 10) : undefined;

  // 검색 조건을 sessionStorage에 저장
  const saveSearchConditions = () => {
    const conditions = {
      filter: selectedFilter,
      facilityType: selectedFacilityType,
      distance: selectedDistance,
      accessibility: selectedAccessibility,
      facilityOptions: selectedFacilityOptions,
    };
    sessionStorage.setItem(SEARCH_CONDITIONS_KEY, JSON.stringify(conditions));
  };

  // 검색 조건 변경 시 URL 업데이트 함수
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const allSelectedAmenities = [...selectedAccessibility, ...selectedFacilityOptions];
  const paginationInput = {
    skip: 0,
    take: 20,
    facilityType: selectedFacilityType || undefined,
    filter: selectedFilter,
    amenities: allSelectedAmenities.length > 0 ? JSON.stringify(allSelectedAmenities) : undefined,
    maxDistance,
  };

  const { data, loading, error, fetchMore } = useQuery<
    GetNearbyFacilitiesData,
    GetNearbyFacilitiesVars
  >(GET_NEARBY_FACILITIES, {
    variables: { paginationInput },
  });

  const facilities: NearbyFacility[] = data?.nearbySportsFacilitiesForUser?.facilities ?? [];
  const ITEM_HEIGHT = 460;

  const {
    containerRef: listContainerRef,
    totalHeight,
    slicedItems,
    getItemStyle,
    slicedStartIndex,
  } = useVirtualScroll<NearbyFacility>({
    items: facilities,
    itemHeight: ITEM_HEIGHT,
    viewportHeight: viewportHeight, // Use dynamic height
    overscanCount: 5,
    getItemId: (facility) => facility.id,
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_POSITION_KEY);
    const container = listContainerRef.current;
    if (container && saved) {
      const scrollTop = parseInt(saved, 10);
      if (!isNaN(scrollTop)) {
        container.scrollTop = scrollTop;
      }
    }
  }, [listContainerRef]);

  // URL이 변경될 때마다 검색 조건 동기화
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const distanceParam = urlParams.get('distance');
    const filterParam = urlParams.get('filter');
    const facilityTypeParam = urlParams.get('facilityType');
    const accessibilityParam = urlParams.get('accessibility');
    const facilityOptionsParam = urlParams.get('facilityOptions');

    if (distanceParam !== selectedDistance) {
      setSelectedDistance(distanceParam || '');
    }
    if (filterParam !== selectedFilter) {
      setSelectedFilter(filterParam || '');
    }
    if (facilityTypeParam !== selectedFacilityType) {
      setSelectedFacilityType(facilityTypeParam || '');
    }

    const urlAccessibility = accessibilityParam ? JSON.parse(accessibilityParam) : [];
    if (JSON.stringify(urlAccessibility) !== JSON.stringify(selectedAccessibility)) {
      setSelectedAccessibility(urlAccessibility);
    }

    const urlFacilityOptions = facilityOptionsParam ? JSON.parse(facilityOptionsParam) : [];
    if (JSON.stringify(urlFacilityOptions) !== JSON.stringify(selectedFacilityOptions)) {
      setSelectedFacilityOptions(urlFacilityOptions);
    }
  }, [location.search]);

  // 검색 조건이 변경될 때마다 sessionStorage에 저장
  useEffect(() => {
    saveSearchConditions();
  }, [selectedFilter, selectedFacilityType, selectedDistance, selectedAccessibility, selectedFacilityOptions]);

  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;

    const handleScrollSave = () => {
      sessionStorage.setItem(SCROLL_POSITION_KEY, String(container.scrollTop));
    };

    container.addEventListener('scroll', handleScrollSave);
    return () => {
      container.removeEventListener('scroll', handleScrollSave);
    };
  }, [listContainerRef, location.key]);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight - 234);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasNext = data?.nearbySportsFacilitiesForUser?.hasNext ?? false;

  const loadMore = () => {
    if (!hasNext) return;

    const currentSkip = facilities.length;

    fetchMore({
      variables: {
        paginationInput: {
          skip: currentSkip,
          take: 20,
          facilityType: selectedFacilityType || undefined,
          filter: selectedFilter,
          amenities: allSelectedAmenities.length > 0 ? JSON.stringify(allSelectedAmenities) : undefined,
          maxDistance,
        },
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;

        return {
          nearbySportsFacilitiesForUser: {
            ...fetchMoreResult.nearbySportsFacilitiesForUser,
            facilities: [
              ...prevResult.nearbySportsFacilitiesForUser.facilities,
              ...fetchMoreResult.nearbySportsFacilitiesForUser.facilities,
            ],
          },
        };
      },
    });
  };

  const sentinelRef = useInfiniteScroll(loadMore);

  // 필터 변경 함수 (기존 장애인 시설 등 버튼용)
  const handleFilterChange = (value: string) => {
    const newValue = selectedFilter === value ? '' : value;
    setSelectedFilter(newValue);
    updateSearchParams('filter', newValue);
  };

  // 체육시설 타입 모달 관련 함수들
  const handleFacilityTypeModalApply = () => {
    setIsFacilityTypeModalOpen(false);
    updateSearchParams('facilityType', selectedFacilityType);
    saveSearchConditions();
  };

  const handleFacilityTypeModalReset = () => {
    setSelectedFacilityType('');
    updateSearchParams('facilityType', '');
  };

  // 거리 모달 관련 함수들
  const handleDistanceModalApply = () => {
    setIsDistanceModalOpen(false);
    updateSearchParams('distance', selectedDistance);
    saveSearchConditions();
  };

  const handleDistanceModalReset = () => {
    setSelectedDistance('');
    updateSearchParams('distance', '');
  };

  // 접근성 모달 관련 함수들
  const handleAccessibilityModalApply = () => {
    setIsAccessibilityModalOpen(false);
    updateSearchParams('accessibility', JSON.stringify(selectedAccessibility));
    saveSearchConditions();
  };

  const handleAccessibilityModalReset = () => {
    setSelectedAccessibility([]);
    updateSearchParams('accessibility', '');
  };

  const handleAccessibilityChange = (value: string) => {
    handleArrayToggle(selectedAccessibility, value, setSelectedAccessibility);
  };

  // 편의시설 모달 관련 함수들
  const handleFacilityOptionsModalApply = () => {
    setIsFacilityOptionsModalOpen(false);
    updateSearchParams('facilityOptions', JSON.stringify(selectedFacilityOptions));
    saveSearchConditions();
  };

  const handleFacilityOptionsModalReset = () => {
    setSelectedFacilityOptions([]);
    updateSearchParams('facilityOptions', '');
  };

  const handleFacilityOptionsChange = (value: string) => {
    handleArrayToggle(selectedFacilityOptions, value, setSelectedFacilityOptions);
  };

  // 필터 모달 섹션 구성
  const facilityTypeFilterSections = [
    {
      title: '종목',
      subtitle: '원하는 종목을 선택하세요',
      options: facilityTypeOptions,
      value: selectedFacilityType,
      onChange: setSelectedFacilityType,
    },
  ];

  const distanceFilterSections = [
    {
      title: '거리',
      subtitle: '최대 거리를 선택하세요',
      options: [...DISTANCE_OPTIONS],
      value: selectedDistance,
      onChange: setSelectedDistance,
    },
  ];

  const accessibilityFilterSections = [
    {
      title: '접근성',
      subtitle: '필요한 접근성 옵션을 선택하세요',
      options: amenitiesList,
      value: selectedAccessibility,
      onChange: handleAccessibilityChange,
      multiSelect: true,
    },
  ];

  const facilityOptionsFilterSections = [
    {
      title: '편의시설',
      subtitle: '필요한 편의시설을 선택하세요',
      options: facilityOptionsList,
      value: selectedFacilityOptions,
      onChange: handleFacilityOptionsChange,
      multiSelect: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="mt-4 mb-4 flex flex-col gap-3">
        {/* 체육시설 타입과 거리 필터 버튼 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFacilityTypeModalOpen(true)}
            className={`whitespace-nowrap ${selectedFacilityType ? 'bg-yellow-400 border-yellow-400 text-black' : ''}`}
          >
            {selectedFacilityType
              ? facilityTypeOptions.find(opt => opt.value === selectedFacilityType)?.label
              : '종목'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDistanceModalOpen(true)}
            className={`whitespace-nowrap ${selectedDistance ? 'bg-yellow-400 border-yellow-400 text-black' : ''}`}
          >
            {selectedDistance
              ? DISTANCE_OPTIONS.find(opt => opt.value === selectedDistance)?.label
              : '거리'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAccessibilityModalOpen(true)}
            className={`whitespace-nowrap ${selectedAccessibility.length > 0 ? 'bg-yellow-400 border-yellow-400 text-black' : ''}`}
          >
            {selectedAccessibility.length > 0
              ? `접근성 (${selectedAccessibility.length})`
              : '접근성'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFacilityOptionsModalOpen(true)}
            className={`whitespace-nowrap ${selectedFacilityOptions.length > 0 ? 'bg-yellow-400 border-yellow-400 text-black' : ''}`}
          >
            {selectedFacilityOptions.length > 0
              ? `편의시설 (${selectedFacilityOptions.length})`
              : '편의시설'}
          </Button>
        </div>

        {/* 기존 장애인 시설 등 필터 버튼들 */}
        <div className="flex gap-2">
          {FACILITY_LIST_FILTER.map((filter) => {
            const isSelected = selectedFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                className={`whitespace-nowrap rounded-full px-4 py-1 text-sm font-medium border transition-colors
                  ${isSelected ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-white border-yellow-400 text-black'}`}
                onClick={() => handleFilterChange(filter.value)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      {loading && <p className="text-center text-gray-500">불러오는 중...</p>}
      {error && <p className="text-center text-red-500">시설 정보를 불러오는데 실패했습니다.</p>}
      <div
        ref={listContainerRef}
        className="relative overflow-y-auto"
        style={{ height: `${viewportHeight}px` }} // Use dynamic height
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }} className="space-y-4">
          {!loading && slicedItems.length < 1 && (
            <div className="flex items-center justify-center">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
          {slicedItems.map((facility: NearbyFacility, idx: number) => {
            const globalIndex = slicedStartIndex + idx;
            return (
              <FacilityCard
                key={facility.id}
                facility={facility}
                to={`/reservation/facility/${facility.id}`}
                style={getItemStyle(globalIndex)}
                message="예약가능"
                state={{
                  returnUrl: `${location.pathname}?${location.search}`,
                  searchConditions: {
                    filter: selectedFilter,
                    facilityType: selectedFacilityType,
                    distance: selectedDistance,
                    accessibility: selectedAccessibility,
                    facilityOptions: selectedFacilityOptions,
                  },
                }}
              />
            );
          })}

          {hasNext && (
            <div
              ref={sentinelRef}
              style={{
                position: 'absolute',
                top: `${(totalHeight - 300) < 0 ? 0 : totalHeight - 300}px`,
                height: '1px',
                width: '100%',
              }}
            />
          )}
        </div>
      </div>

      {/* 종목 필터 모달 */}
      <FilterModal
        title="종목"
        sections={facilityTypeFilterSections}
        isOpen={isFacilityTypeModalOpen}
        onClose={() => setIsFacilityTypeModalOpen(false)}
        onApply={handleFacilityTypeModalApply}
        onReset={handleFacilityTypeModalReset}
      />

      {/* 거리 필터 모달 */}
      <FilterModal
        title="거리"
        sections={distanceFilterSections}
        isOpen={isDistanceModalOpen}
        onClose={() => setIsDistanceModalOpen(false)}
        onApply={handleDistanceModalApply}
        onReset={handleDistanceModalReset}
      />

      {/* 접근성 필터 모달 */}
      <FilterModal
        title="접근성"
        sections={accessibilityFilterSections}
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        onApply={handleAccessibilityModalApply}
        onReset={handleAccessibilityModalReset}
      />

      {/* 편의시설 필터 모달 */}
      <FilterModal
        title="편의시설"
        sections={facilityOptionsFilterSections}
        isOpen={isFacilityOptionsModalOpen}
        onClose={() => setIsFacilityOptionsModalOpen(false)}
        onApply={handleFacilityOptionsModalApply}
        onReset={handleFacilityOptionsModalReset}
      />

      <ReportPopup />
    </div>
  );
}
