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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateTrainingRequestDto } from './dto/create-training-request.dto';
import { FilterTrainingRequestsDto } from './dto/filter-training-requests.dto';
import { UpdateTrainingRequestDto } from './dto/update-training-request.dto';
import { TrainingRequestsService } from './training-requests.service';

@ApiTags('Training Requests')
@Controller('training-requests')
export class TrainingRequestsController {
  constructor(
    private readonly trainingRequestsService: TrainingRequestsService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a training request (Public)' })
  create(@Body() createDto: CreateTrainingRequestDto) {
    return this.trainingRequestsService.create(createDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Get all training requests (Admin/Moderator only)' })
  findAll(@Query() filterDto: FilterTrainingRequestsDto) {
    return this.trainingRequestsService.findAll(filterDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Get a training request by ID (Admin/Moderator only)',
  })
  findOne(@Param('id') id: string) {
    return this.trainingRequestsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({
    summary: 'Update training request status (Admin/Moderator only)',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTrainingRequestDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.trainingRequestsService.update(id, updateDto, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a training request (Admin only)' })
  remove(@Param('id') id: string) {
    return this.trainingRequestsService.remove(id);
  }
}
