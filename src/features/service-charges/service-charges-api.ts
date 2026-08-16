import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once the real endpoints are confirmed live. PRD §15 models service
// charges as global (no stationId) — scoping them per-station is a
// product-direction deviation (2026-08-16, see CLAUDE.md), so the real
// endpoint shape for this is unconfirmed too, not just the pluralization
// issue already flagged in CLAUDE.md.
//
// Access to update (PUT) is one of the 3 unresolved mind-map/PRD conflicts
// (see CLAUDE.md) — this follows the PRD (Admin-only edit) for now.

export interface ServiceCharge {
  id: number
  stationId: number
  serviceType: string
  amount: number
  updatedAt: string
}

// serviceType is open/dynamic data per CLAUDE.md, not a fixed enum — these
// are just the values observed on the live backend while building customer-app.
const resource = createMockResource<ServiceCharge>([
  { id: 1, stationId: 1, serviceType: "GENERAL_SERVICE", amount: 1500, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 2, stationId: 1, serviceType: "REPAIR", amount: 3500, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 3, stationId: 1, serviceType: "BREAKDOWN", amount: 2000, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 4, stationId: 1, serviceType: "WARRANTY", amount: 0, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 5, stationId: 1, serviceType: "INSPECTION", amount: 800, updatedAt: "2026-01-10T10:00:00Z" },
  { id: 6, stationId: 2, serviceType: "GENERAL_SERVICE", amount: 1650, updatedAt: "2026-01-12T10:00:00Z" },
  { id: 7, stationId: 2, serviceType: "REPAIR", amount: 3800, updatedAt: "2026-01-12T10:00:00Z" },
  { id: 8, stationId: 2, serviceType: "BREAKDOWN", amount: 2200, updatedAt: "2026-01-12T10:00:00Z" },
  { id: 9, stationId: 2, serviceType: "WARRANTY", amount: 0, updatedAt: "2026-01-12T10:00:00Z" },
  { id: 10, stationId: 2, serviceType: "INSPECTION", amount: 900, updatedAt: "2026-01-12T10:00:00Z" },
])

export const serviceChargesApi = {
  listByStation: async (stationId: number) => {
    const all = await resource.list()
    return all.filter((charge) => charge.stationId === stationId)
  },
  update: (id: number, amount: number) =>
    resource.update(id, { amount, updatedAt: new Date().toISOString() }),
}
