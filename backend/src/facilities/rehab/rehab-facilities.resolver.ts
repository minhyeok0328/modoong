import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { RehabFacilitiesService } from './rehab-facilities.service';
import { RehabFacility } from './entities/rehab-facility.entity';
import { Public } from '../../common/decorators/public.decorator';

@Resolver(() => RehabFacility)
export class RehabFacilitiesResolver {
  constructor(
    private readonly rehabFacilitiesService: RehabFacilitiesService,
  ) {}

  @Query(() => [RehabFacility], { name: 'rehabFacilities' })
  async findLatest100ByCreateDate(): Promise<RehabFacility[]> {
    return this.rehabFacilitiesService.findLatest100ByCreateDate();
  }

  @Public()
  @Mutation(() => String, {
    name: 'syncRehabFacilities',
    description: '재활 체육시설 데이터를 수동으로 동기화합니다.',
  })
  async syncRehabFacilities(): Promise<string> {
    await this.rehabFacilitiesService.manualSync();
    return '재활 체육시설 데이터 동기화가 완료되었습니다.';
  }
}
