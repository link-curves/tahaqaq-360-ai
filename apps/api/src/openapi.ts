import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';

/**
 * Emits openapi.json WITHOUT serving Swagger or connecting to a database.
 *
 * Swagger only mounts when NODE_ENV === 'development', so the frontends could
 * not generate types from a deployed API. This script decouples the two: the
 * document is a build artifact, produced from the same decorators Swagger uses.
 *
 * `preview: true` tells Nest to build the module graph for introspection
 * without instantiating providers — so PrismaService never connects and this
 * runs anywhere, including CI with no database.
 *
 *   pnpm openapi        -> writes apps/api/openapi.json
 *   pnpm gen:api-types  -> turns that into TypeScript for both frontends
 *
 * See ADR-0003.
 */
async function generate() {
  const app = await NestFactory.create(AppModule, {
    preview: true,
    logger: false,
  });

  // Must mirror main.ts, or generated paths will not match real routes.
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

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
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const out = join(__dirname, '..', 'openapi.json');
  writeFileSync(out, JSON.stringify(document, null, 2));

  const paths = Object.keys(document.paths ?? {}).length;
  const schemas = Object.keys(document.components?.schemas ?? {}).length;
  console.log(`✅ openapi.json written: ${paths} paths, ${schemas} schemas`);

  await app.close();
}

generate().catch((err) => {
  console.error('Failed to generate openapi.json:', err);
  process.exit(1);
});
