import { Injectable } from '@nestjs/common';
import { ContactMessage } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async getContactUSInfo(): Promise<ContactMessage | null> {
    return this.prisma.contactMessage.findFirst();
  }

  async submitContactUSMessage({
    contactUSInfo,
  }: {
    contactUSInfo: CreateContactDto;
  }): Promise<ContactMessage> {
    // Fields are mapped explicitly rather than spread. `ValidationPipe` already
    // strips anything not on the DTO, but this endpoint is public, so the write
    // is pinned to exactly these five columns as a second line of defence.
    // status/response/respondedAt/respondedBy/userId are staff-controlled and
    // must never be settable from a public request — see CreateContactDto.
    return this.prisma.contactMessage.create({
      data: {
        name: contactUSInfo.name,
        email: contactUSInfo.email,
        phone: contactUSInfo.phone,
        subject: contactUSInfo.subject,
        message: contactUSInfo.message,
      },
    });
  }
}
