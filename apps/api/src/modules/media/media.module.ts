import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [PrismaModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
