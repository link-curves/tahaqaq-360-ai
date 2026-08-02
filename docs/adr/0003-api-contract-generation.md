# ADR-0003: Generate the API client from OpenAPI

- **Status:** Proposed
- **Date:** 2026-08-02
- **Deciders:** Ali Traboulsi

## Context

The API contract is described in three places, and nothing keeps them in agreement:

| Layer | Location | Size |
|---|---|---|
| Truth | `apps/api/src/modules/*/dto/*.dto.ts` | ~24 modules |
| Public site client | `apps/web/src/lib/api.ts` | **1001 lines, hand-written** |
| Admin client | `apps/admin/src/lib/adminApi.ts` | **844 lines, hand-written** |

~1,845 lines of hand-maintained TypeScript that exist only to restate what the backend already knows.

Drift produces two failure modes, and **neither is caught at compile time**:

1. **Sending an undeclared field → HTTP 400.** `ValidationPipe` runs with
   `forbidNonWhitelisted: true`, so an extra field is rejected outright, not ignored. A form that
   posts a UI-only field fails with an error that looks unrelated to the change that caused it.
2. **A renamed or removed backend field → silently `undefined`.** The frontend interface still
   declares it, so everything compiles and the UI renders nothing.

Both are found at runtime, by a human, usually after deploy — in a repo with **near-zero test
coverage** and no reviewer. This is currently the most likely way a regression reaches the client.

Two things make this tractable: `@nestjs/swagger` is already wired up and emits an OpenAPI document
at `/api/docs` (dev only), and the response envelope is uniform, applied globally by
`TransformInterceptor`.

## Complication: the response envelope

Every response is wrapped:

```jsonc
{ "success": true, "data": <payload>, "message": "...", "meta": { ... } }
```

Generated clients will type the **envelope**, not the payload, so a thin unwrapping layer is needed
regardless of the tool chosen.

There is a subtlety worth encoding: the interceptor decides between the paginated and single-resource
shapes by checking for the presence of `data` + `total` + `page` + `limit` on the service's return
value. If a service stops returning all four, `meta` silently disappears. **Generation alone does not
fix this** — it is a backend-side contract that would need its own test (see BACKLOG item 6).

## Options

**A. Do nothing.** 0d.
Keep hand-writing. Cost is paid continuously, in exactly the failure mode most likely to reach the
client. Gets worse as the API grows.

**B. Generate types only** (`openapi-typescript`). **2–3d.**
Emit TypeScript types from the OpenAPI document; keep the existing hand-written fetch functions and
have them consume generated types. Minimal disruption — the calling code in components barely
changes. Drift becomes a **compile error**.
*Forecloses:* nothing. *Reversal:* trivial — delete the generated file, keep the old types.

**C. Generate a full typed client** (`openapi-fetch`, `orval`, or similar). **4–6d.**
Replace both client files entirely; optionally generate TanStack Query hooks too. Deletes the most
code and gives the strongest guarantees.
*Forecloses:* the freedom to hand-shape client functions; ties the frontend to generator conventions.
*Reversal:* harder — call sites across both apps change.

**D. Share types via a workspace package.** 3–4d.
Move DTO types into `packages/api-types` imported by all three apps. Avoids a generator, but couples
the frontends to backend internals and needs the DTOs to be import-safe from a Vite app (they carry
`class-validator` decorators and `reflect-metadata`, which is a real obstacle).

## Decision

**Recommended: B — generate types only.**

Reasoning:

- It converts the dangerous failure mode (silent runtime drift) into the safe one (a compile error)
  for **2–3 days**, which is the whole point.
- It is incremental. Types can be adopted one module at a time; the two apps do not have to migrate
  together, and nothing breaks if the work pauses halfway.
- C's extra 2–3 days buy mostly code deletion, which is nice but not the actual problem. C stays
  available later — B is a stepping stone to it, not a detour.
- D's coupling problem is real: `class-validator` decorators and `reflect-metadata` in a Vite bundle
  is a fight not worth having when a generator sidesteps it.

The one prerequisite: **Swagger currently only mounts when `NODE_ENV === 'development'`.** A
generation step needs the document reliably — either by booting the app in dev to emit it, or by
adding a small script that builds the OpenAPI JSON without serving it. Prefer the script; it makes
generation runnable in CI later.

## Consequences

**Positive:** DTO changes surface as type errors in both frontends at build time. The `advise.sh`
hook's DTO-drift warning becomes a backstop rather than the primary defence. Onboarding the contract
gets easier.

**Negative:** a generation step in the workflow that can be forgotten, leaving stale generated types
that are confidently wrong — arguably worse than no types. Mitigate by generating in CI and failing
the build on a diff.

**Not solved by this ADR:** the paginated-envelope fragility, and any case where backend and frontend
are wrong in the same way. Those need tests.

## Migration path

1. Add a script that emits `openapi.json` without serving Swagger (~0.5d).
2. Add `openapi-typescript` and a `generate:api-types` script; commit the output initially so nothing
   depends on the generator running (~0.5d).
3. Adopt generated types in **one module first** — `fact-checks` is the natural pilot, used by both
   apps (~0.5d).
4. Verify: rename a DTO field and confirm both frontends fail to build. **If this test does not fail,
   the whole exercise is theatre** — do not proceed until it does.
5. Roll out across remaining modules incrementally (~1–1.5d).
6. Later, if worthwhile: revisit C and delete the hand-written fetch layer.

## Open questions for the client

None — internal quality work, not client-visible. Sequence it where it does not compete with a
deliverable, but note it pays back on every subsequent feature.
