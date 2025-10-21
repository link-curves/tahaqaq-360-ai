import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTrainingRequestDto {
  @ApiProperty({
    description: 'Request status',
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CONTACTED'],
  })
  @IsString()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED', 'CONTACTED'])
  status: string;

  @ApiPropertyOptional({ description: 'Review notes from admin/moderator' })
  @IsOptional()
  @IsString()
  reviewNotes?: string;
}
