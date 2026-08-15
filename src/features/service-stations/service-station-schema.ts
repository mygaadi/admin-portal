import { z } from "zod"

export const serviceStationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must not exceed 200 characters"),
  locationId: z.number({ message: "Location ID is required" }).int().positive(),
  managerId: z.number({ message: "Manager ID is required" }).int().positive(),
  phone: z.string().max(20, "Phone must not exceed 20 characters"),
  email: z
    .string()
    .max(255, "Email must not exceed 255 characters")
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: "Must be a valid email address",
    }),
  capacity: z.number().min(0, "Capacity must be 0 or greater"),
})

export type ServiceStationFormValues = z.infer<typeof serviceStationSchema>
