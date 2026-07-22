import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ChevronRight, Plus, X, Check,
  Clock, Users, Phone, FileText, Calendar,
} from "lucide-react";
import {
  INITIAL_SCHEDULES, INITIAL_FACILITIES, FACILITY_COLORS,
  type Schedule, type BookingStatus,
} from "../../utils/adminData";

// Basketball courts don't use event title, guests, package, or notes
const COURT_IDS = ["andoy", "juliet"];
const isCourt = (facilityId: string) => COURT_IDS.includes(facilityId);

const FACILITY_MAP = Object.fromEntries(INITIAL_FACILITIES.map(f => [f.id, f]));

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  completed: "bg-gray-100 text-gray-500 border-gray-200",
};

const fmt = (d: Date) => d.toISOString().split("T")[0];
const today = new Date();
const formatPeso = (n: number) => "₱" + n.toLocaleString("en-PH");

function formatDateFull(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

const EMPTY_SCHEDULE: Omit<Schedule, "id"> = {
  facilityId: "pavilion",
  title: "",
  clientName: "",
  date: fmt(today),
  startTime: "09:00",
  endTime: "17:00",
  status: "pending",
  guests: undefined,
  packageName: "",
  phone: "",
  notes: "",
};

// Display label: event title for venues, client name for courts
const bookingLabel = (s: Schedule) => s.title?.trim() || s.clientName;

export default function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [calendarDate, setCalendarDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(fmt(today));
  const [filterFacility, setFilterFacility] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState<Schedule | null>(null);
  const [newSchedule, setNewSchedule] = useState({ ...EMPTY_SCHEDULE });
  const [saved, setSaved] = useState(false);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const filteredSchedules = schedules.filter(s =>
    filterFacility === "all" || s.facilityId === filterFacility
  );

  const getSchedulesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredSchedules.filter(s => s.date === dateStr);
  };

  const selectedSchedules = selectedDate
    ? filteredSchedules.filter(s => s.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime))
    : [];

  const handleFacilityChange = (facilityId: string) => {
    setNewSchedule(s => ({
      ...s,
      facilityId,
      // clear event-only fields when switching to a court
      ...(isCourt(facilityId) ? { title: "", guests: undefined, packageName: "", notes: "" } : {}),
    }));
  };

  const addSchedule = () => {
    const id = Math.max(0, ...schedules.map(s => s.id)) + 1;
    setSchedules(s => [...s, { ...newSchedule, id }]);
    setNewSchedule({ ...EMPTY_SCHEDULE });
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isAddDisabled = isCourt(newSchedule.facilityId)
    ? !newSchedule.clientName.trim()
    : !newSchedule.title?.trim();

  const updateStatus = (id: number, status: BookingStatus) => {
    setSchedules(s => s.map(x => x.id === id ? { ...x, status } : x));
    if (detailModal?.id === id) setDetailModal(d => d ? { ...d, status } : d);
  };

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#111]">Schedules</h2>
          <p className="text-[#888] text-[13px] mt-1">
            {schedules.filter(s => s.date >= fmt(today) && s.status !== "cancelled" && s.status !== "completed").length} upcoming bookings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterFacility}
            onChange={e => setFilterFacility(e.target.value)}
            className="border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#2D5016] bg-white"
          >
            <option value="all">All Facilities</option>
            {INITIAL_FACILITIES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1E3A1E] text-white px-4 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Booking
          </button>
        </div>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-4 py-3 rounded-xl"
        >
          <Check className="w-4 h-4" />
          Booking added successfully!
        </motion.div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[15px]">{MONTH_NAMES[month]} {year}</h3>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-[#F4F5F7] flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-[#666]" />
              </button>
              <button onClick={() => setCalendarDate(new Date(today.getFullYear(), today.getMonth(), 1))} className="text-[12px] text-[#2D5016] hover:underline px-2">
                Today
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-[#F4F5F7] flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-[#666]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="text-center text-[11px] text-[#aaa] uppercase tracking-wide py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const daySchedules = getSchedulesForDay(day);
              const isToday = dateStr === fmt(today);
              const isSelected = dateStr === selectedDate;
              const isPast = dateStr < fmt(today);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`relative aspect-square rounded-lg p-1 flex flex-col items-center transition-all ${
                    isSelected
                      ? "bg-[#1E3A1E] text-white"
                      : isToday
                      ? "bg-[#EEF5E8] text-[#2D5016] font-bold"
                      : isPast
                      ? "text-[#ccc] hover:bg-[#F4F5F7]"
                      : "text-[#444] hover:bg-[#F4F5F7]"
                  }`}
                >
                  <span className="text-[12px] leading-none">{day}</span>
                  {daySchedules.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {daySchedules.slice(0, 3).map(s => (
                        <span
                          key={s.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: isSelected ? "white" : FACILITY_COLORS[s.facilityId] }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-[#F3F4F6]">
            {INITIAL_FACILITIES.map(f => (
              <div key={f.id} className="flex items-center gap-1.5 text-[11px] text-[#888]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: FACILITY_COLORS[f.id] }} />
                {f.name}
              </div>
            ))}
          </div>
        </div>

        {/* Selected day panel */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <h3 className="font-semibold text-[15px] mb-1">
            {selectedDate
              ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })
              : "Select a date"}
          </h3>
          <p className="text-[#999] text-[12px] mb-4">{selectedSchedules.length} booking{selectedSchedules.length !== 1 ? "s" : ""}</p>

          <div className="relative space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {selectedSchedules.length === 0 && (
              <div className="text-center py-10 text-[#ccc]">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-[13px]">No bookings</p>
              </div>
            )}
            {selectedSchedules.map(s => (
              <button
                key={s.id}
                onClick={() => setDetailModal(s)}
                className="w-full text-left p-3.5 rounded-xl border border-[#F3F4F6] hover:border-[#D1D5DB] hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-full min-h-[40px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: FACILITY_COLORS[s.facilityId] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-[13px] text-[#111] truncate">{bookingLabel(s)}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 capitalize ${STATUS_STYLES[s.status]}`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[#888] text-[12px]">{s.startTime} – {s.endTime}</p>
                    <p className="text-[#bbb] text-[11px] mt-0.5">
                      {FACILITY_MAP[s.facilityId]?.name}
                      {s.guests != null ? ` · ${s.guests} guests` : ""}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 lg:p-6">
        <h3 className="font-semibold text-[15px] mb-5">All Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                {["Booking", "Facility", "Date", "Time", "Guests", "Status", ""].map(h => (
                  <th key={h} className="text-left text-[11px] text-[#999] uppercase tracking-wider pb-2 pr-4 font-medium last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9FAFB]">
              {filteredSchedules.sort((a, b) => b.date.localeCompare(a.date)).map(s => (
                <tr key={s.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-[#111]">{bookingLabel(s)}</div>
                    <div className="text-[#999] text-[11px]">{s.clientName}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: FACILITY_COLORS[s.facilityId] }} />
                      {FACILITY_MAP[s.facilityId]?.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[#555]">{formatDateFull(s.date)}</td>
                  <td className="py-3 pr-4 text-[#555]">{s.startTime}–{s.endTime}</td>
                  <td className="py-3 pr-4 text-[#555]">
                    {s.guests != null ? s.guests : <span className="text-[#ccc]">—</span>}
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={s.status}
                      onChange={e => updateStatus(s.id, e.target.value as BookingStatus)}
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border capitalize cursor-pointer focus:outline-none ${STATUS_STYLES[s.status]} bg-transparent`}
                    >
                      {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <button onClick={() => setDetailModal(s)} className="text-[#2D5016] text-[12px] hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal title="Add New Booking" onClose={() => setShowModal(false)}>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Facility *</label>
                <select
                  value={newSchedule.facilityId}
                  onChange={e => handleFacilityChange(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] bg-white"
                >
                  {INITIAL_FACILITIES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                {isCourt(newSchedule.facilityId) && (
                  <p className="text-[11px] text-[#7C3AED] mt-1.5">Basketball court — simplified booking (no event title, guests, or package needed)</p>
                )}

                {/* Rental pricing summary */}
                {FACILITY_MAP[newSchedule.facilityId]?.rentalPrice > 0 && (() => {
                  const rental = FACILITY_MAP[newSchedule.facilityId]!.rentalPrice;
                  const deposit = rental / 2;
                  return (
                    <div className="mt-3 rounded-xl overflow-hidden border border-[#E5E7EB]">
                      <div className="bg-[#F8F9FA] px-4 py-2 border-b border-[#E5E7EB]">
                        <p className="text-[11px] text-[#888] uppercase tracking-wide font-medium">Rental Pricing</p>
                      </div>
                      <div className="divide-y divide-[#F3F4F6]">
                        <div className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-[13px] text-[#555]">Full Rental</span>
                          <span className="text-[13px] font-semibold text-[#111]">{formatPeso(rental)}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50/60">
                          <span className="text-[13px] text-amber-700 font-medium">Deposit Required (50%)</span>
                          <span className="text-[13px] font-bold text-amber-700">{formatPeso(deposit)}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-[13px] text-[#888]">Balance on Day of Event</span>
                          <span className="text-[13px] text-[#888]">{formatPeso(deposit)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Event title — venues only */}
              {!isCourt(newSchedule.facilityId) && (
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Event Title *</label>
                  <input
                    value={newSchedule.title || ""}
                    onChange={e => setNewSchedule(s => ({ ...s, title: e.target.value }))}
                    placeholder="e.g. Garcia Wedding Reception"
                    className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">
                    Client Name {isCourt(newSchedule.facilityId) ? "*" : ""}
                  </label>
                  <input
                    value={newSchedule.clientName}
                    onChange={e => setNewSchedule(s => ({ ...s, clientName: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Phone</label>
                  <input
                    value={newSchedule.phone}
                    onChange={e => setNewSchedule(s => ({ ...s, phone: e.target.value }))}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Date *</label>
                  <input
                    type="date"
                    value={newSchedule.date}
                    onChange={e => setNewSchedule(s => ({ ...s, date: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Start</label>
                  <input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={e => setNewSchedule(s => ({ ...s, startTime: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">End</label>
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={e => setNewSchedule(s => ({ ...s, endTime: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all"
                  />
                </div>
              </div>

              {/* Guests + Package — venues only */}
              {!isCourt(newSchedule.facilityId) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Guests</label>
                    <input
                      type="number"
                      value={newSchedule.guests ?? ""}
                      onChange={e => setNewSchedule(s => ({ ...s, guests: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Package</label>
                    <input
                      value={newSchedule.packageName || ""}
                      onChange={e => setNewSchedule(s => ({ ...s, packageName: e.target.value }))}
                      placeholder="e.g. Full Day"
                      className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Status</label>
                <select
                  value={newSchedule.status}
                  onChange={e => setNewSchedule(s => ({ ...s, status: e.target.value as BookingStatus }))}
                  className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>

              {/* Notes — venues only */}
              {!isCourt(newSchedule.facilityId) && (
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Notes</label>
                  <textarea
                    rows={2}
                    value={newSchedule.notes || ""}
                    onChange={e => setNewSchedule(s => ({ ...s, notes: e.target.value }))}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all resize-none"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addSchedule}
                disabled={isAddDisabled}
                className="flex-1 bg-[#1E3A1E] text-white py-3 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors disabled:opacity-50"
              >
                Add Booking
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-[#E5E7EB] text-[#666] py-3 rounded-xl text-[13px] font-medium hover:bg-[#F4F5F7] transition-colors">
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailModal && (
          <Modal title="Booking Details" onClose={() => setDetailModal(null)}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: `${FACILITY_COLORS[detailModal.facilityId]}15` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-bold" style={{ backgroundColor: FACILITY_COLORS[detailModal.facilityId] }}>
                  {FACILITY_MAP[detailModal.facilityId]?.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-[#111]">{bookingLabel(detailModal)}</p>
                  <p className="text-[13px] text-[#888]">{FACILITY_MAP[detailModal.facilityId]?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <Detail icon={<Calendar className="w-3.5 h-3.5" />} label="Date" value={formatDateFull(detailModal.date)} />
                <Detail icon={<Clock className="w-3.5 h-3.5" />} label="Time" value={`${detailModal.startTime} – ${detailModal.endTime}`} />
                {/* Guests + Package — venues only */}
                {!isCourt(detailModal.facilityId) && detailModal.guests != null && (
                  <Detail icon={<Users className="w-3.5 h-3.5" />} label="Guests" value={String(detailModal.guests)} />
                )}
                {!isCourt(detailModal.facilityId) && (
                  <Detail icon={<FileText className="w-3.5 h-3.5" />} label="Package" value={detailModal.packageName || "—"} />
                )}
                <Detail icon={<Users className="w-3.5 h-3.5" />} label="Client" value={detailModal.clientName} />
                <Detail icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={detailModal.phone || "—"} />
              </div>

              {/* Notes — venues only */}
              {!isCourt(detailModal.facilityId) && detailModal.notes && (
                <div className="bg-[#F8F9FA] rounded-xl p-3.5">
                  <p className="text-[11px] text-[#999] uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-[13px] text-[#555] leading-relaxed">{detailModal.notes}</p>
                </div>
              )}

              <div>
                <p className="text-[11px] text-[#999] uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => updateStatus(detailModal.id, st)}
                      className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full border capitalize transition-all ${
                        detailModal.status === st ? STATUS_STYLES[st] + " ring-1 ring-current" : "border-[#E5E7EB] text-[#888] hover:bg-[#F4F5F7]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-[#aaa] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-[#333] font-medium flex items-center gap-1.5">{icon}{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 8 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
          <h3 className="font-semibold text-[16px]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F4F5F7] flex items-center justify-center text-[#888] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}
