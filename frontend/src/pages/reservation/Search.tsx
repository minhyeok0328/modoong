import { Button, CategorySelector, Checkbox, PageTitle, TabNavigation } from '@/components/common';
import SearchBar from '@/components/menu/search-bar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  GET_SPORTS_FACILITY_TYPES,
  GetSportsFacilityTypesData,
} from '@/graphql/queries/sportsFacilityTypes';
import { GET_SPORTS_FACILITY_AMENITIES, GetSportsFacilityAmenitiesData } from '@/graphql/queries/amenitiesType';
import { SEARCH_DISTANCE_OPTIONS } from '@/utils/facilityConstants';
import { createAmenitiesList, createFacilityOptionsList, handleArrayToggle } from '@/utils/facilityUtils';

const SPORTS_ICONS = {
  배드민턴: '/icons/badminton.png',
  헬스: '/icons/fitness.png',
  골프: '/icons/golf.png',
  육상: '/icons/other.png',
  실외: '/icons/other.png',
  국궁: '/icons/other.png',
  당구: '/icons/billiards.png',
  축구: '/icons/soccer.png',
  승마: '/icons/horse.png',
  줄넘기: '/icons/other.png',
  기타: '/icons/other.png',
  '빙상(스케이트)': '/icons/skating.png',
  하키: '/icons/other.png',
  스키장: '/icons/other.png',
  테니스: '/icons/tennis.png',
  양궁: '/icons/other.png',
  사이클: '/icons/other.png',
  사격: '/icons/other.png',
  조정카누: '/icons/other.png',
  태권도: '/icons/taekwondo.png',
  농구: '/icons/basketball.png',
  권투: '/icons/boxing.png',
  레슬링: '/icons/other.png',
  무도: '/icons/other.png',
  게이트볼: '/icons/other.png',
  씨름: '/icons/other.png',
  야구: '/icons/baseball.png',
  수영: '/icons/swimming.png',
  유도: '/icons/judo.png',
  롤러인라인: '/icons/roller.png',
  클라이밍: '/icons/other.png',
  자동차경주장: '/icons/other.png',
  투기: '/icons/other.png',
  검도: '/icons/kendo.png',
  합기도: '/icons/hapkido.png',
  우슈: '/icons/other.png',
  에어로빅: '/icons/aerobics.png',
  발레: '/icons/ballet.png',
  볼링: '/icons/bowling.png',
  댄스: '/icons/dance.png',
  펜싱: '/icons/fencing.png',
  필라테스: '/icons/pilates.png',
  스쿼시: '/icons/squash.png',
  배구: '/icons/volley.png',
  요가: '/icons/yoga.png',
  탁구: '/icons/table.png',
} as const;

const TIME_SLOTS = [
  { key: '06-08', label: '06:00 ~ 08:00' },
  { key: '08-10', label: '08:00 ~ 10:00' },
  { key: '10-12', label: '10:00 ~ 12:00' },
  { key: '12-14', label: '12:00 ~ 14:00' },
  { key: '14-16', label: '14:00 ~ 16:00' },
  { key: '16-18', label: '16:00 ~ 18:00' },
  { key: 'free2', label: '상관없음' },
];

const TMP_REMOVE_ICON = '/icons/other.png'

export default function Search() {
  const { data: sportsFacilityTypes } =
    useQuery<GetSportsFacilityTypesData>(GET_SPORTS_FACILITY_TYPES);
  const sportsFacilityTypesCategory = sportsFacilityTypes?.sportsFacilityTypes?.filter((type) => SPORTS_ICONS[type as keyof typeof SPORTS_ICONS] !== TMP_REMOVE_ICON);
  const [activeTab, setActiveTab] = useState<string>('facility');
  const [searchValue, setSearchValue] = useState<string>('');

  const orderedSportsFacilityTypesCategory = (() => {
    if (!sportsFacilityTypesCategory) return undefined;
    const trimmed = searchValue.trim();
    if (trimmed === '') return sportsFacilityTypesCategory;
    const includes = sportsFacilityTypesCategory.filter((type) => type.includes(trimmed));
    const excludes = sportsFacilityTypesCategory.filter((type) => !type.includes(trimmed));
    return [...includes, ...excludes];
  })();
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedDistance, setSelectedDistance] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);
  const [selectedFacilityOptions, setSelectedFacilityOptions] = useState<string[]>([]);
  const { data: sportsFacilityAmenitiesData } = useQuery<GetSportsFacilityAmenitiesData>(GET_SPORTS_FACILITY_AMENITIES);

  const amenitiesList = createAmenitiesList(sportsFacilityAmenitiesData?.sportsFacilityAmenities);

  const facilityOptionsList = createFacilityOptionsList(sportsFacilityAmenitiesData?.sportsFacilityAmenities);
  const navigate = useNavigate();

  const tabs = [
    { id: 'facility', label: '체육시설' },
    { id: 'sports', label: '스포츠강좌시설' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (selectedSport) {
      queryParams.set('facilityType', selectedSport);
    }

    if (selectedAccessibility.length > 0) {
      queryParams.set('accessibility', JSON.stringify(selectedAccessibility));
    }

    if (selectedFacilityOptions.length > 0) {
      queryParams.set('facilityOptions', JSON.stringify(selectedFacilityOptions));
    }

    if (selectedDistance && selectedDistance !== 'free1') {
      queryParams.set('distance', selectedDistance);
    }

    // 선택된 탭이 'sports'인 경우 추가 필터를 쿼리스트링에 포함
    if (activeTab === 'sports') {
      queryParams.set('filter', 'sports');
    }

    navigate(`/reservation/facility-list?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col justify-between h-full px-6 py-4">
      <div className="flex flex-col gap-4">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="종목을 검색하세요"
        />
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="mb-4"
        />
        {orderedSportsFacilityTypesCategory && (
          <CategorySelector
            name="sports"
            value={selectedSport}
            onValueChange={setSelectedSport}
            options={[...orderedSportsFacilityTypesCategory, '탁구'].map((type) => ({
              value: type,
              label: type,
              icon: <img src={SPORTS_ICONS[type as keyof typeof SPORTS_ICONS] || '/icons/other.png'} alt={type} className="w-8 h-8" />,
            }))}
            className="whitespace-nowrap overflow-x-auto pb-2"
            style={{ flexWrap: 'nowrap' }}
          />
        )}

        <PageTitle text="접근성" className="font-bold mt-6 mb-1" size="xl" />
        <div className="flex gap-4 overflow-x-auto pb-2 py-1">
          {amenitiesList?.map((option) => (
            <Checkbox
              key={option.value}
              name={option.value}
              label={option.label}
              checked={selectedAccessibility.includes(option.value)}
              onChange={() => handleArrayToggle(selectedAccessibility, option.value, setSelectedAccessibility)}
              className={`whitespace-nowrap ${selectedAccessibility.includes(option.value) ? 'font-bold' : ''}`}
            />
          ))}
        </div>

        <PageTitle text="편의시설" className="font-bold mt-6 mb-1" size="xl" />
        <div className="flex gap-4 overflow-x-auto pb-2 py-1">
          {facilityOptionsList?.map((option) => (
            <Checkbox
              key={option.value}
              name={option.value}
              label={option.label}
              checked={selectedFacilityOptions.includes(option.value)}
              onChange={() => handleArrayToggle(selectedFacilityOptions, option.value, setSelectedFacilityOptions)}
              className={`whitespace-nowrap ${selectedFacilityOptions.includes(option.value) ? 'font-bold' : ''}`}
            />
          ))}
        </div>

        <PageTitle text="거리" className="font-bold mt-6 mb-1" size="xl" />
        <div className="flex gap-4 overflow-x-auto pb-2 py-1">
          {SEARCH_DISTANCE_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              name={option.value}
              label={option.label}
              checked={selectedDistance === option.value}
              onChange={() => setSelectedDistance(option.value)}
              className={`whitespace-nowrap ${selectedDistance === option.value ? 'font-bold' : ''}`}
            />
          ))}
        </div>

        <PageTitle text="시간" className="font-bold mt-6 mb-1" size="xl" />
        <div className="flex gap-4 overflow-x-auto pb-2 py-1">
          {TIME_SLOTS.map((timeSlot) => (
            <Checkbox
              key={timeSlot.key}
              name={timeSlot.key}
              label={timeSlot.label}
              checked={selectedTime === timeSlot.key}
              onChange={() => setSelectedTime(timeSlot.key)}
              className={`whitespace-nowrap ${selectedTime === timeSlot.key ? 'font-bold' : ''}`}
            />
          ))}
        </div>
      </div>
      <Button className="w-full mt-10 font-bold" size="lg" onClick={handleSearch}>
        검색하기
      </Button>
    </div>
  );
}
