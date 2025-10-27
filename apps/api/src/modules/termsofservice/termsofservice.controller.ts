import { Controller, Get } from '@nestjs/common';
import { TermsOfService } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { TermsofserviceService } from './termsofservice.service';

@Controller('terms-of-service')
export class TermsofserviceController {
  constructor(private readonly termsofserviceService: TermsofserviceService) {}

  @Public()
  @Get()
  async getTermsOfService(): Promise<ApiResponse<TermsOfService | null>> {
    const termsOfService =
      await this.termsofserviceService.getTermsOfServiceText();
    return {
      data: termsOfService,
      message: 'Terms of Service retrieved successfully',
    };
  }
}
