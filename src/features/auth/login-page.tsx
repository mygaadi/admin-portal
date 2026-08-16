import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"

import { login } from "@/features/auth/auth-api"
import { loginSchema, type LoginInput } from "@/features/auth/login-schema"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api-client"
import { useAuthStore, type Role } from "@/stores/auth-store"

const PORTAL_ROLES: Role[] = ["ADMIN", "STATION_MANAGER"]

export function LoginPage() {
  const navigate = useNavigate()
  const storeLogin = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const mutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      const data = await login(input.phoneNumber, input.password)
      if (!PORTAL_ROLES.includes(data.role)) {
        throw new ApiError(
          403,
          `This portal is for Admin and Station Manager accounts — this account is a ${data.role
            .toLowerCase()
            .replace("_", " ")} account.`
        )
      }
      return data
    },
    onSuccess: (data, variables) => {
      // TODO(api-integration): the login response doesn't include email
      // (PRD §3.2) — fetch GET /api/users/me after login for the full
      // profile once that endpoint is wired up for real.
      storeLogin(data.accessToken, {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: "",
        phoneNumber: variables.phoneNumber,
        role: data.role,
      })
      navigate("/", { replace: true })
    },
  })

  const errorMessage =
    mutation.error instanceof ApiError ? mutation.error.message : mutation.error ? "Login failed" : null

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>mygaadi Admin</CardTitle>
          <CardDescription>Sign in with your Admin or Station Manager account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                autoComplete="username"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>
            {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}
            <Button type="submit" disabled={mutation.isPending} className="mt-2">
              {mutation.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
