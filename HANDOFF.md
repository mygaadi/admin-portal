# Admin Portal — Handoff

Context carried over from building the mygaadi **customer-app** (a separate,
already-underway mobile project). This doc exists because the admin portal
is a new repo / new Claude session with no memory of that work — everything
here is what a fresh session needs to not re-derive from scratch.

## Product & architecture

**mygaadi** is a vehicle service management platform. Full product/API spec
is `PRD.md` (copy it into this new project's repo root — it doesn't exist
here yet, only in `customer-app`). Treat it as the source of truth for
request/response shapes and validation rules, *except* where this doc says
it's wrong (see below) — those corrections are confirmed against the live
backend, not guesses.

Three separate products cover the PRD's four roles:

1. **Customer app** (mobile, Expo/React Native) — already built, covers the
   Customer role only.
2. **Station Manager + Mechanic app** (mobile) — covers both roles in one
   app, role-gated views. Not started yet.
3. **Admin portal** (web) — this project. Covers the Admin role only.

## Admin portal's scope, per the PRD

- **Vehicle Model Management** (§8) — create/update/delete/list vehicle
  models (`/api/vehicle-models`).
- **Vehicle Variant Management** (§9) — create/update/delete/list variants
  per model (`/api/vehicle-variants`), including color/image/price.
- **Service Station Management** (§10) — create/update/delete/list stations,
  each with a `locationId` and a `managerId` (must reference an existing
  eligible Station Manager user — see open question below).
- **Station Inventory Management** (§11) — Admin can also update a
  station's spare-part stock quantities (`/api/service-stations/{id}/inventory`),
  though this is primarily the Station Manager's job day-to-day.
- **Spare Parts Management** (§12) — create/update/delete/list the spare-part
  catalog (`/api/spare-parts`), each tied to a compatible vehicle model.
- **Service Charge Management** (§15) — view/update the per-service-type
  charge amounts (`/api/service-charges`).
- **Cross-station oversight** (§13.8–13.11) — Admin can view bookings for
  *any* station (`GET /api/service-requests?stationId=X`), view any booking
  detail, assign a mechanic, and update a booking's status — the same
  actions a Station Manager has, but not scoped to one station.

## Backend access

- Base URL is a Cloudflare tunnel, ephemeral (`trycloudflare.com` — expect
  it to change whenever the backend dev restarts it): as of 2026-08-15,
  `https://downloading-bible-shoot-gulf.trycloudflare.com`. Health check:
  `GET /api/public/health`.
- Auth: single `accessToken`, no refresh token, per the PRD. `Authorization:
  Bearer <token>` header. A 401 means the session is dead — no retry/refresh
  flow exists.
- Login: `POST /api/auth/login` with `{ phoneNumber, password }` → returns
  `{ accessToken, tokenType, userId, firstName, lastName, role }`.

## Confirmed PRD vs. real-API discrepancies (from building customer-app)

These are verified against the live backend, not assumptions:

- **`lastName` casing**: PRD writes `lastname` (lowercase) on some
  endpoints — the real API uses `lastName` (camelCase) consistently
  everywhere.
- **Path pluralization**: PRD documents singular `/api/user/me/...` and
  `/api/service-charge` — the real API uses plural `/api/users/me/...` and
  `/api/service-charges` throughout. **Likely also affects an Admin-only
  endpoint you haven't tested yet**: PRD §15.2 documents `PUT
  /api/service-charge/{serviceType}` (singular) — given the confirmed
  pattern, this almost certainly needs to be `PUT
  /api/service-charges/{serviceType}` too. Verify before assuming.
- **Default location** (`GET /api/users/me/locations/default`): PRD says it
  returns `null` when none exists; real API returns `204 No Content` with an
  empty body. (Not directly relevant to Admin, but same backend/same
  pattern of PRD-vs-reality drift — expect more of this.)
- **Vehicle response includes an undocumented `modelName` field.**
- **`PUT /api/users/me/profile` doesn't return a fresh session** like the
  PRD says (no `accessToken`) — it returns the same plain profile shape as
  `GET /api/users/me`.
- **`serviceType`'s real values** (from `GET /api/service-charges`):
  `GENERAL_SERVICE`, `REPAIR`, `BREAKDOWN`, `WARRANTY`, `INSPECTION`. Not
  documented anywhere in the PRD as an enum — likely an Admin-managed table
  (matches §15's charge-per-type model), so don't hardcode it as a fixed
  set; treat it as open/dynamic data.
- **Their server returns a generic `500` for an unmatched route instead of
  a `404`.** This is what made the two path-typos above look like backend
  crashes instead of simple wrong-URL mistakes. When something 500s
  unexpectedly, double-check the exact path against a working sibling
  endpoint before assuming it's a real server bug.

**General lesson, not just a list of specific fixes**: this PRD is Draft
status and has real gaps between what it documents and what the backend
actually does. Verify each new endpoint (curl it directly) before building a
screen against it, the same way this was done for customer-app — don't trust
the PRD's literal path/shape without a live check.

## Open questions to resolve with the backend dev before/while building

These are gaps in the PRD itself, not just typos — nobody has answered them
yet:

1. **How does an Admin (or Station Manager, or Mechanic) account actually
   get created?** `POST /api/auth/register` has no `role` field in its
   documented request body, and empirically it always creates a `CUSTOMER`
   account. There's no documented endpoint for creating a non-Customer
   user. You need at least one real Admin login to test anything here —
   ask the backend dev how to get one (direct DB seed? an undocumented
   endpoint? role promotion?).
2. **How does Admin find/list "eligible" Station Manager users** to assign
   when creating a station (§10.2 requires an existing `managerId`)? No
   listing/search endpoint for users-by-role is documented.
3. Whether there's any user-management surface for Admin at all (list
   customers, list mechanics, deactivate an account, etc.) — the PRD's
   Admin description ("full platform administration") is vague; the
   documented endpoints only cover catalog/station/charge data, not people.

## Suggested starting point for tech stack (not decided — discuss fresh)

Not carried over as a locked decision, just a starting point to save
re-deriving obvious choices: a standard admin-dashboard stack — React web
framework (Next.js or Vite+React), Tailwind, TanStack Query for data
fetching, a table/form-heavy component set (this is a CRUD-and-tables app,
not a consumer app — optimize for that). The mobile-specific stack decisions
from customer-app (Expo, NativeWind, Zustand+SecureStore, React Native
Reusables) don't transfer — this is a plain web app.

## Setup checklist for the new project

- [ ] Copy `PRD.md` into the new repo's root.
- [ ] Copy this handoff doc in too, or fold its contents into the new
      project's `CLAUDE.md`.
- [ ] Get a real Admin login from the backend dev (see open question #1)
      before building the login screen against real auth.
- [ ] Same backend base URL as customer-app, same "it's an ephemeral
      tunnel, expect to update it" caveat.
- [ ] Verify every Admin-specific endpoint live (curl) before building a
      screen against its documented shape — several already-found
      discrepancies above, more likely waiting in the untested endpoints.
