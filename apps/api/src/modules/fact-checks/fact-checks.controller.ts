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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateFactCheckDto,
  FactCheckFilterDto,
  UpdateFactCheckDto,
} from './dto/create-fact-check.dto';
import { FactChecksService } from './fact-checks.service';
import { ROLE, RoleCode } from '../../common/constants/lookups';

@ApiTags('Fact Checks')
@Controller('fact-checks')
export class FactChecksController {
  constructor(private readonly factChecksService: FactChecksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new fact check' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateFactCheckDto,
  ) {
    return this.factChecksService.create(userId, createDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all fact checks with pagination and filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() filterDto: FactCheckFilterDto) {
    return this.factChecksService.findAll(filterDto, filterDto);
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get fact checking statistics' })
  getStats() {
    return this.factChecksService.getStats();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get a single fact check by slug' })
  findOne(@Param('slug') slug: string) {
    return this.factChecksService.findOne(slug);
  }

  @Public()
  @Get(':slug/related')
  @ApiOperation({ summary: 'Get related fact checks' })
  getRelated(@Param('slug') slug: string, @Query('limit') limit?: number) {
    return this.factChecksService.getRelated(slug, limit);
  }

  @Patch(':slug')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a fact check' })
  update(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: RoleCode,
    @Body() updateDto: UpdateFactCheckDto,
  ) {
    return this.factChecksService.update(slug, userId, userRole, updateDto);
  }

  @Delete(':slug')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a fact check' })
  remove(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: RoleCode,
  ) {
    return this.factChecksService.remove(slug, userId, userRole);
  }

  @Post(':slug/save')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Save or unsave a fact check' })
  toggleSave(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.factChecksService.toggleSave(slug, userId);
  }
}
