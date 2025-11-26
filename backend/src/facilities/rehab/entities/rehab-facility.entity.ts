import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class RehabFacility {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: '시군코드' })
  sigunCd: string;

  @Field(() => String, { description: '시군명' })
  sigunNm: string;

  @Field(() => String, { description: '기관명' })
  instNm: string;

  @Field(() => String, { description: '전화번호', nullable: true })
  telno?: string | null;

  @Field(() => String, { description: '홈페이지 URL', nullable: true })
  hmpgUrl?: string | null;

  @Field(() => String, { description: '설치신고일', nullable: true })
  instlStatmntDe?: string | null;

  @Field(() => String, { description: '소재지 지번 주소', nullable: true })
  refineLotnoAddr?: string | null;

  @Field(() => String, { description: '소재지 도로명 주소', nullable: true })
  refineRoadnmAddr?: string | null;

  @Field(() => String, { description: '소재지 우편번호', nullable: true })
  refineZipCd?: string | null;

  @Field(() => Float, { description: 'WGS84 위도' })
  refineWgs84Lat: number;

  @Field(() => Float, { description: 'WGS84 경도' })
  refineWgs84Logt: number;

  @Field(() => Date, { description: '생성일시' })
  createdAt: Date;

  @Field(() => Date, { description: '수정일시' })
  updatedAt: Date;
}
