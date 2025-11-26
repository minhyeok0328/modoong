import { ObjectType, Field, Float } from '@nestjs/graphql';

/**
 * GeoJSON Point 타입(GraphQL용) 공통 정의
 * 모든 도메인 스키마에서 import 하여 중복 타입 생성 방지.
 */
@ObjectType()
export class GeoJsonPoint {
  @Field(() => String)
  type: 'Point';

  @Field(() => [Float])
  coordinates: [number, number]; // [경도, 위도] 순서
}
