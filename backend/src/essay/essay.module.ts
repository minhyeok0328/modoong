import { Module } from '@nestjs/common';
import { EssayService } from './essay.service';
import { EssayResolver } from './essay.resolver';

@Module({
  providers: [EssayService, EssayResolver],
  exports: [EssayService],
})
export class EssayModule {}