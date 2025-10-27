import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

// Database
import { PrismaModule } from './database/prisma.module';

// Core Modules
import { AuthModule } from './modules/auth/auth.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { ContactModule } from './modules/contact/contact.module';
import { EventsModule } from './modules/events/events.module';
import { FactChecksModule } from './modules/fact-checks/fact-checks.module';
import { MediaLiteracyModule } from './modules/media-literacy/media-literacy.module';
import { ResearchModule } from './modules/research/research.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { TrainingRequestsModule } from './modules/training-requests/training-requests.module';
import { UsersModule } from './modules/users/users.module';

// Additional Modules
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { MediaModule } from './modules/media/media.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';

// Guards
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { appConfig } from './config/app.config';
import {
  databaseConfig,
  googleConfig,
  jwtConfig,
  storageConfig,
} from './config/database.config';
import { emailConfig } from './config/email.config';
import { AccessibilityStatementModule } from './modules/accessiblitystatement/accessiblitystatement.module';
import { BlogModule } from './modules/blog/blog.module';
import { FaqModule } from './modules/faq/faq.module';
import { PrivacyPolicyModule } from './modules/privacypolicy/privacypolicy.module';
import { TermsofserviceModule } from './modules/termsofservice/termsofservice.module';

@Module({
  imports: [
    // ============================================
    // CONFIGURATION
    // ============================================
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        jwtConfig,
        googleConfig,
        databaseConfig,
        emailConfig,
        storageConfig,
        appConfig,
      ],
      envFilePath: ['.env.local', '.env'],
    }),

    // ============================================
    // RATE LIMITING
    // ============================================
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60000),
          limit: config.get<number>('THROTTLE_LIMIT', 10),
        },
      ],
    }),

    // ============================================
    // SCHEDULING
    // ============================================
    ScheduleModule.forRoot(),

    // ============================================
    // DATABASE
    // ============================================
    PrismaModule,

    // ============================================
    // CORE FEATURE MODULES
    // ============================================
    AuthModule,
    UsersModule,
    FactChecksModule,
    SubmissionsModule,
    MediaLiteracyModule,
    CertificatesModule,
    EventsModule,
    SessionsModule,
    ResearchModule,
    ContactModule,
    TrainingRequestsModule,
    BlogModule,

    // ============================================
    // SUPPORTING MODULES
    // ============================================
    NotificationsModule,
    AnalyticsModule,
    SearchModule,
    MediaModule,
    GamificationModule,
    ModerationModule,
    AccessibilityStatementModule,
    PrivacyPolicyModule,
    TermsofserviceModule,
    FaqModule,

    // ============================================
    // ADMIN MODULE
    // ============================================
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    // Global JWT Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Rate Limiting Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
