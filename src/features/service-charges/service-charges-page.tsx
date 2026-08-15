import { useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ServiceChargeFormDialog } from "@/features/service-charges/service-charge-form-dialog"
import type { ServiceCharge } from "@/features/service-charges/service-charges-api"
import { useServiceCharges } from "@/features/service-charges/use-service-charges"
import { formatCurrency, humanizeEnum } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useIsAdmin } from "@/stores/auth-store"

const columns: ColumnDef<ServiceCharge>[] = [
  {
    accessorKey: "serviceType",
    header: "Service type",
    cell: ({ getValue }) => humanizeEnum(getValue<string>()),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
    meta: { mono: true },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    meta: { mono: true },
  },
]

export function ServiceChargesPage() {
  const isAdmin = useIsAdmin()
  const { data, isLoading } = useServiceCharges()
  const [editing, setEditing] = useState<ServiceCharge | null>(null)

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const columnCount = columns.length + (isAdmin ? 1 : 0)

  return (
    <div>
      <PageHeader
        eyebrow="Finance"
        title="Service Charges"
        description="Standard charges applicable to each type of vehicle service."
      />

      <MockDataNotice />

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
                {isAdmin && (
                  <TableHead className="text-right font-mono text-[0.6875rem] tracking-wider uppercase">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="text-muted-foreground text-center">
                  Loading…
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="text-muted-foreground text-center">
                  No service charges configured yet.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        (cell.column.columnDef.meta as { mono?: boolean } | undefined)?.mono &&
                          "text-muted-foreground font-mono text-xs"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setEditing(row.original)}>
                        Edit
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ServiceChargeFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        serviceCharge={editing}
      />
    </div>
  )
}
