import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET /api/service-charge and PUT /api/service-charge/{serviceType} are
// confirmed live — CLAUDE.md flags the path as likely wrong (probably
// /api/service-charges, plural, matching the confirmed pluralization
// pattern elsewhere). Verify before wiring this up for real.
//
// Access to PUT (update) is one of the 3 unresolved mind-map/PRD conflicts
// (see CLAUDE.md) — this follows the PRD (Admin-only edit) for now.

export interface ServiceCharge {
  id: number
  serviceType: string
  amount: number
  updatedAt: string
}

// serviceType is open/dynamic data per CLAUDE.md, not a fixed enum — these
// are just the values observed on the live backend while building customer-app.
const resource = createMockResource<ServiceCharge>([
  { id: 1, serviceType: "GENERAL_SERVICE", amount: 1500, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 2, serviceType: "REPAIR", amount: 3500, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 3, serviceType: "BREAKDOWN", amount: 2000, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 4, serviceType: "WARRANTY", amount: 0, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 5, serviceType: "INSPECTION", amount: 800, updatedAt: "2026-01-10T10:00:00Z" },
])

export const serviceChargesApi = {
  list: () => resource.list(),
  update: (id: number, amount: number) =>
    resource.update(id, { amount, updatedAt: new Date().toISOString() }),
}
