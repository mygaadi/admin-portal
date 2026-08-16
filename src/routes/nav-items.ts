import type { Role } from "@/stores/auth-store"

export interface NavItem {
  to: string
  label: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

const overviewGroup: NavGroup = {
  label: "Overview",
  items: [{ to: "/", label: "Dashboard" }],
}

// Shared between roles — Station Manager sees this read-only, Admin can edit.
const catalogGroup: NavGroup = {
  label: "Catalog",
  items: [{ to: "/vehicles", label: "Vehicles" }],
}

const financeGroup: NavGroup = {
  label: "Finance",
  items: [{ to: "/service-charges", label: "Service Charges" }],
}

const adminOperationsGroup: NavGroup = {
  label: "Operations",
  items: [
    { to: "/service-stations", label: "Service Stations" },
    { to: "/bookings", label: "Bookings" },
  ],
}

const stationManagerOperationsGroup: NavGroup = {
  label: "Operations",
  items: [
    { to: "/my-station", label: "My Station" },
    { to: "/my-bookings", label: "My Bookings" },
  ],
}

const adminAccountsGroup: NavGroup = {
  label: "Accounts",
  items: [
    { to: "/create-station-manager", label: "Create Station Manager" },
    { to: "/create-mechanic", label: "Create Mechanic" },
  ],
}

const stationManagerAccountsGroup: NavGroup = {
  label: "Accounts",
  items: [{ to: "/create-mechanic", label: "Create Mechanic" }],
}

export function getNavGroups(role: Role): NavGroup[] {
  switch (role) {
    case "ADMIN":
      return [
        overviewGroup,
        catalogGroup,
        adminOperationsGroup,
        financeGroup,
        adminAccountsGroup,
      ]
    case "STATION_MANAGER":
      return [
        overviewGroup,
        stationManagerOperationsGroup,
        catalogGroup,
        financeGroup,
        stationManagerAccountsGroup,
      ]
    default:
      return [overviewGroup]
  }
}
