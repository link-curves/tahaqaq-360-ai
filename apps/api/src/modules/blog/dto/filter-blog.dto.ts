import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CONTENT_STATUS, ContentStatusCode } from '../../../common/constants/lookups';

export class FilterBlogDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by tag',
    example: 'أخبار كاذبة',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: Object.values(CONTENT_STATUS),
  })
  @IsOptional()
  @IsIn(Object.values(CONTENT_STATUS))
  status?: ContentStatusCode;

  @ApiPropertyOptional({
    description: 'Search in title, excerpt, content',
    example: 'تحقق',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter featured only' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Filter by author name' })
  @IsOptional()
  @IsString()
  author?: string;
}
