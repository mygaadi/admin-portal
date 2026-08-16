import { createBrowserRouter } from "react-router"

import { LoginPage } from "@/features/auth/login-page"
import { BookingDetailPage } from "@/features/bookings/booking-detail-page"
import { BookingsPage } from "@/features/bookings/bookings-page"
import { CreateMechanicPage } from "@/features/accounts/create-mechanic-page"
import { CreateStationManagerPage } from "@/features/accounts/create-station-manager-page"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { MyBookingsPage } from "@/features/my-bookings/my-bookings-page"
import { MyStationPage } from "@/features/my-station/my-station-page"
import { ServiceChargesPage } from "@/features/service-charges/service-charges-page"
import { ServiceStationInventoryPage } from "@/features/service-stations/service-station-inventory-page"
import { ServiceStationsPage } from "@/features/service-stations/service-stations-page"
import { VehiclesPage } from "@/features/vehicles/vehicles-page"
import { ProtectedRoute } from "@/routes/protected-route"
import { RequireRole } from "@/routes/require-role"
import { RootLayout } from "@/routes/root-layout"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          // Shared — Admin can edit, Station Manager sees this read-only.
          { path: "/vehicles", element: <VehiclesPage /> },
          { path: "/service-charges", element: <ServiceChargesPage /> },
          // Shared — Admin or Station Manager can create a Mechanic account.
          { path: "/create-mechanic", element: <CreateMechanicPage /> },
          // Admin-only — cross-station.
          {
            element: <RequireRole role="ADMIN" />,
            children: [
              { path: "/service-stations", element: <ServiceStationsPage /> },
              {
                path: "/service-stations/:stationId/inventory",
                element: <ServiceStationInventoryPage />,
              },
              { path: "/bookings", element: <BookingsPage /> },
              { path: "/bookings/:bookingId", element: <BookingDetailPage /> },
              { path: "/create-station-manager", element: <CreateStationManagerPage /> },
            ],
          },
          // Station Manager-only — scoped to their own station.
          {
            element: <RequireRole role="STATION_MANAGER" />,
            children: [
              { path: "/my-station", element: <MyStationPage /> },
              { path: "/my-bookings", element: <MyBookingsPage /> },
              { path: "/my-bookings/:bookingId", element: <BookingDetailPage /> },
            ],
          },
        ],
      },
    ],
  },
])
