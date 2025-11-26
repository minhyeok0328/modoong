import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SportsFacilitiesPaginationInput {
  @Field(() => Int, {
    nullable: true,
    defaultValue: 0,
    description: '건너뛸 개수',
  })
  skip?: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 20,
    description: '한 페이지에 보여줄 개수',
  })
  take?: number;

  @Field(() => String, { nullable: true, description: '시설 유형으로 필터링' })
  facilityType?: string;

  @Field(() => String, {
    nullable: true,
    description: '소유 주체 필터(disability | public | sports)',
  })
  filter?: string;

  @Field(() => Int, { nullable: true, description: '최대 거리 (km 단위)' })
  maxDistance?: number;

  @Field(() => [String], { nullable: true, description: '편의시설 필터' })
  amenities?: string[];
}
