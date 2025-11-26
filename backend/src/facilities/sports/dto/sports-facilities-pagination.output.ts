import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SportsFacility } from '../entities/sports-facility.entity';

@ObjectType()
export class SportsFacilitiesPaginationOutput {
  @Field(() => [SportsFacility], { description: '체육시설 목록' })
  facilities: SportsFacility[];

  @Field(() => Int, { description: '총 개수' })
  totalCount: number;

  @Field(() => Boolean, { description: '다음 페이지가 있는지 여부' })
  hasNext: boolean;

  @Field(() => Boolean, { description: '이전 페이지가 있는지 여부' })
  hasPrevious: boolean;
}
