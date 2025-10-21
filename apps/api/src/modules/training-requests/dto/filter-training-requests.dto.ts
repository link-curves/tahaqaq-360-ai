import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterTrainingRequestsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CONTACTED'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED', 'CONTACTED'])
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by organization name' })
  @IsOptional()
  @IsString()
  organization?: string;
}
