import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';
import { EVENT_STATUS, EVENT_TYPE, EventStatusCode, EventTypeCode } from '../../../common/constants/lookups';

export class CreateEventDto {
  @ApiProperty({ example: 'Media Literacy Workshop 2025' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Join us for an interactive workshop on identifying misinformation' })
  @IsString()
  @MinLength(20)
  description: string;

  @ApiProperty({ enum: Object.values(EVENT_TYPE), example: EVENT_TYPE.WORKSHOP })
  @IsIn(Object.values(EVENT_TYPE))
  type: EventTypeCode;

  @ApiProperty({ example: '2025-12-01T10:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-01T16:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  virtualLink?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isVirtual?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttendees?: number;

  @ApiProperty({ type: [Object], required: false })
  @IsOptional()
  @IsArray()
  speakers?: any[];

  @ApiProperty({ type: [Object], required: false })
  @IsOptional()
  @IsArray()
  agenda?: any[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  requirements?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiProperty({ enum: Object.values(EVENT_STATUS), required: false })
  @IsOptional()
  @IsIn(Object.values(EVENT_STATUS))
  status?: EventStatusCode;
}

export class RegisterEventDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class HostRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiProperty()
  @IsString()
  proposedTitle: string;

  @ApiProperty()
  @IsString()
  @MinLength(50)
  description: string;

  @ApiProperty({ enum: Object.values(EVENT_TYPE) })
  @IsIn(Object.values(EVENT_TYPE))
  eventType: EventTypeCode;

  @ApiProperty()
  @IsDateString()
  preferredDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  expectedAttendees?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

