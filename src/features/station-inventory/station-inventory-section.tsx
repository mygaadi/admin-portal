import { useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { TableStatusRow } from "@/components/table-status-row"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                Spare part
              </TableHead>
              <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                Price
              </TableHead>
              <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                Quantity
              </TableHead>
              <TableHead className="font-mono text-[0.6875rem] tracking-wider uppercase">
                Updated
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableStatusRow
              colSpan={4}
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && (!data || data.length === 0)}
              resourceLabel="this station's inventory"
              emptyMessage="No spare parts stocked at this station yet."
              onRetry={refetch}
            />
            {!isLoading &&
              !isError &&
              data?.map((item) => (
                <InventoryRow
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
          </TableBody>
        </Table>
      </div>

      {canEdit && (
        <NewPartForm
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

interface InventoryRowProps {
  item: StationInventoryItem
  canEdit: boolean
  onSave: (quantity: number) => Promise<unknown>
  isPending: boolean
}

function InventoryRow({ item, canEdit, onSave, isPending }: InventoryRowProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const dirty = quantity !== item.quantity

  function handleSave() {
    onSave(quantity).catch(() => setQuantity(item.quantity))
  }

  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell className="text-muted-foreground font-mono text-xs">
        {formatCurrency(item.price)}
      </TableCell>
      <TableCell>
        {canEdit ? (
          <div className="flex items-center gap-1.5">
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
              className="w-16 text-center font-mono"
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
            {dirty && (
              <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            )}
          </div>
        ) : (
          <span className="font-mono text-xs">{item.quantity}</span>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground font-mono text-xs">
        {new Date(item.updatedAt).toLocaleDateString()}
      </TableCell>
    </TableRow>
  )
}

interface NewPartFormProps {
  onCreate: (input: { name: string; price: number; quantity: number }) => Promise<unknown>
  isPending: boolean
}

function NewPartForm({ onCreate, isPending }: NewPartFormProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    if (!name.trim()) return
    onCreate({ name: name.trim(), price, quantity }).then(() => {
      setName("")
      setPrice(0)
      setQuantity(1)
    })
  }

  return (
    <div className="border-border rounded-md border p-4">
      <p className="mb-3 text-sm font-medium">Add a spare part to this station</p>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-part-name">Name</Label>
          <Input
            id="new-part-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-48"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-part-price">Price</Label>
          <Input
            id="new-part-price"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(event) => setPrice(Math.max(0, Number(event.target.value)))}
            className="w-28"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-part-quantity">Quantity</Label>
          <Input
            id="new-part-quantity"
            type="number"
            min={0}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(0, Number(event.target.value)))}
            className="w-24"
          />
        </div>
        <Button disabled={!name.trim() || isPending} onClick={handleAdd}>
          {isPending ? "Adding…" : "Add part"}
        </Button>
      </div>
    </div>
  )
}
