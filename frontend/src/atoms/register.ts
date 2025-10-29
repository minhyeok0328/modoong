import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { RegisterFormState } from '../types/user';

export type { RegisterFormState };

const sessionJSONStorage = createJSONStorage<RegisterFormState>(() => sessionStorage);

export const registerFormAtom = atomWithStorage<RegisterFormState>(
  'registerForm',
  {
    name: '',
    address: '',
    agreement: false,
    accessibilityStatus: {},
    sportPreference: [],
    activitySchedule: {
      dawn: { start: '06:00', end: '08:00', selected: false },
      morning: { start: '08:00', end: '12:00', selected: false },
      noon: { start: '12:00', end: '14:00', selected: false },
      afternoon: { start: '14:00', end: '18:00', selected: false },
      evening: { start: '18:00', end: '22:00', selected: false },
      lateNight: { start: '22:00', end: '06:00', selected: false },
    },
    otherSportDescription: '',
    otherDisabilityDescription: '',
  },
  sessionJSONStorage
);

export const isNextButtonEnabledAtom = atom<boolean>(false);
