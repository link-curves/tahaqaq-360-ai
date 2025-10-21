import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTrainingRequestDto {
  @ApiProperty({ description: 'Full name of the requester' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Organization or institution name' })
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiProperty({
    description: 'Position/role in organization',
    required: false,
  })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({ description: 'Topic or focus of the training' })
  @IsString()
  @IsNotEmpty()
  trainingTopic: string;

  @ApiProperty({ description: 'Detailed description of training needs' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Preferred training date',
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  preferredDate?: Date;

  @ApiProperty({
    description: 'Alternative training date',
    required: false,
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  alternativeDate?: Date;

  @ApiProperty({ description: 'Expected number of attendees' })
  @IsInt()
  @Min(1)
  expectedAttendees: number;

  @ApiProperty({ description: 'Location where training should take place' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Target audience (e.g., Students, Teachers, Journalists)',
    required: false,
  })
  @IsString()
  @IsOptional()
  targetAudience?: string;

  @ApiProperty({
    description: 'Specific needs or requirements',
    required: false,
  })
  @IsString()
  @IsOptional()
  specificNeeds?: string;
}
