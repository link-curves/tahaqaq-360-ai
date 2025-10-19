import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';
import { FaqService } from './faq.service';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published FAQs' })
  async getAllFAQs(): Promise<ApiResponse<Faq[]>> {
    const faqs = await this.faqService.findAll();
    return {
      data: faqs,
      message: 'FAQs retrieved successfully',
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get FAQ by ID' })
  async getFAQ(@Param('id') id: string): Promise<ApiResponse<Faq>> {
    const faq = await this.faqService.findOne(id);
    return {
      data: faq,
      message: 'FAQ retrieved successfully',
    };
  }

  // ============================================
  // ADMIN CRUD ENDPOINTS FOR FAQ
  // ============================================

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new FAQ (Admin/Moderator)' })
  async createFAQ(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an FAQ (Admin/Moderator)' })
  async updateFAQ(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete an FAQ (Admin only)' })
  async deleteFAQ(@Param('id') id: string) {
    return this.faqService.delete(id);
  }

  @Patch(':id/publish')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle FAQ publish status (Admin/Moderator)' })
  async toggleFAQPublish(@Param('id') id: string) {
    return this.faqService.togglePublish(id);
  }
}
