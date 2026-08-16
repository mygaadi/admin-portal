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
import {
  useCreateVehicleModel,
  useUpdateVehicleModel,
} from "@/features/vehicle-models/use-vehicle-models"
import {
  vehicleModelSchema,
  type VehicleModelFormValues,
} from "@/features/vehicle-models/vehicle-model-schema"
import { VEHICLE_TYPES, type VehicleModel } from "@/features/vehicle-models/vehicle-models-api"
import { humanizeEnum } from "@/lib/format"

interface VehicleModelFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleModel?: VehicleModel
}

export function VehicleModelFormDialog({
  open,
  onOpenChange,
  vehicleModel,
}: VehicleModelFormDialogProps) {
  const isEditing = Boolean(vehicleModel)
  const createMutation = useCreateVehicleModel()
  const updateMutation = useUpdateVehicleModel()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleModelFormValues>({
    resolver: zodResolver(vehicleModelSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        name: vehicleModel?.name ?? "",
        vehicleType: vehicleModel?.vehicleType,
        releaseDate: vehicleModel?.releaseDate ?? "",
      } as VehicleModelFormValues)
    }
  }, [open, vehicleModel, reset])

  function onSubmit(values: VehicleModelFormValues) {
    const input = {
      name: values.name,
      vehicleType: values.vehicleType,
      releaseDate: values.releaseDate || null,
    }

    const request = isEditing
      ? updateMutation.mutateAsync({ id: vehicleModel!.id, input })
      : createMutation.mutateAsync(input)

    request
      .then(() => {
        toast.success(isEditing ? "Vehicle model updated" : "Vehicle model created")
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
          <DialogTitle>{isEditing ? "Edit vehicle model" : "New vehicle model"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the model's name or release date."
              : "Add a new vehicle model to the catalog."}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicleType">Vehicle type</Label>
            <Controller
              control={control}
              name="vehicleType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="vehicleType" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {humanizeEnum(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.vehicleType && (
              <p className="text-destructive text-sm">{errors.vehicleType.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="releaseDate">Release date</Label>
            <Input id="releaseDate" type="date" {...register("releaseDate")} />
            {errors.releaseDate && (
              <p className="text-destructive text-sm">{errors.releaseDate.message}</p>
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
