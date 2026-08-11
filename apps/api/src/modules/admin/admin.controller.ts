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

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { ROLE, RoleCode } from '../../common/constants/lookups';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers(
    @Query() paginationDto: PaginationDto,
    @Query('role') role?: RoleCode,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(paginationDto, role, search);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  updateUserRole(@Param('id') userId: string, @Body('role') role: RoleCode) {
    return this.adminService.updateUserRole(userId, role);
  }

  @Post('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user' })
  banUser(@Param('id') userId: string, @Body('reason') reason: string) {
    return this.adminService.banUser(userId, reason);
  }

  @Delete('users/:id')
  @Roles(ROLE.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a user (Super Admin only)' })
  deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Get('moderation/pending')
  @ApiOperation({ summary: 'Get pending content for moderation' })
  getPendingContent() {
    return this.adminService.getPendingContent();
  }

  @Get('contact-messages')
  @ApiOperation({ summary: 'Get contact messages' })
  getContactMessages(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.adminService.getContactMessages(paginationDto, status);
  }

  @Post('contact-messages/:id/respond')
  @ApiOperation({ summary: 'Respond to contact message' })
  respondToContact(
    @Param('id') messageId: string,
    @CurrentUser('id') adminId: string,
    @Body('response') response: string,
  ) {
    return this.adminService.respondToContact(messageId, adminId, response);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get system settings' })
  getSystemSettings() {
    return this.adminService.getSystemSettings();
  }

  @Patch('settings')
  @Roles(ROLE.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update system settings' })
  updateSystemSettings(@Body() settings: any) {
    return this.adminService.updateSystemSettings(settings);
  }
}
