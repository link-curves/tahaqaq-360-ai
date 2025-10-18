import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Course } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IPaginatedResult } from '../../common/interfaces/pagination.interface';
import { MarkLessonCompleteDto } from './dto/lesson-progress.dto';
import { MediaLiteracyService } from './media-literacy.service';

@ApiTags('Media Literacy')
@Controller('media-literacy')
export class MediaLiteracyController {
  constructor(private readonly mediaLiteracyService: MediaLiteracyService) {}

  @Public()
  @Get('courses')
  async getCourses(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('difficulty') difficulty?: string,
    @Query('isPublished') isPublished?: string,
    @Query('isFeatured') isFeatured?: string,
  ): Promise<IPaginatedResult<Course>> {
    const paginationParams: PaginationDto = {
      page: page || 1,
      limit: limit || 10,
    };

    return this.mediaLiteracyService.getCourses({
      pagination: paginationParams,
      search,
      difficulty,
      isPublished: isPublished === 'true',
      isFeatured: isFeatured === 'true',
    });
  }

  @Public()
  @Get('courses/:slug')
  @ApiOperation({ summary: 'Get course details' })
  async getCourse(@Param('slug') slug: string) {
    return this.mediaLiteracyService.getCourse(slug);
  }

  @Post('courses/:courseId/enroll')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enroll in a course' })
  async enrollInCourse(
    @Param('courseId') courseId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.mediaLiteracyService.enrollInCourse(userId, courseId);
  }

  @Get('courses/:courseId/progress')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get course progress for current user' })
  async getCourseProgress(
    @Param('courseId') courseId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.mediaLiteracyService.getCourseProgress(userId, courseId);
  }

  @Post('lessons/:lessonId/complete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark lesson as complete/incomplete' })
  async markLessonComplete(
    @Param('lessonId') lessonId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: MarkLessonCompleteDto,
  ) {
    return this.mediaLiteracyService.toggleLessonComplete(
      userId,
      lessonId,
      dto.isCompleted,
    );
  }

  @Get('my-courses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my enrolled courses' })
  async getMyCourses(@CurrentUser('id') userId: string) {
    return this.mediaLiteracyService.getMyCourses(userId);
  }
}
