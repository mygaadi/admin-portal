import { useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  useDeleteVehicleModel,
  useVehicleModels,
} from "@/features/vehicle-models/use-vehicle-models"
import { VehicleModelFormDialog } from "@/features/vehicle-models/vehicle-model-form-dialog"
import type { VehicleModel } from "@/features/vehicle-models/vehicle-models-api"
import { cn } from "@/lib/utils"
import { useIsAdmin } from "@/stores/auth-store"

type FormState = { mode: "create" } | { mode: "edit"; vehicleModel: VehicleModel } | null

const columns: ColumnDef<VehicleModel>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => `#${String(getValue<number>()).padStart(3, "0")}`,
    meta: { mono: true },
  },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "releaseDate",
    header: "Release date",
    cell: ({ getValue }) => getValue<string | null>() ?? "—",
    meta: { mono: true },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    meta: { mono: true },
  },
]

export function VehicleModelsPage() {
  const isAdmin = useIsAdmin()
  const { data, isLoading } = useVehicleModels()
  const deleteMutation = useDeleteVehicleModel()

  const [formState, setFormState] = useState<FormState>(null)
  const [pendingDelete, setPendingDelete] = useState<VehicleModel | null>(null)

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const columnCount = columns.length + (isAdmin ? 1 : 0)

  function handleDelete() {
    if (!pendingDelete) return
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Vehicle model deleted")
        setPendingDelete(null)
      },
      onError: () => toast.error("Failed to delete vehicle model"),
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Vehicle Models"
        description="The models available for customers to add to their garage."
        action={
          isAdmin && (
            <Button onClick={() => setFormState({ mode: "create" })}>New model</Button>
          )
        }
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
                  No vehicle models yet — add one to get started.
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
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormState({ mode: "edit", vehicleModel: row.original })}
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
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <VehicleModelFormDialog
        open={formState !== null}
        onOpenChange={(open) => !open && setFormState(null)}
        vehicleModel={formState?.mode === "edit" ? formState.vehicleModel : undefined}
      />

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete vehicle model"
        description={`This will permanently delete "${pendingDelete?.name}". This action cannot be undone.`}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
