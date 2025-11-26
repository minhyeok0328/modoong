import { TimeRange } from './time';
export interface ActivitySchedule {
  dawn: TimeRange & { selected: boolean }; // 새벽 (06:00~08:00)
  morning: TimeRange & { selected: boolean }; // 아침 (08:00~12:00)
  noon: TimeRange & { selected: boolean }; // 점심 (12:00~14:00)
  afternoon: TimeRange & { selected: boolean }; // 오후 (14:00~18:00)
  evening: TimeRange & { selected: boolean }; // 저녁 (18:00~22:00)
  lateNight: TimeRange & { selected: boolean }; // 늦은 밤 (22:00~06:00)
}

export type AccessibilityStatus = Record<string, boolean | string | undefined>;
export interface RegisterFormState {
  userType: number;
  name: string;
  address: string;
  agreement: boolean;
  accessibilityStatus: AccessibilityStatus;
  activitySchedule: ActivitySchedule;
  sportPreference: string[];
  otherSportDescription: string;
  otherDisabilityDescription: string;

  // New fields for UserType 2
  gender?: string;
  ageGroup?: string;
  phoneNumber?: string;
  email?: string;
  location?: { lat: number; lng: number; address: string };
  roles?: string[];
  volunteerExperience?: boolean;
  volunteerActivities?: string[];
  vmsId?: string;
  assistantCertificate?: boolean;
  hourlyRate?: string;
  assistantServices?: string[];
  guardianLinkedAccount?: string;
  guardianNotifications?: boolean;
}

export interface UserState {
  userType: number;
  username: string;
  address: string;
  accessibilityStatus: AccessibilityStatus;
  activitySchedule: ActivitySchedule;
  sportPreference: string;
  otherSportDescription: string;
  otherDisabilityDescription: string;
}
