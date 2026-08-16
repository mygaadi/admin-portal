import { PageHeader } from "@/components/page-header"
import { BookingTicketList } from "@/features/bookings/booking-ticket-list"
import { useBookingsByStation } from "@/features/bookings/use-bookings"
import { useMyStation } from "@/features/service-stations/use-service-stations"

export function MyBookingsPage() {
  const { data: station } = useMyStation()
  const { data, isLoading, isError, refetch } = useBookingsByStation(station?.id ?? -1)

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="My Bookings"
        description="Bookings for your station — assign mechanics, update status, and manage parts used."
      />

      <BookingTicketList
        bookings={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyMessage="No bookings for your station yet."
        detailPath={(id) => `/my-bookings/${id}`}
      />
    </div>
  )
}
