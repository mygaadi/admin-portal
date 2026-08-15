import { useAuthStore } from "@/stores/auth-store"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  status: number
  body?: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { accessToken, logout } = useAuthStore.getState()

  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    // No refresh flow exists for this backend — a 401 means the session is dead.
    logout()
    throw new ApiError(401, "Session expired")
  }

  if (!res.ok) {
    const body = await res.json().catch(() => undefined)
    const message =
      (body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : undefined) ?? res.statusText
    throw new ApiError(res.status, message, body)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
