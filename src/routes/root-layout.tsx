import { NavLink, Outlet, useNavigate } from "react-router"

import { navItems } from "@/routes/nav-items"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

export function RootLayout() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="grid min-h-svh grid-cols-[220px_1fr]">
      <aside className="border-border flex flex-col gap-1 border-r p-4">
        <div className="mb-4 px-2 font-medium">mygaadi Admin</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "rounded-md px-2 py-1.5 text-sm",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </aside>
      <div className="flex flex-col">
        <header className="border-border flex items-center justify-between border-b px-6 py-3">
          <span className="text-muted-foreground text-sm">
            {user ? `${user.firstName} ${user.lastName}` : null}
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
