import { z } from "zod"

export const serviceChargeSchema = z.object({
  amount: z.number().min(0, "Amount must be 0 or greater"),
})

export type ServiceChargeFormValues = z.infer<typeof serviceChargeSchema>
