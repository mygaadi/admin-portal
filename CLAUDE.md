# mygaadi Admin Portal

A web admin portal for **mygaadi**, a vehicle service management platform. Full product/API spec is `PRD.md` — treat it as the source of truth for request/response shapes and validation rules, *except* where this file says it's wrong (see "Confirmed PRD vs. real-API discrepancies" below).

## Product context

Three separate products cover the PRD's four roles:

1. **Customer app** (mobile, Expo/React Native) — already built, separate repo, covers the Customer role only.
2. **Mechanic app** (mobile) — not started. Originally scoped as a combined "Station Manager + Mechanic" app; that changed (see below).
3. **This project** (web) — covers **both Admin and Station Manager** roles, role-gated by module. Mechanic is mobile-only, not a login role here.

### Role-gated module breakdown

- **Admin**: full CRUD on Vehicles (models + variants, one combined page), full CRUD on Service Stations (all stations), cross-station Bookings (view any station's bookings, assign mechanic, update status), edit Service Charges.
- **Station Manager**: Vehicles and Service Charges are **read-only**; "My Station" (view + edit inventory *and* add new spare parts for their one assigned station, not full station CRUD) and "My Bookings" (their station's bookings only) replace Admin's Service Stations/Bookings screens. Spare parts themselves are station-owned, not a shared catalog — see the product-direction deviation below.
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

## Current build status: real backend integration in progress

**As of 2026-08-16, the real backend source is available locally** at `C:\Users\sieme\VSCodeProjects\mygaadi\backend\backend-service` (Spring Boot 3.5 + MySQL + Liquibase, repo `mygaadi/backend-service`). This changes everything below from "verify by curling a stranger's API" to "read the actual controller/entity source before integrating" — always prefer checking the source over guessing when wiring up a new screen.

**Per-feature status:**

| Feature | Status | Notes |
|---|---|---|
| Auth/Login | **Real**, always was | `src/features/auth/auth-api.ts` never used the mock layer |
| Vehicle Models/Variants | **Real** (2026-08-16) | `vehicleType` field name matches exactly; real enum values are `TWO_WHEELER/THREE_WHEELER/FOUR_WHEELER/COMMERCIAL_VEHICLE/HEAVY_VEHICLE` |
| Profile | **Real** (2026-08-16) | Role-conditional routing: Admin → `/api/admin/me/profile`, others → `/api/users/me/profile`. Password change and email/phone change endpoints exist server-side but aren't in the current UI scope — not added |
| Accounts | **Real create** (2026-08-16), list is session-only | Each role has its own endpoint (no shared "register" route) — routed by `CreatableRole` in `accounts-api.ts`. No listing endpoint exists anywhere for existing users, so the table only ever shows accounts created this session, by design |
| Service Stations | **Real** (2026-08-16) | `addressLine`/`city`/`state`/`latitude`/`longitude` are inline fields on the create/update request (confirmed via the live OpenAPI spec at the Cloudflare tunnel — not yet in the pushed `backend-service` git repo, see note below). `LocationPicker` now only sets lat/lng from a Nominatim search; address/city/state are independent text fields the user fills in. `managerId` picker still `MOCK_MANAGERS` (Open Question #2). "My Station" (Station Manager) now resolves its own station via `useMyStation()` (`?managerId=`) instead of a fixed mock id; its inventory sub-section stays mock |
| Bookings (Service Requests) | **Real** (2026-08-16), parts sub-panel still mock | Core flow (list/detail/assign-mechanic/status) wired to `/api/service-requests`; real `Status` enum uses `PENDING` not `REQUESTED` — renamed throughout. Mechanic picker still sources from a hardcoded list (no endpoint lists mechanics eligible for a station — same gap as Open Question #2). "Parts used" stays mocked: real `AddPartRequest` references a global `sparePartId`, conflicting with our station-inventory model — blocked on the same Spare Parts rework |
| Service Charges | Mock | Real API changed shape significantly (station + vehicleType together) — see Product-direction deviations |
| Spare Parts / Station Inventory | Mock, blocked | Real backend still has a global Admin-managed catalog, not station-owned — waiting on the backend dev |

Remaining mock features still use the **in-memory mock API layer** (`createMockResource()` in `src/lib/mock-resource.ts`), each with a `TODO(api-integration)` comment in its `*-api.ts` file marking where to swap in real calls through `src/lib/api-client.ts` — the swap should only require editing that one file per feature.

## Backend access

- **Local dev backend** (preferred when working on this machine): `http://localhost:8081`, source at `C:\Users\sieme\VSCodeProjects\mygaadi\backend\backend-service`. Run with `JAVA_HOME="C:\Program Files\Java\jdk-17" ./mvnw spring-boot:run` (the global `JAVA_HOME` on this machine points at a nonexistent JRE 8 install — override it per-command, don't rely on the global env var). MySQL database name has changed at least once (`vst_service` → `mygaadi`) — check `application.properties`' `spring.datasource.url` for the current name before assuming. Health check: `GET /api/public/health`.
- Original ephemeral Cloudflare tunnel (`https://downloading-bible-shoot-gulf.trycloudflare.com`) may still be relevant for non-local testing — expect it to change whenever whoever runs it restarts it.
- **`application.properties` has real secrets committed to git, already pushed to `origin`** (MySQL root password, a Gmail SMTP app password, JWT secret, a default-admin password) — flagged to the user 2026-08-16, recommended rotating them. Not this repo's problem to fix, just don't make it worse (don't commit your own local DB password over it without checking first).
- Auth: single `accessToken`, no refresh token. `Authorization: Bearer <token>` header. A 401 means the session is dead — `src/lib/api-client.ts` logs out automatically on 401, no retry/refresh flow exists.
- Login: `POST /api/auth/login` with `{ phoneNumber, password }` → `{ accessToken, tokenType, userId, firstName, lastName, role }`. One shared endpoint for every role/app (confirmed via `SecurityConfig`: `/api/auth/**` is `permitAll()`) — there's no admin-specific login route, role-based access happens entirely through `@PreAuthorize` on individual endpoints afterward.
- A real seeded Admin exists in the DB: phone `9488748480` / password `Admin@12345` (id 1, "System Admin") — confirmed working via curl 2026-08-16. Tied to whichever database the backend currently points at; may need re-seeding if the DB is recreated.
- **Mock login buttons removed 2026-08-16.** They used to bypass auth with a fake `accessToken` to preview screens before a real backend existed. Once most screens were wired to the real API, that bypass just produced broken 401s instead of a useful preview, so it was deleted rather than kept around — real login covers both roles now (`9488748480` / `Admin@12345` for Admin; create a Station Manager via Accounts once one exists).

## Confirmed PRD vs. real-API discrepancies

Verified against the live backend while building customer-app, not assumptions:

- **`lastName` casing**: PRD writes `lastname` (lowercase) on some endpoints — the real API uses `lastName` (camelCase) consistently everywhere.
- **Path pluralization**: PRD documents singular `/api/user/me/...` — the real API uses plural `/api/users/me/...` throughout. (Service Charges' path moved even further from the PRD's guess — see Product-direction deviations below; it's not a flat `/api/service-charge(s)` at all anymore, it's nested under a station.)
- **Default location** (`GET /api/users/me/locations/default`): PRD says it returns `null` when none exists; real API returns `204 No Content` with an empty body.
- **Vehicle response includes an undocumented `modelName` field.**
- **`PUT /api/users/me/profile` doesn't return a fresh session** like the PRD says (no `accessToken`) — it returns the same plain profile shape as `GET /api/users/me`.
- **`serviceType`'s real values**: `GENERAL_SERVICE`, `REPAIR`, `BREAKDOWN`, `WARRANTY`, `INSPECTION`. Not documented in the PRD as an enum — treat as open/dynamic data, don't hardcode as a fixed set.
- **The server returns a generic `500` for an unmatched route instead of a `404`.** When something 500s unexpectedly, double-check the exact path against a working sibling endpoint before assuming it's a real server bug.

**General lesson**: the PRD is Draft status with real gaps between what it documents and what the backend actually does. Verify each new endpoint live (curl it) before wiring a screen up to it — don't trust the PRD's literal path/shape without a live check.

## Product-direction deviations from the PRD (2026-08-16)

Deliberate scope changes from the user, not backend discrepancies — the PRD still describes the old model in these three places:

- **`vehicleType` field on Vehicle Model** — turned out the backend dev added the exact same field independently (2026-08-16 commit), field name matches, so this is **no longer a deviation** — now real. Enum values were guessed wrong initially; corrected to the real `TWO_WHEELER/THREE_WHEELER/FOUR_WHEELER/COMMERCIAL_VEHICLE/HEAVY_VEHICLE` in `vehicle-models-api.ts`.
- **Vehicle Models and Variants are one combined page** (`/vehicles`, `src/features/vehicles/vehicles-page.tsx`) instead of two separate routes — models are listed as cards, each with its variants managed inline. `VehicleVariantFormDialog` no longer has a model picker; `modelId` is passed in from context. Still a frontend-only IA choice, but both underlying APIs are real now.
- **Spare parts are meant to be station-owned, not a shared Admin catalog** — user's explicit direction, backend dev asked to implement it, **not done yet**: the real backend (as of 2026-08-16) still has a global `spare_parts` catalog table referenced by `station_inventory.spare_part_id`, Admin-only CRUD. Frontend (`src/features/station-inventory/`, `src/features/bookings/booking-parts-api.ts`) still simulates the station-owned model against mock data — stays mock until the backend catches up.
- **Accounts is one page with a role-gated role picker**, not a separate route per role. `src/features/accounts/accounts-page.tsx` + `account-form-dialog.tsx` — the "New user" dialog's role options depend on the logged-in user (Admin sees Admin/Station Manager/Mechanic, Station Manager sees Mechanic only). Now wired to the real per-role endpoints (see Open Questions #1); the list itself stays session-only since there's no real listing endpoint.
- **Service Charges are meant to be scoped per-station**, not global — user's explicit direction, backend dev asked to implement it. **Done, but bigger than asked**: the real backend (2026-08-16 commit) scopes charges by **station AND vehicleType together** (`/api/service-stations/{stationId}/charges`, keyed by `serviceType`+`vehicleType`), not just station. Frontend still simulates simple per-station (no vehicleType dimension) against mock data — needs a rebuild of this screen's data model before wiring to the real API, not just a data-source swap.
- **Service Station location handling was reworked (2026-08-16), landing on something simpler than either prior attempt.** First pass wired a location-creation-first flow (`POST`/`PUT /api/users/me/locations` to get a `locationId`, then create the station with it) — user asked the backend dev for something better instead, and got it: `ServiceStationRequest` now takes `addressLine`/`city`/`state`/`latitude`/`longitude` directly inline (confirmed via the live OpenAPI spec at the Cloudflare tunnel, `/v3/api-docs` — `required: ["capacity", "city", "name", "state"]`, everything else optional including `latitude`/`longitude`/`managerId`). No `locationId` in the request at all now — though `ServiceStationResponse` still returns one (the backend still creates a `Location` row internally), which is why `serviceStationsApi.getLocation()` still exists: `ServiceStationResponse` doesn't expose lat/lng directly, so that call is still needed to prefill coordinates on edit. Per explicit direction: `addressLine`/`city`/`state` are independent text fields the user types in, `LocationPicker` now only sets latitude/longitude from a Nominatim search (`LocationCoordinates`, not the old 5-field `LocationValue`). Also fixed a capacity validation bug caught while rewiring this: the real API requires `capacity` to be at least 1, our schema allowed 0. **Caveat**: this inline-fields shape isn't in the pushed `backend-service` git repo yet (only two small unrelated commits are — Swagger config and a Station-Manager-can't-create-Admin security fix) — it only exists on whatever instance is behind the current Cloudflare tunnel. Testing this locally requires either pointing `.env`'s `VITE_API_BASE_URL` at that tunnel, or waiting for the backend dev to push and pulling+restarting the local backend. `managerId` is still a raw Long with no listing endpoint on the backend (see Open Questions #2) — `MOCK_MANAGERS` stands in for now.

## Open questions

1. **~~How does an Admin/Station Manager/Mechanic account get created?~~ Resolved 2026-08-16** — real endpoints now exist, confirmed from source:
   - Create Admin: `POST /api/admin/auth/register/admin` (`AdminAuthController`)
   - Create Station Manager: `POST /api/admin/register/station-manager`, Admin-only (`AdminUserController`)
   - Create Mechanic: `PUT /api/admin/update/mechanic`, Station Manager or Admin (`AdminUserController`) — despite the `PUT`/"update" naming this actually **creates** a new user (calls `authService.register(request, Role.MECHANIC)`, no id involved); same issue on `PUT /api/admin/update/station-manager`. Worth relaying to the backend dev, but functionally usable as-is.
   - **Bug worth flagging**: `registerAdmin` is guarded by `@PreAuthorize("hasRole('STATION_MANAGER') or hasRole('ADMIN')")` — a Station Manager can create new Admin accounts. Our frontend doesn't expose that option to Station Manager regardless (role picker only offers Mechanic for that role), so this doesn't leak through our UI, but it's a real backend privilege-escalation gap.
   - **Wired 2026-08-16** in `src/features/accounts/` — creation is real; the account list itself stays session-only since no listing endpoint exists (see #3).
2. **How does Admin find/list "eligible" Station Manager users** to assign when creating a station (§10.2 requires an existing `managerId`)? Still no listing/search endpoint on the backend as of 2026-08-16. `MOCK_MANAGERS` stands in for now.
3. Whether there's any broader user-management surface for Admin (list customers, deactivate an account) — still unconfirmed either way.
4. **~~Which station is a Station Manager assigned to?~~ Resolved and wired 2026-08-16** — `GET /api/service-stations?managerId={id}` exists and lets anyone query stations by manager. Implemented as `useMyStation()` in `src/features/service-stations/use-service-stations.ts`, used by `my-station-page.tsx` and `my-bookings-page.tsx`. `service-charges-page.tsx` still uses the old `MOCK_MY_STATION_ID` constant — left alone since Service Charges as a whole is still blocked on its own data-model rebuild (see Product-direction deviations), swapping just the id there would be a partial, confusing state.

### Mind-map vs. PRD conflicts — resolved, then partially re-opened by a later backend commit

As of the first backend read (2026-08-16, commit `dddf46b`), all three were confirmed via `@PreAuthorize` annotations to side with the **PRD**, not the mind map:

1. Service Charge edit rights — was Admin-only.
2. Update/Delete Station — Admin-only, confirmed, **still true** as of the latest commit.
3. Assign Mechanic to a booking — Station Manager/Admin only, Mechanic excluded, confirmed, **still true** as of the latest commit.

**But then commit `0f063c3` (same day) changed #1**: Service Charge create/update is now `hasRole('ADMIN') or hasRole('STATION_MANAGER')` — i.e. the backend now matches the **mind map's** version, not the PRD's, on this one specific point. Our frontend's Service Charges page still gates editing to Admin-only (`useIsAdmin()`) — worth revisiting once that screen gets wired to the real (now station+vehicleType-scoped) API, whether to open editing to Station Manager too.

## Setup checklist before real API integration

- [x] Get a real Admin login — `9488748480` / `Admin@12345`, confirmed working 2026-08-16.
- [ ] Get a real Station Manager login (create one via `POST /api/admin/register/station-manager` once Accounts is wired up, or ask the backend dev).
- [ ] Verify every endpoint live (curl or read the source) before wiring a screen up to it — several real shapes have already turned out to differ from what was assumed (Service Charges especially).
