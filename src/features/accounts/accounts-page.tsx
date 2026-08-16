import { useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { PageHeader } from "@/components/page-header"
import { TableStatusRow } from "@/components/table-status-row"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AccountFormDialog } from "@/features/accounts/account-form-dialog"
import type { CreatableRole, CreatedAccount } from "@/features/accounts/accounts-api"
import { useAccounts } from "@/features/accounts/use-accounts"
import { humanizeEnum } from "@/lib/format"
import { useAuthStore } from "@/stores/auth-store"

const columns: ColumnDef<CreatedAccount>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => humanizeEnum(getValue<string>()),
  },
  { accessorKey: "phoneNumber", header: "Phone", meta: { mono: true } },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
    meta: { mono: true },
  },
]

export function AccountsPage() {
  const isAdmin = useAuthStore((state) => state.user?.role === "ADMIN")
  const { data, isLoading, isError, refetch } = useAccounts()
  const [formOpen, setFormOpen] = useState(false)

  const availableRoles: CreatableRole[] = isAdmin
    ? ["ADMIN", "STATION_MANAGER", "MECHANIC"]
    : ["MECHANIC"]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
        so this table only shows what's been created this session.
      </p>

      <div className="border-border bg-card rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-mono text-[0.6875rem] tracking-wider uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <TableStatusRow
              colSpan={columns.length}
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && table.getRowModel().rows.length === 0}
              resourceLabel="accounts"
              emptyMessage="No accounts created this session yet."
              onRetry={refetch}
            />
            {!isLoading &&
              !isError &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell.column.columnDef.meta as { mono?: boolean } | undefined)?.mono
                          ? "text-muted-foreground font-mono text-xs"
                          : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AccountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        availableRoles={availableRoles}
      />
    </div>
  )
}
