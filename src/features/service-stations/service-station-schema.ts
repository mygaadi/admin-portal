import { z } from "zod"

// Wired to the real ServiceStationRequest (confirmed via the live OpenAPI spec,
// 2026-08-16): addressLine/city/state/latitude/longitude are inline fields on
// the station create/update request directly — no separate locationId step.
export const serviceStationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must not exceed 200 characters"),
  managerId: z.number({ message: "Select a station manager" }).int().positive(),
  addressLine: z.string().min(1, "Address is required").max(255, "Address must not exceed 255 characters"),
  city: z.string().min(1, "City is required").max(100, "City must not exceed 100 characters"),
  state: z.string().min(1, "State is required").max(100, "State must not exceed 100 characters"),
  latitude: z.number({ message: "Pick a location on the map to set coordinates" }),
  longitude: z.number({ message: "Pick a location on the map to set coordinates" }),
  phone: z.string().max(20, "Phone must not exceed 20 characters"),
  email: z
    .string()
    .max(255, "Email must not exceed 255 characters")
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: "Must be a valid email address",
    }),
  capacity: z.number().min(1, "Capacity must be at least 1"),
})

export type ServiceStationFormValues = z.infer<typeof serviceStationSchema>
