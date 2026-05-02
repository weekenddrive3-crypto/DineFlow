import { Module } from '@nestjs/common';
import { KotsService } from './kots.service';
import { KotsController } from './kots.controller';

@Module({
  controllers: [KotsController],
  providers: [KotsService],
  exports: [KotsService],
})
export class KotsModule {}
