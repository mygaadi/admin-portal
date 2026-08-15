import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"

interface TableStatusRowProps {
  colSpan: number
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  resourceLabel: string
  emptyMessage: string
  onRetry?: () => void
}

export function TableStatusRow({
  colSpan,
  isLoading,
  isError,
  isEmpty,
  resourceLabel,
  emptyMessage,
  onRetry,
}: TableStatusRowProps) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-muted-foreground text-center">
          Loading…
        </TableCell>
      </TableRow>
    )
  }

  if (isError) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan}>
          <div className="flex flex-col items-center gap-2 py-2 text-center">
            <p className="text-destructive text-sm">
              Couldn't load {resourceLabel}. Check your connection and try again.
            </p>
            {onRetry && (
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    )
  }

  if (isEmpty) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-muted-foreground text-center">
          {emptyMessage}
        </TableCell>
      </TableRow>
    )
  }

  return null
}
