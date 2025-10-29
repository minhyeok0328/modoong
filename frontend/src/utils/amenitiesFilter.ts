export interface FilteredAmenity {
  key: string;
  value: string;
}

export interface FilteredAmenities {
  amenities: FilteredAmenity[];
  accessibility: FilteredAmenity[];
}

const AMENITY_MAP = {
  '남/녀 화장실 구분': { category: 'amenities', displayKey: '남/녀 화장실 구분' },
  '무선 인터넷': { category: 'amenities', displayKey: '무선인터넷' },
  '반려동물 동반': { category: 'amenities', displayKey: '반려동물 동반' },
  '화장실 휠체어 이용가능': { category: 'accessibility', displayKey: '장애인 화장실' },
  '장애인 주차구역': { category: 'accessibility', displayKey: '장애인 주차구역' },
  '출입구 휠체어 이용가능': { category: 'accessibility', displayKey: '입구계단없음' }
} as const;

export function filterSportsFacilityAmenities(sportsFacilityAmenities: string[]): FilteredAmenities {
  const result: FilteredAmenities = {
    amenities: [],
    accessibility: []
  };

  sportsFacilityAmenities.forEach(amenity => {
    const mapped = AMENITY_MAP[amenity as keyof typeof AMENITY_MAP];
    if (mapped) {
      if (mapped.category === 'amenities') {
        result.amenities.push({
          key: mapped.displayKey,
          value: amenity
        });
      } else if (mapped.category === 'accessibility') {
        result.accessibility.push({
          key: mapped.displayKey,
          value: amenity
        });
      }
    }
  });

  return result;
}
