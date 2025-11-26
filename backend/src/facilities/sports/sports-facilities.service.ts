import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SportsFacility } from '@prisma/client';
import { SportsFacilitiesApiService } from './services/sports-facilities-api.service';
import { SportsFacilitiesDbService } from './services/sports-facilities-db.service';
import { SportsFacilitiesPaginationInput } from './dto/sports-facilities-pagination.input';
import { SportsFacilitiesPaginationOutput } from './dto/sports-facilities-pagination.output';
import { UsersService } from '../../users/users.service';
import { BASE_LAT, BASE_LNG } from '../../common/utils/geocoding.util';

@Injectable()
export class SportsFacilitiesService {
  private readonly logger = new Logger(SportsFacilitiesService.name);

  constructor(
    private readonly apiService: SportsFacilitiesApiService,
    private readonly dbService: SportsFacilitiesDbService,
    private readonly usersService: UsersService,
  ) {}

  async findLatest100ByCreateDate(): Promise<SportsFacility[]> {
    return this.dbService.findLatest100ByCreateDate();
  }

  async findById(id: string): Promise<SportsFacility | null> {
    return this.dbService.findById(id);
  }

  async findNearbyFacilities(
    latitude: number,
    longitude: number,
    maxDistance: number = 5000, // 5km
    limit: number = 20,
    facilityType?: string,
  ): Promise<SportsFacility[]> {
    return this.dbService.findNearbyFacilities(
      latitude,
      longitude,
      maxDistance,
      limit,
      facilityType,
    );
  }

  async findFacilitiesByRegion(
    sidoName: string,
    signguName?: string,
    facilityType?: string,
    limit: number = 50,
  ): Promise<SportsFacility[]> {
    return this.dbService.findFacilitiesByRegion(
      sidoName,
      signguName,
      facilityType,
      limit,
    );
  }

  async findNearbyFacilitiesWithDistance(
    latitude: number,
    longitude: number,
    maxDistance: number = 5000,
    limit: number = 20,
  ): Promise<Array<SportsFacility & { distance?: number }>> {
    return this.dbService.findNearbyFacilitiesWithDistance(
      latitude,
      longitude,
      maxDistance,
      limit,
    );
  }

  async findNearbyFacilitiesForUser(
    userId: string,
    paginationInput: SportsFacilitiesPaginationInput,
  ): Promise<SportsFacilitiesPaginationOutput> {
    // 사용자 정보 조회
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (!user.latitude || !user.longitude) {
      throw new Error('사용자의 위치 정보가 없습니다.');
    }

    const {
      skip = 0,
      take = 20,
      facilityType,
      filter,
      amenities,
    } = paginationInput;
    const { maxDistance } = paginationInput;
    const baseLat = BASE_LAT;
    const baseLng = BASE_LNG;
    const { facilities, totalCount } =
      await this.dbService.findNearbyFacilitiesWithPagination(
        baseLat,
        baseLng,
        skip,
        take,
        facilityType,
        filter,
        maxDistance,
        amenities,
      );

    return {
      facilities: facilities as unknown as any[],
      totalCount,
      hasNext: skip + take < totalCount,
      hasPrevious: skip > 0,
    };
  }

  async getAllFacilityTypes(): Promise<string[]> {
    return this.dbService.getAllFacilityTypes();
  }

  async getAllAmenityTypes(): Promise<string[]> {
    return this.dbService.getAllAmenityTypes();
  }

  @Cron('0 4 * * *', {
    name: 'sports-facilities-sync',
    timeZone: 'Asia/Seoul',
  })
  async syncSportsFacilities() {
    this.logger.log('체육시설 데이터 동기화 시작');

    try {
      let totalProcessed = 0;

      await this.apiService.fetchAllSportsFacilities(async (pageData) => {
        await this.dbService.insertSportsFacilitiesPage(
          pageData,
          this.apiService.mapApiDataToSchema.bind(this.apiService),
        );
        totalProcessed += pageData.length;

        // 새로운 시설 수는 로그를 통해 추적 (정확한 계산을 위해서는 insertSportsFacilitiesPage에서 반환값 필요)
        this.logger.log(
          `현재까지 ${totalProcessed}건의 체육시설 데이터 처리됨`,
        );
      });

      this.logger.log(
        `체육시설 데이터 동기화 완료. 총 ${totalProcessed}건 처리 (기존 데이터는 중복 체크를 통해 유지)`,
      );
    } catch (error) {
      this.logger.error('체육시설 데이터 동기화 실패', error);
    }
  }

  async manualSync(): Promise<void> {
    await this.syncSportsFacilities();
  }
}
