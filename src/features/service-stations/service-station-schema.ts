import { z } from "zod"

export const serviceStationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must not exceed 200 characters"),
  managerId: z.number({ message: "Select a station manager" }).int().positive(),
  addressLine: z.string().min(1, "Search and select a location"),
  city: z.string(),
  state: z.string().min(1, "State is required"),
  latitude: z.number(),
  longitude: z.number(),
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
