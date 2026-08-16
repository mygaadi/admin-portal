import { api } from "@/lib/api-client"

// Wired to the real backend (confirmed against backend-service source,
// 2026-08-16): GET/POST/PUT/DELETE /api/vehicle-models. Field names and
// the `vehicleType` field itself match exactly what VehicleModelRequest/
// VehicleModelResponse expect.

export const VEHICLE_TYPES = [
  "TWO_WHEELER",
  "THREE_WHEELER",
  "FOUR_WHEELER",
  "COMMERCIAL_VEHICLE",
  "HEAVY_VEHICLE",
] as const
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

export const vehicleModelsApi = {
  list: () => api.get<VehicleModel[]>("/api/vehicle-models"),
  create: (input: VehicleModelInput) => api.post<VehicleModel>("/api/vehicle-models", input),
  update: (id: number, input: VehicleModelInput) =>
    api.put<VehicleModel>(`/api/vehicle-models/${id}`, input),
  remove: (id: number) => api.delete<void>(`/api/vehicle-models/${id}`),
}
