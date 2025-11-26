import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class CrawlingResult {
  @Field(() => Int)
  success: number;

  @Field(() => Int)
  total: number;

  @Field(() => [String])
  errors: string[];
}
