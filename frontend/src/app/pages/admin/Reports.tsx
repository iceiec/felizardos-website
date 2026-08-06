import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Printer, ChevronDown, CalendarDays, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import {
  FACILITY_COLORS, type Schedule, type Facility, type MaintenanceItem
} from "../../utils/adminData";
import { facilityService } from "../../services/facilityService";
import { scheduleService } from "../../services/scheduleService";
import { maintenanceService } from "../../services/maintenanceService";

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PACKAGE_REVENUE: Record<string, number> = {
  Premium: 38000, "Full Day": 25000, "Half Day": 15000,
  Tide: 22000, Wave: 15000, Splash: 8000,
};
const COURT_FLAT = 3500;
const getRevenue = (s: Schedule) => s.packageName ? (PACKAGE_REVENUE[s.packageName] ?? 0) : COURT_FLAT;
const COURT_IDS = ["andoy", "juliet"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = new Date();
const pad2 = (n: number) => String(n).padStart(2, "0");
const fmtDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const bookingLabel = (s: Schedule) => s.title?.trim() || s.clientName;
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDateDisplay(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}
const formatPeso = (n: number) => "₱" + n.toLocaleString("en-PH");

type Period = "daily" | "monthly" | "yearly";

// ─── Print CSS injected at mount ─────────────────────────────────────────────
const PRINT_STYLE = `
@media print {
  body > * { display: none !important; }
  #felizardos-report-root { display: block !important; position: fixed; inset: 0; z-index: 99999; background: white; overflow: auto; }
  #felizardos-report-root .no-print { display: none !important; }
  @page { size: A4 portrait; margin: 15mm 18mm; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function Reports() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [facility, setFacility] = useState("all");
  const [selectedDate, setSelectedDate] = useState(fmtDate(today));
  const [selectedMonth, setSelectedMonth] = useState(`${today.getFullYear()}-${pad2(today.getMonth() + 1)}`);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const reportRef = useRef<HTMLDivElement>(null);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [schedulesData, setSchedulesData] = useState<Schedule[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceItem[]>([]);

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
        setSchedulesData(sRes.data.map(s => ({
          ...s,
          date: s.date?.includes("T") ? s.date.split("T")[0] : s.date,
        })));
      }
      if (mRes.success && mRes.data) setMaintenanceData(mRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const ALL_SCHEDULES = [...schedulesData];
  const facilityById = Object.fromEntries(facilities.map(f => [f.id, f]));

  const schedules = ALL_SCHEDULES.filter(s => {
    if (facility !== "all" && s.facilityId !== facility) return false;
    if (period === "daily") return s.date === selectedDate;
    if (period === "monthly") return s.date.startsWith(selectedMonth);
    return s.date.startsWith(String(selectedYear));
  });

  const revenue = schedules.reduce((s, sc) => s + getRevenue(sc), 0);
  const confirmed = schedules.filter(s => s.status === "confirmed").length;
  const _completed = schedules.filter(s => s.status === "completed").length;
  const pending = schedules.filter(s => s.status === "pending").length;

  // For yearly: build per-month summary
  const monthlySummary = MONTHS_SHORT.map((m, i) => {
    const ms = schedules.filter(s => new Date(s.date).getMonth() === i);
    return { month: m, bookings: ms.length, revenue: ms.reduce((a, b) => a + getRevenue(b), 0) };
  });

  // Maintenance for the report period
  const maintenance = maintenanceData.filter(m => {
    if (facility !== "all" && m.facilityId !== facility) return false;
    if (period === "daily") return m.scheduledDate === selectedDate;
    if (period === "monthly") return m.scheduledDate.startsWith(selectedMonth);
    return m.scheduledDate.startsWith(String(selectedYear));
  });

  // Report title
  const reportTitle = () => {
    if (period === "daily") return `Daily Report — ${formatDateDisplay(selectedDate)}`;
    if (period === "monthly") {
      const [y, m] = selectedMonth.split("-");
      return `Monthly Report — ${MONTHS[parseInt(m) - 1]} ${y}`;
    }
    return `Annual Report — ${selectedYear}`;
  };

  const facilityLabel = facility === "all" ? "All Facilities" : (facilityById[facility]?.name ?? facility);

  const handlePrint = () => window.print();

  const PERIOD_TABS: { id: Period; label: string }[] = [
    { id: "daily",   label: "Daily" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly",  label: "Yearly" },
  ];

  const STATUS_PILL: Record<string, string> = {
    confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending:   "bg-amber-50  text-amber-700  border border-amber-200",
    cancelled: "bg-red-50    text-red-600    border border-red-200",
    completed: "bg-gray-100  text-gray-500   border border-gray-200",
  };

  const PRIORITY_COLOR: Record<string, string> = {
    critical: "text-red-600", high: "text-orange-500", medium: "text-amber-500", low: "text-blue-500",
  };

  return (
    <>
      {/* Inject print CSS */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLE }} />

      <div id="felizardos-report-root" className="p-5 lg:p-8 space-y-6">

        {/* Page header — hidden when printing */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#111]">Reports</h2>
            <p className="text-[#888] text-[13px] mt-1">Generate and print PDF reports for any period</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#1E3A1E] text-white px-5 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>

        {/* Filters — hidden when printing */}
        <div className="no-print bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] text-[#aaa] uppercase tracking-wide mb-3">Report Settings</p>
          <div className="flex flex-wrap gap-4 items-end">

            {/* Period tabs */}
            <div>
              <label className="text-[11px] text-[#888] mb-1.5 block">Period</label>
              <div className="flex gap-1 p-1 bg-[#F4F5F7] rounded-xl">
                {PERIOD_TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setPeriod(t.id)}
                    className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                      period === t.id ? "bg-white text-[#111] shadow-sm" : "text-[#888] hover:text-[#444]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date selectors */}
            {period === "daily" && (
              <div>
                <label className="text-[11px] text-[#888] mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#2D5016]"
                />
              </div>
            )}
            {period === "monthly" && (
              <div>
                <label className="text-[11px] text-[#888] mb-1.5 block">Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#2D5016]"
                />
              </div>
            )}
            {period === "yearly" && (
              <div>
                <label className="text-[11px] text-[#888] mb-1.5 block">Year</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    className="appearance-none border border-[#E5E7EB] rounded-xl px-3.5 py-2 pr-8 text-[13px] focus:outline-none focus:border-[#2D5016] bg-white"
                  >
                    {[today.getFullYear() - 1, today.getFullYear()].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#aaa] pointer-events-none" />
                </div>
              </div>
            )}

            {/* Facility filter */}
            <div>
              <label className="text-[11px] text-[#888] mb-1.5 block">Facility</label>
              <div className="relative">
                <select
                  value={facility}
                  onChange={e => setFacility(e.target.value)}
                  className="appearance-none border border-[#E5E7EB] rounded-xl px-3.5 py-2 pr-8 text-[13px] focus:outline-none focus:border-[#2D5016] bg-white"
                >
                  <option value="all">All Facilities</option>
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#aaa] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PRINTABLE REPORT                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          ref={reportRef}
          key={`${period}-${selectedDate}-${selectedMonth}-${selectedYear}-${facility}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
        >

          {/* Report letterhead */}
          <div className="bg-[#0E1E0E] px-8 py-6 flex items-start justify-between">
            <div>
              <p className="text-[#A8C88A] text-[10px] tracking-[0.4em] uppercase mb-1">Felizardo's Event Place</p>
              <h1 className="font-display text-[22px] font-bold text-white leading-tight">{reportTitle()}</h1>
              <p className="text-white/50 text-[12px] mt-1">{facilityLabel} · Generated {new Date().toLocaleDateString("en-PH", { dateStyle: "long" })}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-white/30 text-[10px] uppercase tracking-widest">Batangas, Philippines</p>
              <p className="text-white/30 text-[10px] mt-0.5">events@felizardos.com</p>
            </div>
          </div>

          <div className="p-8 space-y-8">

            {/* Summary KPI cards */}
            <div>
              <h2 className="text-[11px] text-[#aaa] uppercase tracking-wide mb-4">Summary</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Bookings",  value: schedules.length, Icon: CalendarDays, color: "bg-[#EEF5E8] text-[#2D5016]" },
                  { label: "Est. Revenue",    value: formatPeso(revenue), Icon: TrendingUp, color: "bg-blue-50 text-blue-700" },
                  { label: "Confirmed",       value: confirmed, Icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700" },
                  { label: "Pending",         value: pending, Icon: Users, color: "bg-amber-50 text-amber-700" },
                ].map(kpi => (
                  <div key={kpi.label} className="border border-[#F3F4F6] rounded-xl p-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${kpi.color}`}>
                      <kpi.Icon className="w-4 h-4" />
                    </div>
                    <p className="font-bold text-[20px] text-[#111] font-display">{kpi.value}</p>
                    <p className="text-[12px] text-[#888] mt-0.5">{kpi.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Facility breakdown (only for "All Facilities") */}
            {facility === "all" && (
              <div>
                <h2 className="text-[11px] text-[#aaa] uppercase tracking-wide mb-4">Breakdown by Facility</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {facilities.map(f => {
                    const fs = schedules.filter(s => s.facilityId === f.id);
                    const fr = fs.reduce((a, b) => a + getRevenue(b), 0);
                    return (
                      <div key={f.id} className="border border-[#F3F4F6] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: FACILITY_COLORS[f.id] }}>
                            {f.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-[12px] font-medium text-[#111] truncate">{f.name}</span>
                        </div>
                        <p className="text-[18px] font-bold text-[#111] font-display">{fs.length}</p>
                        <p className="text-[11px] text-[#888]">bookings · {formatPeso(fr)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Yearly monthly breakdown table */}
            {period === "yearly" && (
              <div>
                <h2 className="text-[11px] text-[#aaa] uppercase tracking-wide mb-4">Monthly Breakdown · {selectedYear}</h2>
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-[#F3F4F6]">
                      <th className="text-left py-2 pr-4 text-[11px] text-[#999] uppercase tracking-wider font-medium">Month</th>
                      <th className="text-right py-2 pr-4 text-[11px] text-[#999] uppercase tracking-wider font-medium">Bookings</th>
                      <th className="text-right py-2 text-[11px] text-[#999] uppercase tracking-wider font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySummary.map(row => (
                      <tr key={row.month} className="border-b border-[#F9FAFB]">
                        <td className="py-2.5 pr-4 font-medium text-[#333]">{row.month}</td>
                        <td className="py-2.5 pr-4 text-right text-[#555]">{row.bookings || <span className="text-[#ccc]">—</span>}</td>
                        <td className="py-2.5 text-right text-[#555]">{row.revenue > 0 ? formatPeso(row.revenue) : <span className="text-[#ccc]">—</span>}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-[#E5E7EB] font-bold">
                      <td className="py-3 pr-4 text-[#111]">Total</td>
                      <td className="py-3 pr-4 text-right text-[#111]">{schedules.length}</td>
                      <td className="py-3 text-right text-[#111]">{formatPeso(revenue)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Bookings table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[11px] text-[#aaa] uppercase tracking-wide">Bookings ({schedules.length})</h2>
              </div>
              {schedules.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-[#E5E7EB] rounded-xl text-[#bbb] text-[13px]">
                  <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No bookings found for this period.
                </div>
              ) : (
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-[#F3F4F6]">
                      {["Booking", "Facility", "Date", "Time", ...(facility === "all" ? [] : []), "Revenue", "Status"].map(h => (
                        <th key={h} className="text-left py-2 pr-4 text-[11px] text-[#999] uppercase tracking-wider font-medium last:pr-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedules
                      .slice()
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map(s => {
                        const fac = facilityById[s.facilityId];
                        return (
                          <tr key={s.id} className="border-b border-[#F9FAFB]">
                            <td className="py-2.5 pr-4">
                              <div className="font-medium text-[#111]">{bookingLabel(s)}</div>
                              <div className="text-[11px] text-[#999]">{s.clientName}</div>
                            </td>
                            <td className="py-2.5 pr-4">
                              <span className="flex items-center gap-1.5 text-[#555]">
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: FACILITY_COLORS[s.facilityId] }} />
                                {fac?.name}
                              </span>
                            </td>
                            <td className="py-2.5 pr-4 text-[#555] whitespace-nowrap">{formatDateDisplay(s.date)}</td>
                            <td className="py-2.5 pr-4 text-[#555] whitespace-nowrap">{s.startTime}–{s.endTime}</td>
                            <td className="py-2.5 pr-4 text-[#555]">
                              {!COURT_IDS.includes(s.facilityId) && s.packageName
                                ? <span>{formatPeso(getRevenue(s))}<span className="text-[#ccc] text-[10px] ml-1">({s.packageName})</span></span>
                                : formatPeso(getRevenue(s))}
                            </td>
                            <td className="py-2.5">
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[s.status] ?? "bg-gray-100 text-gray-500"}`}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#E5E7EB]">
                      <td colSpan={4} className="py-3 pr-4 text-[13px] font-bold text-[#111]">Total Revenue</td>
                      <td className="py-3 pr-4 text-[13px] font-bold text-[#111]">{formatPeso(revenue)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {/* Maintenance section */}
            {maintenance.length > 0 && (
              <div>
                <h2 className="text-[11px] text-[#aaa] uppercase tracking-wide mb-4">Maintenance Tasks ({maintenance.length})</h2>
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-[#F3F4F6]">
                      {["Task", "Facility", "Scheduled", "Priority", "Status"].map(h => (
                        <th key={h} className="text-left py-2 pr-4 text-[11px] text-[#999] uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map(m => (
                      <tr key={m.id} className="border-b border-[#F9FAFB]">
                        <td className="py-2.5 pr-4">
                          <div className="font-medium text-[#111]">{m.title}</div>
                          <div className="text-[11px] text-[#999] max-w-[220px] truncate">{m.description}</div>
                        </td>
                        <td className="py-2.5 pr-4 text-[#555]">{facilityById[m.facilityId]?.name}</td>
                        <td className="py-2.5 pr-4 text-[#555] whitespace-nowrap">{formatDateDisplay(m.scheduledDate)}</td>
                        <td className="py-2.5 pr-4">
                          <span className={`capitalize font-medium ${PRIORITY_COLOR[m.priority] ?? "text-gray-500"}`}>{m.priority}</span>
                        </td>
                        <td className="py-2.5">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[m.status] ?? "bg-gray-100 text-gray-500"}`}>
                            {m.status.replace("-", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Report footer */}
            <div className="pt-6 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#bbb]">
              <span>Felizardo's Event Place · Batangas, Philippines</span>
              <span>Printed {new Date().toLocaleString("en-PH")}</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom print button */}
        <div className="no-print flex justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#1E3A1E] text-white px-6 py-3 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>

      </div>
    </>
  );
}
