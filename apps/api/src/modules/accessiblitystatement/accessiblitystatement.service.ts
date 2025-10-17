import { Injectable } from '@nestjs/common';
import { AccessibilityStatement } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AccessibilityStatementService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccessibilityStatement(): Promise<AccessibilityStatement | null> {
    return this.prisma.accessibilityStatement.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }
}
