import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  vehicleModelsApi,
  type VehicleModelInput,
} from "@/features/vehicle-models/vehicle-models-api"

const vehicleModelsQueryKey = ["vehicle-models"]

export function useVehicleModels() {
  return useQuery({
    queryKey: vehicleModelsQueryKey,
    queryFn: vehicleModelsApi.list,
  })
}

export function useCreateVehicleModel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: VehicleModelInput) => vehicleModelsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleModelsQueryKey }),
  })
}

export function useUpdateVehicleModel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: VehicleModelInput }) =>
      vehicleModelsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleModelsQueryKey }),
  })
}

export function useDeleteVehicleModel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => vehicleModelsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleModelsQueryKey }),
  })
}
