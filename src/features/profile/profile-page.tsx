import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateProfile } from "@/features/profile/use-profile"
import { profileSchema, type ProfileFormValues } from "@/features/profile/profile-schema"
import { humanizeEnum } from "@/lib/format"
import { useAuthStore } from "@/stores/auth-store"

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const updateMutation = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: user?.firstName ?? "", lastName: user?.lastName ?? "" },
  })

  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName })
    }
  }, [user, reset])

  if (!user) {
    return null
  }

  function onSubmit(values: ProfileFormValues) {
    updateMutation.mutate(values, {
      onSuccess: () => toast.success("Profile updated"),
      onError: () => toast.error("Something went wrong. Please try again."),
    })
  }

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Profile" description="Your account details." />

      <Card className="max-w-md">
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-destructive text-sm">{errors.firstName.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-destructive text-sm">{errors.lastName.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input id="phoneNumber" value={user.phoneNumber} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={humanizeEnum(user.role)} disabled />
            </div>
            <p className="text-muted-foreground text-xs">
              Email, phone number, and role can't be changed here.
            </p>
            <Button type="submit" disabled={updateMutation.isPending} className="mt-2 self-start">
              {updateMutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
