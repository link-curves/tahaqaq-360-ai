import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EventStatus, EventType, Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateEventDto,
  HostRequestDto,
  RegisterEventDto,
} from './dto/create-event.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new event' })
  create(@Body() createDto: CreateEventDto) {
    return this.eventsService.create(createDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiQuery({ name: 'type', required: false, enum: EventType })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  @ApiQuery({ name: 'upcoming', required: false, type: Boolean })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('type') type?: EventType,
    @Query('status') status?: EventStatus,
    @Query('upcoming') upcoming?: boolean,
  ) {
    return this.eventsService.findAll(paginationDto, type, status, upcoming);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get event details' })
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findOne(slug);
  }

  @Post(':slug/register')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register for an event' })
  register(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @Body() registerDto: RegisterEventDto,
  ) {
    return this.eventsService.register(slug, userId, registerDto);
  }

  @Delete(':slug/register')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Unregister from an event' })
  unregister(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.eventsService.unregister(slug, userId);
  }

  @Get('my/registrations')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my event registrations' })
  getMyRegistrations(
    @CurrentUser('id') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.eventsService.getMyRegistrations(userId, paginationDto);
  }

  @Public()
  @Post('host-request')
  @ApiOperation({ summary: 'Submit a request to host an event' })
  submitHostRequest(@Body() hostRequestDto: HostRequestDto) {
    return this.eventsService.submitHostRequest(hostRequestDto);
  }

  @Patch(':slug')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an event' })
  update(@Param('slug') slug: string, @Body() updateDto: CreateEventDto) {
    return this.eventsService.update(slug, updateDto);
  }

  @Delete(':slug')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete an event' })
  remove(@Param('slug') slug: string) {
    return this.eventsService.remove(slug);
  }
}
