import { Injectable } from '@nestjs/common';
import { ContactMessage, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async getContactUSInfo(): Promise<ContactMessage | null> {
    return this.prisma.contactMessage.findFirst();
  }

  async submitContactUSMessage({
    contactUSInfo,
  }: {
    contactUSInfo: Prisma.ContactMessageCreateInput;
  }): Promise<ContactMessage> {
    return this.prisma.contactMessage.create({
      data: contactUSInfo,
    });
  }
}
