import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({ example: 'What is fact-checking?' })
  @IsString()
  @MinLength(5)
  question: string;

  @ApiProperty({
    example:
      'Fact-checking is the process of verifying the accuracy of information...',
  })
  @IsString()
  @MinLength(20)
  answer: string;

  @ApiProperty({ example: 'General' })
  @IsString()
  category: string;

  @ApiProperty({
    example: 1,
    description: 'Display order (lower = higher priority)',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
