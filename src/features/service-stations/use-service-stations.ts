import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  serviceStationsApi,
  type ServiceStationInput,
} from "@/features/service-stations/service-stations-api"

const serviceStationsQueryKey = ["service-stations"]

export function useServiceStations() {
  return useQuery({
    queryKey: serviceStationsQueryKey,
    queryFn: serviceStationsApi.list,
  })
}

export function useServiceStation(id: number) {
  return useQuery({
    queryKey: serviceStationsQueryKey,
    queryFn: serviceStationsApi.list,
    select: (stations) => stations.find((station) => station.id === id),
  })
}

export function useCreateServiceStation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ServiceStationInput) => serviceStationsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceStationsQueryKey }),
  })
}

export function useUpdateServiceStation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ServiceStationInput }) =>
      serviceStationsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceStationsQueryKey }),
  })
}

export function useDeleteServiceStation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => serviceStationsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceStationsQueryKey }),
  })
}
