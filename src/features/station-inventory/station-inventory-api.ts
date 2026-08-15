import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET /api/service-stations/{stationId}/inventory and
// PUT /api/service-stations/{stationId}/inventory/{sparePartId} are
// confirmed live.

export interface StationInventoryItem {
  id: number
  stationId: number
  sparePartId: number
  sparePartName: string
  sparePartPrice: number
  quantity: number
  updatedAt: string
}

const resource = createMockResource<StationInventoryItem>([
  {
    id: 1,
    stationId: 1,
    sparePartId: 1,
    sparePartName: "Front Brake Pad",
    sparePartPrice: 2500,
    quantity: 12,
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: 2,
    stationId: 1,
    sparePartId: 2,
    sparePartName: "Air Filter",
    sparePartPrice: 800,
    quantity: 30,
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: 3,
    stationId: 2,
    sparePartId: 1,
    sparePartName: "Front Brake Pad",
    sparePartPrice: 2500,
    quantity: 5,
    updatedAt: "2026-02-20T10:00:00Z",
  },
])

export const stationInventoryApi = {
  listByStation: async (stationId: number) => {
    const all = await resource.list()
    return all.filter((item) => item.stationId === stationId)
  },
  updateQuantity: (id: number, quantity: number) =>
    resource.update(id, { quantity, updatedAt: new Date().toISOString() }),
}

// Station Managers are assigned to exactly one station, but no endpoint
// documents how to look that up (CLAUDE.md open question) — stand in with
// a fixed mock station until that's confirmed.
export const MOCK_MY_STATION_ID = 1
