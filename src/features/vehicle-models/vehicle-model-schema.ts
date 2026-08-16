import { z } from "zod"

import { VEHICLE_TYPES } from "@/features/vehicle-models/vehicle-models-api"

export const vehicleModelSchema = z.object({
  name: z.string().min(1, "Name is required").max(150, "Name must not exceed 150 characters"),
  vehicleType: z.enum(VEHICLE_TYPES, { message: "Select a vehicle type" }),
  releaseDate: z.string(),
})

export type VehicleModelFormValues = z.infer<typeof vehicleModelSchema>
