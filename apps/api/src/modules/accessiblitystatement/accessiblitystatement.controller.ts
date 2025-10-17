import { Controller } from '@nestjs/common';
import { AccessibilityStatement } from '@prisma/client';
import { ApiResponse } from '../../../../web/src/lib/api';
import { AccessibilityStatementService } from './accessiblitystatement.service';

@Controller('accessibility-statement')
export class AccessibilityStatementController {
  constructor(
    private readonly accessibilityStatementService: AccessibilityStatementService,
  ) {}

  async getAccessibilityStatement(): Promise<
    ApiResponse<AccessibilityStatement | null>
  > {
    return {
      data: await this.accessibilityStatementService.getAccessibilityStatement(),
      message: 'Accessibility Statement retrieved successfully',
    };
  }
}
