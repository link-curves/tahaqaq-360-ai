import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.fAQ.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    // Increment view count
    await this.prisma.fAQ.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return faq;
  }

  async create(createFaqDto: CreateFaqDto) {
    return this.prisma.fAQ.create({
      data: {
        question: createFaqDto.question,
        answer: createFaqDto.answer,
        category: createFaqDto.category,
        order: createFaqDto.order ?? 0,
        isPublished: createFaqDto.isPublished ?? true,
      },
    });
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    const updateData: Prisma.FAQUpdateInput = {};

    if (updateFaqDto.question) updateData.question = updateFaqDto.question;
    if (updateFaqDto.answer) updateData.answer = updateFaqDto.answer;
    if (updateFaqDto.category) updateData.category = updateFaqDto.category;
    if (updateFaqDto.order !== undefined) updateData.order = updateFaqDto.order;
    if (updateFaqDto.isPublished !== undefined)
      updateData.isPublished = updateFaqDto.isPublished;

    return this.prisma.fAQ.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    return this.prisma.fAQ.delete({
      where: { id },
    });
  }

  async togglePublish(id: string) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    return this.prisma.fAQ.update({
      where: { id },
      data: {
        isPublished: !faq.isPublished,
      },
    });
  }
}
