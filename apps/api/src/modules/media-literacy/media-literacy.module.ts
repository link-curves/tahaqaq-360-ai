import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { MediaLiteracyController } from './media-literacy.controller';
import { MediaLiteracyService } from './media-literacy.service';

@Module({
  imports: [PrismaModule],
  controllers: [MediaLiteracyController],
  providers: [MediaLiteracyService],
})
export class MediaLiteracyModule {}
