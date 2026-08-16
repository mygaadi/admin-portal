import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { accountsApi, type CreatedAccountInput } from "@/features/accounts/accounts-api"

const accountsQueryKey = ["accounts"]

export function useAccounts() {
  return useQuery({
    queryKey: accountsQueryKey,
    queryFn: accountsApi.list,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatedAccountInput) => accountsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountsQueryKey }),
  })
}
