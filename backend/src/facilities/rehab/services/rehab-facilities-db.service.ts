import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RehabFacilityData } from '../types/api.types';
import { Prisma } from '@prisma/client';

@Injectable()
export class RehabFacilitiesDbService {
  private readonly logger = new Logger(RehabFacilitiesDbService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findLatest100ByCreateDate() {
    return this.prisma.rehabFacility.findMany({
      orderBy: {
        instlStatmntDe: 'desc',
      },
      take: 100,
    });
  }

  async updateRehabFacilitiesData(
    data: RehabFacilityData[],
    mapDataFunction: (
      item: RehabFacilityData,
    ) => Prisma.RehabFacilityCreateInput,
  ): Promise<void> {
    if (data.length === 0) {
      this.logger.warn('업데이트할 데이터가 없습니다.');
      return;
    }

    try {
      await this.prisma.rehabFacility.deleteMany({});
      this.logger.log('기존 재활 체육시설 데이터 삭제 완료');

      const mappedData = data.map(mapDataFunction);

      await this.prisma.rehabFacility.createMany({
        data: mappedData,
        skipDuplicates: true,
      });

      this.logger.log(
        `총 ${data.length}건의 재활 체육시설 데이터 업데이트 완료`,
      );
    } catch (error) {
      this.logger.error('데이터베이스 업데이트 실패', error);
      throw error;
    }
  }
}
