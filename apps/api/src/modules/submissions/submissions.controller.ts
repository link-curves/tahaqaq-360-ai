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

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateSubmissionDto,
  UpdateSubmissionStatusDto,
} from './dto/create-submission.dto';
import { SubmissionsService } from './submissions.service';
import { ROLE, RoleCode, SUBMISSION_STATUS, SubmissionStatusCode } from '../../common/constants/lookups';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit content for fact-checking' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateSubmissionDto,
  ) {
    return this.submissionsService.create(userId, createDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all submissions (Moderators only)' })
  @ApiQuery({ name: 'status', required: false, enum: Object.values(SUBMISSION_STATUS) })
  @ApiQuery({ name: 'type', required: false })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: SubmissionStatusCode,
    @Query('type') type?: string,
  ) {
    return this.submissionsService.findAll(paginationDto, status, type);
  }

  @Get('my-submissions')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my submissions' })
  getMySubmissions(
    @CurrentUser('id') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.submissionsService.getMySubmissions(userId, paginationDto);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get submission statistics' })
  getStats() {
    return this.submissionsService.getStats();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a single submission' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: RoleCode,
  ) {
    return this.submissionsService.findOne(id, userId, userRole);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update submission status' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') moderatorId: string,
    @Body() updateDto: UpdateSubmissionStatusDto,
  ) {
    return this.submissionsService.updateStatus(id, moderatorId, updateDto);
  }

  @Patch(':id/priority')
  @UseGuards(RolesGuard)
  @Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Assign priority to submission' })
  assignPriority(@Param('id') id: string, @Body('priority') priority: number) {
    return this.submissionsService.assignPriority(id, priority);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a submission (Admin only)' })
  deleteSubmission(@Param('id') id: string) {
    return this.submissionsService.deleteSubmission(id);
  }
}
