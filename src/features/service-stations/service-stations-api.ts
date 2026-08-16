import { api } from "@/lib/api-client"

// Wired to the real backend (confirmed against backend-service source,
// 2026-08-16): GET/POST/PUT/DELETE /api/service-stations, plus a
// location-creation-first step through /api/users/me/locations — the real
// ServiceStationRequest takes a `locationId`, not inline address fields.
// LocationController is scoped to the *logged-in user's own* locations, so
// stations end up owned (location-wise) by whichever Admin created them.
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

function locationPayload(input: ServiceStationInput) {
  return {
    addressLine: input.addressLine,
    city: input.city,
    state: input.state,
    latitude: input.latitude,
    longitude: input.longitude,
    isDetected: false,
  }
}

function stationPayload(input: ServiceStationInput, locationId: number) {
  return {
    name: input.name,
    locationId,
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
  create: async (input: ServiceStationInput) => {
    const location = await api.post<LocationResponse>("/api/users/me/locations", locationPayload(input))
    return api.post<ServiceStation>("/api/service-stations", stationPayload(input, location.id))
  },
  update: async (id: number, input: ServiceStationInput, locationId: number) => {
    await api.put<LocationResponse>(`/api/users/me/locations/${locationId}`, locationPayload(input))
    return api.put<ServiceStation>(`/api/service-stations/${id}`, stationPayload(input, locationId))
  },
  remove: (id: number) => api.delete<void>(`/api/service-stations/${id}`),
}
