---
name: api-contract-sync
description: Keep the hand-written frontend API clients in sync with backend DTOs. Use whenever a DTO, controller route, or response shape changes in apps/api, or when a frontend call returns 400 / undefined fields. This repo has no generated types — drift is silent and common.
---

# Syncing the API contract

## The problem

There is no code generation. Three places describe the same contract and nothing enforces agreement:

| Layer | File | Size |
|---|---|---|
| Backend truth | `apps/api/src/modules/<feature>/dto/*.dto.ts` | — |
| Public site client | `apps/web/src/lib/api.ts` | 1001 lines |
| Admin client | `apps/admin/src/lib/adminApi.ts` | 844 lines |

Drift produces two failure modes, neither of which shows up at compile time:

1. **Sending an undeclared field → HTTP 400.** The backend runs `forbidNonWhitelisted: true`, so an
   extra field is rejected outright rather than ignored.
2. **A renamed or removed field → silently `undefined`.** The TypeScript interface still declares it,
   so the frontend compiles and then renders nothing.

## The envelope

Every response is wrapped by `TransformInterceptor`:

```jsonc
// single
{ "success": true, "data": { ... }, "message": "...", "meta": { ... } }

// paginated
{ "success": true, "data": [ ... ],
  "meta": { "total", "page", "limit", "totalPages", "hasNextPage", "hasPreviousPage" } }
```

Frontends must unwrap `.data`. If pagination `meta` is missing at runtime, the cause is almost always
backend-side: the service stopped returning all four of `data`/`total`/`page`/`limit`, so the
interceptor took the single-resource branch.

## Procedure when a DTO changes

1. **Find the truth.**
   ```bash
   cat apps/api/src/modules/<feature>/dto/*.dto.ts
   ```
   The `class-validator` decorators define what is accepted; `@ApiProperty({ required: false })` and
   `?` mark optionality.

2. **Find every consumer.**
   ```bash
   grep -n "<feature>" apps/web/src/lib/api.ts apps/admin/src/lib/adminApi.ts
   grep -rn "<Feature>" apps/web/src apps/admin/src --include=*.tsx
   ```

3. **Update both clients.** Even if only one app uses the endpoint today, check both — several
   endpoints are consumed by each.

4. **Match optionality exactly.** A field the DTO marks `@IsOptional()` must be `?` in the client. A
   required DTO field typed optional in the client produces a 400 that looks like a random failure.

5. **Verify.**
   ```bash
   cd apps/web && pnpm build      # and apps/admin
   ```
   This catches type errors only — it cannot detect a field name that both sides got wrong the same
   way. When practical, exercise the endpoint.

## Debugging a 400

The backend rejects unknown fields. Read the response body — `ValidationPipe` names the offending
property.

- `property X should not exist` → the client sends a field the DTO does not declare. Remove it from
  the client, or add it to the DTO (a deliberate contract change).
- `X must be a string` / `X should not be empty` → type or requiredness mismatch.

Common cause: a form built from a UI mockup posts every form field, including UI-only state.

## Debugging `undefined` fields

1. Check the raw response — is the payload under `.data`?
2. Compare the backend `select` clause against what the client expects. A `select` that omits a field
   returns it as absent, not null.
3. Check for a rename that only landed on one side.

## The real fix

This whole class of bug is structural. `@nestjs/swagger` already produces an OpenAPI document at
`/api/docs`, so generating a typed client is achievable and would delete ~1,850 lines of hand-written
code. That is tracked as **ADR-0003**. Until it is accepted, follow the manual procedure above —
do not start a partial migration.
