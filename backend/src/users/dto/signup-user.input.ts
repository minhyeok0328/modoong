import { InputType, Field, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ActivityScheduleInput } from './activity-schedule.input';

@InputType()
export class LocationInput {
  @Field(() => Number)
  lat: number;

  @Field(() => Number)
  lng: number;

  @Field()
  address: string;
}

@InputType()
export class SignUpUserInput {
  @Field()
  name: string;

  @Field(() => Int)
  userType: number;

  @Field()
  address: string;

  @Field()
  agreement: boolean;

  @Field(() => GraphQLJSONObject)
  accessibilityStatus: Record<string, boolean>;

  @Field(() => ActivityScheduleInput)
  activitySchedule: ActivityScheduleInput;

  @Field(() => [String])
  sportPreference: string[];

  @Field({ nullable: true })
  otherSportDescription?: string;

  @Field({ nullable: true })
  @Field({ nullable: true })
  otherDisabilityDescription?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  ageGroup?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => LocationInput, { nullable: true })
  location?: LocationInput;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field({ nullable: true })
  volunteerExperience?: boolean;

  @Field({ nullable: true })
  vmsId?: string;

  @Field({ nullable: true })
  assistantCertificate?: boolean;

  @Field({ nullable: true })
  hourlyRate?: string;

  @Field({ nullable: true })
  guardianNotifications?: boolean;

  @Field({ nullable: true })
  guardianLinkedAccount?: string;

  @Field(() => [String], { nullable: true })
  assistantServices?: string[];

  @Field(() => [String], { nullable: true })
  volunteerActivities?: string[];
}
