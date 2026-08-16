import { MenuIcon } from "lucide-react"
import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { humanizeEnum } from "@/lib/format"
import { SidebarNav } from "@/routes/sidebar-nav"
import { useAuthStore } from "@/stores/auth-store"

export function RootLayout() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [navOpen, setNavOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  if (!user) {
    return null
  }

  return (
    <div className="grid min-h-svh grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="bg-rail text-rail-foreground hidden p-4 md:flex md:flex-col">
        <SidebarNav role={user.role} />
      </aside>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="left" className="bg-rail text-rail-foreground gap-0 border-none p-4">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav role={user.role} onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col">
        <header className="border-border flex items-center justify-between gap-2 border-b px-4 py-3 md:px-6">
          <Button
            variant="outline"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setNavOpen(true)}
          >
            <MenuIcon />
            <span className="sr-only">Open navigation</span>
          </Button>
          <Link
            to="/profile"
            className="text-muted-foreground hover:text-foreground truncate font-mono text-sm transition-colors"
          >
            {`${user.firstName} ${user.lastName} · ${humanizeEnum(user.role)}`}
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
