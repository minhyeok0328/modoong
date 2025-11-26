import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthToken {
  @Field(() => Boolean)
  success: boolean;
}
