import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { SUBMISSION_TYPE, SubmissionTypeCode } from '../../../common/constants/lookups';

export class CreateSubmissionDto {
  @ApiProperty({ enum: Object.values(SUBMISSION_TYPE), example: SUBMISSION_TYPE.TEXT })
  @IsIn(Object.values(SUBMISSION_TYPE))
  type: SubmissionTypeCode;

  @ApiProperty({ example: 'I found this suspicious claim on social media...' })
  @IsString()
  @MinLength(20)
  content: string;

  @ApiProperty({ required: false, example: 'https://example.com/article' })
  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  mediaUrls?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  submitterEmail?: string;
}

export class UpdateSubmissionStatusDto {
  @ApiProperty({ enum: ['PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'PUBLISHED'] })
  @IsEnum(['PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'PUBLISHED'])
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  internalNotes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

