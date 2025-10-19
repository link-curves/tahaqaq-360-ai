import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Understanding Confirmation Bias' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: '# Confirmation Bias\n\nConfirmation bias is...',
  })
  @IsString()
  @MinLength(50)
  content: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ example: 'https://youtube.com/watch?v=example' })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    example: [
      {
        type: 'pdf',
        title: 'Lesson Notes',
        url: 'https://example.com/notes.pdf',
      },
    ],
  })
  @IsOptional()
  resources?: any[];
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
