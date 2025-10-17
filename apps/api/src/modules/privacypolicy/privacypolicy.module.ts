import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { PrivacyPolicyController } from './privacypolicy.controller';
import { PrivacyPolicyService } from './privacypolicy.service';

@Module({
  imports: [PrismaModule],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService],
})
export class PrivacyPolicyModule {}
