import { Injectable } from '@nestjs/common';
import { ContentStatus, SubmissionStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersThisMonth,
      totalFactChecks,
      publishedFactChecks,
      totalSubmissions,
      pendingSubmissions,
      totalEvents,
      upcomingEvents,
      totalCertificates,
      activeUsers,
    ] = await Promise.all([
      // Users
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Fact Checks
      this.prisma.factCheck.count(),
      this.prisma.factCheck.count({
        where: { status: ContentStatus.PUBLISHED },
      }),

      // Submissions
      this.prisma.submission.count(),
      this.prisma.submission.count({
        where: { status: SubmissionStatus.PENDING },
      }),

      // Events
      this.prisma.event.count(),
      this.prisma.event.count({
        where: {
          startDate: { gte: now },
          status: 'UPCOMING',
        },
      }),

      // Certificates
      this.prisma.certificate.count(),

      // Active users (logged in last 7 days)
      this.prisma.user.count({
        where: { lastLoginAt: { gte: sevenDaysAgo } },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        active: activeUsers,
      },
      factChecks: {
        total: totalFactChecks,
        published: publishedFactChecks,
        draft: totalFactChecks - publishedFactChecks,
      },
      submissions: {
        total: totalSubmissions,
        pending: pendingSubmissions,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
      },
      certificates: {
        total: totalCertificates,
      },
    };
  }

  async getUserGrowth(days: number = 30) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const groupedData = users.reduce((acc, user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedData).map(([date, count]) => ({
      date,
      count,
    }));
  }

  async getSubmissionTrends(days: number = 30) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const submissions = await this.prisma.submission.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { createdAt: true, status: true },
    });

    const groupedData = submissions.reduce((acc, submission) => {
      const date = submission.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { pending: 0, verified: 0, rejected: 0 };
      }
      if (submission.status === SubmissionStatus.PENDING) acc[date].pending++;
      if (submission.status === SubmissionStatus.VERIFIED) acc[date].verified++;
      if (submission.status === SubmissionStatus.REJECTED) acc[date].rejected++;
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(groupedData).map(([date, counts]) => ({
      date,
      ...counts,
    }));
  }

  async getTopContributors(limit: number = 10) {
    const users = await this.prisma.user.findMany({
      orderBy: [
        { reputation: 'desc' },
        { totalPoints: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        reputation: true,
        totalPoints: true,
        level: true,
        _count: {
          select: {
            factChecks: true,
            submissions: true,
            comments: true,
          },
        },
      },
    });

    return users;
  }

  async getRecentActivity(limit: number = 20) {
    const activities = await this.prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return activities;
  }

  async getContentStats() {
    const [factChecksByVerdict, submissionsByType, eventsByType] =
      await Promise.all([
        this.prisma.factCheck.groupBy({
          by: ['verdict'],
          where: { status: ContentStatus.PUBLISHED },
          _count: true,
        }),
        this.prisma.submission.groupBy({
          by: ['type'],
          _count: true,
        }),
        this.prisma.event.groupBy({
          by: ['type'],
          _count: true,
        }),
      ]);

    return {
      factChecksByVerdict: factChecksByVerdict.reduce((acc: Record<string, number>, item) => {
        acc[item.verdict] = item._count;
        return acc;
      }, {}),
      submissionsByType: submissionsByType.reduce((acc: Record<string, number>, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
      eventsByType: eventsByType.reduce((acc: Record<string, number>, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
    };
  }

  async getSystemHealth() {
    const dbHealthy = await this.prisma.healthCheck();
    
    const [
      avgResponseTime,
      errorRate,
      totalRequests,
    ] = await Promise.all([
      // These would come from your logging system
      Promise.resolve(120), // ms
      Promise.resolve(0.5), // %
      Promise.resolve(15230),
    ]);

    return {
      database: {
        status: dbHealthy ? 'healthy' : 'unhealthy',
        responseTime: 45, // ms
      },
      api: {
        avgResponseTime,
        errorRate,
        totalRequests,
      },
      storage: {
        used: '2.3 GB',
        total: '10 GB',
        percentage: 23,
      },
    };
  }
}
