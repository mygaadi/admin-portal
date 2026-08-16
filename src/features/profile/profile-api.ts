import { api } from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth-store"

// Wired to the real backend (confirmed against backend-service source,
// 2026-08-16): PUT /api/users/me/profile for Station Manager/Mechanic/
// Customer, PUT /api/admin/me/profile for Admin — same request/response
// shape either way ({firstName, lastName} in, full profile back out), just
// a different base path depending on role since Admin has its own
// controller (AdminUserController) mirroring UserController's /me routes.

interface ProfileResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
}

export const profileApi = {
  update: async (input: { firstName: string; lastName: string }) => {
    const role = useAuthStore.getState().user?.role
    const path = role === "ADMIN" ? "/api/admin/me/profile" : "/api/users/me/profile"
    const response = await api.put<ProfileResponse>(path, input)
    useAuthStore
      .getState()
      .updateUser({ firstName: response.firstName, lastName: response.lastName })
    return response
  },
}
