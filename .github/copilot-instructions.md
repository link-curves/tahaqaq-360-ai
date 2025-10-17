# Tahaqaq-360 AI Coding Instructions

## Project Overview

**Tahaqaq-360** is a bilingual (Arabic/English) fact-checking and media literacy platform. It's a Turborepo monorepo with:

- **Backend**: NestJS API (`apps/api`) with Prisma ORM + PostgreSQL
- **Frontend**: React + Vite + shadcn/ui (`apps/web`)
- **Package Manager**: pnpm with workspace configuration

## Architecture Patterns

### Backend (NestJS)

#### Module Structure

All feature modules follow this pattern in `apps/api/src/modules/[feature]/`:

```
feature.module.ts      # Module definition with dependencies
feature.controller.ts  # REST endpoints with @ApiTags decorator
feature.service.ts     # Business logic with PrismaService injection
dto/*.dto.ts           # Validation DTOs with class-validator
```

#### Authentication & Authorization

- **Global JWT Guard**: Applied via `APP_GUARD` in `app.module.ts`
- **Opt-out pattern**: Use `@Public()` decorator for public endpoints (see `common/decorators/public.decorator.ts`)
- **Role-based access**: Use `@Roles(Role.ADMIN, Role.MODERATOR)` + `@UseGuards(RolesGuard)` for protected actions
- **Current user**: Access via `@CurrentUser('id')` or `@CurrentUser('role')` decorators
- **Example**:

  ```typescript
  @Public() // Public endpoint - no JWT required
  @Get(':slug')
  findOne(@Param('slug') slug: string) {}

  @UseGuards(RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateDto) {}
  ```

#### Database Access

- **Always** inject `PrismaService` from `database/prisma.module`
- Access via `this.prisma.[model].[operation]`
- Schema location: `apps/api/src/prisma/schema.prisma` (non-standard path)
- Seeding: Extensive bilingual seed data with Arabic-first content (see `ARABIC_SEEDING_SUMMARY.md`)

#### Global Configuration

- **Validation**: `ValidationPipe` with `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`
- **Versioning**: URI-based (`/api/v1/...`) via `VersioningType.URI`
- **Global filters**: `HttpExceptionFilter`, `PrismaExceptionFilter` for error handling
- **Interceptors**: `LoggingInterceptor`, `TransformInterceptor` for request/response processing
- **Security**: Helmet, compression, cookie-parser middleware applied in `main.ts`

#### Database Commands (run from `apps/api`)

```bash
pnpm db:generate          # Generate Prisma client
pnpm db:migrate           # Run migrations
pnpm db:studio            # Open Prisma Studio
pnpm db:seed              # Seed English data
pnpm db:seed:ar           # Seed Arabic data
pnpm db:fresh             # Reset + seed English
pnpm db:fresh:ar          # Reset + seed Arabic
```

### Frontend (React + Vite)

#### Routing & Auth

- **React Router v6** with protected routes via `<ProtectedRoute>` wrapper
- **Auth context**: `contexts/AuthContext.tsx` provides `useAuth()` hook
- **Cookie-based sessions**: Check `logged_in=true` cookie for auth state
- **React Query**: All API calls use `@tanstack/react-query` with 5-minute stale time

#### API Integration

- **Base URL**: `import.meta.env.VITE_API_URL` (falls back to `http://localhost:5000/api/v1`)
- **Client**: Centralized in `lib/api.ts` with typed interfaces matching Prisma schema enums
- **TypeScript types**: Manually sync frontend types with backend Prisma enums (`VeracityRating`, `EventType`, `SubmissionStatus`, etc.)

#### UI Components

- **Design system**: shadcn/ui components in `src/components/ui/`
- **Custom components**: Domain-specific in `src/components/` (e.g., `FactCheckingSection`, `EventsSection`)
- **Styling**: TailwindCSS v4 with `@tailwindcss/vite` plugin
- **Forms**: React Hook Form + Zod validation via `@hookform/resolvers`

## Development Workflows

### Running the Monorepo

```bash
# From root - runs all apps concurrently
pnpm dev

# Individual apps
cd apps/api && pnpm dev    # NestJS on :3000 (default)
cd apps/web && pnpm dev    # Vite on :3000 (check vite.config.ts)
```

### Building & Linting

```bash
pnpm build       # Turbo builds all apps (respects dependencies)
pnpm lint        # ESLint across workspace
pnpm format      # Prettier formatting
```

### Database Workflow

1. Modify `apps/api/src/prisma/schema.prisma`
2. Run `pnpm db:migrate` (creates migration + generates client)
3. Update frontend types in `apps/web/src/lib/api.ts` if enums changed
4. Reseed if needed: `pnpm db:fresh` or `pnpm db:fresh:ar`

## Key Conventions

### Naming & Structure

- **Slugs**: All content uses slug-based routing (`/fact-checks/:slug`, `/events/:slug`)
- **IDs**: CUIDs via `@default(cuid())` in Prisma
- **Bilingual**: Arabic content stored in same fields, use `ar` suffix for seed scripts/files
- **Timestamps**: All entities have `createdAt`, `updatedAt` via Prisma

### API Responses

- **Pagination**: All list endpoints use `PaginationDto` with `page`, `limit`, `sortBy`, `sortOrder`
- **Transformed**: Responses wrapped via `TransformInterceptor` for consistent structure
- **Swagger**: All controllers tagged with `@ApiTags`, operations documented with `@ApiOperation`

### Error Handling

- **Backend**: Use NestJS exceptions (`NotFoundException`, `BadRequestException`, etc.)
- **Frontend**: React Query error boundaries + Sonner toasts for user feedback
- **Prisma errors**: Automatically converted by `PrismaExceptionFilter`

## Common Pitfalls

1. **Prisma schema path**: Always use `--schema=src/prisma/schema.prisma` flag (non-standard location)
2. **Auth guards**: Remember `@Public()` for endpoints that don't require JWT (default is protected)
3. **CORS**: Backend configured via `CORS_ORIGIN` env var (comma-separated)
4. **Supabase storage**: File uploads use Supabase bucket (see `config/storage.config.ts`)
5. **Swagger**: Only enabled in development mode (check `NODE_ENV`)

## Environment Variables

### API (`apps/api/.env`)

```bash
DATABASE_URL, DATABASE_DIRECT_URL  # PostgreSQL
JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET
CORS_ORIGIN  # Comma-separated origins
```

### Web (`apps/web/.env`)

```bash
VITE_API_URL  # Backend API base URL
```

## Testing

- **Backend**: Jest configured (`test:*` scripts in `apps/api/package.json`)
- **E2E**: `pnpm test:e2e` runs NestJS e2e tests
- **Frontend**: No test setup currently (add Vitest if needed)

## Additional Resources

- **Arabic seeding details**: See `ARABIC_SEEDING_SUMMARY.md` for bilingual data patterns
- **Swagger docs**: Visit `/api/docs` when running API in development mode
- **Prisma Studio**: `pnpm db:studio` for GUI database management
