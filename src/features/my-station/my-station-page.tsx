import { MockDataNotice } from "@/components/mock-data-notice"
import { PageHeader } from "@/components/page-header"
import { useServiceStation } from "@/features/service-stations/use-service-stations"
import { MOCK_MY_STATION_ID } from "@/features/station-inventory/station-inventory-api"
import { StationInventorySection } from "@/features/station-inventory/station-inventory-section"

// TODO(api-integration): the PRD documents station-scoped inventory
// (GET/PUT /api/service-stations/{stationId}/inventory) but no endpoint to
// look up *which* station the authenticated Station Manager is assigned to
// (no GET /api/service-stations/me). Standing in with a fixed mock station
// (MOCK_MY_STATION_ID) until that's confirmed — see HANDOFF.md open
// questions.
export function MyStationPage() {
  const { data: station } = useServiceStation(MOCK_MY_STATION_ID)

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title={station?.name ?? "My Station"}
        description={
          station
            ? `${station.addressLine}, ${station.city} — capacity ${station.capacity}`
            : "View and edit your station's inventory."
        }
      />

      <MockDataNotice />

      <StationInventorySection stationId={MOCK_MY_STATION_ID} canEdit />
    </div>
  )
}
