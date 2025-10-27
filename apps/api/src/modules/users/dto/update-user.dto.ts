import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ example: 'johndoe' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiPropertyOptional({ example: 'A passionate fact-checker' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateEmailDto {
  @ApiPropertyOptional({ example: 'newemail@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'currentPassword123' })
  @IsString()
  @MinLength(8)
  currentPassword: string;
}

export class UpdatePasswordDto {
  @ApiPropertyOptional({ example: 'currentPassword123' })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiPropertyOptional({ example: 'newPassword123' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword: string;
}
