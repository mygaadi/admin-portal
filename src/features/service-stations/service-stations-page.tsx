import { useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Link } from "react-router"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { TableStatusRow } from "@/components/table-status-row"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ServiceStationFormDialog } from "@/features/service-stations/service-station-form-dialog"
import type { ServiceStation } from "@/features/service-stations/service-stations-api"
import {
  useDeleteServiceStation,
  useServiceStations,
} from "@/features/service-stations/use-service-stations"
import { cn } from "@/lib/utils"

type FormState = { mode: "create" } | { mode: "edit"; serviceStation: ServiceStation } | null

const columns: ColumnDef<ServiceStation>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => `#${String(getValue<number>()).padStart(3, "0")}`,
    meta: { mono: true },
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "managerName", header: "Manager" },
  { accessorKey: "capacity", header: "Capacity", meta: { mono: true } },
]

export function ServiceStationsPage() {
  const { data, isLoading, isError, refetch } = useServiceStations()
  const deleteMutation = useDeleteServiceStation()

  const [formState, setFormState] = useState<FormState>(null)
  const [pendingDelete, setPendingDelete] = useState<ServiceStation | null>(null)

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  function handleDelete() {
    if (!pendingDelete) return
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Service station deleted")
        setPendingDelete(null)
      },
      onError: () => toast.error("Failed to delete service station"),
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Service Stations"
        description="Stations available to service customer vehicles."
        action={<Button onClick={() => setFormState({ mode: "create" })}>New station</Button>}
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
                <TableHead className="text-right font-mono text-[0.6875rem] tracking-wider uppercase">
                  Actions
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <TableStatusRow
              colSpan={columns.length + 1}
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && table.getRowModel().rows.length === 0}
              resourceLabel="service stations"
              emptyMessage="No service stations yet — add one to get started."
              onRetry={refetch}
            />
            {!isLoading &&
              !isError &&
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
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link to={`/service-stations/${row.original.id}/inventory`} />}
                    >
                      Inventory
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormState({ mode: "edit", serviceStation: row.original })}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setPendingDelete(row.original)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <ServiceStationFormDialog
        open={formState !== null}
        onOpenChange={(open) => !open && setFormState(null)}
        serviceStation={formState?.mode === "edit" ? formState.serviceStation : undefined}
      />

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete service station"
        description={`This will permanently delete "${pendingDelete?.name}". This action cannot be undone.`}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
