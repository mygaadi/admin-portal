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
import {
  serviceStationSchema,
  type ServiceStationFormValues,
} from "@/features/service-stations/service-station-schema"
import type { ServiceStation } from "@/features/service-stations/service-stations-api"
import {
  useCreateServiceStation,
  useUpdateServiceStation,
} from "@/features/service-stations/use-service-stations"

interface ServiceStationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceStation?: ServiceStation
}

export function ServiceStationFormDialog({
  open,
  onOpenChange,
  serviceStation,
}: ServiceStationFormDialogProps) {
  const isEditing = Boolean(serviceStation)
  const createMutation = useCreateServiceStation()
  const updateMutation = useUpdateServiceStation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceStationFormValues>({
    resolver: zodResolver(serviceStationSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        name: serviceStation?.name ?? "",
        locationId: serviceStation?.locationId,
        managerId: serviceStation?.managerId,
        phone: serviceStation?.phone ?? "",
        email: serviceStation?.email ?? "",
        capacity: serviceStation?.capacity,
      } as ServiceStationFormValues)
    }
  }, [open, serviceStation, reset])

  function onSubmit(values: ServiceStationFormValues) {
    const input = {
      name: values.name,
      locationId: values.locationId,
      managerId: values.managerId,
      phone: values.phone || null,
      email: values.email || null,
      capacity: values.capacity,
    }

    const request = isEditing
      ? updateMutation.mutateAsync({ id: serviceStation!.id, input })
      : createMutation.mutateAsync(input)

    request
      .then(() => {
        toast.success(isEditing ? "Service station updated" : "Service station created")
        onOpenChange(false)
      })
      .catch(() => {
        toast.error("Something went wrong. Check the location/manager IDs and try again.")
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit service station" : "New service station"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the station's details, manager, or capacity."
              : "Add a new service station to the network."}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="locationId">Location ID</Label>
              <Input
                id="locationId"
                type="number"
                {...register("locationId", { valueAsNumber: true })}
              />
              {errors.locationId && (
                <p className="text-destructive text-sm">{errors.locationId.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="managerId">Manager ID</Label>
              <Input
                id="managerId"
                type="number"
                {...register("managerId", { valueAsNumber: true })}
              />
              {errors.managerId && (
                <p className="text-destructive text-sm">{errors.managerId.message}</p>
              )}
            </div>
          </div>
          <p className="text-muted-foreground -mt-2 text-xs">
            No lookup exists yet for valid location/manager IDs (see HANDOFF.md). Mock IDs:
            locations 101–103, managers 501–503.
          </p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register("phone")} />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min={0}
              {...register("capacity", { valueAsNumber: true })}
            />
            {errors.capacity && (
              <p className="text-destructive text-sm">{errors.capacity.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
