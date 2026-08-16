import { useState } from "react"
import { MapPinIcon } from "lucide-react"
import { Link } from "react-router"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceStationFormDialog } from "@/features/service-stations/service-station-form-dialog"
import type { ServiceStation } from "@/features/service-stations/service-stations-api"
import {
  useDeleteServiceStation,
  useServiceStations,
} from "@/features/service-stations/use-service-stations"

type FormState = { mode: "create" } | { mode: "edit"; serviceStation: ServiceStation } | null

export function ServiceStationsPage() {
  const { data, isLoading, isError, refetch } = useServiceStations()
  const deleteMutation = useDeleteServiceStation()

  const [formState, setFormState] = useState<FormState>(null)
  const [pendingDelete, setPendingDelete] = useState<ServiceStation | null>(null)

  function handleDelete() {
    if (!pendingDelete) return
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Service station deleted")
        setPendingDelete(null)
      },
      onError: () => toast.error("Failed to delete service station"),
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Service Stations"
        description="Stations available to service customer vehicles."
        action={<Button onClick={() => setFormState({ mode: "create" })}>New station</Button>}
      />

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-destructive text-sm">
            Couldn't load service stations. Check your connection and try again.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : !data || data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No service stations yet — add one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((station) => (
            <Card key={station.id}>
              <CardHeader>
                <p className="text-muted-foreground font-mono text-[0.6875rem] tracking-wider uppercase">
                  #{String(station.id).padStart(3, "0")}
                </p>
                <CardTitle className="mt-1 text-base">{station.name}</CardTitle>
                <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
                  <MapPinIcon className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {station.city && station.state ? `${station.city}, ${station.state}` : "No location set"}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div>
                  <p className="text-muted-foreground font-mono text-[0.6875rem] tracking-wide uppercase">
                    Manager
                  </p>
                  <p className="text-sm">{station.managerName ?? "Unassigned"}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-2xl leading-none font-semibold">
                    {station.capacity}
                  </p>
                  <p className="text-muted-foreground mt-1 font-mono text-[0.6875rem] tracking-wide uppercase">
                    Bays
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link to={`/service-stations/${station.id}/inventory`} />}
                >
                  Inventory
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormState({ mode: "edit", serviceStation: station })}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setPendingDelete(station)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ServiceStationFormDialog
        open={formState !== null}
        onOpenChange={(open) => !open && setFormState(null)}
        serviceStation={formState?.mode === "edit" ? formState.serviceStation : undefined}
      />

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete service station"
        description={`This will permanently delete "${pendingDelete?.name}". This action cannot be undone.`}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
