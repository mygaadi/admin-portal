import { vehicleModelsApi } from "@/features/vehicle-models/vehicle-models-api"
import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): replace with real calls through `@/lib/api-client`
// once GET/POST/PUT/DELETE /api/spare-parts are confirmed live.

export interface SparePart {
  id: number
  name: string
  modelId: number
  modelName: string
  price: number
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface SparePartInput {
  name: string
  modelId: number
  price: number
  imageUrl: string | null
}

const resource = createMockResource<SparePart>([
  {
    id: 1,
    name: "Front Brake Pad",
    modelId: 1,
    modelName: "Tesla Model Y",
    price: 2500,
    imageUrl: null,
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
  {
    id: 2,
    name: "Air Filter",
    modelId: 2,
    modelName: "Tata Nexon",
    price: 800,
    imageUrl: null,
    createdAt: "2026-02-14T10:00:00Z",
    updatedAt: "2026-02-14T10:00:00Z",
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

export const sparePartsApi = {
  list: () => resource.list(),
  create: async (input: SparePartInput) => {
    const modelName = await resolveModelName(input.modelId)
    const now = new Date().toISOString()
    return resource.create({ ...input, modelName, createdAt: now, updatedAt: now })
  },
  update: async (id: number, input: SparePartInput) => {
    const modelName = await resolveModelName(input.modelId)
    return resource.update(id, { ...input, modelName, updatedAt: new Date().toISOString() })
  },
  remove: (id: number) => resource.remove(id),
}
