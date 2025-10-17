import { Controller, Get } from '@nestjs/common';
import { PrivacyPolicy } from '@prisma/client';
import { ApiResponse } from '../../../../web/src/lib/api';
import { Public } from '../../common/decorators/public.decorator';
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
