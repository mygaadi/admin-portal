export interface NavItem {
  to: string
  label: string
}

export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard" },
  { to: "/vehicle-models", label: "Vehicle Models" },
  { to: "/vehicle-variants", label: "Vehicle Variants" },
  { to: "/service-stations", label: "Service Stations" },
  { to: "/spare-parts", label: "Spare Parts" },
  { to: "/service-charges", label: "Service Charges" },
  { to: "/bookings", label: "Bookings" },
]
