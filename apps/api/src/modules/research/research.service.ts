import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ResearchService {
  constructor(private prisma: PrismaService) {}

  async getResearch(params: {
    search?: string;
    category?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
  }) {
    const { search, category, isPublished } = params;

    const where: any = {};

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

    const research = await this.prisma.research.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      success: true,
      data: research,
      total: research.length,
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

    return {
      success: true,
      data: { ...article, views: article.views + 1 },
    };
  }
}
