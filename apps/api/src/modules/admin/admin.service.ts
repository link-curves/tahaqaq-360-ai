import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { PrismaService } from '../../database/prisma.service';
import { RoleCode } from '../../common/constants/lookups';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // USER MANAGEMENT
  // ============================================
  async getAllUsers(paginationDto: PaginationDto, role?: RoleCode, search?: string) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
          role: true,
          reputation: true,
          totalPoints: true,
          level: true,
          isEmailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              submissions: true,
              factChecks: true,
              eventRegistrations: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateUserRole(userId: string, role: RoleCode) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async banUser(userId: string, reason: string) {
    // In a real app, you'd have a 'banned' field
    await this.prisma.activityLog.create({
      data: {
        action: 'USER_BANNED',
        entity: 'user',
        entityId: userId,
        metadata: { reason },
        userId,
      },
    });

    return { message: 'User banned successfully' };
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }

  // ============================================
  // CONTENT MODERATION
  // ============================================
  async getPendingContent() {
    const [submissions, factChecks] = await Promise.all([
      this.prisma.submission.findMany({
        where: { status: 'PENDING' },
        take: 10,
        orderBy: { priority: 'desc' },
        include: {
          submitter: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.factCheck.findMany({
        where: { statusCode: 'UNDER_REVIEW' },
        take: 10,
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return { submissions, factChecks };
  }

  async getContactMessages(paginationDto: PaginationDto, status?: string) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [messages, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        where,
        skip,
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
      }),
      this.prisma.contactMessage.count({ where }),
    ]);

    return {
      data: messages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async respondToContact(messageId: string, adminId: string, response: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.contactMessage.update({
      where: { id: messageId },
      data: {
        status: 'RESOLVED',
        response,
        respondedAt: new Date(),
        respondedBy: adminId,
      },
    });
  }

  // ============================================
  // SETTINGS & CONFIGURATION
  // ============================================
  async getSystemSettings() {
    // In a real app, you'd store these in the database
  
    return {
      maintenance: {
        enabled: false,
        message: '',
      },
      features: {
        userRegistration: true,
        submissions: true,
        events: true,
      },
      limits: {
        maxSubmissionsPerDay: 5,
        maxFileSize: 10485760, // 10MB
      },
    };
  }

  async updateSystemSettings(settings: any) {
    // Store settings in database
    return settings;
  }
}
