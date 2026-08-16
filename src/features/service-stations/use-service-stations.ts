import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  serviceStationsApi,
  type ServiceStationInput,
} from "@/features/service-stations/service-stations-api"
import { useAuthStore } from "@/stores/auth-store"

const serviceStationsQueryKey = ["service-stations"]

// Resolves the logged-in Station Manager's own station via
// GET /api/service-stations?managerId= (CLAUDE.md open question #4).
export function useMyStation() {
  const userId = useAuthStore((state) => state.user?.userId)
  return useQuery({
    queryKey: ["service-stations", "mine", userId],
    queryFn: () => serviceStationsApi.listByManager(userId!),
    enabled: userId !== undefined,
    select: (stations) => stations[0],
  })
}

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
    mutationFn: ({
      id,
      input,
      locationId,
    }: {
      id: number
      input: ServiceStationInput
      locationId: number
    }) => serviceStationsApi.update(id, input, locationId),
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
