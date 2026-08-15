import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Link } from "react-router"

import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { TableStatusRow } from "@/components/table-status-row"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookingStatusStepper } from "@/features/bookings/booking-status-stepper"
import type { Booking } from "@/features/bookings/bookings-api"
import { useBookingsByStation } from "@/features/bookings/use-bookings"
import { MOCK_MY_STATION_ID } from "@/features/station-inventory/station-inventory-api"
import { humanizeEnum } from "@/lib/format"

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => `#${String(getValue<number>()).padStart(3, "0")}`,
  },
  { accessorKey: "vehicleName", header: "Vehicle" },
  { accessorKey: "customerName", header: "Customer" },
  {
    accessorKey: "mechanicName",
    header: "Mechanic",
    cell: ({ getValue }) => getValue<string | null>() ?? "—",
  },
  {
    accessorKey: "serviceType",
    header: "Service type",
    cell: ({ getValue }) => humanizeEnum(getValue<string>()),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <BookingStatusStepper status={getValue<Booking["status"]>()} />,
  },
]

export function MyBookingsPage() {
  const { data, isLoading, isError, refetch } = useBookingsByStation(MOCK_MY_STATION_ID)

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="My Bookings"
        description="Bookings for your station — assign mechanics, update status, and manage parts used."
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
              resourceLabel="your station's bookings"
              emptyMessage="No bookings for your station yet."
              onRetry={refetch}
            />
            {!isLoading &&
              !isError &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link to={`/my-bookings/${row.original.id}`} />}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
