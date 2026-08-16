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

// Shared between roles — the dialog inside just offers fewer role options
// for Station Manager (see AccountsPage).
const accountsGroup: NavGroup = {
  label: "Accounts",
  items: [{ to: "/accounts", label: "Accounts" }],
}

export function getNavGroups(role: Role): NavGroup[] {
  switch (role) {
    case "ADMIN":
      return [overviewGroup, catalogGroup, adminOperationsGroup, financeGroup, accountsGroup]
    case "STATION_MANAGER":
      return [
        overviewGroup,
        stationManagerOperationsGroup,
        catalogGroup,
        financeGroup,
        accountsGroup,
      ]
    default:
      return [overviewGroup]
  }
}
