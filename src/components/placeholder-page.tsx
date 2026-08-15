interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div>
      <h1 className="text-lg font-medium">{title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {description ?? "Coming soon."}
      </p>
    </div>
  )
}
