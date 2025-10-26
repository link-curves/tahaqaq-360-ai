import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog title',
    example: 'كيف تتحقق من الأخبار الكاذبة',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'how-to-verify-fake-news',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug: string;

  @ApiProperty({
    description: 'Short excerpt/summary',
    example: 'دليل شامل للتحقق من الأخبار',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  excerpt: string;

  @ApiProperty({
    description: 'Full blog content (supports Markdown/HTML)',
    example: '# مقدمة\n\nهذا دليل شامل...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Cover image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: 'Author name', example: 'فريق تحقق 360' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'Blog category', example: 'التحقق من الحقائق' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({
    description: 'Tags array',
    example: ['أخبار كاذبة', 'تحقق', 'وسائل التواصل'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Featured blog flag', default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Publication status',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({
    description: 'Estimated reading time in minutes',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  readTime?: number;

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'دليل التحقق من الأخبار | تحقق 360',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'تعلم كيف تتحقق من صحة الأخبار',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaDescription?: string;
}
