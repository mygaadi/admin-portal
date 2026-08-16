import { useMemo, useState } from "react"
import { ImageOffIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useDeleteVehicleModel, useVehicleModels } from "@/features/vehicle-models/use-vehicle-models"
import { VehicleModelFormDialog } from "@/features/vehicle-models/vehicle-model-form-dialog"
import type { VehicleModel } from "@/features/vehicle-models/vehicle-models-api"
import {
  useDeleteVehicleVariant,
  useVehicleVariants,
} from "@/features/vehicle-variants/use-vehicle-variants"
import { VehicleVariantFormDialog } from "@/features/vehicle-variants/vehicle-variant-form-dialog"
import type { VehicleVariant } from "@/features/vehicle-variants/vehicle-variants-api"
import { formatCurrency, humanizeEnum } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useIsAdmin } from "@/stores/auth-store"

type ModelFormState = { mode: "create" } | { mode: "edit"; vehicleModel: VehicleModel } | null
type VariantFormState =
  | { mode: "create"; modelId: number }
  | { mode: "edit"; modelId: number; vehicleVariant: VehicleVariant }
  | null

export function VehiclesPage() {
  const isAdmin = useIsAdmin()
  const {
    data: models,
    isLoading: modelsLoading,
    isError: modelsError,
    refetch: refetchModels,
  } = useVehicleModels()
  const { data: variants } = useVehicleVariants()
  const deleteModelMutation = useDeleteVehicleModel()
  const deleteVariantMutation = useDeleteVehicleVariant()

  const [modelForm, setModelForm] = useState<ModelFormState>(null)
  const [variantForm, setVariantForm] = useState<VariantFormState>(null)
  const [pendingDeleteModel, setPendingDeleteModel] = useState<VehicleModel | null>(null)
  const [pendingDeleteVariant, setPendingDeleteVariant] = useState<VehicleVariant | null>(null)

  const variantsByModel = useMemo(() => {
    const map = new Map<number, VehicleVariant[]>()
    for (const variant of variants ?? []) {
      const list = map.get(variant.modelId) ?? []
      list.push(variant)
      map.set(variant.modelId, list)
    }
    return map
  }, [variants])

  function handleDeleteModel() {
    if (!pendingDeleteModel) return
    deleteModelMutation.mutate(pendingDeleteModel.id, {
      onSuccess: () => {
        toast.success("Vehicle model deleted")
        setPendingDeleteModel(null)
      },
      onError: () => toast.error("Failed to delete vehicle model"),
    })
  }

  function handleDeleteVariant() {
    if (!pendingDeleteVariant) return
    deleteVariantMutation.mutate(pendingDeleteVariant.id, {
      onSuccess: () => {
        toast.success("Vehicle variant deleted")
        setPendingDeleteVariant(null)
      },
      onError: () => toast.error("Failed to delete vehicle variant"),
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Vehicles"
        description="Models and their color/price variants."
        action={
          isAdmin && <Button onClick={() => setModelForm({ mode: "create" })}>New model</Button>
        }
      />

      {modelsLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : modelsError ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-destructive text-sm">
            Couldn't load vehicle models. Check your connection and try again.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetchModels()}>
            Retry
          </Button>
        </div>
      ) : !models || models.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No vehicle models yet — add one to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {models.map((model) => (
            <section key={model.id}>
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-lg font-semibold">{model.name}</h2>
                  <p className="text-muted-foreground mt-0.5 font-mono text-xs tracking-wide uppercase">
                    {humanizeEnum(model.vehicleType)}
                    {model.releaseDate && ` · Released ${model.releaseDate}`}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModelForm({ mode: "edit", vehicleModel: model })}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setPendingDeleteModel(model)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {(variantsByModel.get(model.id) ?? []).map((variant) => (
                  <Card
                    key={variant.id}
                    size="sm"
                    className={cn("overflow-hidden", !variant.imageUrl && "pt-0")}
                  >
                    {variant.imageUrl ? (
                      <img
                        src={variant.imageUrl}
                        alt={variant.color}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted text-muted-foreground flex aspect-[4/3] w-full items-center justify-center rounded-t-lg">
                        <ImageOffIcon className="size-6" />
                      </div>
                    )}
                    <CardContent className="flex flex-col gap-0.5">
                      <p className="truncate text-sm font-medium">{variant.color}</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {formatCurrency(variant.price)}
                      </p>
                    </CardContent>
                    {isAdmin && (
                      <CardFooter className="gap-1.5">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            setVariantForm({
                              mode: "edit",
                              modelId: model.id,
                              vehicleVariant: variant,
                            })
                          }
                        >
                          <PencilIcon />
                          <span className="sr-only">Edit {variant.color}</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => setPendingDeleteVariant(variant)}
                        >
                          <Trash2Icon />
                          <span className="sr-only">Delete {variant.color}</span>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setVariantForm({ mode: "create", modelId: model.id })}
                    className="border-border text-muted-foreground hover:border-primary hover:text-primary flex min-h-40 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors"
                  >
                    <PlusIcon className="size-5" />
                    <span className="text-xs font-medium">Add variant</span>
                  </button>
                )}

                {!isAdmin && (variantsByModel.get(model.id) ?? []).length === 0 && (
                  <p className="text-muted-foreground col-span-full text-sm">
                    No variants yet.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      <VehicleModelFormDialog
        open={modelForm !== null}
        onOpenChange={(open) => !open && setModelForm(null)}
        vehicleModel={modelForm?.mode === "edit" ? modelForm.vehicleModel : undefined}
      />

      {variantForm && (
        <VehicleVariantFormDialog
          open={variantForm !== null}
          onOpenChange={(open) => !open && setVariantForm(null)}
          modelId={variantForm.modelId}
          vehicleVariant={variantForm.mode === "edit" ? variantForm.vehicleVariant : undefined}
        />
      )}

      <ConfirmDeleteDialog
        open={pendingDeleteModel !== null}
        onOpenChange={(open) => !open && setPendingDeleteModel(null)}
        title="Delete vehicle model"
        description={`This will permanently delete "${pendingDeleteModel?.name}" and its variants. This action cannot be undone.`}
        onConfirm={handleDeleteModel}
        isPending={deleteModelMutation.isPending}
      />

      <ConfirmDeleteDialog
        open={pendingDeleteVariant !== null}
        onOpenChange={(open) => !open && setPendingDeleteVariant(null)}
        title="Delete vehicle variant"
        description={`This will permanently delete the "${pendingDeleteVariant?.color}" variant. This action cannot be undone.`}
        onConfirm={handleDeleteVariant}
        isPending={deleteVariantMutation.isPending}
      />
    </div>
  )
}
