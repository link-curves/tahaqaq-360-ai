import { Injectable } from '@nestjs/common';
import { PrivacyPolicy } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PrivacyPolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrivacyPolicyText(): Promise<PrivacyPolicy | null> {
    return this.prisma.privacyPolicy.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }
}
