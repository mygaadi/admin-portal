import type { BookingStatus } from "@/features/bookings/bookings-api"
import { humanizeEnum } from "@/lib/format"
import { cn } from "@/lib/utils"

const STEPS: BookingStatus[] = ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED"]

const STEP_COLOR: Record<BookingStatus, string> = {
  PENDING: "bg-status-pending",
  ASSIGNED: "bg-status-assigned",
  IN_PROGRESS: "bg-status-in-progress",
  COMPLETED: "bg-status-completed",
  CANCELLED: "bg-status-cancelled",
}

const STEP_RING: Record<BookingStatus, string> = {
  PENDING: "ring-status-pending/30",
  ASSIGNED: "ring-status-assigned/30",
  IN_PROGRESS: "ring-status-in-progress/30",
  COMPLETED: "ring-status-completed/30",
  CANCELLED: "ring-status-cancelled/30",
}

interface BookingStatusStepperProps {
  status: BookingStatus
  labeled?: boolean
}

export function BookingStatusStepper({ status, labeled = false }: BookingStatusStepperProps) {
  if (status === "CANCELLED") {
    return (
      <span className="text-status-cancelled inline-flex items-center gap-1.5 font-mono text-xs tracking-wide uppercase">
        <span className="bg-status-cancelled size-2 rounded-full" />
        Cancelled
      </span>
    )
  }

  const currentIndex = STEPS.indexOf(status)

  return (
    <div className="flex items-center">
      {STEPS.map((step, index) => (
        <div key={step} className="flex items-center">
          {index > 0 && (
            <span
              className={cn("h-px w-4", index <= currentIndex ? "bg-primary/40" : "bg-border")}
            />
          )}
          <div className="flex flex-col items-center gap-1">
            <span
              title={humanizeEnum(step)}
              className={cn(
                "size-2.5 rounded-full",
                index <= currentIndex ? STEP_COLOR[step] : "bg-border",
                index === currentIndex && cn("ring-2 ring-offset-2 ring-offset-card", STEP_RING[step])
              )}
            />
            {labeled && (
              <span
                className={cn(
                  "font-mono text-[0.625rem] whitespace-nowrap uppercase",
                  index <= currentIndex ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {humanizeEnum(step)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
