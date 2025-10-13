import { Module } from '@nestjs/common';
import { Fact-checksService } from './fact-checks.service';
import { Fact-checksController } from './fact-checks.controller';

@Module({
  controllers: [Fact-checksController],
  providers: [Fact-checksService],
})
export class Fact-checksModule {}
