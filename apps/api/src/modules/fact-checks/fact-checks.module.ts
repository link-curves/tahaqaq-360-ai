import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { FactChecksController } from './fact-checks.controller';
import { FactChecksService } from './fact-checks.service';

@Module({
  imports: [PrismaModule],
  controllers: [FactChecksController],
  providers: [FactChecksService],
  exports: [FactChecksService],
})
export class FactChecksModule {}