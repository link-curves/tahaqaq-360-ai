import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { TermsofserviceController } from './termsofservice.controller';
import { TermsofserviceService } from './termsofservice.service';

@Module({
  imports: [PrismaModule],
  controllers: [TermsofserviceController],
  providers: [TermsofserviceService],
})
export class TermsofserviceModule {}
