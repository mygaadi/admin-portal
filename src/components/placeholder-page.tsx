import { PageHeader } from "@/components/page-header"

interface PlaceholderPageProps {
  eyebrow: string
  title: string
  description?: string
}

export function PlaceholderPage({ eyebrow, title, description }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} />
      <p className="text-muted-foreground text-sm">{description ?? "Coming soon."}</p>
    </div>
  )
}
