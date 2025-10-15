import { ApiProperty } from '@nestjs/swagger';
import { SubmissionType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ enum: SubmissionType, example: SubmissionType.TEXT })
  @IsEnum(SubmissionType)
  type: SubmissionType;

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

