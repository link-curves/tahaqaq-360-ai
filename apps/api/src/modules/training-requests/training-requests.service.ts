import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTrainingRequestDto } from './dto/create-training-request.dto';
import { FilterTrainingRequestsDto } from './dto/filter-training-requests.dto';
import { UpdateTrainingRequestDto } from './dto/update-training-request.dto';

@Injectable()
export class TrainingRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateTrainingRequestDto) {
    return this.prisma.trainingRequest.create({
      data: createDto,
    });
  }

  async findAll(filterDto: FilterTrainingRequestsDto) {
    const { page = 1, limit = 10, status, organization } = filterDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (organization) {
      where.organization = {
        contains: organization,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.trainingRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.trainingRequest.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const request = await this.prisma.trainingRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Training request with ID ${id} not found`);
    }

    return request;
  }

  async update(
    id: string,
    updateDto: UpdateTrainingRequestDto,
    userId: string,
  ) {
    await this.findOne(id); // Ensure it exists

    return this.prisma.trainingRequest.update({
      where: { id },
      data: {
        ...updateDto,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure it exists

    return this.prisma.trainingRequest.delete({
      where: { id },
    });
  }
}
