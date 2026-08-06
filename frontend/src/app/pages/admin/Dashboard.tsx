import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Building2, CalendarDays, Wrench, TrendingUp,
  CheckCircle2, ArrowRight, FileBarChart, ChevronDown,
} from "lucide-react";
import {
  FACILITY_COLORS, type Facility, type Schedule, type MaintenanceItem
} from "../../utils/adminData";
import { facilityService } from "../../services/facilityService";
import { scheduleService } from "../../services/scheduleService";
import { maintenanceService } from "../../services/maintenanceService";

// ─── Revenue lookup by package name ──────────────────────────────────────────
const PACKAGE_REVENUE: Record<string, number> = {
  Premium: 38000,
  "Full Day": 25000,
  "Half Day": 15000,
  Tide: 22000,
  Wave: 15000,
  Splash: 8000,
};
const COURT_FLAT = 3500;

function getRevenue(s: { facilityId: string; packageName?: string }): number {
  if (!s.packageName) return COURT_FLAT;
  return PACKAGE_REVENUE[s.packageName] ?? 0;
}

// ─── Month labels ─────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildMonthlyData(year: number, facility: string, schedules: Schedule[]) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return MONTHS.map((month, i) => {
    const isFuture = year > currentYear || (year === currentYear && i > currentMonth);

    // Real schedules for this month/year
    const real = schedules.filter(s => {
      if (facility !== "all" && s.facilityId !== facility) return false;
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() === i;
    });

    const bookings = isFuture ? 0 : real.length;
    const revenue = isFuture ? 0 : real.reduce((s, sc) => s + getRevenue(sc), 0);

    return { month, bookings, revenue };
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const todayStr = fmt(today);

const bookingLabel = (s: { title?: string; clientName: string }) =>
  s.title?.trim() || s.clientName;

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    inactive: "bg-gray-100 text-gray-500 border-gray-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
    completed: "bg-gray-100 text-gray-500 border-gray-200",
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border capitalize ${map[status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {status.replace("-", " ")}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    critical: "bg-red-500", high: "bg-orange-400", medium: "bg-amber-400", low: "bg-blue-400",
  };
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${map[priority] ?? "bg-gray-400"}`} />;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatPeso(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  fontSize: 12,
  padding: "8px 12px",
};
const TOOLTIP_LABEL_STYLE = { fontWeight: 600, color: "#111", marginBottom: 2 };

// ─── Component ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const currentYear = today.getFullYear();
  const [analyticsYear, setAnalyticsYear] = useState(currentYear);
  const [analyticsFacility, setAnalyticsFacility] = useState("all");

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fRes, sRes, mRes] = await Promise.all([
        facilityService.getAll(),
        scheduleService.getAll(),
        maintenanceService.getAll()
      ]);
      if (fRes.success && fRes.data) setFacilities(fRes.data);
      if (sRes.success && sRes.data) {
        // Normalize ISO dates to YYYY-MM-DD
        setSchedules(sRes.data.map(s => ({
          ...s,
          date: s.date?.includes("T") ? s.date.split("T")[0] : s.date,
        })));
      }
      if (mRes.success && mRes.data) setMaintenance(mRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const facilityById = Object.fromEntries(facilities.map(f => [f.id, f]));
  const upcomingBookings = schedules.filter(
    s => s.date >= todayStr && s.status !== "cancelled" && s.status !== "completed"
  ).sort((a, b) => a.date.localeCompare(b.date));
  
  const pendingMaintenance = maintenance.filter(m => m.status !== "completed");

  const monthlyData = buildMonthlyData(analyticsYear, analyticsFacility, schedules);
  const totalBookings = monthlyData.reduce((s, d) => s + d.bookings, 0);
  const totalRevenue  = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const peakMonth     = monthlyData.length > 0 ? monthlyData.reduce((a, b) => b.bookings > a.bookings ? b : a, monthlyData[0]) : { month: "-", bookings: 0 };

  const STAT_CARDS = [
    {
      label: "Total Facilities",
      value: facilities.length,
      sub: `${facilities.filter(f => f.status === "active").length} active`,
      Icon: Building2, color: "bg-[#EEF5E8] text-[#2D5016]", to: "/admin/facilities",
    },
    {
      label: "Upcoming Bookings",
      value: upcomingBookings.length,
      sub: `${upcomingBookings.filter(b => b.date === todayStr).length} today`,
      Icon: CalendarDays, color: "bg-blue-50 text-blue-700", to: "/admin/schedules",
    },
    {
      label: "Pending Maintenance",
      value: pendingMaintenance.length,
      sub: `${pendingMaintenance.filter(m => m.priority === "high" || m.priority === "critical").length} high priority`,
      Icon: Wrench, color: "bg-amber-50 text-amber-700", to: "/admin/maintenance",
    },
    {
      label: "Events This Month",
      value: schedules.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      }).length,
      sub: "All facilities combined",
      Icon: TrendingUp, color: "bg-purple-50 text-purple-700", to: "/admin/schedules",
    },
  ];

  return (
    <div className="p-5 lg:p-8 space-y-8">

      {/* Welcome */}
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111]">
          Good {today.getHours() < 12 ? "morning" : today.getHours() < 17 ? "afternoon" : "evening"}, Admin 👋
        </h2>
        <p className="text-[#888] text-[14px] mt-1">Here's what's happening at Felizardo's today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.5 }}>
            <Link to={card.to} className="block bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:shadow-md hover:border-[#D1D5DB] transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <card.Icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-[#111] font-display mb-1">{card.value}</div>
              <div className="text-[13px] font-medium text-[#444]">{card.label}</div>
              <div className="text-[12px] text-[#999] mt-0.5">{card.sub}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Analytics ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }} className="space-y-5">
        {/* Analytics header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-[#111]">Analytics</h3>
            <p className="text-[#999] text-[13px] mt-0.5">Bookings and revenue overview</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Year selector */}
            <div className="relative">
              <select
                value={analyticsYear}
                onChange={e => setAnalyticsYear(Number(e.target.value))}
                className="appearance-none border border-[#E5E7EB] rounded-xl px-3.5 py-2 pr-8 text-[13px] focus:outline-none focus:border-[#2D5016] bg-white font-medium text-[#444]"
              >
                {[currentYear - 1, currentYear].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#aaa] pointer-events-none" />
            </div>
            {/* Facility filter */}
            <div className="relative">
              <select
                value={analyticsFacility}
                onChange={e => setAnalyticsFacility(e.target.value)}
                className="appearance-none border border-[#E5E7EB] rounded-xl px-3.5 py-2 pr-8 text-[13px] focus:outline-none focus:border-[#2D5016] bg-white text-[#444]"
              >
                <option value="all">All Facilities</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#aaa] pointer-events-none" />
            </div>
            <Link
              to="/admin/reports"
              className="flex items-center gap-2 bg-[#1E3A1E] text-white px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors"
            >
              <FileBarChart className="w-4 h-4" />
              Print Reports
            </Link>
          </div>
        </div>

        {/* Analytics summary row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Bookings", value: totalBookings, sub: `${analyticsYear}` },
            { label: "Total Revenue", value: formatPeso(totalRevenue), sub: `${analyticsYear} estimated` },
            { label: "Peak Month", value: peakMonth.month, sub: `${peakMonth.bookings} bookings` },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
              <p className="text-[11px] text-[#aaa] uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="font-bold text-[#111] text-[22px] font-display">{stat.value}</p>
              <p className="text-[12px] text-[#999] mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Monthly Bookings Bar Chart */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="font-semibold text-[15px] text-[#111]">Monthly Bookings</h4>
                <p className="text-[12px] text-[#999] mt-0.5">Total bookings per month · {analyticsYear}</p>
              </div>
              <span className="text-[11px] bg-[#EEF5E8] text-[#2D5016] px-2.5 py-1 rounded-full font-medium">{totalBookings} total</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} barSize={22} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(v: number) => [`${v} booking${v !== 1 ? "s" : ""}`, ""]}
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                  itemStyle={{ color: "#2D5016" }}
                  cursor={{ fill: "#F8F9FA", radius: 6 }}
                />
                <Bar dataKey="bookings" fill="#2D5016" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Area Chart */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="font-semibold text-[15px] text-[#111]">Revenue</h4>
                <p className="text-[12px] text-[#999] mt-0.5">Estimated revenue per month · {analyticsYear}</p>
              </div>
              <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{formatPeso(totalRevenue)}</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A6080" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1A6080" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#aaa" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => v >= 1000 ? `₱${(v / 1000).toFixed(0)}k` : `₱${v}`}
                />
                <Tooltip
                  formatter={(v: number) => [formatPeso(v), ""]}
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                  itemStyle={{ color: "#1A6080" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1A6080" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: "#1A6080" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Breakdown */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-semibold text-[15px] text-[#111]">Bookings by Facility · {analyticsYear}</h4>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {facilities.map(f => {
              const facilityData = buildMonthlyData(analyticsYear, f.id, schedules);
              const count = facilityData.reduce((s, d) => s + d.bookings, 0);
              const rev = facilityData.reduce((s, d) => s + d.revenue, 0);
              const pct = totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0;
              return (
                <div key={f.id} className="p-4 rounded-xl border border-[#F3F4F6] hover:border-[#D1D5DB] transition-colors">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: FACILITY_COLORS[f.id] }}>
                      {f.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <span className="text-[13px] font-medium text-[#111] truncate">{f.name}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#999]">Bookings</span>
                      <span className="font-semibold text-[#111]">{count}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#999]">Revenue</span>
                      <span className="font-semibold text-[#111]">{formatPeso(rev)}</span>
                    </div>
                    <div className="mt-2.5 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: FACILITY_COLORS[f.id] }} />
                    </div>
                    <p className="text-[10px] text-[#bbb] mt-1">{pct}% of total</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Facilities Status */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5 }} className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[15px]">Facilities</h3>
            <Link to="/admin/facilities" className="text-[12px] text-[#2D5016] hover:underline flex items-center gap-1">Manage <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {facilities.map(f => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold" style={{ backgroundColor: FACILITY_COLORS[f.id] }}>
                  {f.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[#111] truncate">{f.name}</div>
                  <div className="text-[12px] text-[#999]">{f.type} · capacity {f.capacity}</div>
                </div>
                <StatusBadge status={f.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Bookings */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.5 }} className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[15px]">Upcoming Bookings</h3>
            <Link to="/admin/schedules" className="text-[12px] text-[#2D5016] hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {upcomingBookings.slice(0, 5).map(s => {
              const facility = facilityById[s.facilityId];
              return (
                <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold mt-0.5" style={{ backgroundColor: FACILITY_COLORS[s.facilityId] }}>
                    {facility?.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-[#111] truncate">{bookingLabel(s)}</div>
                    <div className="text-[12px] text-[#999]">{formatDate(s.date)} · {s.startTime}–{s.endTime}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              );
            })}
            {upcomingBookings.length === 0 && (
              <div className="text-center py-6 text-[#bbb] text-[13px]">No upcoming bookings</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Active Maintenance */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.5 }} className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[15px]">Active Maintenance</h3>
          <Link to="/admin/maintenance" className="text-[12px] text-[#2D5016] hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                <th className="text-left text-[11px] text-[#999] uppercase tracking-wider py-2 pr-4 font-medium">Task</th>
                <th className="text-left text-[11px] text-[#999] uppercase tracking-wider py-2 pr-4 font-medium hidden sm:table-cell">Facility</th>
                <th className="text-left text-[11px] text-[#999] uppercase tracking-wider py-2 pr-4 font-medium hidden md:table-cell">Assigned</th>
                <th className="text-left text-[11px] text-[#999] uppercase tracking-wider py-2 pr-4 font-medium">Priority</th>
                <th className="text-left text-[11px] text-[#999] uppercase tracking-wider py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9FAFB]">
              {pendingMaintenance.map(m => {
                const facility = facilityById[m.facilityId];
                return (
                  <tr key={m.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-[#111]">{m.title}</div>
                      <div className="text-[#999] text-[11px] mt-0.5">{formatDate(m.scheduledDate)}</div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell"><span className="text-[#555]">{facility?.name}</span></td>
                    <td className="py-3 pr-4 hidden md:table-cell"><span className="text-[#777] truncate block max-w-[160px]">{m.assignee}</span></td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1.5">
                        <PriorityDot priority={m.priority} />
                        <span className="capitalize text-[#555]">{m.priority}</span>
                      </span>
                    </td>
                    <td className="py-3"><StatusBadge status={m.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pendingMaintenance.length === 0 && (
            <div className="text-center py-8 text-[#bbb] text-[13px]">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-300" />
              All maintenance tasks completed!
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
