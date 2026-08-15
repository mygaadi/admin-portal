import { z } from "zod"

export const vehicleVariantSchema = z.object({
  modelId: z.number({ message: "Select a vehicle model" }).int().positive(),
  color: z.string().min(1, "Color is required").max(50, "Color must not exceed 50 characters"),
  imageUrl: z.string().max(500, "Image URL must not exceed 500 characters"),
  price: z.number().min(0, "Price must be 0 or greater"),
})

export type VehicleVariantFormValues = z.infer<typeof vehicleVariantSchema>
