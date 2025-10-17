import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactMessage, Prisma } from '@prisma/client';
import { ApiResponse } from '../../../../web/src/lib/api';
import { Public } from '../../common/decorators/public.decorator';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Get()
  async getContactUSInfo(): Promise<ApiResponse<ContactMessage | null>> {
    return {
      data: await this.contactService.getContactUSInfo(),
      message: 'Contact US information retrieved successfully',
    };
  }

  @Public()
  @Post('submit')
  async submitContactUSMessage(
    @Body() contactUSInfo: Prisma.ContactMessageCreateInput,
  ): Promise<ApiResponse<ContactMessage>> {
    return {
      data: await this.contactService.submitContactUSMessage({ contactUSInfo }),
      message: 'Contact message submitted successfully',
    };
  }
}
