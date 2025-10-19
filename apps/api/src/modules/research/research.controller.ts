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
import { Research, Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { IPaginatedResult } from '../../common/interfaces/pagination.interface';
import { CreateResearchDto } from './dto/create-research.dto';
import { UpdateResearchDto } from './dto/update-research.dto';
import { ResearchService } from './research.service';

@ApiTags('Research')
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

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new research article (Admin/Moderator)' })
  async createResearch(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateResearchDto,
  ) {
    return this.researchService.createResearch(userId, createDto);
  }

  @Patch(':slug')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a research article (Admin/Moderator)' })
  async updateResearch(
    @Param('slug') slug: string,
    @Body() updateDto: UpdateResearchDto,
  ) {
    return this.researchService.updateResearch(slug, updateDto);
  }

  @Delete(':slug')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a research article (Admin only)' })
  async deleteResearch(@Param('slug') slug: string) {
    return this.researchService.deleteResearch(slug);
  }

  @Patch(':slug/publish')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle publish status (Admin/Moderator)' })
  async togglePublish(@Param('slug') slug: string) {
    return this.researchService.togglePublish(slug);
  }

  @Patch(':slug/feature')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle featured status (Admin only)' })
  async toggleFeatured(@Param('slug') slug: string) {
    return this.researchService.toggleFeatured(slug);
  }
}
