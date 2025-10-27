import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  reputation: number;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  lastLoginAt?: Date;
}

export class UserStatsDto {
  @ApiProperty()
  totalSubmissions: number;

  @ApiProperty()
  totalFactChecks: number;

  @ApiProperty()
  totalComments: number;

  @ApiProperty()
  completedCourses: number;

  @ApiProperty()
  totalAchievements: number;

  @ApiProperty()
  reputation: number;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  level: number;
}
