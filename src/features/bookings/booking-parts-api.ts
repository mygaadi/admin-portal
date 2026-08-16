import { stationInventoryApi } from "@/features/station-inventory/station-inventory-api"
import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET/POST /api/service-requests/{serviceRequestId}/parts and
// DELETE .../parts/{partEntryId} are confirmed live (PRD §14).
//
// Parts are now looked up from the booking's own station inventory rather
// than a shared spare-parts catalog (2026-08-16 product direction — see
// station-inventory-api.ts and CLAUDE.md) — you can only add a part the
// station actually has stocked.

export interface BookingPart {
  id: number
  bookingId: number
  inventoryItemId: number
  partName: string
  unitPrice: number
  quantity: number
  subtotal: number
}

const resource = createMockResource<BookingPart>([
  {
    id: 1,
    bookingId: 2,
    inventoryItemId: 1,
    partName: "Front Brake Pad",
    unitPrice: 2500,
    quantity: 2,
    subtotal: 5000,
  },
])

export const bookingPartsApi = {
  listByBooking: async (bookingId: number) => {
    const all = await resource.list()
    return all.filter((p) => p.bookingId === bookingId)
  },
  add: async (
    bookingId: number,
    stationId: number,
    inventoryItemId: number,
    quantity: number
  ) => {
    const inventory = await stationInventoryApi.listByStation(stationId)
    const item = inventory.find((i) => i.id === inventoryItemId)
    if (!item) {
      throw new Error(`Inventory item ${inventoryItemId} not found at this station`)
    }
    return resource.create({
      bookingId,
      inventoryItemId,
      partName: item.name,
      unitPrice: item.price,
      quantity,
      subtotal: item.price * quantity,
    })
  },
  remove: (id: number) => resource.remove(id),
}
