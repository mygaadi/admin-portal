import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { accountSchema, type AccountFormValues } from "@/features/accounts/accounts-schema"
import type { CreatableRole } from "@/features/accounts/accounts-api"
import { useCreateAccount } from "@/features/accounts/use-accounts"
import { humanizeEnum } from "@/lib/format"

interface AccountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableRoles: CreatableRole[]
}

export function AccountFormDialog({ open, onOpenChange, availableRoles }: AccountFormDialogProps) {
  const createMutation = useCreateAccount()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        role: availableRoles.length === 1 ? availableRoles[0] : undefined,
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
      } as AccountFormValues)
    }
  }, [open, availableRoles, reset])

  function onSubmit(values: AccountFormValues) {
    createMutation.mutate(
      {
        role: values.role,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      },
      {
        onSuccess: () => {
          toast.success(`${humanizeEnum(values.role)} account created`)
          onOpenChange(false)
        },
        onError: () => toast.error("Something went wrong. Please try again."),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New user</DialogTitle>
          <DialogDescription>Create an account and assign it a role.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {humanizeEnum(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
          </div>
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
            <Label htmlFor="phoneNumber">Phone number</Label>
            <Input id="phoneNumber" type="tel" {...register("phoneNumber")} />
            {errors.phoneNumber && (
              <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Temporary password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
