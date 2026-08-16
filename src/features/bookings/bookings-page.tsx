import { useState } from "react"

import { PageHeader } from "@/components/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingTicketList } from "@/features/bookings/booking-ticket-list"
import { useBookingsByStation } from "@/features/bookings/use-bookings"
import { useServiceStations } from "@/features/service-stations/use-service-stations"

export function BookingsPage() {
  const { data: stations } = useServiceStations()
  const [stationId, setStationId] = useState<number | undefined>(undefined)
  const effectiveStationId = stationId ?? stations?.[0]?.id

  const { data, isLoading, isError, refetch } = useBookingsByStation(effectiveStationId ?? -1)

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Bookings"
        description="Service bookings for any station, cross-station."
        action={
          <Select value={effectiveStationId} onValueChange={(value) => setStationId(value ?? undefined)}>
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
        }
      />

      <BookingTicketList
        bookings={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyMessage="No bookings for this station yet."
        detailPath={(id) => `/bookings/${id}`}
      />
    </div>
  )
}
