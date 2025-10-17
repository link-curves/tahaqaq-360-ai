import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { MediaLiteracyService } from './media-literacy.service';

@Controller('media-literacy')
export class MediaLiteracyController {
  constructor(private readonly mediaLiteracyService: MediaLiteracyService) {}

  @Public()
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

  @Public()
  @Get('courses/:slug')
  async getCourse(@Param('slug') slug: string) {
    return this.mediaLiteracyService.getCourse(slug);
  }
}
