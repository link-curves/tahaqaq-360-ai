import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CONTENT_STATUS, ContentStatusCode, LOCALE, LocaleCode, VERDICT, VerdictCode } from '../../../common/constants/lookups';

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

  @ApiProperty({ enum: Object.values(VERDICT), example: VERDICT.FALSE })
  @IsIn(Object.values(VERDICT))
  verdict: VerdictCode;

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

  @ApiProperty({ enum: Object.values(CONTENT_STATUS), required: false })
  @IsOptional()
  @IsIn(Object.values(CONTENT_STATUS))
  status?: ContentStatusCode;

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
    enum: Object.values(LOCALE),
    required: false,
    description: 'Language of the article. Defaults to AR (Arabic-first desk).',
  })
  @IsOptional()
  @IsIn(Object.values(LOCALE))
  locale?: LocaleCode;

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
  @IsIn(Object.values(VERDICT))
  verdict?: VerdictCode;

  @IsOptional()
  @IsIn(Object.values(CONTENT_STATUS))
  status?: ContentStatusCode;

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
