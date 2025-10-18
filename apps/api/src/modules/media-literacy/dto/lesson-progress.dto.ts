import { IsBoolean, IsOptional } from 'class-validator';

export class MarkLessonCompleteDto {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean = true;
}
