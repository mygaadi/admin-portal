import { useState } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"

import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { TableStatusRow } from "@/components/table-status-row"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookingStatusStepper } from "@/features/bookings/booking-status-stepper"
import { mechanicsForStation, nextStatusOptions, type BookingStatus } from "@/features/bookings/bookings-api"
import {
  useAssignMechanic,
  useBooking,
  useUpdateBookingStatus,
} from "@/features/bookings/use-bookings"
import { useAddBookingPart, useBookingParts, useRemoveBookingPart } from "@/features/bookings/use-booking-parts"
import { useSpareParts } from "@/features/spare-parts/use-spare-parts"
import { formatCurrency, humanizeEnum } from "@/lib/format"

const STATUS_ACTION_LABEL: Record<BookingStatus, string> = {
  REQUESTED: "Mark Requested",
  ASSIGNED: "Mark Assigned",
  IN_PROGRESS: "Start Service",
  COMPLETED: "Complete Service",
  CANCELLED: "Cancel Booking",
}

const PARTS_EDITABLE_STATUSES: BookingStatus[] = ["ASSIGNED", "IN_PROGRESS"]
const MECHANIC_EDITABLE_STATUSES: BookingStatus[] = ["REQUESTED", "ASSIGNED", "IN_PROGRESS"]

export function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const id = Number(bookingId)

  const { data: booking, isLoading } = useBooking(id)
  const assignMutation = useAssignMechanic()
  const statusMutation = useUpdateBookingStatus()

  if (isLoading || !booking) {
    return (
      <div>
        <PageHeader eyebrow="Operations" title="Booking" />
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    )
  }

  const canEditMechanic = MECHANIC_EDITABLE_STATUSES.includes(booking.status)
  const canEditParts = PARTS_EDITABLE_STATUSES.includes(booking.status)

  function handleAssign(mechanicId: number) {
    assignMutation.mutate(
      { id: booking!.id, mechanicId },
      {
        onSuccess: () => toast.success("Mechanic assigned"),
        onError: () => toast.error("Failed to assign mechanic"),
      }
    )
  }

  function handleStatusChange(status: BookingStatus) {
    statusMutation.mutate(
      { id: booking!.id, status },
      {
        onSuccess: () => toast.success(`Booking ${humanizeEnum(status).toLowerCase()}`),
        onError: () => toast.error("Failed to update status"),
      }
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title={`Booking #${String(booking.id).padStart(3, "0")}`}
        description={`${booking.vehicleName} — ${booking.customerName}`}
      />

      <MockDataNotice />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <BookingStatusStepper status={booking.status} labeled />
            {nextStatusOptions(booking.status).length > 0 && (
              <div className="flex gap-2">
                {nextStatusOptions(booking.status).map((status) => (
                  <Button
                    key={status}
                    variant={status === "CANCELLED" ? "destructive" : "default"}
                    size="sm"
                    disabled={statusMutation.isPending}
                    onClick={() => handleStatusChange(status)}
                  >
                    {STATUS_ACTION_LABEL[status]}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <DetailField label="Station" value={booking.stationName} />
              <DetailField label="Service type" value={humanizeEnum(booking.serviceType)} />
              <DetailField
                label="Start time"
                value={booking.startTime ? new Date(booking.startTime).toLocaleString() : "—"}
              />
              <DetailField
                label="End time"
                value={booking.endTime ? new Date(booking.endTime).toLocaleString() : "—"}
              />
              <DetailField
                label="Invoice"
                value={booking.invoiceId ? `#${booking.invoiceId}` : "Not generated"}
              />
              <DetailField
                label="Updated"
                value={new Date(booking.updatedAt).toLocaleString()}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mechanic</CardTitle>
          </CardHeader>
          <CardContent>
            {canEditMechanic ? (
              <Select
                value={booking.mechanicId ?? undefined}
                onValueChange={(mechanicId) => handleAssign(mechanicId as number)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Assign a mechanic" />
                </SelectTrigger>
                <SelectContent>
                  {mechanicsForStation(booking.stationId).map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm">{booking.mechanicName ?? "Not assigned"}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parts used</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingPartsSection bookingId={booking.id} canEdit={canEditParts} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground font-mono text-[0.6875rem] tracking-wider uppercase">
        {label}
      </dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  )
}

function BookingPartsSection({ bookingId, canEdit }: { bookingId: number; canEdit: boolean }) {
  const { data: parts, isLoading, isError, refetch } = useBookingParts(bookingId)
  const { data: spareParts } = useSpareParts()
  const addMutation = useAddBookingPart(bookingId)
  const removeMutation = useRemoveBookingPart(bookingId)

  const [sparePartId, setSparePartId] = useState<number | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    if (!sparePartId) return
    addMutation.mutate(
      { sparePartId, quantity },
      {
        onSuccess: () => {
          toast.success("Part added")
          setSparePartId(undefined)
          setQuantity(1)
        },
        onError: () => toast.error("Failed to add part"),
      }
    )
  }

  function handleRemove(partEntryId: number) {
    removeMutation.mutate(partEntryId, {
      onSuccess: () => toast.success("Part removed"),
      onError: () => toast.error("Failed to remove part"),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                Part
              </TableHead>
              <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                Unit price
              </TableHead>
              <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                Qty
              </TableHead>
              <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                Subtotal
              </TableHead>
              {canEdit && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableStatusRow
              colSpan={5}
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && (!parts || parts.length === 0)}
              resourceLabel="parts used on this booking"
              emptyMessage="No parts added yet."
              onRetry={refetch}
            />
            {!isLoading &&
              !isError &&
              parts?.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>{part.sparePartName}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {formatCurrency(part.unitPrice)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{part.quantity}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {formatCurrency(part.subtotal)}
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={removeMutation.isPending}
                        onClick={() => handleRemove(part.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {canEdit && (
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label>Spare part</Label>
            <Select
              value={sparePartId ?? undefined}
              onValueChange={(value) => setSparePartId(value as number)}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select a part" />
              </SelectTrigger>
              <SelectContent>
                {spareParts?.map((part) => (
                  <SelectItem key={part.id} value={part.id}>
                    {part.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
              className="w-20"
            />
          </div>
          <Button disabled={!sparePartId || addMutation.isPending} onClick={handleAdd}>
            {addMutation.isPending ? "Adding…" : "Add part"}
          </Button>
        </div>
      )}
    </div>
  )
}
