import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class DisabilitySportsFacility {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  bizrno: string;

  @Field(() => String)
  facilityName: string;

  @Field(() => String, { nullable: true })
  facilityOwner?: string | null;

  @Field(() => String, { nullable: true })
  facilityPhone?: string | null;

  @Field(() => String)
  facilityAddress: string;

  @Field(() => Float, { nullable: true })
  latitude?: number | null;

  @Field(() => Float, { nullable: true })
  longitude?: number | null;

  @Field(() => String, { nullable: true })
  vehicleSupport?: string | null;

  @Field(() => String, { nullable: true })
  disabilitySupport?: string | null;

  @Field(() => String, { nullable: true })
  facilityImageBase64?: string | null;

  @Field(() => [GraphQLJSONObject], { nullable: true })
  courseInfo?: any[] | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
