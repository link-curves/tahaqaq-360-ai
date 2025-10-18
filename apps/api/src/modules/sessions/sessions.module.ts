import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [PrismaModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
