import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export enum CourseDifficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Media Literacy' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'introduction-to-media-literacy' })
  @IsString()
  @MinLength(3)
  slug: string;

  @ApiProperty({
    example: 'Learn the fundamentals of media literacy and critical thinking',
  })
  @IsString()
  @MinLength(50)
  description: string;

  @ApiProperty({ enum: CourseDifficulty, example: CourseDifficulty.BEGINNER })
  @IsEnum(CourseDifficulty)
  difficulty: CourseDifficulty;

  @ApiProperty({ example: 480, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({
    example: [
      'Understand media bias',
      'Identify misinformation',
      'Analyze sources critically',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  learningObjectives?: string[];

  @ApiProperty({
    example: ['Basic reading comprehension', 'Internet access'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prerequisites?: string[];

  @ApiProperty({ example: 'https://example.com/course-image.jpg' })
  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
