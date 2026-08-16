import { useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { StationInventoryItem } from "@/features/station-inventory/station-inventory-api"
import {
  useCreateStationInventoryItem,
  useStationInventory,
  useUpdateStationInventoryQuantity,
} from "@/features/station-inventory/use-station-inventory"
import { formatCurrency } from "@/lib/format"

interface StationInventorySectionProps {
  stationId: number
  canEdit: boolean
}

export function StationInventorySection({ stationId, canEdit }: StationInventorySectionProps) {
  const { data, isLoading, isError, refetch } = useStationInventory(stationId)
  const updateMutation = useUpdateStationInventoryQuantity(stationId)
  const createMutation = useCreateStationInventoryItem(stationId)

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading…</p>
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-destructive text-sm">
          Couldn't load this station's inventory. Check your connection and try again.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {data?.map((item) => (
        <PartTile
          key={item.id}
          item={item}
          canEdit={canEdit}
          onSave={(quantity) =>
            updateMutation.mutateAsync(
              { id: item.id, quantity },
              {
                onSuccess: () => toast.success("Inventory updated"),
                onError: () => toast.error("Failed to update inventory"),
              }
            )
          }
          isPending={updateMutation.isPending}
        />
      ))}

      {(!data || data.length === 0) && !canEdit && (
        <p className="text-muted-foreground col-span-full text-sm">
          No spare parts stocked at this station yet.
        </p>
      )}

      {canEdit && (
        <AddPartTile
          onCreate={(input) =>
            createMutation.mutateAsync(input, {
              onSuccess: () => toast.success("Spare part added to inventory"),
              onError: () => toast.error("Failed to add spare part"),
            })
          }
          isPending={createMutation.isPending}
        />
      )}
    </div>
  )
}

interface PartTileProps {
  item: StationInventoryItem
  canEdit: boolean
  onSave: (quantity: number) => Promise<unknown>
  isPending: boolean
}

function PartTile({ item, canEdit, onSave, isPending }: PartTileProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const dirty = quantity !== item.quantity

  function handleSave() {
    onSave(quantity).catch(() => setQuantity(item.quantity))
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="truncate text-sm font-medium">{item.name}</p>
          <p className="text-muted-foreground mt-0.5 font-mono text-xs">
            {formatCurrency(item.price)}
          </p>
        </div>

        {canEdit ? (
          <div className="flex items-center justify-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setQuantity((q) => Math.max(0, q - 1))}
              disabled={isPending}
            >
              <MinusIcon />
            </Button>
            <Input
              type="number"
              min={0}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(0, Number(event.target.value)))}
              className="w-14 text-center font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setQuantity((q) => q + 1)}
              disabled={isPending}
            >
              <PlusIcon />
            </Button>
          </div>
        ) : (
          <p className="text-center font-mono text-lg font-semibold">{item.quantity}</p>
        )}

        {dirty && (
          <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        )}

        <p className="text-muted-foreground text-center font-mono text-[0.6875rem] tracking-wide uppercase">
          Updated {new Date(item.updatedAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}

interface AddPartTileProps {
  onCreate: (input: { name: string; price: number; quantity: number }) => Promise<unknown>
  isPending: boolean
}

function AddPartTile({ onCreate, isPending }: AddPartTileProps) {
  const [expanded, setExpanded] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    if (!name.trim()) return
    onCreate({ name: name.trim(), price, quantity }).then(() => {
      setName("")
      setPrice(0)
      setQuantity(1)
      setExpanded(false)
    })
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="border-border text-muted-foreground hover:border-primary hover:text-primary flex min-h-38 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors"
      >
        <PlusIcon className="size-5" />
        <span className="text-xs font-medium">Add spare part</span>
      </button>
    )
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <Input
          placeholder="Part name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />
        <div className="flex gap-2">
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(event) => setPrice(Math.max(0, Number(event.target.value)))}
            className="w-1/2 font-mono"
          />
          <Input
            type="number"
            min={0}
            placeholder="Qty"
            value={quantity}
            onChange={(event) => setQuantity(Math.max(0, Number(event.target.value)))}
            className="w-1/2 font-mono"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setExpanded(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="flex-1"
            disabled={!name.trim() || isPending}
            onClick={handleAdd}
          >
            {isPending ? "Adding…" : "Add"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
