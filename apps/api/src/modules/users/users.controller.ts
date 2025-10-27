import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get current user statistics' })
  async getUserStats(@CurrentUser('id') userId: string) {
    return this.usersService.getUserStats(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Put('email')
  @ApiOperation({ summary: 'Update user email' })
  async updateEmail(
    @CurrentUser('id') userId: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.usersService.updateEmail(userId, updateEmailDto);
  }

  @Put('password')
  @ApiOperation({ summary: 'Update user password' })
  async updatePassword(
    @CurrentUser('id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Delete user account' })
  async deleteAccount(
    @CurrentUser('id') userId: string,
    @Body('password') password: string,
  ) {
    return this.usersService.deleteAccount(userId, password);
  }
}
