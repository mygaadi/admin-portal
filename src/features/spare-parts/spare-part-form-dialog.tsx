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
import { useCreateSparePart, useUpdateSparePart } from "@/features/spare-parts/use-spare-parts"
import {
  sparePartSchema,
  type SparePartFormValues,
} from "@/features/spare-parts/spare-part-schema"
import type { SparePart } from "@/features/spare-parts/spare-parts-api"

interface SparePartFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sparePart?: SparePart
}

export function SparePartFormDialog({ open, onOpenChange, sparePart }: SparePartFormDialogProps) {
  const isEditing = Boolean(sparePart)
  const { data: vehicleModels } = useVehicleModels()
  const createMutation = useCreateSparePart()
  const updateMutation = useUpdateSparePart()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SparePartFormValues>({
    resolver: zodResolver(sparePartSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        name: sparePart?.name ?? "",
        modelId: sparePart?.modelId,
        price: sparePart?.price,
        imageUrl: sparePart?.imageUrl ?? "",
      } as SparePartFormValues)
    }
  }, [open, sparePart, reset])

  function onSubmit(values: SparePartFormValues) {
    const input = {
      name: values.name,
      modelId: values.modelId,
      price: values.price,
      imageUrl: values.imageUrl || null,
    }

    const request = isEditing
      ? updateMutation.mutateAsync({ id: sparePart!.id, input })
      : createMutation.mutateAsync(input)

    request
      .then(() => {
        toast.success(isEditing ? "Spare part updated" : "Spare part created")
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
          <DialogTitle>{isEditing ? "Edit spare part" : "New spare part"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the part's name, model, price, or image."
              : "Add a new spare part to the catalog."}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="modelId">Compatible vehicle model</Label>
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" placeholder="https://…" {...register("imageUrl")} />
            {errors.imageUrl && (
              <p className="text-destructive text-sm">{errors.imageUrl.message}</p>
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
