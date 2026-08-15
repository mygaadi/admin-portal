import { Navigate, Outlet } from "react-router"

import { useAuthStore, type Role } from "@/stores/auth-store"

interface RequireRoleProps {
  role: Role
}

export function RequireRole({ role }: RequireRoleProps) {
  const userRole = useAuthStore((state) => state.user?.role)

  if (userRole !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
