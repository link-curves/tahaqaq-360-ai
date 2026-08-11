import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
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
  ChangeVerdictDto,
  CreateArticleDto,
  CreateEvidenceDto,
  CreateFactCheckDto,
  ReorderEvidenceDto,
  RetractArticleDto,
  UpdateArticleDto,
  UpdateEvidenceDto,
} from './dto/authoring.dto';
import { FactCheckFilterDto } from './dto/create-fact-check.dto';
import { FactChecksAuthoringService } from './fact-checks-authoring.service';
import {
  FactCheckDetailResponseDto,
  FactCheckListResponseDto,
  FactCheckStatsResponseDto,
  RelatedFactChecksResponseDto,
  ToggleSaveResponseDto,
} from './dto/fact-check-response.dto';
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
  constructor(
    private readonly factChecksService: FactChecksService,
    private readonly authoring: FactChecksAuthoringService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List fact-check articles in one locale' })
  @ApiOkResponse({ type: FactCheckListResponseDto })
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
  @ApiOkResponse({ type: FactCheckStatsResponseDto })
  @ApiQuery({ name: 'locale', required: false, enum: Object.values(LOCALE) })
  getStats(@Query('locale') locale?: LocaleCode) {
    return this.factChecksService.getStats(locale ?? LOCALE.AR);
  }

  @Public()
  @Get(':locale/:slug')
  @ApiOperation({ summary: 'Get one article by locale and slug' })
  @ApiOkResponse({ type: FactCheckDetailResponseDto })
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
  @ApiOkResponse({ type: RelatedFactChecksResponseDto })
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
  @ApiOkResponse({ type: ToggleSaveResponseDto })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  toggleSave(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.factChecksService.toggleSave(locale, slug, userId);
  }

  // -------------------------------------------------------------------
  // AUTHORING
  //
  // Every write goes through FactChecksAuthoringService — the single write
  // path. Publishing, retraction and verdict changes carry hard ADR-0006
  // invariants that only hold if there is exactly one way in.
  // -------------------------------------------------------------------

  @Post()
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a fact-check: claim, review and the first article (DRAFT)',
  })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateFactCheckDto,
  ) {
    return this.authoring.createFactCheck(userId, dto);
  }

  @Post(':factCheckId/translations')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Add a sibling article in another locale — its own DRAFT',
  })
  addTranslation(
    @Param('factCheckId') factCheckId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateArticleDto,
  ) {
    return this.authoring.addTranslation(factCheckId, userId, dto);
  }

  @Patch(':locale/:slug')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Edit an article. Once published, a revision is mandatory.',
  })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  update(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.authoring.updateArticle(locale, slug, userId, dto);
  }

  @Post(':locale/:slug/submit')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit a draft for editorial review' })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  submit(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.authoring.submitForReview(locale, slug, userId);
  }

  @Post(':locale/:slug/publish')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Publish. The editor cannot be the author (ADR-0002).',
  })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  publish(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') editorId: string,
  ) {
    return this.authoring.publish(locale, slug, editorId);
  }

  @Post(':locale/:slug/send-back')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Send an article under review back to draft' })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  sendBack(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') editorId: string,
  ) {
    return this.authoring.sendBackToDraft(locale, slug, editorId);
  }

  @Post(':locale/:slug/retract')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Withdraw a published fact-check. Never a delete — URL preserved.',
  })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  retract(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RetractArticleDto,
  ) {
    return this.authoring.retract(locale, slug, userId, dto);
  }

  @Post(':locale/:slug/archive')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove from listings; the article stays reachable' })
  @ApiParam({ name: 'locale', enum: Object.values(LOCALE) })
  archive(
    @Param('locale', new ParseEnumPipe(LOCALE)) locale: LocaleCode,
    @Param('slug') slug: string,
  ) {
    return this.authoring.archive(locale, slug);
  }

  @Post(':factCheckId/verdict-change')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Change a published rating. The caller approves; changedById is the ' +
      'analyst, and must be someone else. Notifies every published locale.',
  })
  changeVerdict(
    @Param('factCheckId') factCheckId: string,
    @CurrentUser('id') approverId: string,
    @Body() dto: ChangeVerdictDto,
  ) {
    return this.authoring.changeVerdict(factCheckId, approverId, dto);
  }

  // --- Evidence ------------------------------------------------------

  @Post(':factCheckId/evidence')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add a citation; positions stay contiguous' })
  addEvidence(
    @Param('factCheckId') factCheckId: string,
    @Body() dto: CreateEvidenceDto,
  ) {
    return this.authoring.addEvidence(factCheckId, dto);
  }

  @Patch('evidence/:evidenceId')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a citation' })
  updateEvidence(
    @Param('evidenceId') evidenceId: string,
    @Body() dto: UpdateEvidenceDto,
  ) {
    return this.authoring.updateEvidence(evidenceId, dto);
  }

  @Delete('evidence/:evidenceId')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove a citation' })
  removeEvidence(@Param('evidenceId') evidenceId: string) {
    return this.authoring.removeEvidence(evidenceId);
  }

  @Put(':factCheckId/evidence/order')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reorder citations — analysts sequence them' })
  reorderEvidence(
    @Param('factCheckId') factCheckId: string,
    @Body() dto: ReorderEvidenceDto,
  ) {
    return this.authoring.reorderEvidence(factCheckId, dto);
  }
}
