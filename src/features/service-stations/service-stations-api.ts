import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET/POST/PUT/DELETE /api/service-stations are confirmed live.
//
// managerId has no documented listing endpoint (CLAUDE.md open question #2)
// — MOCK_MANAGERS below stands in for what a real user-search-by-role
// endpoint would return. Location is no longer a locationId reference (see
// CLAUDE.md product-direction deviations) — addressLine/city/lat/lng are
// captured directly via the location picker and stored inline.

export interface ServiceStation {
  id: number
  name: string
  addressLine: string
  city: string
  latitude: number
  longitude: number
  managerId: number
  managerName: string
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

function resolveManagerName(managerId: number) {
  const manager = MOCK_MANAGERS.find((m) => m.id === managerId)
  if (!manager) {
    throw new Error(`Manager ${managerId} not found`)
  }
  return manager.name
}

const resource = createMockResource<ServiceStation>([
  {
    id: 1,
    name: "ABC Motors Service Center",
    addressLine: "123, Main Road, Indiranagar, Bangalore, Karnataka, India",
    city: "Bangalore",
    latitude: 12.9716,
    longitude: 77.6412,
    managerId: 501,
    managerName: "John Doe",
    phone: "+919876543210",
    email: "abc.manager@example.com",
    capacity: 50,
    createdAt: "2026-01-05T10:00:00Z",
    updatedAt: "2026-01-05T10:00:00Z",
  },
  {
    id: 2,
    name: "Metro Car Care",
    addressLine: "45, Andheri West, Near Metro Station, Mumbai, Maharashtra, India",
    city: "Mumbai",
    latitude: 19.1197,
    longitude: 72.8468,
    managerId: 502,
    managerName: "Jane Doe",
    phone: "+919812345678",
    email: "metro.manager@example.com",
    capacity: 35,
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
])

export const serviceStationsApi = {
  list: () => resource.list(),
  create: async (input: ServiceStationInput) => {
    const managerName = resolveManagerName(input.managerId)
    const now = new Date().toISOString()
    return resource.create({ ...input, managerName, createdAt: now, updatedAt: now })
  },
  update: async (id: number, input: ServiceStationInput) => {
    const managerName = resolveManagerName(input.managerId)
    return resource.update(id, { ...input, managerName, updatedAt: new Date().toISOString() })
  },
  remove: (id: number) => resource.remove(id),
}
