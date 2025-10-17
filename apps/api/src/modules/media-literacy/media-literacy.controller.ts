import { Controller, Get, Param, Query } from '@nestjs/common';
import { MediaLiteracyService } from './media-literacy.service';

@Controller('media-literacy')
export class MediaLiteracyController {
  constructor(private readonly mediaLiteracyService: MediaLiteracyService) {}

  @Get('courses')
  async getCourses(
    @Query('search') search?: string,
    @Query('difficulty') difficulty?: string,
    @Query('isPublished') isPublished?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    return this.mediaLiteracyService.getCourses({
      search,
      difficulty,
      isPublished: isPublished === 'true',
      isFeatured: isFeatured === 'true',
    });
  }

  @Get('courses/:slug')
  async getCourse(@Param('slug') slug: string) {
    return this.mediaLiteracyService.getCourse(slug);
  }
}
