import { useState } from "react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AccountFormDialog } from "@/features/accounts/account-form-dialog"
import type { CreatableRole, CreatedAccount } from "@/features/accounts/accounts-api"
import { useAccounts } from "@/features/accounts/use-accounts"
import { humanizeEnum } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

const ROLE_BADGE: Record<CreatableRole, string> = {
  ADMIN: "bg-primary/10 text-primary ring-1 ring-primary/20",
  STATION_MANAGER: "bg-accent text-accent-foreground ring-1 ring-transparent",
  MECHANIC: "bg-secondary text-secondary-foreground ring-1 ring-transparent",
}

function initials(account: CreatedAccount) {
  return `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase()
}

export function AccountsPage() {
  const isAdmin = useAuthStore((state) => state.user?.role === "ADMIN")
  const { data, isLoading, isError, refetch } = useAccounts()
  const [formOpen, setFormOpen] = useState(false)

  const availableRoles: CreatableRole[] = isAdmin
    ? ["ADMIN", "STATION_MANAGER", "MECHANIC"]
    : ["MECHANIC"]

  return (
    <div>
      <PageHeader
        eyebrow="Accounts"
        title="Accounts"
        description={
          isAdmin
            ? "Create Admin, Station Manager, or Mechanic accounts."
            : "Create Mechanic accounts for your station."
        }
        action={<Button onClick={() => setFormOpen(true)}>New user</Button>}
      />

      <p className="border-border bg-muted/50 text-muted-foreground mb-4 rounded-md border px-3 py-2 text-sm">
        Accounts created here are real. There's no backend endpoint yet to list existing accounts,
        so this list only shows what's been created this session.
      </p>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-destructive text-sm">
            Couldn't load accounts. Check your connection and try again.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : !data || data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No accounts created this session yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((account) => (
            <Card key={account.id} className="p-0">
              <CardContent className="flex items-center gap-3 p-3">
                <span className="bg-muted text-foreground flex size-9 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold">
                  {initials(account)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {account.firstName} {account.lastName}
                  </p>
                  <p className="text-muted-foreground font-mono text-xs">{account.phoneNumber}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide uppercase",
                    ROLE_BADGE[account.role]
                  )}
                >
                  {humanizeEnum(account.role)}
                </span>
                <span className="text-muted-foreground hidden shrink-0 font-mono text-xs sm:block">
                  {new Date(account.createdAt).toLocaleDateString()}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AccountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        availableRoles={availableRoles}
      />
    </div>
  )
}
