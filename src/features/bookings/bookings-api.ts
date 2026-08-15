import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET /api/service-requests, GET /api/service-requests/{id},
// PUT /api/service-requests/{id}/assign-mechanic, and
// PUT /api/service-requests/{id}/status are confirmed live.
//
// Assign-mechanic-by-Mechanic-role is one of the 3 unresolved mind-map/PRD
// conflicts (see HANDOFF.md) — doesn't affect this portal directly since
// Mechanic isn't a login role here, only Admin/Station Manager.

export type BookingStatus = "REQUESTED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export interface Booking {
  id: number
  vehicleId: number
  vehicleName: string
  customerId: number
  customerName: string
  mechanicId: number | null
  mechanicName: string | null
  stationId: number
  stationName: string
  invoiceId: number | null
  status: BookingStatus
  serviceType: string
  startTime: string | null
  endTime: string | null
  createdAt: string
  updatedAt: string
}

export interface Mechanic {
  id: number
  name: string
  stationId: number
}

export const MOCK_MECHANICS: Mechanic[] = [
  { id: 701, name: "Mike Smith", stationId: 1 },
  { id: 702, name: "Raj Kumar", stationId: 1 },
  { id: 703, name: "Priya Singh", stationId: 2 },
]

const resource = createMockResource<Booking>([
  {
    id: 1,
    vehicleId: 101,
    vehicleName: "Tesla Model Y - Pearl White",
    customerId: 901,
    customerName: "Arjun Mehta",
    mechanicId: null,
    mechanicName: null,
    stationId: 1,
    stationName: "ABC Motors Service Center",
    invoiceId: null,
    status: "REQUESTED",
    serviceType: "GENERAL_SERVICE",
    startTime: null,
    endTime: null,
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-08-10T09:00:00Z",
  },
  {
    id: 2,
    vehicleId: 102,
    vehicleName: "Tata Nexon - Racing Red",
    customerId: 902,
    customerName: "Sneha Rao",
    mechanicId: 701,
    mechanicName: "Mike Smith",
    stationId: 1,
    stationName: "ABC Motors Service Center",
    invoiceId: null,
    status: "IN_PROGRESS",
    serviceType: "REPAIR",
    startTime: "2026-08-12T10:00:00Z",
    endTime: null,
    createdAt: "2026-08-11T09:00:00Z",
    updatedAt: "2026-08-12T10:00:00Z",
  },
  {
    id: 3,
    vehicleId: 103,
    vehicleName: "Tesla Model Y - Midnight Blue",
    customerId: 903,
    customerName: "Karan Verma",
    mechanicId: 701,
    mechanicName: "Mike Smith",
    stationId: 1,
    stationName: "ABC Motors Service Center",
    invoiceId: 5001,
    status: "COMPLETED",
    serviceType: "INSPECTION",
    startTime: "2026-08-05T09:00:00Z",
    endTime: "2026-08-05T12:00:00Z",
    createdAt: "2026-08-04T09:00:00Z",
    updatedAt: "2026-08-05T12:00:00Z",
  },
  {
    id: 4,
    vehicleId: 104,
    vehicleName: "Tata Nexon - Racing Red",
    customerId: 904,
    customerName: "Divya Nair",
    mechanicId: 703,
    mechanicName: "Priya Singh",
    stationId: 2,
    stationName: "Metro Car Care",
    invoiceId: null,
    status: "ASSIGNED",
    serviceType: "BREAKDOWN",
    startTime: null,
    endTime: null,
    createdAt: "2026-08-13T09:00:00Z",
    updatedAt: "2026-08-13T09:30:00Z",
  },
])

async function getBookingOrThrow(id: number): Promise<Booking> {
  const all = await resource.list()
  const booking = all.find((b) => b.id === id)
  if (!booking) {
    throw new Error(`Booking ${id} not found`)
  }
  return booking
}

export const bookingsApi = {
  listByStation: async (stationId: number) => {
    const all = await resource.list()
    return all.filter((b) => b.stationId === stationId)
  },
  get: (id: number) => getBookingOrThrow(id),
  assignMechanic: async (id: number, mechanicId: number) => {
    const booking = await getBookingOrThrow(id)
    const mechanic = MOCK_MECHANICS.find(
      (m) => m.id === mechanicId && m.stationId === booking.stationId
    )
    if (!mechanic) {
      throw new Error(`Mechanic ${mechanicId} not found at this station`)
    }
    return resource.update(id, {
      mechanicId: mechanic.id,
      mechanicName: mechanic.name,
      status: booking.status === "REQUESTED" ? "ASSIGNED" : booking.status,
      updatedAt: new Date().toISOString(),
    })
  },
  updateStatus: async (id: number, status: BookingStatus) => {
    const booking = await getBookingOrThrow(id)
    const now = new Date().toISOString()
    const patch: Partial<Booking> = { status, updatedAt: now }
    if (status === "IN_PROGRESS" && !booking.startTime) {
      patch.startTime = now
    }
    if (status === "COMPLETED" && !booking.endTime) {
      patch.endTime = now
    }
    return resource.update(id, patch)
  },
}

export function nextStatusOptions(status: BookingStatus): BookingStatus[] {
  switch (status) {
    case "REQUESTED":
      return ["CANCELLED"]
    case "ASSIGNED":
      return ["IN_PROGRESS", "CANCELLED"]
    case "IN_PROGRESS":
      return ["COMPLETED"]
    default:
      return []
  }
}

export function mechanicsForStation(stationId: number): Mechanic[] {
  return MOCK_MECHANICS.filter((m) => m.stationId === stationId)
}
