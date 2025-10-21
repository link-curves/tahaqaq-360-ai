import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Admin')
@Controller('admin/dashboard')
@UseGuards(RolesGuard)
@Roles(Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get comprehensive dashboard statistics' })
  getStats() {
    return this.dashboardService.getComprehensiveStats();
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview statistics' })
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('user-growth')
  @ApiOperation({ summary: 'Get user growth data' })
  getUserGrowth(@Query('days') days?: number) {
    return this.dashboardService.getUserGrowth(days ? +days : 30);
  }

  @Get('submission-trends')
  @ApiOperation({ summary: 'Get submission trends' })
  getSubmissionTrends(@Query('days') days?: number) {
    return this.dashboardService.getSubmissionTrends(days ? +days : 30);
  }

  @Get('top-contributors')
  @ApiOperation({ summary: 'Get top contributors' })
  getTopContributors(@Query('limit') limit?: number) {
    return this.dashboardService.getTopContributors(limit ? +limit : 10);
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent activity' })
  getRecentActivity(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentActivity(limit ? +limit : 20);
  }

  @Get('content-stats')
  @ApiOperation({ summary: 'Get content statistics' })
  getContentStats() {
    return this.dashboardService.getContentStats();
  }

  @Get('system-health')
  @ApiOperation({ summary: 'Get system health metrics' })
  getSystemHealth() {
    return this.dashboardService.getSystemHealth();
  }
}
