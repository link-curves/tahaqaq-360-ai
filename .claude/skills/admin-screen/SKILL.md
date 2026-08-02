---
name: admin-screen
description: Add or modify a management screen in the admin panel (apps/admin). Use when building admin CRUD for a content type. Non-obvious because the admin app has no router — screens are tab components inside a single shell, not routes.
---

# Adding an admin management screen

## The structural surprise

`apps/admin` has only **two pages**: `AdminLogin.tsx` and `Admin.tsx`. There is **no admin router**.

The real shell is `components/admin/AdminDashboard.tsx`, which renders a screen via a `switch` on an
`activeTab` string. `Admin.tsx` just wraps `AdminDashboard` in `AdminLayout`.

**A new admin screen is a new `case` in that switch, not a route.** Do not add React Router routes to
the admin app without a decision from the `solution-architect` agent — it changes the app's shape.

Currently wired tabs (verified in `AdminDashboard.tsx`):
`dashboard`, `blogs`, `events`, `factchecks`, `education`, `research`, `courses`, `faqs`,
`analytics`. Note `settings` is **commented out** — `SettingsView.tsx` exists but is not reachable.

```
src/components/admin/
  AdminDashboard.tsx                                  # the switch — wire new screens HERE
  AdminLayout.tsx  AdminSidebar.tsx  AdminNavbar.tsx  # shell/nav
  DashboardOverviewNew.tsx  FactCheckManagementNew.tsx
  EducationManagementNew.tsx  EventManagementNew.tsx
  BlogManagement.tsx  CourseManagement.tsx
  ResearchManagement.tsx  FAQManagement.tsx
  DataTable.tsx  StatsCard.tsx  ContentEditor.tsx  ConfirmDialog.tsx   # reusable
  AnalyticsView.tsx  SettingsView.tsx                 # SettingsView is currently unreachable
```

⚠️ **`DashboardOverview.tsx` is dead code** — verified unreferenced anywhere. The live component is
`DashboardOverviewNew.tsx`. Editing the wrong twin is an easy and silent mistake; grep before editing.

## Procedure

1. **Confirm the backend exists.** Check `apps/api/src/modules/<feature>/` for the admin-facing
   endpoints and their required roles (`MODERATOR`, `ADMIN`, `SUPER_ADMIN`).

2. **Add the client methods** to `apps/admin/src/lib/adminApi.ts`, matching the backend DTOs exactly.
   The client is hand-written — see the `api-contract-sync` skill.

3. **Build the component** in `src/components/admin/<Feature>Management.tsx`. Reuse:
   - `DataTable.tsx` for lists
   - `ContentEditor.tsx` for rich content
   - `ConfirmDialog.tsx` for destructive actions — **always confirm deletes**, this is client data
   - `StatsCard.tsx` for summary tiles

4. **Wire it into the shell** — add a `case "<tab>"` to the switch in `AdminDashboard.tsx` **and** the
   corresponding nav entry in `AdminSidebar.tsx`. Both are required: a missing case renders nothing,
   a missing nav entry makes it unreachable. Verify by loading the app, not by building.

5. **Respect roles in the UI.** Read the role from `contexts/AdminAuthContext.tsx` and hide controls
   the user cannot use. This is UX, not security — the backend `RolesGuard` is the actual control,
   and it must be enforced there regardless.

## Data fetching

TanStack Query v5.

- `queryKey` must include every filter/page/id that affects the result, or lists go stale after edits.
- Mutations must invalidate the **list** query, not only the detail query — otherwise the table still
  shows the old row after a save.
- Unwrap the response envelope: payload is under `.data`, pagination under `.meta`.

## Content status

Content types use `ContentStatus`: `DRAFT → UNDER_REVIEW → PUBLISHED → ARCHIVED`.
Submissions use `SubmissionStatus`: `PENDING → IN_REVIEW → VERIFIED | REJECTED → PUBLISHED`.

Expose transitions deliberately. **Publishing is the highest-consequence action in this product** —
it puts a verdict under the client organization's name. Confirm before publish, and never build a
bulk-publish control without asking Ali first.

## Fact-check specifics

The `VeracityRating` scale has 8 values: `TRUE, MOSTLY_TRUE, HALF_TRUE, MOSTLY_FALSE, FALSE,
UNVERIFIABLE, SATIRE, MISLEADING`. This is a published editorial commitment — render all 8, never
collapse or reorder them, and never add a value without a product decision.

## Arabic / RTL

The admin UI is Arabic. Use logical CSS properties (`ms-*`/`me-*`, `start`/`end`) rather than
`ml-*`/`mr-*` so layout survives the bilingual work in ADR-0002. Mirror directional icons.

## Verify

```bash
cd apps/admin && pnpm build && pnpm lint
```

There are no frontend tests. A passing build is not a working screen — load it at
`http://localhost:3001` and exercise the flow, or state that it is unverified.

Remember: the 50 `components/ui/` files are duplicated verbatim with `apps/web`. Fixing one there
does not fix the other.
