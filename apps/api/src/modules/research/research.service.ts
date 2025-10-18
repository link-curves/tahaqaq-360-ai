import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Research } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IPaginatedResult } from '../../common/interfaces/pagination.interface';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ResearchService {
  constructor(private prisma: PrismaService) {}

  async getResearch(params: {
    search?: string;
    category?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    paginationParams: PaginationDto;
  }): Promise<IPaginatedResult<Research>> {
    const { search, category, isPublished, paginationParams } = params;

    const where: Prisma.ResearchWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isPublished !== undefined) {
      where.status = isPublished ? 'PUBLISHED' : 'DRAFT';
    }

    const [research, total] = await Promise.all([
      this.prisma.research.findMany({
        where,
        skip: (paginationParams.page - 1) * paginationParams.limit,
        take: paginationParams.limit,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.research.count({ where }),
    ]);

    const totalPages = Math.ceil(total / paginationParams.limit);

    return {
      data: research,
      total,
      page: paginationParams.page,
      limit: paginationParams.limit,
      totalPages,
      hasNextPage: paginationParams.page < totalPages,
      hasPreviousPage: paginationParams.page > 1,
    };
  }

  async getResearchArticle(slug: string) {
    const article = await this.prisma.research.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Research article not found');
    }

    // Increment view count
    await this.prisma.research.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });

    return { ...article, views: article.views + 1 };
  }
}
