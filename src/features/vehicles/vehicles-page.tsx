import { useMemo, useState } from "react"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableStatusRow } from "@/components/table-status-row"
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

      <div className="flex flex-col gap-4">
        {modelsLoading || modelsError || !models || models.length === 0 ? (
          <div className="border-border bg-card rounded-md border">
            <Table>
              <TableBody>
                <TableStatusRow
                  colSpan={1}
                  isLoading={modelsLoading}
                  isError={modelsError}
                  isEmpty={!modelsLoading && !modelsError}
                  resourceLabel="vehicle models"
                  emptyMessage="No vehicle models yet — add one to get started."
                  onRetry={refetchModels}
                />
              </TableBody>
            </Table>
          </div>
        ) : (
          models.map((model) => (
            <Card key={model.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{model.name}</CardTitle>
                  <p className="text-muted-foreground mt-1 font-mono text-xs tracking-wide uppercase">
                    {humanizeEnum(model.vehicleType)}
                    {model.releaseDate && ` · Released ${model.releaseDate}`}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
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
              </CardHeader>
              <CardContent>
                <div className="border-border rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                          Color
                        </TableHead>
                        <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                          Price
                        </TableHead>
                        {isAdmin && <TableHead />}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(variantsByModel.get(model.id) ?? []).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={isAdmin ? 3 : 2}
                            className="text-muted-foreground text-center"
                          >
                            No variants yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        (variantsByModel.get(model.id) ?? []).map((variant) => (
                          <TableRow key={variant.id}>
                            <TableCell>{variant.color}</TableCell>
                            <TableCell className="text-muted-foreground font-mono text-xs">
                              {formatCurrency(variant.price)}
                            </TableCell>
                            {isAdmin && (
                              <TableCell className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setVariantForm({
                                      mode: "edit",
                                      modelId: model.id,
                                      vehicleVariant: variant,
                                    })
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setPendingDeleteVariant(variant)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setVariantForm({ mode: "create", modelId: model.id })}
                  >
                    Add variant
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

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
