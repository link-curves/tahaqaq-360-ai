import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, SubmissionStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateSubmissionDto,
  UpdateSubmissionStatusDto,
} from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateSubmissionDto) {
    const submission = await this.prisma.submission.create({
      data: {
        ...createDto,
        submitterId: userId,
      },
      include: {
        submitter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Award points for submission
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: { increment: 10 },
        reputation: { increment: 1 },
      },
    });

    // Create notification for moderators
    const moderators = await this.prisma.user.findMany({
      where: {
        role: { in: [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN] },
      },
      select: { id: true },
    });

    await this.prisma.notification.createMany({
      data: moderators.map((mod) => ({
        userId: mod.id,
        type: 'SUBMISSION_UPDATE',
        title: 'New Submission',
        message: `A new ${createDto.type.toLowerCase()} submission needs review`,
        actionUrl: `/admin/submissions/${submission.id}`,
      })),
    });

    return submission;
  }

  async findAll(
    paginationDto: PaginationDto,
    status?: SubmissionStatus,
    type?: string,
    userId?: string,
  ) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (userId) where.submitterId = userId;

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          submitter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          factCheck: {
            select: {
              id: true,
              title: true,
              slug: true,
              verdict: true,
            },
          },
          moderationLogs: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              moderator: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.submission.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: submissions,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string, userId?: string, userRole?: Role) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        submitter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        factCheck: true,
        moderationLogs: {
          orderBy: { createdAt: 'desc' },
          include: {
            moderator: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check permissions
    const isModerator =
      userRole && ['MODERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(userRole);
    const isOwner = userId && submission.submitterId === userId;

    if (!isModerator && !isOwner) {
      throw new ForbiddenException(
        'You do not have permission to view this submission',
      );
    }

    return submission;
  }

  async updateStatus(
    id: string,
    moderatorId: string,
    updateDto: UpdateSubmissionStatusDto,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: { submitter: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Update submission
    const updated = await this.prisma.submission.update({
      where: { id },
      data: {
        status: updateDto.status as SubmissionStatus,
        internalNotes: updateDto.internalNotes,
        rejectionReason: updateDto.rejectionReason,
        reviewedBy: moderatorId,
        reviewedAt: new Date(),
      },
      include: {
        submitter: true,
        factCheck: true,
      },
    });

    // Create moderation log
    await this.prisma.moderationLog.create({
      data: {
        action: updateDto.status === 'REJECTED' ? 'REJECT' : 'APPROVE',
        reason: updateDto.rejectionReason,
        notes: updateDto.internalNotes,
        moderatorId,
        submissionId: id,
      },
    });

    // Notify submitter
    await this.prisma.notification.create({
      data: {
        userId: submission.submitterId,
        type: 'SUBMISSION_UPDATE',
        title: 'Submission Status Updated',
        message: `Your submission has been ${updateDto.status.toLowerCase()}`,
        actionUrl: `/submissions/${id}`,
      },
    });

    // Award bonus points if verified
    if (updateDto.status === 'VERIFIED') {
      await this.prisma.user.update({
        where: { id: submission.submitterId },
        data: {
          totalPoints: { increment: 50 },
          reputation: { increment: 5 },
        },
      });
    }

    return updated;
  }

  async getMySubmissions(userId: string, paginationDto: PaginationDto) {
    return this.findAll(paginationDto, undefined, undefined, userId);
  }

  async getStats() {
    const [total, byStatus, byType, recentCount] = await Promise.all([
      this.prisma.submission.count(),
      this.prisma.submission.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.submission.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.submission.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      total,
      recentCount,
      byStatus: byStatus.reduce((acc: Record<string, number>, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
      byType: byType.reduce((acc: Record<string, number>, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
    };
  }

  async assignPriority(id: string, priority: number) {
    return this.prisma.submission.update({
      where: { id },
      data: { priority },
    });
  }

  async deleteSubmission(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return this.prisma.submission.delete({
      where: { id },
    });
  }
}
