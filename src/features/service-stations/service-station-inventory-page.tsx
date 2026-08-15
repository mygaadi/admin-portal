import { useParams } from "react-router"

import { PageHeader } from "@/components/page-header"
import { StationInventorySection } from "@/features/station-inventory/station-inventory-section"
import { useServiceStation } from "@/features/service-stations/use-service-stations"
import { MockDataNotice } from "@/components/mock-data-notice"

export function ServiceStationInventoryPage() {
  const { stationId } = useParams<{ stationId: string }>()
  const id = Number(stationId)
  const { data: station } = useServiceStation(id)

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title={station ? `${station.name} — Inventory` : "Station Inventory"}
        description="Spare parts stocked at this station and their available quantity."
      />

      <MockDataNotice />

      <StationInventorySection stationId={id} canEdit />
    </div>
  )
}
