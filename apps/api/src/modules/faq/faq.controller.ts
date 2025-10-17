import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ApiResponse } from './../../../../web/src/lib/api';
import { Faq } from './entities/faq.entity';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Public()
  @Get()
  async getAllFAQs(): Promise<ApiResponse<Faq[]>> {
    const faqs = await this.faqService.findAll();
    return {
      data: faqs,
      message: 'FAQs retrieved successfully',
    };
  }
}
