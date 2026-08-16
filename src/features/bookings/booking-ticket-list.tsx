import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookingStatusStepper } from "@/features/bookings/booking-status-stepper"
import type { Booking } from "@/features/bookings/bookings-api"
import { humanizeEnum } from "@/lib/format"

interface BookingTicketListProps {
  bookings: Booking[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  emptyMessage: string
  detailPath: (id: number) => string
}

export function BookingTicketList({
  bookings,
  isLoading,
  isError,
  onRetry,
  emptyMessage,
  detailPath,
}: BookingTicketListProps) {
  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading…</p>
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-destructive text-sm">
          Couldn't load bookings. Check your connection and try again.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return <p className="text-muted-foreground py-8 text-center text-sm">{emptyMessage}</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <Card key={booking.id} className="p-0">
          <Link
            to={detailPath(booking.id)}
            className="hover:bg-accent/40 flex flex-col gap-4 rounded-lg p-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground border-border shrink-0 rounded border px-1.5 py-0.5 font-mono text-[0.6875rem]">
                #{String(booking.id).padStart(3, "0")}
              </span>
              <div>
                <p className="font-medium">{booking.vehicleName}</p>
                <p className="text-muted-foreground text-sm">{booking.customerName}</p>
                <p className="text-muted-foreground mt-1 font-mono text-[0.6875rem] tracking-wide uppercase">
                  {humanizeEnum(booking.serviceType)} · {booking.mechanicName ?? "Unassigned"}
                </p>
              </div>
            </div>
            <BookingStatusStepper status={booking.status} labeled />
          </Link>
        </Card>
      ))}
    </div>
  )
}
