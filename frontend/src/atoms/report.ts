import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export interface ReportData {
    facilityId: string;
    // Basic Info
    location: string;
    facilityType: string;
    operatingHoursStart: string;
    operatingHoursEnd: string;
    operatingDays: string;
    fee: string;
    discount: string;
    notice: string;

    // Accessibility Info
    stairHeight: string;
    stairCount: string;
    hasEntrancePhoto: boolean; // Actual photo stored in IDB
    disabledToilet: boolean;
    disabledParking: boolean;
    elevator: boolean;
    ramp: boolean;
    wheelchairRental: boolean;
    brailleSign: boolean;
    audioGuide: boolean;
    otherAccessibility: string;
}

export const defaultReportData: Omit<ReportData, 'facilityId'> = {
    location: '',
    facilityType: '',
    operatingHoursStart: '',
    operatingHoursEnd: '',
    operatingDays: '',
    fee: '',
    discount: '',
    notice: '',
    stairHeight: '',
    stairCount: '',
    hasEntrancePhoto: false,
    disabledToilet: false,
    disabledParking: false,
    elevator: false,
    ramp: false,
    wheelchairRental: false,
    brailleSign: false,
    audioGuide: false,
    otherAccessibility: '',
};

// LocalStorage for reports (excluding image)
const localJSONStorage = createJSONStorage<Record<string, ReportData>>(() => localStorage);

export const reportsAtom = atomWithStorage<Record<string, ReportData>>(
    'facilityReports',
    {},
    localJSONStorage
);

// Popup State
export const reportPopupStateAtom = atom<{
    isOpen: boolean;
    facilityId: string | null;
}>({
    isOpen: false,
    facilityId: null,
});

// Form State (Temporary)
export const reportFormAtom = atom<ReportData>({
    facilityId: '',
    ...defaultReportData,
});
