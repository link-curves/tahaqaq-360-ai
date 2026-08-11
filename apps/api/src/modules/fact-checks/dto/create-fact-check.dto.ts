import { ApiProperty } from '@nestjs/swagger';
import { ContentStatus, Locale, VeracityRating } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreateFactCheckDto {
  @ApiProperty({ example: 'Breaking: Major Scientific Discovery' })
  @IsString()
  @MinLength(10)
  title: string;

  @ApiProperty({ example: 'Scientists have discovered a cure for aging' })
  @IsString()
  @MinLength(20)
  claim: string;

  @ApiProperty({ example: 'Dr. John Smith', required: false })
  @IsOptional()
  @IsString()
  claimant?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  claimDate?: string;

  @ApiProperty({ enum: VeracityRating, example: VeracityRating.FALSE })
  @IsEnum(VeracityRating)
  verdict: VeracityRating;

  @ApiProperty({ example: 'This claim is false because...' })
  @IsString()
  summary: string;

  @ApiProperty({ example: 'Detailed analysis of the claim...' })
  @IsString()
  fullAnalysis: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  methodology?: string;

  @ApiProperty({ type: [Object], required: false })
  @IsOptional()
  @IsArray()
  sources?: any[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  mediaUrls?: string[];

  @ApiProperty({
    type: [String],
    example: ['health', 'science'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiProperty({ enum: ContentStatus, required: false })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  submissionId?: string;
}

export class UpdateFactCheckDto extends CreateFactCheckDto {}

export class FactCheckFilterDto extends PaginationDto {
  @ApiProperty({
    enum: Locale,
    required: false,
    description: 'Language of the article. Defaults to AR (Arabic-first desk).',
  })
  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale;

  @ApiProperty({
    required: false,
    description:
      'Topic slug, e.g. "health". Controlled vocabulary — see ADR-0007.',
  })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({
    required: false,
    description: 'ISO 3166-1 alpha-2 country code, e.g. "LB".',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(VeracityRating)
  verdict?: VeracityRating;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isFeatured?: boolean;
}
