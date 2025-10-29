import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { atom } from 'jotai';
import { UserState } from '../types/user';

const sessionJSONStorage = createJSONStorage<UserState>(() => sessionStorage);

const defaultUserState: UserState = {
  username: '',
  address: '',
  accessibilityStatus: {},
  activitySchedule: {
    dawn: { start: '06:00', end: '08:00', selected: false },
    morning: { start: '08:00', end: '12:00', selected: false },
    noon: { start: '12:00', end: '14:00', selected: false },
    afternoon: { start: '14:00', end: '18:00', selected: false },
    evening: { start: '18:00', end: '22:00', selected: false },
    lateNight: { start: '22:00', end: '06:00', selected: false },
  },
  sportPreference: '',
  otherSportDescription: '',
  otherDisabilityDescription: '',
};

export const userAtom = atomWithStorage<UserState>('user', defaultUserState, sessionJSONStorage);

export const appInitializationAtom = atom<{
  isInitializing: boolean;
  isInitialized: boolean;
}>({
  isInitializing: true,
  isInitialized: false,
});
