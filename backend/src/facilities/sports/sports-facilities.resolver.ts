import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { SportsFacilitiesService } from './sports-facilities.service';
import { SportsFacility } from './entities/sports-facility.entity';
import { Public } from '../../common/decorators/public.decorator';
import { SportsFacilitiesPaginationInput } from './dto/sports-facilities-pagination.input';
import { SportsFacilitiesPaginationOutput } from './dto/sports-facilities-pagination.output';
import {
  CurrentUser,
  CurrentUserType,
} from '../../common/decorators/current-user.decorator';
import { NaverMapCrawlingService } from './services/naver-map-crawling.service';
import { CrawlingResult } from './types/crawling.types';
import { KspoVoucherCrawlingService } from '../disability-sports/services/kspo-voucher-crawling.service';

@Resolver(() => SportsFacility)
export class SportsFacilitiesResolver {
  constructor(
    private readonly sportsFacilitiesService: SportsFacilitiesService,
    private readonly naverMapCrawlingService: NaverMapCrawlingService,
    private readonly kspoVoucherCrawlingService: KspoVoucherCrawlingService,
  ) {}

  @Query(() => [SportsFacility], { name: 'sportsFacilities' })
  async findLatest100ByCreateDate(): Promise<SportsFacility[]> {
    return (await this.sportsFacilitiesService.findLatest100ByCreateDate()) as unknown as SportsFacility[];
  }

  @Query(() => SportsFacility, {
    name: 'sportsFacility',
    description: '체육시설 ID로 상세 정보를 조회합니다.',
    nullable: true,
  })
  async findById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<SportsFacility | null> {
    return (await this.sportsFacilitiesService.findById(
      id,
    )) as unknown as SportsFacility | null;
  }

  @Query(() => [SportsFacility], { name: 'nearbySportsFacilities' })
  async findNearbyFacilities(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('maxDistance', { type: () => Float, nullable: true })
    maxDistance?: number,
    @Args('limit', { type: () => Float, nullable: true }) limit?: number,
    @Args('facilityType', { nullable: true }) facilityType?: string,
  ): Promise<SportsFacility[]> {
    return (await this.sportsFacilitiesService.findNearbyFacilities(
      latitude,
      longitude,
      maxDistance,
      limit,
      facilityType,
    )) as unknown as SportsFacility[];
  }

  @Query(() => SportsFacilitiesPaginationOutput, {
    name: 'nearbySportsFacilitiesForUser',
    description:
      '로그인한 사용자 위치 기준 가장 가까운 체육시설 목록을 페이징으로 반환합니다.',
  })
  async findNearbyFacilitiesForUser(
    @CurrentUser() currentUser: CurrentUserType,
    @Args('paginationInput') paginationInput: SportsFacilitiesPaginationInput,
  ): Promise<SportsFacilitiesPaginationOutput> {
    return this.sportsFacilitiesService.findNearbyFacilitiesForUser(
      currentUser.sub,
      paginationInput,
    );
  }

  @Public()
  @Query(() => [String], {
    name: 'sportsFacilityTypes',
    description: '체육시설 유형 목록을 반환합니다.',
  })
  async sportsFacilityTypes(): Promise<string[]> {
    return this.sportsFacilitiesService.getAllFacilityTypes();
  }

  @Query(() => [String], {
    name: 'sportsFacilityAmenities',
    description: '체육시설 시설 편의 시설 목록을 반환합니다.',
  })
  async sportsFacilityAmenities(): Promise<string[]> {
    return this.sportsFacilitiesService.getAllAmenityTypes();
  }

  @Public()
  @Mutation(() => String, {
    name: 'syncSportsFacilities',
    description: '체육시설 데이터를 수동으로 동기화합니다.',
  })
  async syncSportsFacilities(): Promise<string> {
    await this.sportsFacilitiesService.manualSync();
    return '체육시설 데이터 동기화가 완료되었습니다.';
  }

  @Public()
  @Mutation(() => CrawlingResult, {
    name: 'crawlSportsFacilities',
    description: '네이버 지도에서 체육시설 데이터를 크롤링합니다.',
  })
  async crawlSportsFacilities(): Promise<CrawlingResult> {
    return this.naverMapCrawlingService.crawlAllFacilities();
  }

  @Public()
  @Mutation(() => CrawlingResult, {
    name: 'crawlDisabilitySportsFacilities',
    description: 'KSPO 장애인스포츠강좌이용권 시설 데이터를 크롤링합니다.',
  })
  async crawlDisabilitySportsFacilities(): Promise<CrawlingResult> {
    return this.kspoVoucherCrawlingService.crawlAllFacilities();
  }
}
