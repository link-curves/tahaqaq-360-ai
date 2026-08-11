import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { createSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma.service';
import { CreateEventDto, HostRequestDto, RegisterEventDto } from './dto/create-event.dto';
import { EVENT_STATUS, EventStatusCode, EventTypeCode } from '../../common/constants/lookups';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateEventDto) {
    const slug = createSlug(createDto.title);

    // Validate dates
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const event = await this.prisma.event.create({
      data: {
        ...createDto,
        slug,
        startDate,
        endDate,
      },
    });

    return event;
  }

  async findAll(
    paginationDto: PaginationDto,
    type?: EventTypeCode,
    status?: EventStatusCode,
    upcoming?: boolean,
  ) {
    const { page = 1, limit = 10, sortBy = 'startDate', sortOrder = 'asc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (type) where.type = type;
    if (status) where.status = status;
    
    if (upcoming) {
      where.startDate = { gte: new Date() };
      where.status = { in: [EVENT_STATUS.UPCOMING, EVENT_STATUS.ONGOING] };
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(slug: string, updateDto: CreateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: { slug },
      data: updateDto,
    });
  }

  async remove(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.event.delete({
      where: { slug },
    });

    return { message: 'Event deleted successfully' };
  }

  async register(slug: string, userId: string, registerDto?: RegisterEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if event is full
    if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
      throw new BadRequestException('Event is full');
    }

    // Check if already registered
    const existing = await this.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: event.id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Already registered for this event');
    }

    // Check if event has started
    if (new Date() > event.startDate) {
      throw new BadRequestException('Cannot register for a past or ongoing event');
    }

    const registration = await this.prisma.eventRegistration.create({
      data: {
        userId,
        eventId: event.id,
      },
      include: {
        event: true,
      },
    });

    // Award points
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: { increment: 20 },
      },
    });

    // Send notification
    await this.prisma.notification.create({
      data: {
        userId,
        typeCode: 'EVENT_REMINDER',
        title: 'Event Registration Confirmed',
        message: `You've successfully registered for ${event.title}`,
        actionUrl: `/events/${slug}`,
      },
    });

    return registration;
  }

  async unregister(slug: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const registration = await this.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: event.id,
        },
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    await this.prisma.eventRegistration.delete({
      where: { id: registration.id },
    });

    return { message: 'Successfully unregistered from event' };
  }

  async getMyRegistrations(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      this.prisma.eventRegistration.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { registeredAt: 'desc' },
        include: {
          event: true,
        },
      }),
      this.prisma.eventRegistration.count({ where: { userId } }),
    ]);

    return {
      data: registrations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async submitHostRequest(hostRequestDto: HostRequestDto) {
    const hostRequest = await this.prisma.hostRequest.create({
      data: hostRequestDto,
    });

    // Notify admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
      },
      select: { id: true },
    });

    await this.prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        type: 'SYSTEM',
        title: 'New Host Request',
        message: `${hostRequestDto.name} wants to host: ${hostRequestDto.proposedTitle}`,
        actionUrl: `/admin/host-requests/${hostRequest.id}`,
      })),
    });

    return hostRequest;
  }

  async getHostRequests(paginationDto: PaginationDto, status?: string) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      this.prisma.hostRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.hostRequest.count({ where }),
    ]);

    return {
      data: requests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateEventStatus(slug: string, status: EventStatusCode) {
    return this.prisma.event.update({
      where: { slug },
      data: { status },
    });
  }

  async markAttendance(eventId: string, userId: string) {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    return this.prisma.eventRegistration.update({
      where: { id: registration.id },
      data: {
        attendedAt: new Date(),
        status: 'ATTENDED',
      },
    });
  }
}
