import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { DisabilitySportsFacility } from '../../disability-sports/entities/disability-sports-facility.entity';

@ObjectType()
export class SportsFacility {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  facltCdEncptVl?: string | null;

  // 좌표 정보가 없는 시설도 있으므로 nullable 설정
  @Field(() => Float, { nullable: true })
  refineWgs84Lat?: number | null;

  @Field(() => Float, { nullable: true })
  refineWgs84Logt?: number | null;

  @Field(() => Float, {
    nullable: true,
    description: '사용자로부터의 거리 (km)',
  })
  distance?: number;

  @Field(() => String, { nullable: true })
  facltDivNm?: string | null;

  @Field(() => String, { nullable: true })
  indutypeNm?: string | null;

  @Field(() => String, { nullable: true })
  facltTypeNm?: string | null;

  @Field(() => String, { nullable: true })
  facltTelno?: string | null;

  @Field(() => String, { nullable: true })
  sidoNm?: string | null;

  @Field(() => String, { nullable: true })
  signguNm?: string | null;

  @Field(() => String, { nullable: true })
  refineRoadnmAddr?: string | null;

  @Field(() => String, { nullable: true })
  siDesc?: string | null;

  @Field(() => String, { nullable: true })
  facltStateNm?: string | null;

  @Field(() => String, { nullable: true })
  facltHmpgAddr?: string | null;

  @Field(() => String, { nullable: true })
  facltOpertFormCd?: string | null;

  @Field(() => String, { nullable: true })
  posesnMainbdNm?: string | null;

  @Field(() => String, { nullable: true })
  posesnMainbdSidoNm?: string | null;

  @Field(() => String, { nullable: true })
  posesnMainbdSignguNm?: string | null;

  @Field(() => String, { nullable: true })
  chrgpsnDeptNm?: string | null;

  @Field(() => String, { nullable: true })
  facltMangrTelno?: string | null;

  @Field(() => String, { nullable: true })
  inoutdrDivNm?: string | null;

  @Field(() => String, { nullable: true })
  audtrmSeatCnt?: string | null;

  @Field(() => String, { nullable: true })
  audtrmAceptncPsncnt?: string | null;

  @Field(() => String, { nullable: true })
  facltTotAr?: string | null;

  @Field(() => String, { nullable: true })
  livelhOpenpublYn?: string | null;

  @Field(() => String, { nullable: true })
  livelhGymNm?: string | null;

  @Field(() => String, { nullable: true })
  utlzGrpNm?: string | null;

  @Field(() => String, { nullable: true })
  facltCreatStdDe?: string | null;

  @Field(() => String, { nullable: true })
  registStatmntDe?: string | null;

  @Field(() => String, { nullable: true })
  compltnDe?: string | null;

  @Field(() => String, { nullable: true })
  suspnbizDe?: string | null;

  @Field(() => String, { nullable: true })
  clsbizDe?: string | null;

  @Field(() => String, { nullable: true })
  nationPhstrnFacltYn?: string | null;

  @Field(() => String, { nullable: true })
  qukprfDesignYn?: string | null;

  @Field(() => String, { nullable: true })
  selfctrlCheckTargetYn?: string | null;

  @Field(() => String, { nullable: true })
  registDtm?: string | null;

  @Field(() => String, { nullable: true })
  updDtm?: string | null;

  @Field(() => String, { nullable: true })
  refineLotnoAddr?: string | null;

  @Field(() => String, { nullable: true })
  refineZipno?: string | null;

  @Field(() => String, { nullable: true, description: '시설 대표 이미지 URL' })
  imageSrc?: string | null;

  @Field(() => String, {
    nullable: true,
    description: '네이버 지도 거리뷰 URL',
  })
  streetViewUrl?: string | null;

  @Field(() => String, {
    nullable: true,
    description: '거리뷰 미리보기 이미지 (Base64)',
  })
  streetViewPreview?: string | null;

  @Field(() => [String], { nullable: true, description: '시설 편의시설 목록' })
  amenities?: string[] | null;

  @Field(() => String, {
    nullable: true,
    description: '장애인체육시설 이미지 (Base64)',
  })
  facilityImageBase64?: string | null;

  @Field(() => DisabilitySportsFacility, {
    nullable: true,
    description: '연관된 장애인체육시설 정보',
  })
  disabilitySportsFacility?: DisabilitySportsFacility | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
