import { api } from "@/lib/api-client"
import type { Role } from "@/stores/auth-store"

export interface LoginResponse {
  accessToken: string
  tokenType: string
  userId: number
  firstName: string
  lastName: string
  role: Role
}

export function login(phoneNumber: string, password: string) {
  return api.post<LoginResponse>("/api/auth/login", { phoneNumber, password })
}
