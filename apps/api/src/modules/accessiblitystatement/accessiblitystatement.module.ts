import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AccessibilityStatementController } from './accessiblitystatement.controller';
import { AccessibilityStatementService } from './accessiblitystatement.service';

@Module({
  imports: [PrismaModule],
  controllers: [AccessibilityStatementController],
  providers: [AccessibilityStatementService],
})
export class AccessibilityStatementModule {}
