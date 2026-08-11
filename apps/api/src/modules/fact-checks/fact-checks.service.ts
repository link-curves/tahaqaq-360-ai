import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { createSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateFactCheckDto,
  FactCheckFilterDto,
  UpdateFactCheckDto,
} from './dto/create-fact-check.dto';
import { CONTENT_STATUS, RoleCode } from '../../common/constants/lookups';

@Injectable()
export class FactChecksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateFactCheckDto) {
    const slug = createSlug(createDto.title);

    const factCheck = await this.prisma.factCheck.create({
      data: {
        ...createDto,
        slug,
        authorId: userId,
        publishedAt:
          createDto.status === CONTENT_STATUS.PUBLISHED ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return factCheck;
  }

  async findAll(paginationDto: PaginationDto, filterDto: FactCheckFilterDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.FactCheckWhereInput = {};

    if (filterDto.verdict) {
      where.verdictCode = filterDto.verdict;
    }

    if (filterDto.status) {
      where.statusCode = filterDto.statusCode;
    } else {
      // Default to published for public
      where.statusCode = CONTENT_STATUS.PUBLISHED;
    }

    if (filterDto.search) {
      where.OR = [
        { title: { contains: filterDto.search, mode: 'insensitive' } },
        { claim: { contains: filterDto.search, mode: 'insensitive' } },
        { summary: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    if (filterDto.tags && filterDto.tags.length > 0) {
      where.tags = { hasSome: filterDto.tags };
    }

    if (filterDto.authorId) {
      where.authorId = filterDto.authorId;
    }

    if (filterDto.startDate || filterDto.endDate) {
      where.publishedAt = {};
      if (filterDto.startDate) {
        where.publishedAt.gte = new Date(filterDto.startDate);
      }
      if (filterDto.endDate) {
        where.publishedAt.lte = new Date(filterDto.endDate);
      }
    }

    // Execute queries
    const [factChecks, total] = await Promise.all([
      this.prisma.factCheck.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      }),
      this.prisma.factCheck.count({ where }),
    ]);

    return {
      data: factChecks,
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

  async findOne(slug: string, incrementView: boolean = true) {
    const factCheck = await this.prisma.factCheck.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
            reputation: true,
          },
        },
        comments: {
          where: { parentId: null },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            replies: {
              take: 5,
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true, savedBy: true },
        },
      },
    });

    if (!factCheck) {
      throw new NotFoundException('Fact check not found');
    }

    // Increment view count
    if (incrementView) {
      await this.prisma.factCheck.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    }

    return factCheck;
  }

  async update(
    slug: string,
    userId: string,
    userRole: RoleCode,
    updateDto: UpdateFactCheckDto,
  ) {
    const factCheck = await this.prisma.factCheck.findUnique({
      where: { slug },
    });

    if (!factCheck) {
      throw new NotFoundException('Fact check not found');
    }

    // Authorization check
    if (
      factCheck.authorId !== userId &&
      !['ADMIN', 'SUPER_ADMIN'].includes(userRole)
    ) {
      throw new ForbiddenException('You can only edit your own fact checks');
    }

    const updatedFactCheck = await this.prisma.factCheck.update({
      where: { slug },
      data: {
        ...updateDto,
        publishedAt:
          updateDto.status === CONTENT_STATUS.PUBLISHED && !factCheck.publishedAt
            ? new Date()
            : factCheck.publishedAt,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return updatedFactCheck;
  }

  async remove(slug: string, userId: string, userRole: RoleCode) {
    const factCheck = await this.prisma.factCheck.findUnique({
      where: { slug },
    });

    if (!factCheck) {
      throw new NotFoundException('Fact check not found');
    }

    // Authorization check
    if (
      factCheck.authorId !== userId &&
      !['ADMIN', 'SUPER_ADMIN'].includes(userRole)
    ) {
      throw new ForbiddenException('You can only delete your own fact checks');
    }

    await this.prisma.factCheck.delete({
      where: { slug },
    });

    return { message: 'Fact check deleted successfully' };
  }

  async getRelated(slug: string, limit: number = 5) {
    const factCheck = await this.prisma.factCheck.findUnique({
      where: { slug },
      select: { tags: true, verdict: true },
    });

    if (!factCheck) {
      throw new NotFoundException('Fact check not found');
    }

    const related = await this.prisma.factCheck.findMany({
      where: {
        slug: { not: slug },
        status: CONTENT_STATUS.PUBLISHED,
        OR: [
          { tags: { hasSome: factCheck.tags } },
          { verdictCode: factCheck.verdictCode },
        ],
      },
      take: limit,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        verdict: true,
        featuredImage: true,
        publishedAt: true,
      },
    });

    return related;
  }

  async getStats() {
    const [total, byVerdict, recentCount] = await Promise.all([
      this.prisma.factCheck.count({
        where: { statusCode: CONTENT_STATUS.PUBLISHED },
      }),
      this.prisma.factCheck.groupBy({
        by: ['verdictCode'],
        where: { statusCode: CONTENT_STATUS.PUBLISHED },
        _count: true,
      }),
      this.prisma.factCheck.count({
        where: {
          statusCode: CONTENT_STATUS.PUBLISHED,
          publishedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      total,
      recentCount,
      byVerdict: byVerdict.reduce((acc: Record<string, number>, item) => {
        acc[item.verdictCode] = item._count;
        return acc;
      }, {}),
    };
  }

  async toggleSave(slug: string, userId: string) {
    const factCheck = await this.prisma.factCheck.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!factCheck) {
      throw new NotFoundException('Fact check not found');
    }

    const existing = await this.prisma.savedContent.findUnique({
      where: {
        userId_factCheckId: {
          userId,
          factCheckId: factCheck.id,
        },
      },
    });

    if (existing) {
      await this.prisma.savedContent.delete({
        where: { id: existing.id },
      });
      return { saved: false, message: 'Fact check removed from saved items' };
    } else {
      await this.prisma.savedContent.create({
        data: {
          userId,
          factCheckId: factCheck.id,
        },
      });
      return { saved: true, message: 'Fact check saved successfully' };
    }
  }
}
