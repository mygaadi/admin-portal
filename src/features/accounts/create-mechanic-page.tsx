import { PlaceholderPage } from "@/components/placeholder-page"

// TODO(api-integration): confirmed conceptually via the "My Garage" mind map
// (2026-08-15) — Admin or Station Manager can create a Mechanic account —
// but no such endpoint is documented anywhere in PRD.md. Confirm the real
// endpoint/shape with the backend dev before building this for real — see
// HANDOFF.md open question #1.
export function CreateMechanicPage() {
  return (
    <PlaceholderPage
      eyebrow="Accounts"
      title="Create Mechanic"
      description="Create a new Mechanic account for your station."
    />
  )
}
