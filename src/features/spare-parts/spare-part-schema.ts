import { z } from "zod"

export const sparePartSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must not exceed 200 characters"),
  modelId: z.number({ message: "Select a vehicle model" }).int().positive(),
  price: z.number().min(0, "Price must be 0 or greater"),
  imageUrl: z.string().max(500, "Image URL must not exceed 500 characters"),
})

export type SparePartFormValues = z.infer<typeof sparePartSchema>
