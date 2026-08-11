import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CONTENT_STATUS } from '../../common/constants/lookups';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    // Get counts for all major entities
    const [
      factChecksCount,
      eventsCount,
      coursesCount,
      researchCount,
      usersCount,
      submissionsCount,
    ] = await Promise.all([
      this.prisma.factCheck.count({
        // FactCheck itself has no status — publication is per-article (ADR-0002).
        where: { articles: { some: { statusCode: CONTENT_STATUS.PUBLISHED } } },
      }),
      this.prisma.event.count(),
      this.prisma.course.count({ where: { isPublished: true } }),
      this.prisma.research.count({
        where: { statusCode: CONTENT_STATUS.PUBLISHED },
      }),
      this.prisma.user.count(),
      this.prisma.submission.count(),
    ]);

    // Get total enrollments
    const enrollmentsCount = await this.prisma.courseProgress.count();

    // Get total event registrations
    const eventRegistrationsCount = await this.prisma.eventRegistration.count();

    return {
      success: true,
      data: {
        factChecks: factChecksCount,
        events: eventsCount,
        courses: coursesCount,
        research: researchCount,
        users: usersCount,
        submissions: submissionsCount,
        enrollments: enrollmentsCount,
        eventRegistrations: eventRegistrationsCount,
      },
    };
  }
}
