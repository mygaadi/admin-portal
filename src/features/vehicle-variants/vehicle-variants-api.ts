import { api } from "@/lib/api-client"

// Wired to the real backend (confirmed against backend-service source,
// 2026-08-16): GET/POST/PUT/DELETE /api/vehicle-variants. Shape matches
// exactly what VehicleVariantRequest/VehicleVariantResponse expect.

export interface VehicleVariant {
  id: number
  modelId: number
  modelName: string
  color: string
  imageUrl: string | null
  price: number
  createdAt: string
}

export interface VehicleVariantInput {
  modelId: number
  color: string
  imageUrl: string | null
  price: number
}

export const vehicleVariantsApi = {
  list: () => api.get<VehicleVariant[]>("/api/vehicle-variants"),
  create: (input: VehicleVariantInput) => api.post<VehicleVariant>("/api/vehicle-variants", input),
  update: (id: number, input: VehicleVariantInput) =>
    api.put<VehicleVariant>(`/api/vehicle-variants/${id}`, input),
  remove: (id: number) => api.delete<void>(`/api/vehicle-variants/${id}`),
}
