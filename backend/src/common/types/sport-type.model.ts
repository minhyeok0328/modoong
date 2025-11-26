import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SportTypeModel {
  @Field(() => Int)
  id: number;

  @Field()
  code: string;

  @Field()
  name: string;
}
