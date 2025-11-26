import { Module } from '@nestjs/common';
import { SportsFacilitiesModule } from './sports/sports-facilities.module';
import { RehabFacilitiesModule } from './rehab/rehab-facilities.module';

@Module({
  imports: [SportsFacilitiesModule, RehabFacilitiesModule],
})
export class FacilitiesModule {}
