import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Use require for CommonJS modules to avoid compilation issues
const compression = require('compression');
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;
  const environment = configService.get<string>('NODE_ENV') || 'development';

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================
  app.use(
    helmet({
      contentSecurityPolicy: environment === 'production',
      crossOriginEmbedderPolicy: environment === 'production',
    }),
  );

  app.use(compression());
  app.use(cookieParser());

  // ============================================
  // CORS
  // ============================================

  const whitelist = [
    'https://tahaqaq-360-web.netlify.app',
    'https://tahaqaq-360-admin.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5678',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // ============================================
  // API VERSIONING
  // ============================================
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ============================================
  // GLOBAL PREFIX
  // ============================================
  app.setGlobalPrefix('api');

  // ============================================
  // GLOBAL PIPES
  // ============================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ============================================
  // GLOBAL FILTERS
  // ============================================
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  // ============================================
  // GLOBAL INTERCEPTORS
  // ============================================
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // ============================================
  // SWAGGER DOCUMENTATION
  // ============================================
  if (environment === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Tahaqaq 360 API')
      .setDescription(
        'Fact-checking and Media Literacy Platform API Documentation',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management')
      .addTag('Fact Checks', 'Fact checking operations')
      .addTag('Submissions', 'User submissions')
      .addTag('Media Literacy', 'Educational content')
      .addTag('Certificates', 'Certificate management')
      .addTag('Events', 'Events and workshops')
      .addTag('Sessions', 'Recorded sessions')
      .addTag('Research', 'Research and insights')
      .addTag('FAQ', 'Frequently asked questions')
      .addTag('Contact', 'Contact messages')
      .addTag('Admin', 'Admin panel operations')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'Tahaqaq 360 API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
    });

    console.log(
      `📚 API Documentation available at: http://localhost:${port}/api/docs`,
    );
  }

  // ============================================
  // GRACEFUL SHUTDOWN
  // ============================================
  app.enableShutdownHooks();

  // ============================================
  // START SERVER
  // ============================================
  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║   🚀 Tahaqaq 360 Backend is running!                ║
    ║                                                       ║
    ║   Environment: ${environment.padEnd(35)}  ║
    ║   Port:        ${port.toString().padEnd(35)}  ║
    ║   URL:         http://localhost:${port}/api${' '.repeat(17)}  ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
  `);
}

bootstrap();
