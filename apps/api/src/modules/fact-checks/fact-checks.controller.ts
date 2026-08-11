import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  LOCALE,
  LocaleCode,
  ROLE,
  RoleCode,
} from '../../common/constants/lookups';
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

/**
 * Routes carry a locale because a slug is unique WITHIN a locale, not globally
 * (ADR-0002). `/fact-checks/ar/<slug>` and `/fact-checks/en/<slug>` are two
 * different articles reviewing the same claim.
 *
 * Route order matters: `stats` is declared before `:locale/:slug`, or Nest
 * would match "stats" as a locale.
 */
@ApiTags('Fact Checks')
@Controller('fact-checks')
export class FactChecksController {
  constructor(private readonly factChecksService: FactChecksService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List fact-check articles in one locale' })
  @ApiQuery({ name: 'locale', required: false, enum: Object.values(LOCALE) })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'topic', required: false })
  @ApiQuery({ name: 'country', required: false })
  findAll(@Query() filterDto: FactCheckFilterDto) {
    return this.factChecksService.findAll(filterDto);
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Verdict distribution and counts' })
  @ApiQuery({ name: 'locale', required: false, enum: Object.values(LOCALE) })
  getStats(@Query('locale') locale?: LocaleCode) {
    return this.factChecksService.getStats(locale ?? LOCALE.AR);
  }

  @Public()
  @Get(':locale/:slug')
  @ApiOperation({ summary: 'Get one article by locale and slug' })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  findOne(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
  ) {
    return this.factChecksService.findOne(locale, slug);
  }

  @Public()
  @Get(':locale/:slug/related')
  @ApiOperation({ summary: 'Related fact-checks in the same locale' })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  getRelated(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @Query('limit') limit?: number,
  ) {
    return this.factChecksService.getRelated(locale, slug, limit);
  }

  @Post(':locale/:slug/save')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Save or unsave a fact-check' })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  toggleSave(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.factChecksService.toggleSave(locale, slug, userId);
  }

  // -------------------------------------------------------------------
  // Authoring — Phase 3. These currently return 501; see the service.
  // -------------------------------------------------------------------

  @Post()
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a fact-check (Phase 3 — not implemented)' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateFactCheckDto,
  ) {
    return this.factChecksService.create(userId, createDto);
  }

  @Patch(':locale/:slug')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an article (Phase 3 — not implemented)' })
  update(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: RoleCode,
    @Body() updateDto: UpdateFactCheckDto,
  ) {
    return this.factChecksService.update(
      locale,
      slug,
      userId,
      userRole,
      updateDto,
    );
  }

  @Delete(':locale/:slug')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retract an article (Phase 3 — never a hard delete, see ADR-0006)',
  })
  remove(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: RoleCode,
  ) {
    return this.factChecksService.remove(locale, slug, userId, userRole);
  }
}
