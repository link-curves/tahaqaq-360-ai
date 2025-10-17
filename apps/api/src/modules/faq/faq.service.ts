import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.fAQ.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
