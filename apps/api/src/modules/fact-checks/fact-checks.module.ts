import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { FactChecksController } from './fact-checks.controller';
import { FactChecksAuthoringService } from './fact-checks-authoring.service';
import { FactChecksService } from './fact-checks.service';

@Module({
  imports: [PrismaModule],
  controllers: [FactChecksController],
  providers: [FactChecksService, FactChecksAuthoringService],
  exports: [FactChecksService, FactChecksAuthoringService],
})
export class FactChecksModule {}