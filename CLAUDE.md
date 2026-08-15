# mygaadi Admin Portal

A web admin portal for **mygaadi**, a vehicle service management platform. Full product/API spec is `PRD.md` — treat it as the source of truth for request/response shapes and validation rules, *except* where this file says it's wrong (see "Confirmed PRD vs. real-API discrepancies" below).

## Product context

Three separate products cover the PRD's four roles:

1. **Customer app** (mobile, Expo/React Native) — already built, separate repo, covers the Customer role only.
2. **Mechanic app** (mobile) — not started. Originally scoped as a combined "Station Manager + Mechanic" app; that changed (see below).
3. **This project** (web) — covers **both Admin and Station Manager** roles, role-gated by module. Mechanic is mobile-only, not a login role here.

### Role-gated module breakdown

- **Admin**: full CRUD on Vehicle Models/Variants/Spare Parts, full CRUD on Service Stations (all stations), cross-station Bookings (view any station's bookings, assign mechanic, update status), edit Service Charges.
- **Station Manager**: Vehicle Models/Variants/Spare Parts and Service Charges are **read-only**; "My Station" (view + edit inventory for their one assigned station, not full station CRUD) and "My Bookings" (their station's bookings only) replace Admin's Service Stations/Bookings screens.
- Implemented as: `getNavGroups(role)` in `src/routes/nav-items.ts` (per-role sidebar), `RequireRole` (`src/routes/require-role.tsx`) guarding Admin-only (`/service-stations`, `/bookings`, `/create-station-manager`) and Station-Manager-only (`/my-station`, `/my-bookings`) routes, and `useIsAdmin()` (`src/stores/auth-store.ts`) gating edit affordances on screens shared between both roles (Catalog, Finance).

## Tech stack

Vite + React 19 + TypeScript, Tailwind v4 + shadcn/ui (**Base UI**, not Radix — composition uses a `render` prop, e.g. `<DialogClose render={<Button variant="outline" />}>`, never `asChild`), TanStack Query for server state, TanStack Table for data tables (pinned to **v8** — v9 shipped a completely different feature-composition API), React Router v7, React Hook Form + Zod, Zustand for the auth store.

## Design system: "Shop Floor"

Grounded in the actual subject (vehicle service/workshop operations), not generic admin-dashboard defaults — see `src/index.css`.

- **Palette**: OKLCH tokens — `paper`/`ink` background/foreground, a permanently-dark-steel `rail` (sidebar stays dark in both light/dark mode — it's "equipment," not a themed surface), a burnt-orange `signal`/primary accent, and `status-*` tokens (requested/assigned/in-progress/completed/cancelled) for the booking workflow.
- **Type**: Space Grotesk (headings), IBM Plex Sans (body), IBM Plex Mono (data — IDs, prices, timestamps).
- **Layout**: grouped sidebar nav (Catalog / Operations / Finance / Accounts, not a flat list), `PageHeader` component (eyebrow + title) on every screen, hairline tables with mono numeric columns, `#001`-style padded IDs.
- **Signature element**: `BookingStatusStepper` (`src/features/bookings/booking-status-stepper.tsx`) — a stamped job-ticket style stepper for booking status, since REQUESTED→ASSIGNED→IN_PROGRESS→COMPLETED is a real sequence.
- Mobile: sidebar collapses to a Sheet-based drawer below `md`; shared `SidebarNav` component used by both. Tables scroll horizontally in their own container rather than reflowing (shadcn default).

## Current build status: mock data, not yet wired to the real API

Every feature (`src/features/*`) is fully built and working against an **in-memory mock API layer** (`createMockResource()` in `src/lib/mock-resource.ts`), not the real backend — there's no test login yet (see open questions). Each feature's `*-api.ts` file has a `TODO(api-integration)` comment marking where to swap in real calls through `src/lib/api-client.ts`. The mock/real swap should only require editing that one file per feature — page components, hooks, and forms call the API module by name and shouldn't need to change.

`src/features/my-station/*` and the account-creation pages additionally stand in with fixed mock IDs / no-op forms because the underlying endpoints are unconfirmed or undocumented (see open questions).

## Backend access

- Base URL is a Cloudflare tunnel, ephemeral (`trycloudflare.com` — expect it to change whenever the backend dev restarts it): as of 2026-08-15, `https://downloading-bible-shoot-gulf.trycloudflare.com` (see `.env` / `.env.example`, `VITE_API_BASE_URL`). Health check: `GET /api/public/health`.
- Auth: single `accessToken`, no refresh token, per the PRD. `Authorization: Bearer <token>` header. A 401 means the session is dead — `src/lib/api-client.ts` logs out automatically on 401, no retry/refresh flow exists.
- Login: `POST /api/auth/login` with `{ phoneNumber, password }` → `{ accessToken, tokenType, userId, firstName, lastName, role }`.
- Mock login buttons exist on the login page to preview both roles without real credentials. Shown when `import.meta.env.DEV` (always true under `vite dev`) **or** `VITE_ENABLE_MOCK_AUTH=true` is set (for demo/preview deployments — e.g. Vercel — that have no real backend to log into yet). Unset that env var once real login exists; anyone with the deployment URL can otherwise use it to get full Admin/Station Manager access to the mock data.

## Confirmed PRD vs. real-API discrepancies

Verified against the live backend while building customer-app, not assumptions:

- **`lastName` casing**: PRD writes `lastname` (lowercase) on some endpoints — the real API uses `lastName` (camelCase) consistently everywhere.
- **Path pluralization**: PRD documents singular `/api/user/me/...` and `/api/service-charge` — the real API uses plural `/api/users/me/...` and `/api/service-charges` throughout. **Likely affects an Admin-only endpoint not yet tested**: PRD §15.2 documents `PUT /api/service-charge/{serviceType}` (singular) — given the confirmed pattern, this almost certainly needs to be `PUT /api/service-charges/{serviceType}`. Verify before wiring up Service Charges.
- **Default location** (`GET /api/users/me/locations/default`): PRD says it returns `null` when none exists; real API returns `204 No Content` with an empty body.
- **Vehicle response includes an undocumented `modelName` field.**
- **`PUT /api/users/me/profile` doesn't return a fresh session** like the PRD says (no `accessToken`) — it returns the same plain profile shape as `GET /api/users/me`.
- **`serviceType`'s real values**: `GENERAL_SERVICE`, `REPAIR`, `BREAKDOWN`, `WARRANTY`, `INSPECTION`. Not documented in the PRD as an enum — treat as open/dynamic data, don't hardcode as a fixed set.
- **The server returns a generic `500` for an unmatched route instead of a `404`.** When something 500s unexpectedly, double-check the exact path against a working sibling endpoint before assuming it's a real server bug.

**General lesson**: the PRD is Draft status with real gaps between what it documents and what the backend actually does. Verify each new endpoint live (curl it) before wiring a screen up to it — don't trust the PRD's literal path/shape without a live check.

## Open questions (need backend dev / product owner input)

1. **How does an Admin/Station Manager/Mechanic account get created?** `POST /api/auth/register` has no `role` field and always creates a `CUSTOMER`. **Partially resolved**: a MindMeister "My Garage" product mind map (not part of the PRD) shows dedicated "Create Station Manager" (Admin-only) and "Create Mechanic" (Station Manager + Admin) features — placeholder screens exist (`src/features/accounts/`) but the real endpoint/shape is still unconfirmed.
2. **How does Admin find/list "eligible" Station Manager users** to assign when creating a station (§10.2 requires an existing `managerId`)? No listing/search endpoint is documented — the Service Station form currently takes raw location/manager IDs with mock values documented inline.
3. Whether there's any user-management surface for Admin at all (list customers, list mechanics, deactivate an account) — the PRD's Admin description is vague on this.
4. **Which station is a Station Manager assigned to?** No `GET /api/service-stations/me` (or equivalent) is documented — only `GET /api/service-stations/me/service-requests` for bookings. "My Station" stands in with a fixed mock station ID (`MOCK_MY_STATION_ID` in `src/features/station-inventory/station-inventory-api.ts`) until this is confirmed.

### Unresolved conflicts between the mind map and the PRD — do not build against either side yet

The mind map above confirms most of the PRD's access-control rules but conflicts in three places. Current code follows the **PRD** for all three, unchanged — flagged as open decisions, not resolved:

1. **Service Charge edit rights** — mind map tags Create/Update/Delete as Station-Manager-only (no Admin tag); PRD §15.2 says the opposite (Admin-only edit, Station Manager read-only). Direct contradiction.
2. **Update/Delete Station** — mind map grants these to Station Manager too; PRD's section headings say Admin-only.
3. **Assign Mechanic to a booking** — mind map tags Mechanic as able to self-assign; PRD §13.10 restricts it to Station Manager/Admin. (Doesn't affect this portal directly since Mechanic isn't a login role here.)

Resolve with the backend dev / product owner before changing role restrictions on Service Charges, Service Station update/delete, or assign-mechanic.

## Setup checklist before real API integration

- [ ] Get a real Admin login **and** a real Station Manager login from the backend dev.
- [ ] Verify every endpoint live (curl) before wiring a screen up to it, especially the flagged pluralization issue on service-charges.
- [ ] Confirm the account-creation endpoint (open question #1) and the Station Manager's own-station lookup (open question #4) before building those screens for real.
