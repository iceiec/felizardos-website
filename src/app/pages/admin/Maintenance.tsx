import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, X, Check, Filter, AlertTriangle,
  CheckCircle2, Clock, Wrench,
} from "lucide-react";
import {
  INITIAL_MAINTENANCE, INITIAL_FACILITIES, FACILITY_COLORS,
  type MaintenanceItem, type MaintenancePriority, type MaintenanceStatus,
} from "../../utils/adminData";

const FACILITY_MAP = Object.fromEntries(INITIAL_FACILITIES.map(f => [f.id, f]));

const PRIORITY_STYLES: Record<MaintenancePriority, { badge: string; dot: string; label: string }> = {
  critical: { badge: "bg-red-50 text-red-700 border-red-200",    dot: "bg-red-500",    label: "Critical" },
  high:     { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400", label: "High" },
  medium:   { badge: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400",  label: "Medium" },
  low:      { badge: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-400",   label: "Low" },
};

const STATUS_STYLES: Record<MaintenanceStatus, { badge: string; icon: React.ReactNode }> = {
  scheduled:   { badge: "bg-blue-50 text-blue-700 border-blue-200",   icon: <Clock className="w-3 h-3" /> },
  "in-progress": { badge: "bg-amber-50 text-amber-700 border-amber-200", icon: <Wrench className="w-3 h-3" /> },
  completed:   { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
};

const fmt = (d: Date) => d.toISOString().split("T")[0];
const today = new Date();

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

const EMPTY_ITEM: Omit<MaintenanceItem, "id"> = {
  facilityId: "pavilion",
  title: "",
  description: "",
  priority: "medium",
  status: "scheduled",
  scheduledDate: fmt(today),
  assignee: "",
};

export default function Maintenance() {
  const [items, setItems] = useState<MaintenanceItem[]>(INITIAL_MAINTENANCE);
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | "all">("all");
  const [filterFacility, setFilterFacility] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState<MaintenanceItem | null>(null);
  const [newItem, setNewItem] = useState({ ...EMPTY_ITEM });
  const [savedId, setSavedId] = useState<number | null>(null);

  const flash = (id: number) => { setSavedId(id); setTimeout(() => setSavedId(null), 2000); };

  const filtered = items.filter(m =>
    (filterStatus === "all" || m.status === filterStatus) &&
    (filterFacility === "all" || m.facilityId === filterFacility)
  );

  const addItem = () => {
    const id = Math.max(0, ...items.map(i => i.id)) + 1;
    setItems(prev => [...prev, { ...newItem, id }]);
    setNewItem({ ...EMPTY_ITEM });
    setShowModal(false);
    flash(id);
  };

  const updateStatus = (id: number, status: MaintenanceStatus) => {
    setItems(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (editModal?.id === id) setEditModal(e => e ? { ...e, status } : e);
    flash(id);
  };

  const saveEdit = () => {
    if (!editModal) return;
    setItems(prev => prev.map(m => m.id === editModal.id ? editModal : m));
    flash(editModal.id);
    setEditModal(null);
  };

  const counts = {
    all: items.length,
    scheduled: items.filter(m => m.status === "scheduled").length,
    "in-progress": items.filter(m => m.status === "in-progress").length,
    completed: items.filter(m => m.status === "completed").length,
  };

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#111]">Maintenance</h2>
          <p className="text-[#888] text-[13px] mt-1">
            {items.filter(m => m.status !== "completed").length} active tasks · {items.filter(m => m.status === "completed").length} completed
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1E3A1E] text-white px-4 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([["all", "All Tasks", "#6B7280"], ["scheduled", "Scheduled", "#3B82F6"], ["in-progress", "In Progress", "#F59E0B"], ["completed", "Completed", "#10B981"]] as const).map(([key, label, color]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 ${
              filterStatus === key
                ? "border-current shadow-sm"
                : "bg-white border-[#E5E7EB] hover:border-[#D1D5DB]"
            }`}
            style={filterStatus === key ? { borderColor: color, backgroundColor: color + "10", color } : {}}
          >
            <div className="text-2xl font-bold font-display" style={filterStatus === key ? { color } : { color: "#111" }}>
              {counts[key]}
            </div>
            <div className="text-[12px] mt-0.5" style={filterStatus === key ? { color } : { color: "#888" }}>{label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-[#aaa]" />
        <select
          value={filterFacility}
          onChange={e => setFilterFacility(e.target.value)}
          className="border border-[#E5E7EB] rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#2D5016] bg-white"
        >
          <option value="all">All Facilities</option>
          {INITIAL_FACILITIES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-300" />
            <p className="text-[#bbb] text-[14px]">No maintenance tasks match your filters.</p>
          </div>
        )}

        <AnimatePresence>
          {filtered.map((m, i) => {
            const pStyle = PRIORITY_STYLES[m.priority];
            const sStyle = STATUS_STYLES[m.status];
            const facility = FACILITY_MAP[m.facilityId];
            const isOverdue = m.status !== "completed" && m.scheduledDate < fmt(today);

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  savedId === m.id ? "border-emerald-300 shadow-md shadow-emerald-500/8" : "border-[#E5E7EB]"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Priority indicator */}
                    <div className={`w-1 rounded-full h-full min-h-[60px] flex-shrink-0 ${pStyle.dot}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-[15px] text-[#111]">{m.title}</h4>
                            {isOverdue && (
                              <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">
                                <AlertTriangle className="w-2.5 h-2.5" /> Overdue
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className="text-[11px] font-medium px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: FACILITY_COLORS[m.facilityId] ?? "#999" }}
                            >
                              {facility?.name}
                            </span>
                            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${pStyle.badge}`}>
                              {pStyle.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${sStyle.badge}`}>
                              {sStyle.icon}
                              {m.status.replace("-", " ")}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setEditModal({ ...m })}
                          className="text-[12px] text-[#2D5016] hover:underline flex-shrink-0"
                        >
                          Edit
                        </button>
                      </div>

                      {m.description && (
                        <p className="text-[#666] text-[13px] leading-relaxed mb-3">{m.description}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-[12px] text-[#888]">
                        <span>📅 {formatDate(m.scheduledDate)}</span>
                        <span>👤 {m.assignee}</span>
                      </div>

                      {/* Quick status actions */}
                      {m.status !== "completed" && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
                          {m.status === "scheduled" && (
                            <button
                              onClick={() => updateStatus(m.id, "in-progress")}
                              className="flex items-center gap-1.5 text-[12px] bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                            >
                              <Wrench className="w-3 h-3" /> Start Work
                            </button>
                          )}
                          {m.status === "in-progress" && (
                            <button
                              onClick={() => updateStatus(m.id, "completed")}
                              className="flex items-center gap-1.5 text-[12px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              <Check className="w-3 h-3" /> Mark Complete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {savedId === m.id && (
                  <div className="bg-emerald-50 border-t border-emerald-100 px-5 py-2 flex items-center gap-2 text-emerald-700 text-[12px]">
                    <Check className="w-3.5 h-3.5" /> Updated
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal title="Add Maintenance Task" onClose={() => setShowModal(false)}>
            <MaintenanceForm data={newItem as MaintenanceItem} onChange={setNewItem as any} />
            <div className="flex gap-3 mt-6">
              <button onClick={addItem} disabled={!newItem.title.trim()} className="flex-1 bg-[#1E3A1E] text-white py-3 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors disabled:opacity-50">
                Add Task
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-[#E5E7EB] text-[#666] py-3 rounded-xl text-[13px] font-medium hover:bg-[#F4F5F7] transition-colors">
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <Modal title="Edit Task" onClose={() => setEditModal(null)}>
            <MaintenanceForm data={editModal} onChange={setEditModal as any} />
            <div className="flex gap-3 mt-6">
              <button onClick={saveEdit} className="flex-1 bg-[#1E3A1E] text-white py-3 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors">
                Save Changes
              </button>
              <button onClick={() => setEditModal(null)} className="flex-1 border border-[#E5E7EB] text-[#666] py-3 rounded-xl text-[13px] font-medium hover:bg-[#F4F5F7] transition-colors">
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function MaintenanceForm({ data, onChange }: { data: MaintenanceItem; onChange: (d: MaintenanceItem) => void }) {
  const f = (key: keyof MaintenanceItem, val: string) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Facility *</label>
        <select value={data.facilityId} onChange={e => f("facilityId", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] bg-white">
          {INITIAL_FACILITIES.map(fac => <option key={fac.id} value={fac.id}>{fac.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Task Title *</label>
        <input value={data.title} onChange={e => f("title", e.target.value)} placeholder="e.g. Pool Filter Cleaning" className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all" />
      </div>
      <div>
        <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Description</label>
        <textarea rows={2} value={data.description} onChange={e => f("description", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Priority</label>
          <select value={data.priority} onChange={e => f("priority", e.target.value as MaintenancePriority)} className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] bg-white">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Status</label>
          <select value={data.status} onChange={e => f("status", e.target.value as MaintenanceStatus)} className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] bg-white">
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Scheduled Date</label>
          <input type="date" value={data.scheduledDate} onChange={e => f("scheduledDate", e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all" />
        </div>
        <div>
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Assigned To</label>
          <input value={data.assignee} onChange={e => f("assignee", e.target.value)} placeholder="e.g. Maintenance Team A" className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] transition-all" />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
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
