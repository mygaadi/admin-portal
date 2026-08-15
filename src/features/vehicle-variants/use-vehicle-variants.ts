import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  vehicleVariantsApi,
  type VehicleVariantInput,
} from "@/features/vehicle-variants/vehicle-variants-api"

const vehicleVariantsQueryKey = ["vehicle-variants"]

export function useVehicleVariants() {
  return useQuery({
    queryKey: vehicleVariantsQueryKey,
    queryFn: vehicleVariantsApi.list,
  })
}

export function useCreateVehicleVariant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: VehicleVariantInput) => vehicleVariantsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleVariantsQueryKey }),
  })
}

export function useUpdateVehicleVariant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: VehicleVariantInput }) =>
      vehicleVariantsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleVariantsQueryKey }),
  })
}

export function useDeleteVehicleVariant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => vehicleVariantsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleVariantsQueryKey }),
  })
}
