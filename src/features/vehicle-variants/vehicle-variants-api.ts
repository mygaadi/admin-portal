import { vehicleModelsApi } from "@/features/vehicle-models/vehicle-models-api"
import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET/POST/PUT/DELETE /api/vehicle-variants are confirmed live.

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

const resource = createMockResource<VehicleVariant>([
  {
    id: 1,
    modelId: 1,
    modelName: "Tesla Model Y",
    color: "Pearl White",
    imageUrl: null,
    price: 1250000,
    createdAt: "2026-01-12T10:00:00Z",
  },
  {
    id: 2,
    modelId: 1,
    modelName: "Tesla Model Y",
    color: "Midnight Blue",
    imageUrl: null,
    price: 1300000,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: 3,
    modelId: 2,
    modelName: "Tata Nexon",
    color: "Racing Red",
    imageUrl: null,
    price: 950000,
    createdAt: "2026-02-10T10:00:00Z",
  },
])

async function resolveModelName(modelId: number): Promise<string> {
  const models = await vehicleModelsApi.list()
  const model = models.find((m) => m.id === modelId)
  if (!model) {
    throw new Error(`Vehicle model ${modelId} not found`)
  }
  return model.name
}

export const vehicleVariantsApi = {
  list: () => resource.list(),
  create: async (input: VehicleVariantInput) => {
    const modelName = await resolveModelName(input.modelId)
    return resource.create({ ...input, modelName, createdAt: new Date().toISOString() })
  },
  update: async (id: number, input: VehicleVariantInput) => {
    const modelName = await resolveModelName(input.modelId)
    return resource.update(id, { ...input, modelName })
  },
  remove: (id: number) => resource.remove(id),
}
