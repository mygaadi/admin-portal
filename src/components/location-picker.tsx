import { useState } from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Uses OpenStreetMap's free Nominatim search — no API key/billing needed,
// a reasonable fit while the rest of the app is mock data too. Their usage
// policy (https://operations.osmfoundation.org/policies/nominatim/) caps
// this at ~1 request/second and expects light/prototype-level traffic —
// swap for a paid geocoding provider or a self-hosted instance before any
// real production usage.
//
// Only produces coordinates — address/city/state are independent text
// fields the user fills in themselves (2026-08-16 product direction), not
// derived from the search result.

export interface LocationCoordinates {
  latitude: number
  longitude: number
}

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
}

interface LocationPickerProps {
  value: LocationCoordinates | null
  onChange: (value: LocationCoordinates) => void
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NominatimResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pickedLabel, setPickedLabel] = useState<string | null>(null)

  async function handleSearch() {
    if (query.trim().length < 3) return
    setIsSearching(true)
    setError(null)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
      )
      if (!response.ok) {
        throw new Error("Search request failed")
      }
      const data = (await response.json()) as NominatimResult[]
      setResults(data)
      if (data.length === 0) {
        setError("No matches found. Try a different search.")
      }
    } catch {
      setError("Couldn't search for that location. Check your connection and try again.")
    } finally {
      setIsSearching(false)
    }
  }

  function handleSelect(result: NominatimResult) {
    onChange({ latitude: Number(result.lat), longitude: Number(result.lon) })
    setPickedLabel(result.display_name)
    setResults([])
    setQuery("")
    setError(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a place to set coordinates…"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              handleSearch()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={isSearching || query.trim().length < 3}
        >
          <SearchIcon />
          {isSearching ? "Searching…" : "Search"}
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {results.length > 0 && (
        <div className="border-border bg-card max-h-48 overflow-y-auto rounded-md border">
          {results.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className="hover:bg-accent block w-full px-3 py-2 text-left text-sm"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}

      {value && (
        <div className="border-border bg-muted/30 rounded-md border px-3 py-2 text-sm">
          {pickedLabel && <p className="text-muted-foreground truncate text-xs">{pickedLabel}</p>}
          <p className="text-muted-foreground mt-0.5 font-mono text-xs">
            {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
          </p>
        </div>
      )}
    </div>
  )
}
