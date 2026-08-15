import { PlaceholderPage } from "@/components/placeholder-page"

// TODO(api-integration): the PRD documents station-scoped inventory
// (GET/PUT /api/service-stations/{stationId}/inventory) but no endpoint to
// look up *which* station the authenticated Station Manager is assigned to
// (no GET /api/service-stations/me). Confirm with the backend dev before
// building this out — see HANDOFF.md open questions.
export function MyStationPage() {
  return (
    <PlaceholderPage
      eyebrow="Operations"
      title="My Station"
      description="View and edit your station's inventory and details."
    />
  )
}
