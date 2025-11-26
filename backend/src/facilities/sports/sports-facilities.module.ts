import { Module } from '@nestjs/common';
import { SportsFacilitiesService } from './sports-facilities.service';
import { SportsFacilitiesResolver } from './sports-facilities.resolver';
import { SportsFacilitiesApiService } from './services/sports-facilities-api.service';
import { SportsFacilitiesDbService } from './services/sports-facilities-db.service';
import { NaverMapCrawlingService } from './services/naver-map-crawling.service';
import { KspoVoucherCrawlingService } from '../disability-sports/services/kspo-voucher-crawling.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [],
  providers: [
    SportsFacilitiesService,
    SportsFacilitiesResolver,
    SportsFacilitiesApiService,
    SportsFacilitiesDbService,
    NaverMapCrawlingService,
    KspoVoucherCrawlingService,
  ],
})
export class SportsFacilitiesModule {}
