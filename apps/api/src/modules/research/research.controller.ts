import { Controller, Get, Param, Query } from '@nestjs/common';
import { Research } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IPaginatedResult } from '../../common/interfaces/pagination.interface';
import { ResearchService } from './research.service';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Public()
  @Get()
  async getResearch(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('isPublished') isPublished?: boolean,
    @Query('isFeatured') isFeatured?: boolean,
  ): Promise<IPaginatedResult<Research>> {
    const paginationParams: PaginationDto = {
      page: page || 1,
      limit: limit || 10,
    };

    return this.researchService.getResearch({
      search,
      category,
      isPublished,
      isFeatured,
      paginationParams,
    });
  }

  @Public()
  @Get(':slug')
  async getResearchArticle(@Param('slug') slug: string) {
    return this.researchService.getResearchArticle(slug);
  }
}
