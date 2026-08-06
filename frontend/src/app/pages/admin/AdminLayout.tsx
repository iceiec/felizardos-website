import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Building2, CalendarDays, Wrench,
  FileEdit, LogOut, Menu, X, ChevronRight, Bell, BarChart2, Settings,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuth";

const NAV_ITEMS = [
  { to: "/admin",             label: "Overview",    Icon: LayoutDashboard, end: true },
  { to: "/admin/facilities",  label: "Facilities",  Icon: Building2 },
  { to: "/admin/schedules",   label: "Schedules",   Icon: CalendarDays },
  { to: "/admin/maintenance", label: "Maintenance", Icon: Wrench },
  { to: "/admin/content",     label: "Content",     Icon: FileEdit },
  { to: "/admin/reports",   label: "Reports",   Icon: BarChart2 },
  { to: "/admin/settings",  label: "Settings",  Icon: Settings },
];

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-[260px] flex-shrink-0 bg-[#0F1117] h-full flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/6">
        <div className="flex flex-col leading-none">
          <span className="font-display text-[14px] tracking-[0.22em] font-bold text-white">FELIZARDO'S</span>
          <span className="text-[8px] tracking-[0.4em] text-white/30 mt-0.5">EVENT PLACE</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-[#A8C88A]/15 text-[#A8C88A] text-[10px] px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A8C88A]" />
          Admin Panel
        </div>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] tracking-[0.3em] text-white/25 uppercase px-3 mb-3">Navigation</p>
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#2D5016] text-white"
                  : "text-white/50 hover:text-white hover:bg-white/6"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#A8C88A]" : ""}`} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#A8C88A]" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/6">
        <div className="px-3 py-3 rounded-xl bg-white/4 mb-2">
          <p className="text-white/75 text-[13px] font-medium truncate">Administrator</p>
          <p className="text-white/30 text-[11px] truncate">admin@felizardos.com</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // If not authenticated, redirect to login — use Navigate component, not useEffect
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const currentLabel = NAV_ITEMS.find(n =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to + "/") || location.pathname === n.to
  )?.label ?? "Admin";

  return (
    <div className="h-screen bg-[#F4F5F7] flex overflow-hidden font-sans">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex lg:hidden"
            >
              <Sidebar onLogout={handleLogout} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E5E7EB] px-5 lg:px-8 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            className="lg:hidden text-[#666] hover:text-[#111] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="font-semibold text-[16px] text-[#111]">{currentLabel}</h1>
            <p className="text-[#999] text-[12px]">
              {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F4F5F7] transition-colors">
              <Bell className="w-4 h-4 text-[#666]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>
            <a
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-[12px] text-[#666] hover:text-[#1E3A1E] transition-colors border border-[#E5E7EB] rounded-lg px-3 py-1.5 hover:border-[#A8C88A]"
            >
              View Site ↗
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="relative flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
