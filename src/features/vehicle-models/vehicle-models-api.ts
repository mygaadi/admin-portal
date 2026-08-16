import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace the mock resource below with real calls
// through `@/lib/api-client` once GET/POST/PUT/DELETE /api/vehicle-models
// are confirmed against the live backend (see CLAUDE.md). Keep the
// `vehicleModelsApi` function signatures unchanged so callers don't need
// to change.
//
// `vehicleType` is not documented in the PRD at all — added per product
// direction (2026-08-16). Flagged as a PRD deviation in CLAUDE.md.

export const VEHICLE_TYPES = ["CAR", "BIKE", "SCOOTER", "TRUCK", "BUS"] as const
export type VehicleType = (typeof VEHICLE_TYPES)[number]

export interface VehicleModel {
  id: number
  name: string
  vehicleType: VehicleType
  releaseDate: string | null
  createdAt: string
}

export interface VehicleModelInput {
  name: string
  vehicleType: VehicleType
  releaseDate: string | null
}

const resource = createMockResource<VehicleModel>([
  {
    id: 1,
    name: "Tesla Model Y",
    vehicleType: "CAR",
    releaseDate: "2025-01-15",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: 2,
    name: "Tata Nexon",
    vehicleType: "CAR",
    releaseDate: "2023-06-10",
    createdAt: "2026-02-05T10:00:00Z",
  },
  {
    id: 3,
    name: "Maruti Suzuki Swift",
    vehicleType: "CAR",
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
