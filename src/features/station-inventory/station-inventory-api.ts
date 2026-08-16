import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET/PUT /api/service-stations/{stationId}/inventory are confirmed
// live.
//
// Deviates from the PRD (2026-08-16, product direction): spare parts are no
// longer a shared Admin-managed catalog (PRD §12) — each station defines its
// own parts directly in its inventory. `name`/`price` live here per-station
// instead of being looked up from a shared sparePartId. Flagged in CLAUDE.md.

export interface StationInventoryItem {
  id: number
  stationId: number
  name: string
  price: number
  quantity: number
  updatedAt: string
}

export interface StationInventoryItemInput {
  name: string
  price: number
  quantity: number
}

const resource = createMockResource<StationInventoryItem>([
  {
    id: 1,
    stationId: 1,
    name: "Front Brake Pad",
    price: 2500,
    quantity: 12,
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: 2,
    stationId: 1,
    name: "Air Filter",
    price: 800,
    quantity: 30,
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: 3,
    stationId: 2,
    name: "Front Brake Pad",
    price: 2650,
    quantity: 5,
    updatedAt: "2026-02-20T10:00:00Z",
  },
])

export const stationInventoryApi = {
  listByStation: async (stationId: number) => {
    const all = await resource.list()
    return all.filter((item) => item.stationId === stationId)
  },
  create: (stationId: number, input: StationInventoryItemInput) =>
    resource.create({ ...input, stationId, updatedAt: new Date().toISOString() }),
  updateQuantity: (id: number, quantity: number) =>
    resource.update(id, { quantity, updatedAt: new Date().toISOString() }),
}

// Station Managers are assigned to exactly one station, but no endpoint
// documents how to look that up (CLAUDE.md open question) — stand in with
// a fixed mock station until that's confirmed.
export const MOCK_MY_STATION_ID = 1
