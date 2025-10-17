import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ResearchService } from './research.service';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Public()
  @Get()
  async getResearch(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('isPublished') isPublished?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    return this.researchService.getResearch({
      search,
      category,
      isPublished: isPublished === 'true',
      isFeatured: isFeatured === 'true',
    });
  }

  @Public()
  @Get(':slug')
  async getResearchArticle(@Param('slug') slug: string) {
    return this.researchService.getResearchArticle(slug);
  }
}
