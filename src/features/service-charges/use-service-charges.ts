import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { serviceChargesApi } from "@/features/service-charges/service-charges-api"

const serviceChargesQueryKey = ["service-charges"]

export function useServiceCharges() {
  return useQuery({
    queryKey: serviceChargesQueryKey,
    queryFn: serviceChargesApi.list,
  })
}

export function useUpdateServiceCharge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, amount }: { id: number; amount: number }) =>
      serviceChargesApi.update(id, amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceChargesQueryKey }),
  })
}
