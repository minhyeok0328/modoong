import { Field, ObjectType, ID, Float, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  userType: number;

  @Field({ nullable: true })
  address?: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  authProvider?: string;

  @Field({ nullable: true })
  providerId?: string;

  @Field()
  agreement: boolean;

  @Field({ nullable: true })
  accessibilityStatus?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  activitySchedule?: Record<string, any>;

  @Field({ nullable: true })
  sportPreference?: string;

  @Field({ nullable: true })
  otherSportDescription?: string;

  @Field({ nullable: true })
  otherDisabilityDescription?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
