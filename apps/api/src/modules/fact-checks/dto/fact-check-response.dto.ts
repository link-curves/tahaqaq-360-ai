import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Response shapes for the fact-check read endpoints.
 *
 * These exist so `pnpm openapi` emits real response schemas: without an
 * `@ApiOkResponse({ type })` on the controller, Nest documents a 200 with no
 * body, and the generated frontend types know the routes but not the payload —
 * which is most of the value (ADR-0003).
 *
 * They describe what `FactChecksService` actually returns, including the global
 * `{ success, data, meta }` envelope added by TransformInterceptor. Keep them in
 * step with the service selects; they are documentation with teeth, not
 * decoration.
 *
 * NOTE the deliberate absences: `Evidence.note` and `ArticleRevision.reason` are
 * internal analyst fields and must never appear here (ADR-0005/0006 invariant 7).
 */

export class BylineDto {
  @ApiProperty() id: string;
  @ApiPropertyOptional({ type: String, nullable: true }) firstName?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) lastName?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) avatar?: string | null;
}

/** A lookup value already resolved to the requested language (ADR-0008). */
export class LocalizedRefDto {
  @ApiProperty({ example: 'FALSE' }) code: string;
  @ApiProperty({
    example: 'خاطئ',
    description: 'Resolved for the requested locale',
  })
  label: string;
}

export class VerdictDto extends LocalizedRefDto {
  @ApiPropertyOptional({
    description: 'The published definition of this rating',
  })
  definition?: string;
}

export class TopicDto {
  @ApiProperty({ example: 'health' }) slug: string;
  @ApiProperty({ example: 'الصحة' }) label: string;
}

export class ClaimAppearanceDto {
  @ApiProperty() url: string;
  @ApiPropertyOptional({ type: String, nullable: true }) platform?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) publisher?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) appearedAt?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true,
    description: 'Snapshot that survives the original being deleted', })
  archiveUrl?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) archivedAt?: string | null;
  @ApiProperty({ type: [String] }) mediaUrls: string[];
}

export class ClaimDto {
  @ApiProperty({ description: 'The claim as it circulated' }) text: string;
  @ApiPropertyOptional({ type: String, nullable: true }) languageCode?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) claimantName?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) claimedAt?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) firstSeenAt?: string | null;
  @ApiProperty({ type: [ClaimAppearanceDto] })
  appearances: ClaimAppearanceDto[];
}

export class EvidenceDto {
  @ApiProperty({ description: 'Presentation order, contiguous from 0' })
  position: number;
  @ApiProperty({ example: 'OFFICIAL_RECORD' }) typeCode: string;
  @ApiProperty() url: string;
  @ApiPropertyOptional({ type: String, nullable: true }) title?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) publisher?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) publishedAt?: string | null;
  @ApiProperty({ description: 'When the analyst consulted the source' })
  accessedAt: string;
  @ApiPropertyOptional({ type: String, nullable: true }) archiveUrl?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) archivedAt?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) excerpt?: string | null;
  // `note` is intentionally absent — internal.
}

export class CorrectionDto {
  @ApiProperty() revisionNumber: number;
  @ApiProperty({
    example: 'CORRECTION',
    enum: ['UPDATE', 'CORRECTION', 'VERDICT_CHANGE'],
  })
  tierCode: string;
  @ApiPropertyOptional({ type: String, nullable: true, description: 'The public notice' })
  noticeText?: string | null;
  @ApiProperty({ description: 'The rating at the time of this revision' })
  verdictAtTimeCode: string;
  @ApiProperty() createdAt: string;
  // `reason` is intentionally absent — internal.
}

export class AvailableLocaleDto {
  @ApiProperty({ example: 'EN' }) locale: string;
  @ApiProperty({ description: 'Slug of the sibling article in that locale' })
  slug: string;
}

export class ClaimSummaryDto {
  @ApiProperty({ description: 'The claim as it circulated' }) text: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  claimantName?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  claimedAt?: string | null;
}

export class ReviewCountsDto {
  @ApiProperty() evidence: number;
  @ApiProperty() comments: number;
}

export class ReviewSummaryDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'FALSE' }) verdictCode: string;
  @ApiProperty({ type: VerdictDto }) verdict: VerdictDto;
  @ApiProperty({ type: [String], description: 'ISO 3166-1 alpha-2' })
  countryCodes: string[];
  @ApiProperty({ type: [TopicDto] }) topics: TopicDto[];
  @ApiProperty({ type: ClaimSummaryDto }) claim: ClaimSummaryDto;
  @ApiProperty({ type: ReviewCountsDto }) _count: ReviewCountsDto;
}

export class FactCheckListItemDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'AR' }) localeCode: string;
  @ApiProperty() slug: string;
  @ApiProperty() title: string;
  @ApiProperty() summary: string;
  @ApiPropertyOptional({ type: String, nullable: true }) featuredImage?: string | null;
  @ApiProperty() isFeatured: boolean;
  @ApiProperty({ example: 'PUBLISHED' }) statusCode: string;
  @ApiPropertyOptional({ type: String, nullable: true }) publishedAt?: string | null;
  @ApiProperty() views: number;
  @ApiProperty() shares: number;
  @ApiProperty({ type: BylineDto }) author: BylineDto;
  @ApiProperty({ type: ReviewSummaryDto }) factCheck: ReviewSummaryDto;
}

export class ReviewDetailDto extends ReviewSummaryDto {
  /** Overrides the summary claim with appearances included. */
  @ApiProperty({
    type: [String],
    description: 'Free text, SEO only — never a filter',
  })
  tags: string[];
  @ApiProperty({ type: ClaimDto }) declare claim: ClaimDto;
  @ApiProperty({ type: [EvidenceDto] }) evidence: EvidenceDto[];
}

export class FactCheckDetailDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'AR' }) localeCode: string;
  @ApiProperty() slug: string;
  @ApiProperty() title: string;
  @ApiProperty() summary: string;
  @ApiProperty() body: string;
  @ApiPropertyOptional({ type: String, nullable: true }) methodology?: string | null;
  @ApiProperty({ example: 'PUBLISHED' }) statusCode: string;
  @ApiProperty({ description: 'True when statusCode is RETRACTED' })
  isRetracted: boolean;
  @ApiPropertyOptional({ type: String, nullable: true }) publishedAt?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) reviewedAt?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) metaTitle?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) metaDescription?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) featuredImage?: string | null;
  @ApiProperty() views: number;
  @ApiProperty() shares: number;
  @ApiProperty({ type: BylineDto, description: 'Who wrote it' })
  author: BylineDto;
  @ApiPropertyOptional({
    type: BylineDto,
    nullable: true,
    description: 'Who reviewed it — a distinct step from moderation',
  })
  editor?: BylineDto | null;
  @ApiProperty({ type: ReviewDetailDto }) factCheck: ReviewDetailDto;
  @ApiProperty({
    type: [AvailableLocaleDto],
    description: 'Sibling locales that are PUBLISHED — drafts are excluded',
  })
  availableLocales: AvailableLocaleDto[];
  @ApiProperty({
    type: [CorrectionDto],
    description: 'Disclosed revisions only; SILENT edits stay internal',
  })
  corrections: CorrectionDto[];
}

export class RelatedFactCheckDto {
  @ApiProperty({ example: 'AR' }) localeCode: string;
  @ApiProperty() slug: string;
  @ApiProperty() title: string;
  @ApiProperty() summary: string;
  @ApiPropertyOptional({ type: String, nullable: true }) featuredImage?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) publishedAt?: string | null;
  @ApiProperty({
    type: ReviewSummaryDto,
    description: 'Only verdictCode and verdict are populated here',
  })
  factCheck: Partial<ReviewSummaryDto>;
}

export class FactCheckStatsDto {
  @ApiProperty() total: number;
  @ApiProperty({ description: 'Published in the last 30 days' })
  recentCount: number;
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { TRUE: 26, FALSE: 19 },
    description: 'Keyed by verdict code',
  })
  byVerdict: Record<string, number>;
}

export class ToggleSaveDto {
  @ApiProperty() saved: boolean;
  @ApiProperty() message: string;
}

// ---------------------------------------------------------------------------
// Envelope wrappers — TransformInterceptor wraps every response globally.
// Declared explicitly rather than generically: @nestjs/swagger generics need
// getSchemaPath/ApiExtraModels gymnastics that obscure more than they save at
// this scale.
// ---------------------------------------------------------------------------

export class PaginationMetaDto {
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
  @ApiProperty() hasNextPage: boolean;
  @ApiProperty() hasPreviousPage: boolean;
}

export class FactCheckListResponseDto {
  @ApiProperty({ example: true }) success: boolean;
  @ApiProperty({ type: [FactCheckListItemDto] }) data: FactCheckListItemDto[];
  @ApiProperty({ type: PaginationMetaDto }) meta: PaginationMetaDto;
}

export class FactCheckDetailResponseDto {
  @ApiProperty({ example: true }) success: boolean;
  @ApiProperty({ type: FactCheckDetailDto }) data: FactCheckDetailDto;
}

export class RelatedFactChecksResponseDto {
  @ApiProperty({ example: true }) success: boolean;
  @ApiProperty({ type: [RelatedFactCheckDto] }) data: RelatedFactCheckDto[];
}

export class FactCheckStatsResponseDto {
  @ApiProperty({ example: true }) success: boolean;
  @ApiProperty({ type: FactCheckStatsDto }) data: FactCheckStatsDto;
}

export class ToggleSaveResponseDto {
  @ApiProperty({ example: true }) success: boolean;
  @ApiProperty({ type: ToggleSaveDto }) data: ToggleSaveDto;
}
