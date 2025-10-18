import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IPaginatedResult } from '../../common/interfaces/pagination.interface';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MediaLiteracyService {
  constructor(private prisma: PrismaService) {}

  async getCourses(params: {
    pagination: PaginationDto;
    search?: string;
    difficulty?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
  }): Promise<IPaginatedResult<Course>> {
    const { search, difficulty, isPublished, pagination } = params;

    const where: Prisma.CourseWhereInput = {};

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

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        include: {
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: [{ order: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.course.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data: courses,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPreviousPage: pagination.page > 1,
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

    return course;
  }

  async enrollInCourse(userId: string, courseId: string) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if already enrolled
    const existingProgress = await this.prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingProgress) {
      throw new BadRequestException('Already enrolled in this course');
    }

    // Create course progress
    const progress = await this.prisma.courseProgress.create({
      data: {
        userId,
        courseId,
        progress: 0,
        isCompleted: false,
      },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    return {
      message: 'Successfully enrolled in course',
      progress,
    };
  }

  async getCourseProgress(userId: string, courseId: string) {
    const courseProgress = await this.prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                lessonProgress: {
                  where: {
                    userId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!courseProgress) {
      throw new NotFoundException('Not enrolled in this course');
    }

    // Calculate progress percentage
    const totalLessons = courseProgress.course.lessons.length;
    const completedLessons = courseProgress.course.lessons.filter(
      (lesson) =>
        lesson.lessonProgress.length > 0 &&
        lesson.lessonProgress[0].isCompleted,
    ).length;

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Update progress if changed
    if (progressPercentage !== courseProgress.progress) {
      await this.prisma.courseProgress.update({
        where: { id: courseProgress.id },
        data: { progress: progressPercentage },
      });
    }

    return {
      ...courseProgress,
      progress: progressPercentage,
      completedLessons,
      totalLessons,
    };
  }

  async toggleLessonComplete(
    userId: string,
    lessonId: string,
    isCompleted: boolean = true,
  ) {
    // Check if lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if enrolled in course
    const courseProgress = await this.prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId,
        },
      },
    });

    if (!courseProgress) {
      throw new BadRequestException('You must enroll in the course first');
    }

    // Upsert lesson progress
    const lessonProgress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Update course progress
    await this.updateCourseProgress(userId, lesson.courseId);

    return {
      message: isCompleted
        ? 'Lesson marked as complete'
        : 'Lesson marked as incomplete',
      lessonProgress,
    };
  }

  private async updateCourseProgress(userId: string, courseId: string) {
    // Get all lessons for the course
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
      include: {
        lessonProgress: {
          where: { userId },
        },
      },
    });

    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(
      (lesson) =>
        lesson.lessonProgress.length > 0 &&
        lesson.lessonProgress[0].isCompleted,
    ).length;

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    const isCompleted = progressPercentage === 100;

    // Update course progress
    await this.prisma.courseProgress.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        progress: progressPercentage,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        lastAccessedAt: new Date(),
      },
    });

    // If course is completed, generate certificate
    if (isCompleted) {
      await this.generateCertificate(userId, courseId);
    }
  }

  private async generateCertificate(userId: string, courseId: string) {
    // Check if certificate already exists
    const existingCert = await this.prisma.certificate.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingCert) {
      return existingCert;
    }

    // Get user info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate unique certificate number and verification code
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const verificationCode = Math.random()
      .toString(36)
      .substr(2, 12)
      .toUpperCase();

    // Create certificate
    const certificate = await this.prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateNumber,
        verificationCode,
        recipientName: `${user.firstName} ${user.lastName}`,
        issuedDate: new Date(),
      },
    });

    return certificate;
  }

  async getMyCourses(userId: string) {
    const enrolledCourses = await this.prisma.courseProgress.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                lessonProgress: {
                  where: { userId },
                },
              },
            },
            _count: {
              select: {
                enrollments: true,
              },
            },
          },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    return enrolledCourses.map((enrollment) => ({
      ...enrollment.course,
      enrollmentProgress: {
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        completedAt: enrollment.completedAt,
        startedAt: enrollment.startedAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        completedLessons: enrollment.course.lessons.filter(
          (lesson) =>
            lesson.lessonProgress.length > 0 &&
            lesson.lessonProgress[0].isCompleted,
        ).length,
        totalLessons: enrollment.course.lessons.length,
      },
    }));
  }
}
