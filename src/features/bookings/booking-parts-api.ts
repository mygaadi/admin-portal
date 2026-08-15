import { sparePartsApi } from "@/features/spare-parts/spare-parts-api"
import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET/POST /api/service-requests/{serviceRequestId}/parts and
// DELETE .../parts/{partEntryId} are confirmed live (PRD §14).

export interface BookingPart {
  id: number
  bookingId: number
  sparePartId: number
  sparePartName: string
  unitPrice: number
  quantity: number
  subtotal: number
}

const resource = createMockResource<BookingPart>([
  {
    id: 1,
    bookingId: 2,
    sparePartId: 1,
    sparePartName: "Front Brake Pad",
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
  add: async (bookingId: number, sparePartId: number, quantity: number) => {
    const spareParts = await sparePartsApi.list()
    const sparePart = spareParts.find((p) => p.id === sparePartId)
    if (!sparePart) {
      throw new Error(`Spare part ${sparePartId} not found`)
    }
    return resource.create({
      bookingId,
      sparePartId,
      sparePartName: sparePart.name,
      unitPrice: sparePart.price,
      quantity,
      subtotal: sparePart.price * quantity,
    })
  },
  remove: (id: number) => resource.remove(id),
}
