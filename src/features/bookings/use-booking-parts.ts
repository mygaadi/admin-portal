import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { bookingPartsApi } from "@/features/bookings/booking-parts-api"

const bookingPartsQueryKey = (bookingId: number) => ["booking-parts", bookingId]

export function useBookingParts(bookingId: number) {
  return useQuery({
    queryKey: bookingPartsQueryKey(bookingId),
    queryFn: () => bookingPartsApi.listByBooking(bookingId),
  })
}

export function useAddBookingPart(bookingId: number, stationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ inventoryItemId, quantity }: { inventoryItemId: number; quantity: number }) =>
      bookingPartsApi.add(bookingId, stationId, inventoryItemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingPartsQueryKey(bookingId) }),
  })
}

export function useRemoveBookingPart(bookingId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (partEntryId: number) => bookingPartsApi.remove(partEntryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingPartsQueryKey(bookingId) }),
  })
}
