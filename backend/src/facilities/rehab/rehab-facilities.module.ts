import { Module } from '@nestjs/common';
import { RehabFacilitiesService } from './rehab-facilities.service';
import { RehabFacilitiesResolver } from './rehab-facilities.resolver';
import { RehabFacilitiesApiService } from './services/rehab-facilities-api.service';
import { RehabFacilitiesDbService } from './services/rehab-facilities-db.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    RehabFacilitiesService,
    RehabFacilitiesResolver,
    RehabFacilitiesApiService,
    RehabFacilitiesDbService,
  ],
})
export class RehabFacilitiesModule {}
