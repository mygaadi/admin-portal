import { api } from "@/lib/api-client"

// Wired to the real backend (confirmed against backend-service source,
// 2026-08-16): creating an account calls a real endpoint per role — there's
// no shared "register" endpoint with a role field, each role has its own
// route (see CLAUDE.md Open Question #1). There is still no listing
// endpoint anywhere for existing users, so `list()` stays a session-only
// local cache of whatever's been created here — not a real GET.

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
  email: string
  phoneNumber: string
  password: string
  role: CreatableRole
}

interface UserProfileResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
}

let sessionAccounts: CreatedAccount[] = []

function registerRequestBody(input: CreatedAccountInput) {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phoneNumber: input.phoneNumber,
    password: input.password,
  }
}

async function registerByRole(input: CreatedAccountInput): Promise<UserProfileResponse> {
  const body = registerRequestBody(input)
  switch (input.role) {
    case "ADMIN":
      return api.post<UserProfileResponse>("/api/admin/auth/register/admin", body)
    case "STATION_MANAGER":
      return api.post<UserProfileResponse>("/api/admin/register/station-manager", body)
    case "MECHANIC":
      // Despite the PUT/"update" naming this creates a new user server-side
      // (see CLAUDE.md Open Question #1) — there's no separate create route.
      return api.put<UserProfileResponse>("/api/admin/update/mechanic", body)
  }
}

export const accountsApi = {
  list: async () => [...sessionAccounts],
  create: async (input: CreatedAccountInput) => {
    const response = await registerByRole(input)
    const account: CreatedAccount = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      phoneNumber: response.phoneNumber,
      role: input.role,
      createdAt: new Date().toISOString(),
    }
    sessionAccounts = [...sessionAccounts, account]
    return account
  },
}
