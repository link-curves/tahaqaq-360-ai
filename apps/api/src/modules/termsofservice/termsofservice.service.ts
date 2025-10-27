import { Injectable } from '@nestjs/common';
import { TermsOfService } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TermsofserviceService {
  constructor(private readonly prisma: PrismaService) {}

  async getTermsOfServiceText(): Promise<TermsOfService | null> {
    return this.prisma.termsOfService.findFirst({
      where: { isCurrent: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
