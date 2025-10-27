import { Controller, Get } from '@nestjs/common';
import { AccessibilityStatement } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { AccessibilityStatementService } from './accessiblitystatement.service';

@Controller('accessibility-statement')
export class AccessibilityStatementController {
  constructor(
    private readonly accessibilityStatementService: AccessibilityStatementService,
  ) {}

  @Public()
  @Get()
  async getAccessibilityStatement(): Promise<
    ApiResponse<AccessibilityStatement | null>
  > {
    return {
      data: await this.accessibilityStatementService.getAccessibilityStatement(),
      message: 'Accessibility Statement retrieved successfully',
    };
  }
}
