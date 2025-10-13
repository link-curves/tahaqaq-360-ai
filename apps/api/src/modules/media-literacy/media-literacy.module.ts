import { Module } from '@nestjs/common';
import { Media-literacyService } from './media-literacy.service';
import { Media-literacyController } from './media-literacy.controller';

@Module({
  controllers: [Media-literacyController],
  providers: [Media-literacyService],
})
export class Media-literacyModule {}
