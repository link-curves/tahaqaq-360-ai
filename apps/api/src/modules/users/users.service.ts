import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { UserResponseDto, UserStatsDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        bio: true,
        role: true,
        isEmailVerified: true,
        reputation: true,
        totalPoints: true,
        level: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      username: user.username ?? undefined,
      avatar: user.avatar ?? undefined,
      bio: user.bio ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async getUserStats(userId: string): Promise<UserStatsDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        reputation: true,
        totalPoints: true,
        level: true,
        _count: {
          select: {
            submissions: true,
            factChecks: true,
            comments: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Count completed courses
    const completedCourses = await this.prisma.courseProgress.count({
      where: {
        userId,
        isCompleted: true,
      },
    });

    return {
      totalSubmissions: user._count.submissions,
      totalFactChecks: user._count.factChecks,
      totalComments: user._count.comments,
      completedCourses,
      totalAchievements: user._count.achievements,
      reputation: user.reputation,
      totalPoints: user.totalPoints,
      level: user.level,
    };
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // If username is being updated, check if it's unique
    if (updateUserDto.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          username: updateUserDto.username,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Username already taken');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        bio: true,
        role: true,
        isEmailVerified: true,
        reputation: true,
        totalPoints: true,
        level: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    return {
      ...user,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      username: user.username ?? undefined,
      avatar: user.avatar ?? undefined,
      bio: user.bio ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  async updateEmail(
    userId: string,
    updateEmailDto: UpdateEmailDto,
  ): Promise<UserResponseDto> {
    // Verify current password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      updateEmailDto.currentPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Check if new email is already in use
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: updateEmailDto.email,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Update email
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: updateEmailDto.email,
        isEmailVerified: false, // Reset email verification
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        bio: true,
        role: true,
        isEmailVerified: true,
        reputation: true,
        totalPoints: true,
        level: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    return {
      ...updatedUser,
      firstName: updatedUser.firstName ?? undefined,
      lastName: updatedUser.lastName ?? undefined,
      username: updatedUser.username ?? undefined,
      avatar: updatedUser.avatar ?? undefined,
      bio: updatedUser.bio ?? undefined,
      lastLoginAt: updatedUser.lastLoginAt ?? undefined,
    };
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    // Verify current password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      updatePasswordDto.currentPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Hash new password
    const hashedPassword = await argon2.hash(updatePasswordDto.newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async deleteAccount(
    userId: string,
    password: string,
  ): Promise<{ message: string }> {
    // Verify password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Delete user (cascade will handle related records based on schema)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }
}
