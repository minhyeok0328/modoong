import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class TokenPayload {
  @Field()
  sub: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  address?: string;

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

  @Field()
  userType: number;
}
