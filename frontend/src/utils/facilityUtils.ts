import { filterSportsFacilityAmenities } from './amenitiesFilter';

export function createAmenitiesList(amenities: string[] | undefined) {
  if (!amenities) return [];
  const filtered = filterSportsFacilityAmenities(amenities);
  return filtered.accessibility.map(item => ({ value: item.value, label: item.key }));
}

export function createFacilityOptionsList(amenities: string[] | undefined) {
  if (!amenities) return [];
  const filtered = filterSportsFacilityAmenities(amenities);
  return filtered.amenities.map(item => ({ value: item.value, label: item.key }));
}

export function handleArrayToggle<T>(array: T[], value: T, setter: (newArray: T[]) => void) {
  if (array.includes(value)) {
    setter(array.filter(item => item !== value));
  } else {
    setter([...array, value]);
  }
}