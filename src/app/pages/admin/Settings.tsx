import { useState } from "react";
import { motion } from "motion/react";
import {
  User, Lock, Bell, MapPin, Phone, Mail, Clock,
  Check, Eye, EyeOff, Shield, Trash2, RotateCcw, Save,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuth";

// ─── Persisted settings shape ─────────────────────────────────────────────────
interface AdminSettings {
  venueName: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  notifyNewBooking: boolean;
  notifyMaintenance: boolean;
  notifyPayment: boolean;
}

const DEFAULT_SETTINGS: AdminSettings = {
  venueName: "Felizardo's Event Place",
  address: "Felizardo's Event Place, Batangas, Philippines",
  phone: "+63 912 345 6789",
  email: "events@felizardos.com",
  hours: "Monday – Saturday, 9:00 AM – 6:00 PM",
  notifyNewBooking: true,
  notifyMaintenance: true,
  notifyPayment: false,
};

const STORAGE_KEY = "felizardos_settings";

function loadSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(s: AdminSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, description, icon: Icon, children }: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#F3F4F6] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EEF5E8] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#2D5016]" />
        </div>
        <div>
          <h3 className="font-semibold text-[15px] text-[#111]">{title}</h3>
          <p className="text-[12px] text-[#999] mt-0.5">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-1 focus:ring-[#2D5016]/15 transition-all";

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F9FAFB] last:border-0">
      <div>
        <p className="text-[14px] font-medium text-[#111]">{label}</p>
        <p className="text-[12px] text-[#999] mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? "bg-[#2D5016]" : "bg-[#D1D5DB]"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Settings() {
  const { logout } = useAdminAuth();
  const [settings, setSettings] = useState<AdminSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  // Password change state
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  // Danger zone
  const [confirmReset, setConfirmReset] = useState(false);

  const field = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    setSettings(s => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = () => {
    setPwError("");
    if (pwCurrent !== "felizardos2025") {
      setPwError("Current password is incorrect.");
      return;
    }
    if (pwNew.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwSaved(true);
    setPwCurrent(""); setPwNew(""); setPwConfirm("");
    setTimeout(() => setPwSaved(false), 2500);
  };

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("felizardos_site_content");
    setSettings({ ...DEFAULT_SETTINGS });
    setConfirmReset(false);
  };

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#111]">Settings</h2>
          <p className="text-[#888] text-[13px] mt-1">Manage your venue configuration and account preferences.</p>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${saved ? "bg-emerald-600 text-white" : "bg-[#1E3A1E] text-white hover:bg-[#2D5016]"}`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </motion.button>
      </div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
        <Section title="Account" description="Admin login identity" icon={User}>
          <div className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#1E3A1E] flex items-center justify-center text-white font-bold text-[16px] flex-shrink-0">A</div>
            <div>
              <p className="font-semibold text-[14px] text-[#111]">Administrator</p>
              <p className="text-[12px] text-[#888]">admin@felizardos.com</p>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
          </div>
          <p className="text-[12px] text-[#bbb] -mt-1">Email and role are fixed and cannot be changed.</p>
        </Section>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Section title="Change Password" description="Update your admin login password" icon={Lock}>
          <Field label="Current Password">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pwCurrent}
                onChange={e => setPwCurrent(e.target.value)}
                className={inputCls + " pr-10"}
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-3 text-[#aaa] hover:text-[#555] transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="New Password">
              <input type={showPw ? "text" : "password"} value={pwNew} onChange={e => setPwNew(e.target.value)} className={inputCls} placeholder="Min. 8 characters" />
            </Field>
            <Field label="Confirm New Password">
              <input type={showPw ? "text" : "password"} value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} className={inputCls} placeholder="Repeat password" />
            </Field>
          </div>
          {pwError && <p className="text-[12px] text-red-500 bg-red-50 px-3 py-2 rounded-xl">{pwError}</p>}
          {pwSaved && <p className="text-[12px] text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Password updated successfully.</p>}
          <button
            onClick={handlePasswordChange}
            className="flex items-center gap-2 bg-[#1E3A1E] text-white px-4 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> Update Password
          </button>
        </Section>
      </motion.div>

      {/* Venue Info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Section title="Venue Information" description="Business details shown on the site and reports" icon={MapPin}>
          <Field label="Venue Name">
            <input value={settings.venueName} onChange={e => field("venueName", e.target.value)} className={inputCls} placeholder="Felizardo's Event Place" />
          </Field>
          <Field label="Address">
            <input value={settings.address} onChange={e => field("address", e.target.value)} className={inputCls} placeholder="Full address" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone">
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#ccc]" />
                <input value={settings.phone} onChange={e => field("phone", e.target.value)} className={inputCls + " pl-9"} placeholder="+63 912 345 6789" />
              </div>
            </Field>
            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#ccc]" />
                <input value={settings.email} onChange={e => field("email", e.target.value)} className={inputCls + " pl-9"} placeholder="events@felizardos.com" />
              </div>
            </Field>
          </div>
          <Field label="Business Hours">
            <div className="relative">
              <Clock className="absolute left-3.5 top-3 w-4 h-4 text-[#ccc]" />
              <input value={settings.hours} onChange={e => field("hours", e.target.value)} className={inputCls + " pl-9"} placeholder="Monday – Saturday, 9:00 AM – 6:00 PM" />
            </div>
          </Field>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <Section title="Notifications" description="Control which events trigger admin alerts" icon={Bell}>
          <Toggle
            checked={settings.notifyNewBooking}
            onChange={v => field("notifyNewBooking", v)}
            label="New Booking"
            description="Alert when a new schedule is added"
          />
          <Toggle
            checked={settings.notifyMaintenance}
            onChange={v => field("notifyMaintenance", v)}
            label="Maintenance Updates"
            description="Alert when a maintenance task changes status"
          />
          <Toggle
            checked={settings.notifyPayment}
            onChange={v => field("notifyPayment", v)}
            label="Payment Reminders"
            description="Alert for pending deposits 48 hours before event"
          />
        </Section>
      </motion.div>

      {/* Security info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
        <Section title="Security" description="Session and access information" icon={Shield}>
          <div className="space-y-3">
            {[
              { label: "Authentication", value: "Local session · localStorage" },
              { label: "Session expires", value: "On browser close" },
              { label: "Last login", value: new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-2.5 border-b border-[#F9FAFB] last:border-0">
                <span className="text-[13px] text-[#666]">{r.label}</span>
                <span className="text-[13px] font-medium text-[#111]">{r.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-[13px] text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors font-medium mt-2"
          >
            Sign out of all sessions
          </button>
        </Section>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-red-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] text-[#111]">Danger Zone</h3>
              <p className="text-[12px] text-[#999] mt-0.5">Irreversible actions — proceed with caution</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-[#111]">Reset Local Data</p>
                <p className="text-[12px] text-[#999] mt-0.5">Clears all saved settings and site content from this browser</p>
              </div>
              <button
                onClick={handleReset}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${confirmReset ? "bg-red-500 text-white hover:bg-red-600" : "border border-red-200 text-red-500 hover:bg-red-50"}`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {confirmReset ? "Confirm Reset" : "Reset Data"}
              </button>
            </div>
            {confirmReset && (
              <p className="text-[12px] text-red-500 mt-3 bg-red-50 px-3 py-2 rounded-xl">
                Click "Confirm Reset" again to permanently clear local settings. This cannot be undone.
              </p>
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
