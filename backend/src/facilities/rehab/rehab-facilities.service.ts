import { Injectable, Logger } from '@nestjs/common';
import { RehabFacilitiesApiService } from './services/rehab-facilities-api.service';
import { RehabFacilitiesDbService } from './services/rehab-facilities-db.service';
import { RehabFacility } from '@prisma/client';

@Injectable()
export class RehabFacilitiesService {
  private readonly logger = new Logger(RehabFacilitiesService.name);

  constructor(
    private readonly apiService: RehabFacilitiesApiService,
    private readonly dbService: RehabFacilitiesDbService,
  ) {}

  /**
   * 최신 설치신고일 기준 100건 조회
   */
  async findLatest100ByCreateDate(): Promise<RehabFacility[]> {
    return this.dbService.findLatest100ByCreateDate();
  }

  async syncRehabFacilities(): Promise<void> {
    this.logger.log('재활 체육시설 데이터 동기화 시작');
    try {
      const allData = await this.apiService.fetchAllRehabFacilities();
      await this.dbService.updateRehabFacilitiesData(
        allData,
        this.apiService.mapApiDataToSchema.bind(this.apiService),
      );
      this.logger.log(
        `재활 체육시설 데이터 동기화 완료. 총 ${allData.length}건 처리`,
      );
    } catch (error) {
      this.logger.error('재활 체육시설 데이터 동기화 실패', error);
    }
  }

  /**
   * 수동 동기화
   */
  async manualSync(): Promise<void> {
    await this.syncRehabFacilities();
  }
}
