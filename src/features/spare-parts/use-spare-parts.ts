import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { sparePartsApi, type SparePartInput } from "@/features/spare-parts/spare-parts-api"

const sparePartsQueryKey = ["spare-parts"]

export function useSpareParts() {
  return useQuery({
    queryKey: sparePartsQueryKey,
    queryFn: sparePartsApi.list,
  })
}

export function useCreateSparePart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SparePartInput) => sparePartsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sparePartsQueryKey }),
  })
}

export function useUpdateSparePart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: SparePartInput }) =>
      sparePartsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sparePartsQueryKey }),
  })
}

export function useDeleteSparePart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => sparePartsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sparePartsQueryKey }),
  })
}
