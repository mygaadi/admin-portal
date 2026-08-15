import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET/POST/PUT/DELETE /api/service-stations are confirmed live.
//
// locationId and managerId have no documented listing endpoint (HANDOFF.md
// open question #2) — real Admin users would hit the same problem picking
// valid IDs. The lookups below are mock-only stand-ins for what a real
// location/user-search endpoint would resolve server-side.

export interface ServiceStation {
  id: number
  name: string
  locationId: number
  city: string
  addressLine: string
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
  locationId: number
  managerId: number
  phone: string | null
  email: string | null
  capacity: number
}

export const MOCK_LOCATIONS: Record<number, { city: string; addressLine: string }> = {
  101: { city: "Bangalore", addressLine: "123, Main Road, Indiranagar" },
  102: { city: "Mumbai", addressLine: "45, Andheri West, Near Metro Station" },
  103: { city: "Pune", addressLine: "12, FC Road" },
}

export const MOCK_MANAGERS: Record<number, string> = {
  501: "John Doe",
  502: "Jane Doe",
  503: "Amit Shah",
}

function resolveLocation(locationId: number) {
  const location = MOCK_LOCATIONS[locationId]
  if (!location) {
    throw new Error(`Location ${locationId} not found`)
  }
  return location
}

function resolveManagerName(managerId: number) {
  const managerName = MOCK_MANAGERS[managerId]
  if (!managerName) {
    throw new Error(`Manager ${managerId} not found`)
  }
  return managerName
}

const resource = createMockResource<ServiceStation>([
  {
    id: 1,
    name: "ABC Motors Service Center",
    locationId: 101,
    city: "Bangalore",
    addressLine: "123, Main Road, Indiranagar",
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
    locationId: 102,
    city: "Mumbai",
    addressLine: "45, Andheri West, Near Metro Station",
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
    const location = resolveLocation(input.locationId)
    const managerName = resolveManagerName(input.managerId)
    const now = new Date().toISOString()
    return resource.create({ ...input, ...location, managerName, createdAt: now, updatedAt: now })
  },
  update: async (id: number, input: ServiceStationInput) => {
    const location = resolveLocation(input.locationId)
    const managerName = resolveManagerName(input.managerId)
    return resource.update(id, {
      ...input,
      ...location,
      managerName,
      updatedAt: new Date().toISOString(),
    })
  },
  remove: (id: number) => resource.remove(id),
}
