import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  EVIDENCE_TYPE,
  LOCALE,
  REVISION_TIER,
  VERDICT,
} from '../../../common/constants/lookups';

/**
 * Authoring inputs for the editorial record.
 *
 * Every nested object uses BOTH `@ValidateNested({ each: true })` and `@Type()`.
 * With only one of them class-validator silently skips the array items, which
 * would reopen exactly the `any[]` hole ADR-0005 exists to close.
 */

// ---------------------------------------------------------------------------
// Claim
// ---------------------------------------------------------------------------

export class ClaimAppearanceInputDto {
  @ApiProperty() @IsUrl() url: string;

  @ApiPropertyOptional({ example: 'twitter' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  platform?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  publisher?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString() appearedAt?: string;

  @ApiPropertyOptional({
    description: 'Snapshot URL. Claims get deleted; this is what survives.',
  })
  @IsOptional()
  @IsUrl()
  archiveUrl?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString() archivedAt?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  mediaUrls?: string[];
}

export class CreateClaimDto {
  @ApiProperty({ description: 'The claim as it circulated' })
  @IsString()
  @MinLength(10)
  text: string;

  @ApiPropertyOptional({ enum: Object.values(LOCALE) })
  @IsOptional()
  @IsIn(Object.values(LOCALE))
  languageCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  claimantName?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString() claimedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() firstSeenAt?: string;

  @ApiPropertyOptional({ type: [ClaimAppearanceInputDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ClaimAppearanceInputDto)
  appearances?: ClaimAppearanceInputDto[];
}

// ---------------------------------------------------------------------------
// Article content (per locale)
// ---------------------------------------------------------------------------

export class ArticleContentDto {
  @ApiProperty() @IsString() @MinLength(10) @MaxLength(300) title: string;
  @ApiProperty() @IsString() @MinLength(20) summary: string;
  @ApiProperty({ description: 'Markdown' })
  @IsString()
  @MinLength(50)
  body: string;

  @ApiPropertyOptional() @IsOptional() @IsString() methodology?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaTitle?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() featuredImage?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFeatured?: boolean;
}

export class CreateArticleDto extends ArticleContentDto {
  @ApiProperty({ enum: Object.values(LOCALE) })
  @IsIn(Object.values(LOCALE))
  localeCode: string;

  @ApiPropertyOptional({
    description: 'Derived from the title when omitted. Unique WITHIN a locale.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;
}

// ---------------------------------------------------------------------------
// Fact-check creation — claim + review + first article, in one transaction
// ---------------------------------------------------------------------------

export class CreateFactCheckDto {
  @ApiProperty({ type: CreateClaimDto })
  @ValidateNested()
  @Type(() => CreateClaimDto)
  claim: CreateClaimDto;

  @ApiProperty({ enum: Object.values(VERDICT) })
  @IsIn(Object.values(VERDICT))
  verdictCode: string;

  @ApiPropertyOptional({ type: [String], description: 'ISO 3166-1 alpha-2' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countryCodes?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Topic slugs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicSlugs?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Free text, SEO only — never drives filtering (ADR-0007)',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ type: CreateArticleDto, description: 'The first article' })
  @ValidateNested()
  @Type(() => CreateArticleDto)
  article: CreateArticleDto;

  @ApiPropertyOptional({ description: 'Submission this fact-check answers' })
  @IsOptional()
  @IsString()
  submissionId?: string;
}

// ---------------------------------------------------------------------------
// Editing a published article — the revision is not optional
// ---------------------------------------------------------------------------

export class RevisionInputDto {
  @ApiProperty({
    enum: Object.values(REVISION_TIER),
    description:
      'Chosen by the editor, never inferred from a diff: a one-word change ' +
      'can be a typo or a reversal of meaning (ADR-0006).',
  })
  @IsIn(Object.values(REVISION_TIER))
  tierCode: string;

  @ApiPropertyOptional({
    description: 'PUBLIC notice. Required for anything above SILENT.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  noticeText?: string;

  @ApiPropertyOptional({ description: 'INTERNAL — never served publicly' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateArticleDto extends PartialType(ArticleContentDto) {
  @ApiPropertyOptional({
    type: RevisionInputDto,
    description:
      'Required once the article is PUBLISHED. Ignored while it is a draft.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RevisionInputDto)
  revision?: RevisionInputDto;
}

export class RetractArticleDto {
  @ApiProperty({ description: 'Shown publicly in place of the analysis' })
  @IsString()
  @MinLength(10)
  noticeText: string;

  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

// ---------------------------------------------------------------------------
// Verdict change — the highest-consequence edit in the system
// ---------------------------------------------------------------------------

export class ChangeVerdictDto {
  @ApiProperty({ enum: Object.values(VERDICT) })
  @IsIn(Object.values(VERDICT))
  toVerdictCode: string;

  @ApiProperty({ description: 'PUBLIC — why the rating changed' })
  @IsString()
  @MinLength(20)
  reason: string;

  @ApiProperty({
    description:
      'The analyst whose determination this is. The CALLER is the approver, ' +
      'and must be a different person (ADR-0006 invariant 5).',
  })
  @IsString()
  @IsNotEmpty()
  changedById: string;
}

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------

export class CreateEvidenceDto {
  @ApiProperty() @IsUrl() url: string;

  @ApiPropertyOptional({ enum: Object.values(EVIDENCE_TYPE) })
  @IsOptional()
  @IsIn(Object.values(EVIDENCE_TYPE))
  typeCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  publisher?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() publishedAt?: string;

  @ApiProperty({
    description:
      'When the analyst consulted it. Required: a source that said X in ' +
      'January and Y in March makes the fact-check unfalsifiable without it.',
  })
  @IsDateString()
  accessedAt: string;

  @ApiPropertyOptional() @IsOptional() @IsUrl() archiveUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() archivedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() excerpt?: string;

  @ApiPropertyOptional({ description: 'INTERNAL — never served publicly' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Appended when omitted' })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}

export class UpdateEvidenceDto extends PartialType(CreateEvidenceDto) {}

export class ReorderEvidenceDto {
  @ApiProperty({
    type: [String],
    description: 'Evidence ids in the order they should appear',
  })
  @IsArray()
  @IsString({ each: true })
  orderedIds: string[];
}
