import { Module } from '@nestjs/common';
import { MediaLiteracyController } from './media-literacy.controller';
import { MediaLiteracyService } from './media-literacy.service';

@Module({
  controllers: [MediaLiteracyController],
  providers: [MediaLiteracyService],
})
export class MediaLiteracyModule {}
