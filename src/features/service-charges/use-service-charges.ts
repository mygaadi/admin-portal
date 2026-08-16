import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { serviceChargesApi } from "@/features/service-charges/service-charges-api"

const serviceChargesQueryKey = (stationId: number) => ["service-charges", stationId]

export function useServiceCharges(stationId: number) {
  return useQuery({
    queryKey: serviceChargesQueryKey(stationId),
    queryFn: () => serviceChargesApi.listByStation(stationId),
  })
}

export function useUpdateServiceCharge(stationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, amount }: { id: number; amount: number }) =>
      serviceChargesApi.update(id, amount),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: serviceChargesQueryKey(stationId) }),
  })
}
