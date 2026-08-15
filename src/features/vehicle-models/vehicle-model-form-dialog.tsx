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
  useCreateVehicleModel,
  useUpdateVehicleModel,
} from "@/features/vehicle-models/use-vehicle-models"
import {
  vehicleModelSchema,
  type VehicleModelFormValues,
} from "@/features/vehicle-models/vehicle-model-schema"
import type { VehicleModel } from "@/features/vehicle-models/vehicle-models-api"

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
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleModelFormValues>({
    resolver: zodResolver(vehicleModelSchema),
    defaultValues: { name: "", releaseDate: "" },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: vehicleModel?.name ?? "",
        releaseDate: vehicleModel?.releaseDate ?? "",
      })
    }
  }, [open, vehicleModel, reset])

  function onSubmit(values: VehicleModelFormValues) {
    const input = {
      name: values.name,
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
