import { useMutation } from "@tanstack/react-query"

import { profileApi } from "@/features/profile/profile-api"

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (input: { firstName: string; lastName: string }) => profileApi.update(input),
  })
}
