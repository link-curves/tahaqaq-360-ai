import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MediaLiteracyService {
  constructor(private prisma: PrismaService) {}

  async getCourses(params: {
    search?: string;
    difficulty?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
  }) {
    const { search, difficulty, isPublished } = params;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    const courses = await this.prisma.course.findMany({
      where,
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: [{ order: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      success: true,
      data: courses,
      total: courses.length,
    };
  }

  async getCourse(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      data: course,
    };
  }
}
