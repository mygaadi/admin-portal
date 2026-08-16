import { createMockResource } from "@/lib/mock-resource"

// TODO(api-integration): confirmed conceptually via the "My Garage" mind map
// (2026-08-15) — Admin can create Admin/Station Manager/Mechanic accounts,
// Station Manager can create Mechanic accounts — but no such endpoint is
// documented anywhere in PRD.md. POST /api/auth/register has no role field
// and always creates a CUSTOMER. Confirm the real endpoint/shape with the
// backend dev before building this for real — see CLAUDE.md open question #1.

export type CreatableRole = "ADMIN" | "STATION_MANAGER" | "MECHANIC"

export interface CreatedAccount {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  role: CreatableRole
  createdAt: string
}

export interface CreatedAccountInput {
  firstName: string
  lastName: string
  phoneNumber: string
  role: CreatableRole
}

const resource = createMockResource<CreatedAccount>([])

export const accountsApi = {
  list: () => resource.list(),
  create: (input: CreatedAccountInput) =>
    resource.create({ ...input, createdAt: new Date().toISOString() }),
}
