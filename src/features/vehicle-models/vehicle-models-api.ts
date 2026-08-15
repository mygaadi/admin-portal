import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace the mock resource below with real calls
// through `@/lib/api-client` once GET/POST/PUT/DELETE /api/vehicle-models
// are confirmed against the live backend (see CLAUDE.md). Keep the
// `vehicleModelsApi` function signatures unchanged so callers don't need
// to change.

export interface VehicleModel {
  id: number
  name: string
  releaseDate: string | null
  createdAt: string
}

export interface VehicleModelInput {
  name: string
  releaseDate: string | null
}

const resource = createMockResource<VehicleModel>([
  {
    id: 1,
    name: "Tesla Model Y",
    releaseDate: "2025-01-15",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: 2,
    name: "Tata Nexon",
    releaseDate: "2023-06-10",
    createdAt: "2026-02-05T10:00:00Z",
  },
  {
    id: 3,
    name: "Maruti Suzuki Swift",
    releaseDate: "2021-03-01",
    createdAt: "2026-03-01T10:00:00Z",
  },
])

export const vehicleModelsApi = {
  list: () => resource.list(),
  create: (input: VehicleModelInput) =>
    resource.create({ ...input, createdAt: new Date().toISOString() }),
  update: (id: number, input: VehicleModelInput) => resource.update(id, input),
  remove: (id: number) => resource.remove(id),
}
