import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DisabilityTypeModel {
  @Field(() => Int)
  id: number;

  @Field()
  code: string;

  @Field()
  name: string;
}
