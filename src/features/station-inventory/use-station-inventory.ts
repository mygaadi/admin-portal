import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { stationInventoryApi } from "@/features/station-inventory/station-inventory-api"

const stationInventoryQueryKey = (stationId: number) => ["station-inventory", stationId]

export function useStationInventory(stationId: number) {
  return useQuery({
    queryKey: stationInventoryQueryKey(stationId),
    queryFn: () => stationInventoryApi.listByStation(stationId),
  })
}

export function useUpdateStationInventoryQuantity(stationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      stationInventoryApi.updateQuantity(id, quantity),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: stationInventoryQueryKey(stationId) }),
  })
}
