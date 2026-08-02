---
name: nestjs-module
description: Create or extend a feature module in apps/api. Use when adding a new backend feature, endpoint, or resource to the NestJS API — covers module structure, auth decorators, the response envelope, DTO strictness, and registration in app.module.ts.
---

# Adding a feature module to the Tahaqaq 360 API

Reference implementation: `apps/api/src/modules/fact-checks/`. Mirror it.

## 1. Structure

```
apps/api/src/modules/<feature>/
  <feature>.module.ts
  <feature>.controller.ts
  <feature>.service.ts
  dto/create-<feature>.dto.ts
  dto/update-<feature>.dto.ts
  dto/<feature>-filter.dto.ts
  entities/<feature>.entity.ts
```

Naming is kebab-case for directories and files, PascalCase for classes.

## 2. Controller

Auth is **deny-by-default** — `JwtAuthGuard` is bound globally in `app.module.ts`.

```ts
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('<Feature>')
@Controller('<feature>')
export class <Feature>Controller {
  constructor(private readonly service: <Feature>Service) {}

  @Public()                                   // public read — no JWT
  @Get()
  @ApiOperation({ summary: '...' })
  @ApiQuery({ name: 'page', required: false })
  findAll(@Query() filterDto: <Feature>FilterDto) {
    return this.service.findAll(filterDto);
  }

  @UseGuards(RolesGuard)                      // REQUIRED — @Roles alone is inert
  @Roles(Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: Create<Feature>Dto) {
    return this.service.create(userId, dto);
  }
}
```

**Before writing `@Public()`, answer:** does this return PII, return user-owned data, or accept a
write? If yes to any, it is not public.

**`@Roles()` without `@UseGuards(RolesGuard)` does nothing** — the route stays open to every
authenticated user. Always pair them.

Roles ascend: `USER < MODERATOR < ADMIN < SUPER_ADMIN`.

## 3. Service — return bare data

`TransformInterceptor` wraps every response globally as `{ success, data, message, meta }`.
Never construct that envelope yourself.

For a paginated list, return **exactly** this shape:

```ts
return { data, total, page, limit, totalPages, hasNextPage, hasPreviousPage };
```

The interceptor detects pagination by the presence of `data` + `total` + `page` + `limit`. Drop any
one of them and it silently falls through to the single-resource branch — `meta` disappears and
frontend pagination breaks with no error anywhere.

Other rules:

- Inject `PrismaService` from `database/prisma.module`. Never `new PrismaClient()`.
- `select` away `password`, `googleId`, and tokens on any user-facing read.
- Always bound `findMany` with `take`.
- For user-owned resources, filter by `userId` in the `where` clause. Do not fetch by id and then
  compare — and never trust a client-supplied id without an ownership check (IDOR).
- Slugs use `slugify` from `common/utils/slug.util.ts` and are `@unique`.

## 4. DTOs are strict

`ValidationPipe` runs with `whitelist: true`, **`forbidNonWhitelisted: true`**, `transform: true`,
`enableImplicitConversion: true`.

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class Create<Feature>Dto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  summary?: string;
}
```

Extend `PaginationDto` from `common/dto/pagination.dto.ts` for filter DTOs.

**Any field not declared here causes a 400.** This is the contract the hand-written frontend clients
depend on.

## 5. Register the module

Add to `apps/api/src/app.module.ts` under the correct banner comment — `CORE FEATURE MODULES`,
`SUPPORTING MODULES`, or `ADMIN MODULE`. A module that is not registered does not exist.

Add the Swagger tag in `main.ts` if the feature is public-facing.

## 6. Update the frontend clients

The API clients are **hand-written** and will not tell you they are stale:

- `apps/web/src/lib/api.ts`
- `apps/admin/src/lib/adminApi.ts`

Add the types and calls by hand. Skipping this is the most common source of runtime 400s here.

## 7. Verify

```bash
cd apps/api && pnpm build && pnpm lint
```

Coverage is near-zero — a passing build does **not** mean the feature works. Say so plainly, or
write a spec (see the `test-engineer` agent).
