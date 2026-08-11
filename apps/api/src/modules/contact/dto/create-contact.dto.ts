import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Public contact form submission.
 *
 * SECURITY: this endpoint is `@Public()` — anyone on the internet can post to it.
 * Only fields a member of the public is allowed to set may appear here.
 *
 * `ContactMessage` also has `status`, `response`, `respondedAt`, `respondedBy`
 * and `userId`. Those are set by staff, never by the submitter. Before this DTO
 * existed the controller accepted `Prisma.ContactMessageCreateInput`, which has
 * no class metadata for `ValidationPipe` to whitelist against — so every one of
 * those columns was settable anonymously. A submission could arrive pre-marked
 * RESOLVED (and so never appear in the admin queue) carrying a forged staff
 * reply. Do not widen this DTO without thinking that through again.
 */
export class CreateContactDto {
  @ApiProperty({ maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ maxLength: 254 })
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ required: false, maxLength: 32 })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject: string;

  @ApiProperty({ maxLength: 5000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;
}
