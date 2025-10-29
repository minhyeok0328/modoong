import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { atom } from 'jotai';
import { DisabilitySportsFacility } from '@/graphql/queries/sportsFacility';

export interface ReservationItem {
  id: string; // facility ID (NearbyFacility.id)
  type: 'facility' | 'course';
  facilityName?: string;
  address?: string;
  date?: string;
  time?: string;
  amount: number | string;
  reservationNumber: string; // reservation_id for display
  courseTitle?: string;
  courseInfo?: any;
  coursePrice?: string;
  instructor?: string;
  createdAt: string;
  disabilitySportsFacility?: DisabilitySportsFacility;
  // 체육시설 관련 필드들
  siDesc?: string | null;
  refineRoadnmAddr?: string | null;
  facltTelno?: string | null;
  streetViewUrl?: string | null;
  streetViewPreview?: string | null;
  imageSrc?: string | null;
  // 스포츠강좌 관련 필드들
  facilityOwner?: string | null;
  vehicleSupport?: string | null;
  facilityAddress?: string | null;
  facilityImage?: string | null;
  facilityImageBase64?: string | null;
}

const localJSONStorage = createJSONStorage<ReservationItem[]>(() => localStorage);

// Default empty array for reservations
const defaultReservations: ReservationItem[] = [];

// Atom for managing reservations with localStorage persistence
export const reservationsAtom = atomWithStorage<ReservationItem[]>(
  'reservations',
  defaultReservations,
  localJSONStorage
);

// Derived atoms for filtering reservations
export const facilityReservationsAtom = atom(
  (get) => get(reservationsAtom).filter(item => item.type === 'facility')
);

export const courseReservationsAtom = atom(
  (get) => get(reservationsAtom).filter(item => item.type === 'course')
);

// Atom for adding new reservations
export const addReservationAtom = atom(
  null,
  (get, set, newReservation: ReservationItem) => {
    const currentReservations = get(reservationsAtom);

    // Check if reservation already exists (by reservation number)
    const existingIndex = currentReservations.findIndex(
      item => item.reservationNumber === newReservation.reservationNumber
    );

    if (existingIndex === -1) {
      // Add new reservation
      set(reservationsAtom, [...currentReservations, newReservation]);
      return true;
    }

    return false; // Already exists
  }
);

// Atom for removing reservations
export const removeReservationAtom = atom(
  null,
  (get, set, reservationNumber: string) => {
    const currentReservations = get(reservationsAtom);
    const updatedReservations = currentReservations.filter(
      item => item.reservationNumber !== reservationNumber
    );
    set(reservationsAtom, updatedReservations);
  }
);

// Atom for finding reservation by reservation number
export const findReservationByNumberAtom = atom(
  (get) => (reservationNumber: string) => {
    const reservations = get(reservationsAtom);
    return reservations.find(item => item.reservationNumber === reservationNumber);
  }
);
