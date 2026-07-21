import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Check, Edit2, Eye, EyeOff, Users, ToggleLeft, ToggleRight, PhilippinePeso } from "lucide-react";
import { INITIAL_FACILITIES, FACILITY_COLORS, type Facility, type FacilityStatus } from "../../utils/adminData";

const formatPeso = (n: number) => "₱" + n.toLocaleString("en-PH");

function StatusBadge({ status }: { status: FacilityStatus }) {
  const map = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    inactive: "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

const EMPTY_FACILITY: Omit<Facility, "id"> = {
  name: "",
  type: "Event Hall",
  capacity: 0,
  status: "active",
  description: "",
  showOnLanding: false,
  amenities: [],
  rentalPrice: 0,
};

const FACILITY_TYPES = ["Event Hall", "Recreation", "Basketball Court", "Function Room", "Other"];

export default function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [editTarget, setEditTarget] = useState<Facility | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newFacility, setNewFacility] = useState<Omit<Facility, "id">>(EMPTY_FACILITY);
  const [amenityInput, setAmenityInput] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const flash = (id: string) => {
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const saveEdit = () => {
    if (!editTarget) return;
    setFacilities(f => f.map(x => x.id === editTarget.id ? editTarget : x));
    flash(editTarget.id);
    setEditTarget(null);
  };

  const toggleStatus = (id: string) => {
    setFacilities(f => f.map(x =>
      x.id === id ? { ...x, status: x.status === "active" ? "maintenance" : "active" } : x
    ));
  };

  const toggleLanding = (id: string) => {
    setFacilities(f => f.map(x => x.id === id ? { ...x, showOnLanding: !x.showOnLanding } : x));
  };

  const addFacility = () => {
    const id = newFacility.name.toLowerCase().replace(/\s+/g, "-");
    setFacilities(f => [...f, { ...newFacility, id }]);
    setNewFacility({ ...EMPTY_FACILITY });
    setAmenityInput("");
    setIsAdding(false);
    flash(id);
  };

  const addAmenity = (target: "new" | "edit") => {
    const val = amenityInput.trim();
    if (!val) return;
    if (target === "new") setNewFacility(f => ({ ...f, amenities: [...f.amenities, val] }));
    else if (editTarget) setEditTarget(e => e ? { ...e, amenities: [...e.amenities, val] } : e);
    setAmenityInput("");
  };

  const removeAmenity = (idx: number, target: "new" | "edit") => {
    if (target === "new") setNewFacility(f => ({ ...f, amenities: f.amenities.filter((_, i) => i !== idx) }));
    else if (editTarget) setEditTarget(e => e ? { ...e, amenities: e.amenities.filter((_, i) => i !== idx) } : e);
  };

  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#111]">Facilities</h2>
          <p className="text-[#888] text-[13px] mt-1">{facilities.length} venues managed · {facilities.filter(f => f.status === "active").length} active</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#1E3A1E] text-white px-4 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Facility
        </button>
      </div>

      {/* Facility cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {facilities.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${saved === f.id ? "border-emerald-400 shadow-lg shadow-emerald-500/10" : "border-[#E5E7EB]"}`}
          >
            {/* Color accent bar */}
            <div className="h-1.5" style={{ backgroundColor: FACILITY_COLORS[f.id] ?? "#999" }} />

            <div className="p-5">
              {/* Name + edit */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                    style={{ backgroundColor: FACILITY_COLORS[f.id] ?? "#999" }}
                  >
                    {f.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-[#111]">{f.name}</h3>
                    <p className="text-[#888] text-[12px]">{f.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={f.status} />
                  <button
                    onClick={() => setEditTarget({ ...f })}
                    className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#888] hover:text-[#1E3A1E] hover:border-[#A8C88A] transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[#666] text-[13px] leading-relaxed mb-4 line-clamp-2">{f.description}</p>

              {/* Capacity row */}
              <div className="flex items-center gap-1.5 text-[12px] text-[#888] mb-3">
                <Users className="w-3.5 h-3.5" />
                {f.capacity} max capacity
              </div>

              {/* Pricing row */}
              <div className="flex items-stretch gap-3 mb-4">
                <div className="flex-1 bg-[#F8F9FA] rounded-xl px-4 py-3">
                  <p className="text-[10px] text-[#aaa] uppercase tracking-wide mb-1">Full Rental</p>
                  <p className="font-bold text-[#111] text-[16px] font-display">{formatPeso(f.rentalPrice)}</p>
                </div>
                <div className="flex-1 rounded-xl px-4 py-3" style={{ backgroundColor: `${FACILITY_COLORS[f.id] ?? "#999"}18` }}>
                  <p className="text-[10px] text-[#aaa] uppercase tracking-wide mb-1">Deposit (50%)</p>
                  <p className="font-bold text-[16px] font-display" style={{ color: FACILITY_COLORS[f.id] ?? "#555" }}>
                    {formatPeso(f.rentalPrice / 2)}
                  </p>
                </div>
              </div>

              {/* Amenity chips */}
              {f.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {f.amenities.slice(0, 4).map((a, idx) => (
                    <span key={idx} className="text-[11px] bg-[#F4F5F7] text-[#666] px-2.5 py-0.5 rounded-full">{a}</span>
                  ))}
                  {f.amenities.length > 4 && (
                    <span className="text-[11px] bg-[#F4F5F7] text-[#888] px-2.5 py-0.5 rounded-full">+{f.amenities.length - 4} more</span>
                  )}
                </div>
              )}

              {/* Toggles */}
              <div className="flex items-center gap-4 pt-3 border-t border-[#F3F4F6]">
                <button
                  onClick={() => toggleStatus(f.id)}
                  className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${f.status === "active" ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {f.status === "active" ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {f.status === "active" ? "Active" : "Maintenance"}
                </button>
                <button
                  onClick={() => toggleLanding(f.id)}
                  className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${f.showOnLanding ? "text-blue-600" : "text-[#aaa]"}`}
                >
                  {f.showOnLanding ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {f.showOnLanding ? "On Landing Page" : "Hidden"}
                </button>
              </div>
            </div>

            {saved === f.id && (
              <div className="bg-emerald-50 border-t border-emerald-100 px-5 py-2 flex items-center gap-2 text-emerald-700 text-[12px]">
                <Check className="w-3.5 h-3.5" /> Changes saved
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editTarget && (
          <Modal title={`Edit — ${editTarget.name}`} onClose={() => setEditTarget(null)}>
            <FacilityForm
              data={editTarget}
              onChange={setEditTarget as (d: Facility) => void}
              amenityInput={amenityInput}
              setAmenityInput={setAmenityInput}
              onAddAmenity={() => addAmenity("edit")}
              onRemoveAmenity={i => removeAmenity(i, "edit")}
            />
            <div className="flex gap-3 mt-6">
              <button onClick={saveEdit} className="flex-1 bg-[#1E3A1E] text-white py-3 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors">
                Save Changes
              </button>
              <button onClick={() => setEditTarget(null)} className="flex-1 border border-[#E5E7EB] text-[#666] py-3 rounded-xl text-[13px] font-medium hover:bg-[#F4F5F7] transition-colors">
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <Modal title="Add New Facility" onClose={() => setIsAdding(false)}>
            <FacilityForm
              data={newFacility as Facility}
              onChange={v => setNewFacility(v)}
              amenityInput={amenityInput}
              setAmenityInput={setAmenityInput}
              onAddAmenity={() => addAmenity("new")}
              onRemoveAmenity={i => removeAmenity(i, "new")}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={addFacility}
                disabled={!newFacility.name.trim()}
                className="flex-1 bg-[#1E3A1E] text-white py-3 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors disabled:opacity-50"
              >
                Add Facility
              </button>
              <button onClick={() => setIsAdding(false)} className="flex-1 border border-[#E5E7EB] text-[#666] py-3 rounded-xl text-[13px] font-medium hover:bg-[#F4F5F7] transition-colors">
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
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

function FacilityForm({
  data, onChange, amenityInput, setAmenityInput, onAddAmenity, onRemoveAmenity,
}: {
  data: Facility;
  onChange: (d: Facility) => void;
  amenityInput: string;
  setAmenityInput: (v: string) => void;
  onAddAmenity: () => void;
  onRemoveAmenity: (i: number) => void;
}) {
  const field = (key: keyof Facility, value: string | number | boolean) =>
    onChange({ ...data, [key]: value });

  const deposit = data.rentalPrice / 2;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Facility Name *</label>
          <input
            value={data.name}
            onChange={e => field("name", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-1 focus:ring-[#2D5016]/15 transition-all"
            placeholder="e.g. The Pavilion"
          />
        </div>
        <div>
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Type</label>
          <select
            value={data.type}
            onChange={e => field("type", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] bg-white transition-all"
          >
            {FACILITY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Capacity</label>
          <input
            type="number"
            value={data.capacity}
            onChange={e => field("capacity", Number(e.target.value))}
            className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-1 focus:ring-[#2D5016]/15 transition-all"
          />
        </div>
      </div>

      {/* Rental pricing */}
      <div>
        <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Full Rental Price (₱)</label>
        <div className="relative">
          <PhilippinePeso className="absolute left-3.5 top-3 w-4 h-4 text-[#ccc]" />
          <input
            type="number"
            value={data.rentalPrice}
            onChange={e => field("rentalPrice", Number(e.target.value))}
            placeholder="0"
            className="w-full border border-[#E5E7EB] rounded-xl pl-9 pr-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-1 focus:ring-[#2D5016]/15 transition-all"
          />
        </div>
        {data.rentalPrice > 0 && (
          <div className="flex items-center justify-between mt-2 px-1 text-[12px]">
            <span className="text-[#aaa]">Deposit required (50%)</span>
            <span className="font-semibold text-amber-600">{formatPeso(deposit)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Status</label>
          <select
            value={data.status}
            onChange={e => field("status", e.target.value as FacilityStatus)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] bg-white transition-all"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Landing Page</label>
          <button
            type="button"
            onClick={() => field("showOnLanding", !data.showOnLanding)}
            className={`w-full flex items-center justify-center gap-2 border rounded-xl px-3.5 py-2.5 text-[14px] transition-all font-medium ${data.showOnLanding ? "bg-[#EEF5E8] border-[#A8C88A] text-[#2D5016]" : "border-[#E5E7EB] text-[#888]"}`}
          >
            {data.showOnLanding ? <><Eye className="w-4 h-4" /> Visible</> : <><EyeOff className="w-4 h-4" /> Hidden</>}
          </button>
        </div>
      </div>

      <div>
        <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Description</label>
        <textarea
          rows={3}
          value={data.description}
          onChange={e => field("description", e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-1 focus:ring-[#2D5016]/15 transition-all resize-none"
        />
      </div>

      <div>
        <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">Amenities</label>
        <div className="flex gap-2 mb-2">
          <input
            value={amenityInput}
            onChange={e => setAmenityInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), onAddAmenity())}
            placeholder="Add amenity (press Enter)"
            className="flex-1 border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#2D5016] transition-all"
          />
          <button
            type="button"
            onClick={onAddAmenity}
            className="bg-[#EEF5E8] text-[#2D5016] w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#D6ECC4] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.amenities.map((a, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[12px] bg-[#F4F5F7] text-[#555] px-2.5 py-1 rounded-full">
              {a}
              <button onClick={() => onRemoveAmenity(i)} className="text-[#aaa] hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
