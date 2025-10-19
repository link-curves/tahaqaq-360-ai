import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateResearchDto {
  @ApiProperty({ example: 'Understanding Media Bias in Digital Age' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'understanding-media-bias-digital-age' })
  @IsString()
  @MinLength(3)
  slug: string;

  @ApiProperty({
    example:
      '# Introduction\n\nThis research explores...\n\n## Methodology\n\nWe analyzed...',
  })
  @IsString()
  @MinLength(100)
  content: string;

  @ApiProperty({
    example:
      'A comprehensive study on media bias patterns in digital journalism',
  })
  @IsString()
  @MinLength(50)
  summary: string;

  @ApiProperty({ example: 'Media Analysis' })
  @IsString()
  category: string;

  @ApiProperty({ example: ['Dr. Ahmed Ali', 'Dr. Sara Mohammed'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  authors?: string[];

  @ApiProperty({
    example: ['media-bias', 'journalism', 'fact-checking', 'digital-media'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 'https://example.com/research-image.jpg' })
  @IsUrl()
  @IsOptional()
  featuredImage?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ example: 'Understanding Media Bias - Research Study' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiProperty({
    example:
      'Comprehensive research on media bias patterns and fact-checking in the digital age',
  })
  @IsString()
  @IsOptional()
  metaDescription?: string;
}
