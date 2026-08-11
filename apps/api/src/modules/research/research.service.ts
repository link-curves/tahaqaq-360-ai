import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Research } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IPaginatedResult } from '../../common/interfaces/pagination.interface';
import { PrismaService } from '../../database/prisma.service';
import { CreateResearchDto } from './dto/create-research.dto';
import { UpdateResearchDto } from './dto/update-research.dto';
import { CONTENT_STATUS } from '../../common/constants/lookups';

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
      where.statusCode = isPublished
        ? CONTENT_STATUS.PUBLISHED
        : CONTENT_STATUS.DRAFT;
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

  // ============================================
  // ADMIN METHODS
  // ============================================

  async createResearch(userId: string, createDto: CreateResearchDto) {
    // Check if slug already exists
    const existing = await this.prisma.research.findUnique({
      where: { slug: createDto.slug },
    });

    if (existing) {
      throw new BadRequestException(
        'Research article with this slug already exists',
      );
    }

    return this.prisma.research.create({
      data: {
        title: createDto.title,
        slug: createDto.slug,
        summary: createDto.summary,
        fullContent: createDto.content,
        authors: createDto.authors || [],
        category: createDto.category,
        tags: createDto.tags || [],
        coverImage: createDto.featuredImage,
        isFeatured: createDto.isFeatured || false,
        statusCode: createDto.isPublished ? 'PUBLISHED' : 'DRAFT',
        publishedAt: createDto.isPublished ? new Date() : null,
        attachments: [],
      },
    });
  }

  async updateResearch(slug: string, updateDto: UpdateResearchDto) {
    const article = await this.prisma.research.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Research article not found');
    }

    // If slug is being updated, check for conflicts
    if (updateDto.slug && updateDto.slug !== slug) {
      const existing = await this.prisma.research.findUnique({
        where: { slug: updateDto.slug },
      });

      if (existing) {
        throw new BadRequestException(
          'Research article with this slug already exists',
        );
      }
    }

    const updateData: any = {};
    if (updateDto.title) updateData.title = updateDto.title;
    if (updateDto.slug) updateData.slug = updateDto.slug;
    if (updateDto.summary) updateData.summary = updateDto.summary;
    if (updateDto.content) updateData.fullContent = updateDto.content;
    if (updateDto.authors) updateData.authors = updateDto.authors;
    if (updateDto.category) updateData.category = updateDto.category;
    if (updateDto.tags) updateData.tags = updateDto.tags;
    if (updateDto.featuredImage)
      updateData.coverImage = updateDto.featuredImage;
    if (updateDto.isFeatured !== undefined)
      updateData.isFeatured = updateDto.isFeatured;

    if (updateDto.isPublished !== undefined) {
      updateData.status = updateDto.isPublished ? 'PUBLISHED' : 'DRAFT';
      if (updateDto.isPublished && !article.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    return this.prisma.research.update({
      where: { slug },
      data: updateData,
    });
  }

  async deleteResearch(slug: string) {
    const article = await this.prisma.research.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Research article not found');
    }

    await this.prisma.research.delete({
      where: { slug },
    });

    return { message: 'Research article deleted successfully' };
  }

  async togglePublish(slug: string) {
    const article = await this.prisma.research.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Research article not found');
    }

    const isPublished = article.statusCode === 'PUBLISHED';

    return this.prisma.research.update({
      where: { slug },
      data: {
        statusCode: isPublished ? 'DRAFT' : 'PUBLISHED',
        publishedAt: !isPublished ? new Date() : article.publishedAt,
      },
    });
  }

  async toggleFeatured(slug: string) {
    const article = await this.prisma.research.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Research article not found');
    }

    return this.prisma.research.update({
      where: { slug },
      data: {
        isFeatured: !article.isFeatured,
      },
    });
  }
}
