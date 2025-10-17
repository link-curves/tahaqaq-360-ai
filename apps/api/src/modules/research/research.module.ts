import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';

@Module({
  imports: [PrismaModule],
  controllers: [ResearchController],
  providers: [ResearchService],
})
export class ResearchModule {}
