import { z } from "zod"

export const accountSchema = z.object({
  role: z.enum(["ADMIN", "STATION_MANAGER", "MECHANIC"], { message: "Select a role" }),
  firstName: z.string().min(1, "First name is required").max(100, "First name must not exceed 100 characters"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must not exceed 100 characters"),
  email: z.email("Must be a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must not exceed 100 characters"),
})

export type AccountFormValues = z.infer<typeof accountSchema>
