import { createBrowserRouter } from "react-router"

import { LoginPage } from "@/features/auth/login-page"
import { BookingsPage } from "@/features/bookings/bookings-page"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { ServiceChargesPage } from "@/features/service-charges/service-charges-page"
import { ServiceStationsPage } from "@/features/service-stations/service-stations-page"
import { SparePartsPage } from "@/features/spare-parts/spare-parts-page"
import { VehicleModelsPage } from "@/features/vehicle-models/vehicle-models-page"
import { VehicleVariantsPage } from "@/features/vehicle-variants/vehicle-variants-page"
import { ProtectedRoute } from "@/routes/protected-route"
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
          { path: "/vehicle-models", element: <VehicleModelsPage /> },
          { path: "/vehicle-variants", element: <VehicleVariantsPage /> },
          { path: "/service-stations", element: <ServiceStationsPage /> },
          { path: "/spare-parts", element: <SparePartsPage /> },
          { path: "/service-charges", element: <ServiceChargesPage /> },
          { path: "/bookings", element: <BookingsPage /> },
        ],
      },
    ],
  },
])
