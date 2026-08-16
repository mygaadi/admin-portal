import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import type { ServiceCharge } from "@/features/service-charges/service-charges-api"
import {
  serviceChargeSchema,
  type ServiceChargeFormValues,
} from "@/features/service-charges/service-charge-schema"
import { useUpdateServiceCharge } from "@/features/service-charges/use-service-charges"
import { humanizeEnum } from "@/lib/format"

interface ServiceChargeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceCharge: ServiceCharge | null
}

export function ServiceChargeFormDialog({
  open,
  onOpenChange,
  serviceCharge,
}: ServiceChargeFormDialogProps) {
  const updateMutation = useUpdateServiceCharge(serviceCharge?.stationId ?? -1)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceChargeFormValues>({
    resolver: zodResolver(serviceChargeSchema),
  })

  useEffect(() => {
    if (open) {
      reset({ amount: serviceCharge?.amount })
    }
  }, [open, serviceCharge, reset])

  function onSubmit(values: ServiceChargeFormValues) {
    if (!serviceCharge) return

    updateMutation
      .mutateAsync({ id: serviceCharge.id, amount: values.amount })
      .then(() => {
        toast.success("Service charge updated")
        onOpenChange(false)
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again.")
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit service charge</DialogTitle>
          <DialogDescription>
            {serviceCharge
              ? `Update the charge for ${humanizeEnum(serviceCharge.serviceType)}.`
              : null}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
