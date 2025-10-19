import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Course, Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { IPaginatedResult } from '../../common/interfaces/pagination.interface';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { MarkLessonCompleteDto } from './dto/lesson-progress.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
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

  // ============================================
  // ADMIN CRUD ENDPOINTS FOR COURSES
  // ============================================

  @Post('courses')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new course (Admin/Moderator)' })
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.mediaLiteracyService.createCourse(createCourseDto);
  }

  @Patch('courses/:slug')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a course (Admin/Moderator)' })
  async updateCourse(
    @Param('slug') slug: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.mediaLiteracyService.updateCourse(slug, updateCourseDto);
  }

  @Delete('courses/:slug')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a course (Admin only)' })
  async deleteCourse(@Param('slug') slug: string) {
    return this.mediaLiteracyService.deleteCourse(slug);
  }

  @Patch('courses/:slug/publish')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle course publish status (Admin/Moderator)' })
  async toggleCoursePublish(@Param('slug') slug: string) {
    return this.mediaLiteracyService.toggleCoursePublish(slug);
  }

  // ============================================
  // ADMIN CRUD ENDPOINTS FOR LESSONS
  // ============================================

  @Post('courses/:courseSlug/lessons')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new lesson for a course (Admin/Moderator)',
  })
  async createLesson(
    @Param('courseSlug') courseSlug: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.mediaLiteracyService.createLesson(courseSlug, createLessonDto);
  }

  @Patch('lessons/:lessonId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a lesson (Admin/Moderator)' })
  async updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.mediaLiteracyService.updateLesson(lessonId, updateLessonDto);
  }

  @Delete('lessons/:lessonId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a lesson (Admin only)' })
  async deleteLesson(@Param('lessonId') lessonId: string) {
    return this.mediaLiteracyService.deleteLesson(lessonId);
  }
}
