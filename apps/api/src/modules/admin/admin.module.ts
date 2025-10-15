import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController, DashboardController],
  providers: [AdminService, DashboardService],
  exports: [AdminService],
})
export class AdminModule {}