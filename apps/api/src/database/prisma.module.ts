import { Global, Module } from '@nestjs/common';
import { LookupIntegrityService } from './lookup-integrity.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, LookupIntegrityService],
  exports: [PrismaService],
})
export class PrismaModule {}
