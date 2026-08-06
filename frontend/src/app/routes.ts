import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import PavilionPage from "./pages/PavilionPage";
import PoolPage from "./pages/PoolPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Facilities from "./pages/admin/Facilities";
import Schedules from "./pages/admin/Schedules";
import Maintenance from "./pages/admin/Maintenance";
import Content from "./pages/admin/Content";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

export const router = createBrowserRouter([
  // Public routes
  { path: "/", Component: Home },
  { path: "/venues/pavilion", Component: PavilionPage },
  { path: "/venues/pool", Component: PoolPage },

  // Admin login (standalone, no layout) - must be before /admin route
  { path: "/admin/login", Component: AdminLogin },

  // Admin dashboard (protected, with sidebar layout)
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "facilities",  Component: Facilities },
      { path: "schedules",   Component: Schedules },
      { path: "maintenance", Component: Maintenance },
      { path: "content",     Component: Content },
      { path: "reports",   Component: Reports },
      { path: "settings",  Component: Settings },
    ],
  },
]);
