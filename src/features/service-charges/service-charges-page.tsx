import { useEffect, useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { TableStatusRow } from "@/components/table-status-row"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ServiceChargeFormDialog } from "@/features/service-charges/service-charge-form-dialog"
import type { ServiceCharge } from "@/features/service-charges/service-charges-api"
import { useServiceCharges } from "@/features/service-charges/use-service-charges"
import { useServiceStations } from "@/features/service-stations/use-service-stations"
import { MOCK_MY_STATION_ID } from "@/features/station-inventory/station-inventory-api"
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
  const { data: stations } = useServiceStations()
  const [adminStationId, setAdminStationId] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (isAdmin && adminStationId === undefined && stations && stations.length > 0) {
      setAdminStationId(stations[0].id)
    }
  }, [isAdmin, stations, adminStationId])

  const stationId = isAdmin ? (adminStationId ?? -1) : MOCK_MY_STATION_ID

  const { data, isLoading, isError, refetch } = useServiceCharges(stationId)
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
        description="Standard charges applicable to each type of vehicle service, per station."
        action={
          isAdmin && (
            <Select
              value={adminStationId}
              onValueChange={(value) => setAdminStationId(value ?? undefined)}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent>
                {stations?.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <TableStatusRow
              colSpan={columnCount}
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && table.getRowModel().rows.length === 0}
              resourceLabel="service charges"
              emptyMessage="No service charges configured for this station yet."
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
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setEditing(row.original)}>
                        Edit
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
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
