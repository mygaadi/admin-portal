import { PlaceholderPage } from "@/components/placeholder-page"

// TODO(api-integration): confirmed conceptually via the "My Garage" mind map
// (2026-08-15) — Admin can create a Station Manager account — but no such
// endpoint is documented anywhere in PRD.md. POST /api/auth/register has no
// role field and always creates a CUSTOMER. Confirm the real endpoint/shape
// with the backend dev before building this for real — see HANDOFF.md open
// question #1.
export function CreateStationManagerPage() {
  return (
    <PlaceholderPage
      eyebrow="Accounts"
      title="Create Station Manager"
      description="Create a new Station Manager account and assign them to a station."
    />
  )
}
