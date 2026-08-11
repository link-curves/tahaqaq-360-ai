import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CONTENT_STATUS } from '../../common/constants/lookups';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBlogDto: CreateBlogDto) {
    // Check if slug already exists
    const existingBlog = await this.prisma.blog.findUnique({
      where: { slug: createBlogDto.slug },
    });

    if (existingBlog) {
      throw new ConflictException('Blog with this slug already exists');
    }

    // If publishing, set publishedAt
    // `status` on the DTO maps to the statusCode FK on the model.
    const { status, ...blogFields } = createBlogDto;
    const blogData: Prisma.BlogUncheckedCreateInput = {
      ...blogFields,
      statusCode: status ?? CONTENT_STATUS.DRAFT,
      publishedAt:
        status === CONTENT_STATUS.PUBLISHED ? new Date() : undefined,
    };

    return this.prisma.blog.create({
      data: blogData,
    });
  }

  async findAll(filterDto: FilterBlogDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      category,
      tag,
      status,
      search,
      isFeatured,
      author,
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.BlogWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    if (status) {
      where.statusCode = status;
    } else {
      // Public endpoint should only show published by default
      where.statusCode = CONTENT_STATUS.PUBLISHED;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (author) {
      where.author = {
        contains: author,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query
    const [data, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.blog.count({ where }),
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

  async findOne(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) {
      throw new NotFoundException(`Blog with slug "${slug}" not found`);
    }

    // Increment view count
    await this.prisma.blog.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    // Check if blog exists
    const existingBlog = await this.prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }

    // If slug is being updated, check uniqueness
    if (updateBlogDto.slug && updateBlogDto.slug !== existingBlog.slug) {
      const slugExists = await this.prisma.blog.findUnique({
        where: { slug: updateBlogDto.slug },
      });

      if (slugExists) {
        throw new ConflictException('Blog with this slug already exists');
      }
    }

    // Update publishedAt if status changes to PUBLISHED
    const { status: nextStatus, ...updateFields } = updateBlogDto;
    const updateData: Prisma.BlogUncheckedUpdateInput = { ...updateFields };
    if (nextStatus !== undefined) updateData.statusCode = nextStatus;
    if (
      nextStatus === CONTENT_STATUS.PUBLISHED &&
      existingBlog.statusCode !== CONTENT_STATUS.PUBLISHED
    ) {
      updateData.publishedAt = new Date();
    }

    return this.prisma.blog.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }

    return this.prisma.blog.delete({
      where: { id },
    });
  }

  async getCategories() {
    const blogs = await this.prisma.blog.findMany({
      where: { statusCode: CONTENT_STATUS.PUBLISHED },
      select: { category: true },
      distinct: ['category'],
    });

    return blogs.map((b) => b.category);
  }

  async getTags() {
    const blogs = await this.prisma.blog.findMany({
      where: { statusCode: CONTENT_STATUS.PUBLISHED },
      select: { tags: true },
    });

    // Flatten and get unique tags
    const allTags = blogs.flatMap((b) => b.tags);
    return [...new Set(allTags)];
  }
}
