import { z } from "zod"

export const vehicleModelSchema = z.object({
  name: z.string().min(1, "Name is required").max(150, "Name must not exceed 150 characters"),
  releaseDate: z.string(),
})

export type VehicleModelFormValues = z.infer<typeof vehicleModelSchema>
