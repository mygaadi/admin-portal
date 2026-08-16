import { api } from "@/lib/api-client"

// Wired to the real backend (confirmed against the live OpenAPI spec,
// 2026-08-16): GET/POST/PUT/DELETE /api/service-stations. ServiceStationRequest
// takes addressLine/city/state/latitude/longitude directly — no separate
// location-creation step required. The response still includes a
// `locationId` (the backend creates/updates a Location row internally), so
// GET /api/users/me/locations/{id} is still useful to prefill lat/lng on
// edit, since ServiceStationResponse itself doesn't expose coordinates.
//
// managerId has no documented listing endpoint (CLAUDE.md open question #2)
// — MOCK_MANAGERS stands in for what a real user-search-by-role endpoint
// would return.

export interface ServiceStation {
  id: number
  name: string
  locationId: number
  addressLine: string
  city: string
  state: string
  managerId: number | null
  managerName: string | null
  phone: string | null
  email: string | null
  capacity: number
  createdAt: string
  updatedAt: string
}

export interface ServiceStationInput {
  name: string
  addressLine: string
  city: string
  state: string
  latitude: number
  longitude: number
  managerId: number
  phone: string | null
  email: string | null
  capacity: number
}

export interface Manager {
  id: number
  name: string
}

export const MOCK_MANAGERS: Manager[] = [
  { id: 501, name: "John Doe" },
  { id: 502, name: "Jane Doe" },
  { id: 503, name: "Amit Shah" },
]

interface LocationResponse {
  id: number
  addressLine: string
  city: string
  state: string
  latitude: number
  longitude: number
}

function stationPayload(input: ServiceStationInput) {
  return {
    name: input.name,
    addressLine: input.addressLine,
    city: input.city,
    state: input.state,
    latitude: input.latitude,
    longitude: input.longitude,
    managerId: input.managerId,
    phone: input.phone,
    email: input.email,
    capacity: input.capacity,
  }
}

export const serviceStationsApi = {
  list: () => api.get<ServiceStation[]>("/api/service-stations"),
  listByManager: (managerId: number) =>
    api.get<ServiceStation[]>(`/api/service-stations?managerId=${managerId}`),
  getLocation: (locationId: number) =>
    api.get<LocationResponse>(`/api/users/me/locations/${locationId}`),
  create: (input: ServiceStationInput) =>
    api.post<ServiceStation>("/api/service-stations", stationPayload(input)),
  update: (id: number, input: ServiceStationInput) =>
    api.put<ServiceStation>(`/api/service-stations/${id}`, stationPayload(input)),
  remove: (id: number) => api.delete<void>(`/api/service-stations/${id}`),
}
