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
import { useVehicleModels } from "@/features/vehicle-models/use-vehicle-models"
import {
  useCreateVehicleVariant,
  useUpdateVehicleVariant,
} from "@/features/vehicle-variants/use-vehicle-variants"
import {
  vehicleVariantSchema,
  type VehicleVariantFormValues,
} from "@/features/vehicle-variants/vehicle-variant-schema"
import type { VehicleVariant } from "@/features/vehicle-variants/vehicle-variants-api"

interface VehicleVariantFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleVariant?: VehicleVariant
}

export function VehicleVariantFormDialog({
  open,
  onOpenChange,
  vehicleVariant,
}: VehicleVariantFormDialogProps) {
  const isEditing = Boolean(vehicleVariant)
  const { data: vehicleModels } = useVehicleModels()
  const createMutation = useCreateVehicleVariant()
  const updateMutation = useUpdateVehicleVariant()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleVariantFormValues>({
    resolver: zodResolver(vehicleVariantSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        modelId: vehicleVariant?.modelId,
        color: vehicleVariant?.color ?? "",
        imageUrl: vehicleVariant?.imageUrl ?? "",
        price: vehicleVariant?.price,
      } as VehicleVariantFormValues)
    }
  }, [open, vehicleVariant, reset])

  function onSubmit(values: VehicleVariantFormValues) {
    const input = {
      modelId: values.modelId,
      color: values.color,
      imageUrl: values.imageUrl || null,
      price: values.price,
    }

    const request = isEditing
      ? updateMutation.mutateAsync({ id: vehicleVariant!.id, input })
      : createMutation.mutateAsync(input)

    request
      .then(() => {
        toast.success(isEditing ? "Vehicle variant updated" : "Vehicle variant created")
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
          <DialogTitle>{isEditing ? "Edit vehicle variant" : "New vehicle variant"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the variant's model, color, image, or price."
              : "Add a new color/price variant for a vehicle model."}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="modelId">Vehicle model</Label>
            <Controller
              control={control}
              name="modelId"
              render={({ field }) => (
                <Select
                  value={field.value ?? undefined}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id="modelId" className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleModels?.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.modelId && (
              <p className="text-destructive text-sm">{errors.modelId.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" {...register("color")} />
            {errors.color && <p className="text-destructive text-sm">{errors.color.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" placeholder="https://…" {...register("imageUrl")} />
            {errors.imageUrl && (
              <p className="text-destructive text-sm">{errors.imageUrl.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
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
