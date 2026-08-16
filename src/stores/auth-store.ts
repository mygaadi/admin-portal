import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Role = "ADMIN" | "STATION_MANAGER" | "MECHANIC" | "CUSTOMER"

export interface AuthUser {
  userId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: Role
}

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  login: (accessToken: string, user: AuthUser) => void
  logout: () => void
  updateUser: (patch: Partial<Pick<AuthUser, "firstName" | "lastName">>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      login: (accessToken, user) => set({ accessToken, user }),
      logout: () => set({ accessToken: null, user: null }),
      updateUser: (patch) =>
        set((state) => ({ user: state.user ? { ...state.user, ...patch } : state.user })),
    }),
    { name: "admin-portal-auth" }
  )
)

// Catalog/Finance screens are shared between roles but editable by Admin
// only — Station Manager sees them read-only.
export function useIsAdmin() {
  return useAuthStore((state) => state.user?.role === "ADMIN")
}
