import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { useMyStation } from "@/features/service-stations/use-service-stations"
import { StationInventorySection } from "@/features/station-inventory/station-inventory-section"

// Station identity is real (GET /api/service-stations?managerId=, resolved
// via useMyStation). The inventory section underneath stays mock — the real
// backend still has a global Admin-managed spare-parts catalog, not
// station-owned (see CLAUDE.md, Spare Parts/Station Inventory).
export function MyStationPage() {
  const { data: station } = useMyStation()

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title={station?.name ?? "My Station"}
        description={
          station
            ? `${station.addressLine && station.city ? `${station.addressLine}, ${station.city} — ` : ""}capacity ${station.capacity}`
            : "View and edit your station's inventory."
        }
      />

      <MockDataNotice />

      {station && <StationInventorySection stationId={station.id} canEdit />}
    </div>
  )
}
