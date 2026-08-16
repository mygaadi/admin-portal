import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { LocationPicker, type LocationCoordinates } from "@/components/location-picker"
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
import {
  serviceStationSchema,
  type ServiceStationFormValues,
} from "@/features/service-stations/service-station-schema"
import {
  MOCK_MANAGERS,
  serviceStationsApi,
  type ServiceStation,
} from "@/features/service-stations/service-stations-api"
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
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceStationFormValues>({
    resolver: zodResolver(serviceStationSchema),
  })

  useEffect(() => {
    if (!open) return

    reset({
      name: serviceStation?.name ?? "",
      managerId: serviceStation?.managerId ?? undefined,
      addressLine: serviceStation?.addressLine ?? "",
      city: serviceStation?.city ?? "",
      state: serviceStation?.state ?? "",
      latitude: undefined,
      longitude: undefined,
      phone: serviceStation?.phone ?? "",
      email: serviceStation?.email ?? "",
      capacity: serviceStation?.capacity,
    })

    if (serviceStation) {
      serviceStationsApi.getLocation(serviceStation.locationId).then((location) => {
        setValue("latitude", location.latitude)
        setValue("longitude", location.longitude)
      })
    }
  }, [open, serviceStation, reset, setValue])

  const latitude = watch("latitude")
  const longitude = watch("longitude")
  const coordinates: LocationCoordinates | null =
    latitude !== undefined && longitude !== undefined ? { latitude, longitude } : null

  function handleCoordinatesChange(next: LocationCoordinates) {
    setValue("latitude", next.latitude, { shouldValidate: true })
    setValue("longitude", next.longitude, { shouldValidate: true })
  }

  function onSubmit(values: ServiceStationFormValues) {
    const input = {
      name: values.name,
      managerId: values.managerId,
      addressLine: values.addressLine,
      city: values.city,
      state: values.state,
      latitude: values.latitude,
      longitude: values.longitude,
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
        toast.error("Something went wrong. Please try again.")
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
            <Input id="name" autoComplete="off" {...register("name")} />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="managerId">Station manager</Label>
            <Controller
              control={control}
              name="managerId"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="managerId" className="w-full">
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_MANAGERS.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.managerId && (
              <p className="text-destructive text-sm">{errors.managerId.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="addressLine">Address</Label>
            <Input id="addressLine" autoComplete="off" {...register("addressLine")} />
            {errors.addressLine && (
              <p className="text-destructive text-sm">{errors.addressLine.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" autoComplete="off" {...register("city")} />
              {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" autoComplete="off" {...register("state")} />
              {errors.state && <p className="text-destructive text-sm">{errors.state.message}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Coordinates</Label>
            <LocationPicker value={coordinates} onChange={handleCoordinatesChange} />
            {(errors.latitude || errors.longitude) && (
              <p className="text-destructive text-sm">
                {errors.latitude?.message ?? errors.longitude?.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" autoComplete="off" {...register("phone")} />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="off" {...register("email")} />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
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
