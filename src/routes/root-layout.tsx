import { NavLink, Outlet, useNavigate } from "react-router"

import { getNavGroups } from "@/routes/nav-items"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  STATION_MANAGER: "Station Manager",
}

export function RootLayout() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const navGroups = user ? getNavGroups(user.role) : []

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="grid min-h-svh grid-cols-[220px_1fr]">
      <aside className="bg-rail text-rail-foreground flex flex-col gap-5 p-4">
        <div className="px-2 font-heading text-sm font-semibold tracking-tight">
          mygaadi <span className="text-primary">Admin</span>
        </div>
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <p className="text-rail-foreground/50 mb-1 px-2 font-mono text-[0.6875rem] tracking-widest uppercase">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-sm border-l-2 px-2 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-rail-accent border-primary text-rail-accent-foreground font-medium"
                      : "text-rail-foreground/80 hover:bg-rail-accent/60 border-transparent"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </aside>
      <div className="flex flex-col">
        <header className="border-border flex items-center justify-between border-b px-6 py-3">
          <span className="text-muted-foreground font-mono text-sm">
            {user && `${user.firstName} ${user.lastName} · ${ROLE_LABEL[user.role]}`}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
