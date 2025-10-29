import { AccessibilityStatus, ActivitySchedule } from '@/types/user';
import { gql } from '@apollo/client';

export const GET_TOKEN_PAYLOAD = gql`
  query TokenPayload {
    tokenPayload {
      username
      address
      accessibilityStatus
      activitySchedule
      sportPreference
      otherSportDescription
      otherDisabilityDescription
    }
  }
`;

export interface TokenPayload {
  username: string;
  address: string;
  accessibilityStatus: AccessibilityStatus;
  activitySchedule: ActivitySchedule;
  sportPreference: string;
  otherSportDescription: string;
  otherDisabilityDescription: string;
}

export interface GetTokenPayloadData {
  tokenPayload: TokenPayload;
}
