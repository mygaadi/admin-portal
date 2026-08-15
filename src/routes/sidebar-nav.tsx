import { NavLink } from "react-router"

import { getNavGroups } from "@/routes/nav-items"
import { cn } from "@/lib/utils"
import type { Role } from "@/stores/auth-store"

interface SidebarNavProps {
  role: Role
  onNavigate?: () => void
}

export function SidebarNav({ role, onNavigate }: SidebarNavProps) {
  const navGroups = getNavGroups(role)

  return (
    <div className="flex flex-col gap-5">
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
              onClick={onNavigate}
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
    </div>
  )
}
