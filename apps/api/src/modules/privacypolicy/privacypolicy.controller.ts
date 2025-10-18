import { Controller, Get } from '@nestjs/common';
import { PrivacyPolicy } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { PrivacyPolicyService } from './privacypolicy.service';

@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {}

  @Public()
  @Get()
  async getPrivacyPolicy(): Promise<ApiResponse<PrivacyPolicy | null>> {
    const privacyPolicy =
      await this.privacyPolicyService.getPrivacyPolicyText();
    return {
      data: privacyPolicy,
      message: 'Privacy Policy retrieved successfully',
    };
  }
}
