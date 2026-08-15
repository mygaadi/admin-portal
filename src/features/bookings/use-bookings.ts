import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { bookingsApi, type BookingStatus } from "@/features/bookings/bookings-api"

const bookingsQueryKey = (stationId: number) => ["bookings", "station", stationId]
const bookingQueryKey = (id: number) => ["bookings", "detail", id]

export function useBookingsByStation(stationId: number) {
  return useQuery({
    queryKey: bookingsQueryKey(stationId),
    queryFn: () => bookingsApi.listByStation(stationId),
  })
}

export function useBooking(id: number) {
  return useQuery({
    queryKey: bookingQueryKey(id),
    queryFn: () => bookingsApi.get(id),
  })
}

function invalidateBooking(queryClient: ReturnType<typeof useQueryClient>, booking: {
  id: number
  stationId: number
}) {
  queryClient.invalidateQueries({ queryKey: bookingQueryKey(booking.id) })
  queryClient.invalidateQueries({ queryKey: bookingsQueryKey(booking.stationId) })
}

export function useAssignMechanic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, mechanicId }: { id: number; mechanicId: number }) =>
      bookingsApi.assignMechanic(id, mechanicId),
    onSuccess: (booking) => invalidateBooking(queryClient, booking),
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BookingStatus }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: (booking) => invalidateBooking(queryClient, booking),
  })
}
