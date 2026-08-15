import { useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SparePartFormDialog } from "@/features/spare-parts/spare-part-form-dialog"
import type { SparePart } from "@/features/spare-parts/spare-parts-api"
import { useDeleteSparePart, useSpareParts } from "@/features/spare-parts/use-spare-parts"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useIsAdmin } from "@/stores/auth-store"

type FormState = { mode: "create" } | { mode: "edit"; sparePart: SparePart } | null

const columns: ColumnDef<SparePart>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => `#${String(getValue<number>()).padStart(3, "0")}`,
    meta: { mono: true },
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "modelName", header: "Compatible model" },
  {
    accessorKey: "price",
    header: "Price",
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

export function SparePartsPage() {
  const isAdmin = useIsAdmin()
  const { data, isLoading } = useSpareParts()
  const deleteMutation = useDeleteSparePart()

  const [formState, setFormState] = useState<FormState>(null)
  const [pendingDelete, setPendingDelete] = useState<SparePart | null>(null)

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
        toast.success("Spare part deleted")
        setPendingDelete(null)
      },
      onError: () => toast.error("Failed to delete spare part"),
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Spare Parts"
        description="Parts available for servicing, tied to a compatible vehicle model."
        action={
          isAdmin && <Button onClick={() => setFormState({ mode: "create" })}>New part</Button>
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
                  No spare parts yet — add one to get started.
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
                        onClick={() => setFormState({ mode: "edit", sparePart: row.original })}
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

      <SparePartFormDialog
        open={formState !== null}
        onOpenChange={(open) => !open && setFormState(null)}
        sparePart={formState?.mode === "edit" ? formState.sparePart : undefined}
      />

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete spare part"
        description={`This will permanently delete "${pendingDelete?.name}". This action cannot be undone.`}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
