import { useAuthStore } from "@/stores/auth-store"

// TODO(api-integration): replace with a real call through `@/lib/api-client`
// to PUT /api/users/me/profile once confirmed live (PRD §4.2 — only
// firstName/lastName are editable; email, phoneNumber, and role are not).
// Per HANDOFF's original notes this endpoint doesn't return a fresh
// accessToken despite what the PRD says — it returns the same plain
// profile shape as GET /api/users/me.

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 300))
}

export const profileApi = {
  update: async (input: { firstName: string; lastName: string }) => {
    await delay()
    const { user, updateUser } = useAuthStore.getState()
    if (!user) {
      throw new Error("Not logged in")
    }
    updateUser(input)
    return { ...user, ...input }
  },
}
