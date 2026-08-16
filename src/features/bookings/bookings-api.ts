import { api } from "@/lib/api-client"

// Wired to the real backend (confirmed against backend-service source,
// 2026-08-16): GET /api/service-requests?stationId=, GET /api/service-requests/{id},
// PUT /api/service-requests/{id}/assign-mechanic, PUT /api/service-requests/{id}/status.
// The real Status enum uses PENDING where our mock used REQUESTED — renamed
// to match. Status transitions (e.g. auto-advancing to ASSIGNED) are now the
// backend's job; we just call the endpoint and use whatever it returns.
//
// TODO(api-integration): no endpoint lists mechanics eligible for a station
// (same class of gap as the Station Manager listing problem — CLAUDE.md open
// question #2) — the mechanic picker stays on a mock list until one exists.

export type BookingStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

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

export const bookingsApi = {
  listByStation: (stationId: number) =>
    api.get<Booking[]>(`/api/service-requests?stationId=${stationId}`),
  get: (id: number) => api.get<Booking>(`/api/service-requests/${id}`),
  assignMechanic: (id: number, mechanicId: number) =>
    api.put<Booking>(`/api/service-requests/${id}/assign-mechanic`, { mechanicId }),
  updateStatus: (id: number, status: BookingStatus) =>
    api.put<Booking>(`/api/service-requests/${id}/status`, { status }),
}

export function nextStatusOptions(status: BookingStatus): BookingStatus[] {
  switch (status) {
    case "PENDING":
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
