import { z } from "zod"

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name must not exceed 100 characters"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must not exceed 100 characters"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
