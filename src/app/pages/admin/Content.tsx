import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Save, Check, RotateCcw, Eye, EyeOff, MapPin, Phone, Mail, Clock, Sparkles } from "lucide-react";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "../../utils/adminData";

const STORAGE_KEY = "felizardos_site_content";

function loadContent(): SiteContent {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_SITE_CONTENT, ...JSON.parse(stored) } : { ...DEFAULT_SITE_CONTENT };
  } catch {
    return { ...DEFAULT_SITE_CONTENT };
  }
}

function saveContent(content: SiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

type Section = "hero" | "contact" | "venues";

export default function Content() {
  const [content, setContent] = useState<SiteContent>(loadContent);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(true);

  const update = (key: keyof SiteContent, val: string) =>
    setContent(c => ({ ...c, [key]: val }));

  const handleSave = () => {
    saveContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = (section: Section) => {
    if (!confirm("Reset this section to default values?")) return;
    if (section === "hero") {
      setContent(c => ({
        ...c,
        heroTagline: DEFAULT_SITE_CONTENT.heroTagline,
        heroTitle: DEFAULT_SITE_CONTENT.heroTitle,
        heroHighlight: DEFAULT_SITE_CONTENT.heroHighlight,
        heroSubtitle: DEFAULT_SITE_CONTENT.heroSubtitle,
      }));
    } else if (section === "contact") {
      setContent(c => ({
        ...c,
        contactAddress: DEFAULT_SITE_CONTENT.contactAddress,
        contactPhone: DEFAULT_SITE_CONTENT.contactPhone,
        contactEmail: DEFAULT_SITE_CONTENT.contactEmail,
        contactHours: DEFAULT_SITE_CONTENT.contactHours,
      }));
    } else {
      setContent(c => ({
        ...c,
        pavilionDescription: DEFAULT_SITE_CONTENT.pavilionDescription,
        poolDescription: DEFAULT_SITE_CONTENT.poolDescription,
      }));
    }
  };

  const SECTION_TABS: { id: Section; label: string }[] = [
    { id: "hero", label: "Hero Section" },
    { id: "contact", label: "Contact Info" },
    { id: "venues", label: "Venue Descriptions" },
  ];

  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#111]">Content Management</h2>
          <p className="text-[#888] text-[13px] mt-1">Edit landing page copy and contact information</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(v => !v)}
            className="flex items-center gap-2 border border-[#E5E7EB] text-[#666] px-3.5 py-2.5 rounded-xl text-[13px] hover:bg-[#F4F5F7] transition-colors"
          >
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#1E3A1E] text-white px-4 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#2D5016] transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-4 py-3 rounded-xl mb-5"
          >
            <Check className="w-4 h-4" />
            Content saved successfully! Changes will appear on the landing page.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section tabs */}
      <div className="flex gap-1 p-1 bg-[#F4F5F7] rounded-xl mb-6 w-fit">
        {SECTION_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
              activeSection === tab.id
                ? "bg-white text-[#111] shadow-sm"
                : "text-[#888] hover:text-[#444]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={`grid gap-6 ${preview ? "lg:grid-cols-[1fr_400px]" : ""}`}>

        {/* Edit Panel */}
        <div className="space-y-5">
          {activeSection === "hero" && (
            <Section title="Hero Section" icon={<Sparkles className="w-4 h-4" />} onReset={() => handleReset("hero")}>
              <Field label="Tagline (small text above heading)">
                <input
                  value={content.heroTagline}
                  onChange={e => update("heroTagline", e.target.value)}
                  className={INPUT_CLS}
                  placeholder="Premium Event Venue · Philippines"
                />
              </Field>
              <Field label="Main Heading">
                <input
                  value={content.heroTitle}
                  onChange={e => update("heroTitle", e.target.value)}
                  className={INPUT_CLS}
                  placeholder="Where Every Moment Becomes"
                />
                <p className="text-[11px] text-[#aaa] mt-1">The heading continues with the highlighted text below.</p>
              </Field>
              <Field label="Highlighted Text (green accent)">
                <input
                  value={content.heroHighlight}
                  onChange={e => update("heroHighlight", e.target.value)}
                  className={INPUT_CLS}
                  placeholder="A Memory"
                />
              </Field>
              <Field label="Subtitle / Description">
                <textarea
                  rows={3}
                  value={content.heroSubtitle}
                  onChange={e => update("heroSubtitle", e.target.value)}
                  className={INPUT_CLS + " resize-none"}
                />
              </Field>
            </Section>
          )}

          {activeSection === "contact" && (
            <Section title="Contact Information" icon={<Phone className="w-4 h-4" />} onReset={() => handleReset("contact")}>
              <Field label="Address">
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#ccc]" />
                  <input
                    value={content.contactAddress}
                    onChange={e => update("contactAddress", e.target.value)}
                    className={INPUT_CLS + " pl-10"}
                  />
                </div>
              </Field>
              <Field label="Phone Number">
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#ccc]" />
                  <input
                    value={content.contactPhone}
                    onChange={e => update("contactPhone", e.target.value)}
                    className={INPUT_CLS + " pl-10"}
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </Field>
              <Field label="Email Address">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#ccc]" />
                  <input
                    value={content.contactEmail}
                    onChange={e => update("contactEmail", e.target.value)}
                    className={INPUT_CLS + " pl-10"}
                    placeholder="events@felizardos.com"
                  />
                </div>
              </Field>
              <Field label="Office Hours">
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3 w-4 h-4 text-[#ccc]" />
                  <input
                    value={content.contactHours}
                    onChange={e => update("contactHours", e.target.value)}
                    className={INPUT_CLS + " pl-10"}
                    placeholder="Monday – Saturday, 9:00 AM – 6:00 PM"
                  />
                </div>
              </Field>
            </Section>
          )}

          {activeSection === "venues" && (
            <Section title="Venue Descriptions" icon={<Eye className="w-4 h-4" />} onReset={() => handleReset("venues")}>
              <Field label="The Pavilion — Description">
                <textarea
                  rows={4}
                  value={content.pavilionDescription}
                  onChange={e => update("pavilionDescription", e.target.value)}
                  className={INPUT_CLS + " resize-none"}
                />
                <p className="text-[11px] text-[#aaa] mt-1">Shown in the Pavilion section on the landing page.</p>
              </Field>
              <Field label="Swimming Pool — Description">
                <textarea
                  rows={4}
                  value={content.poolDescription}
                  onChange={e => update("poolDescription", e.target.value)}
                  className={INPUT_CLS + " resize-none"}
                />
                <p className="text-[11px] text-[#aaa] mt-1">Shown in the Swimming Pool section on the landing page.</p>
              </Field>
            </Section>
          )}
        </div>

        {/* Live Preview */}
        {preview && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden sticky top-6">
              <div className="bg-[#F8F9FA] border-b border-[#E5E7EB] px-5 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-[11px] text-[#aaa] ml-2 font-mono">Live Preview</span>
              </div>

              <div className="p-5">
                {activeSection === "hero" && (
                  <div className="bg-[#0B1A0B] rounded-xl p-5 text-center">
                    <p className="text-[#B8D4A0] text-[9px] tracking-[0.4em] uppercase mb-3">{content.heroTagline}</p>
                    <h3 className="font-display text-[22px] font-bold text-white leading-tight mb-1">
                      {content.heroTitle}
                    </h3>
                    <h3 className="font-display text-[22px] font-bold text-[#A8C88A] leading-tight mb-3">
                      {content.heroHighlight}
                    </h3>
                    <p className="text-white/55 text-[11px] leading-relaxed">{content.heroSubtitle}</p>
                    <div className="flex justify-center gap-2 mt-4">
                      <div className="bg-[#2D5016] text-white text-[10px] px-4 py-2 rounded-full">Book Your Event</div>
                      <div className="bg-white/10 text-white/70 text-[10px] px-4 py-2 rounded-full border border-white/20">Explore Venues</div>
                    </div>
                  </div>
                )}

                {activeSection === "contact" && (
                  <div className="space-y-3">
                    {[
                      { icon: <MapPin className="w-4 h-4 text-[#2D5016]" />, label: "Location", val: content.contactAddress },
                      { icon: <Phone className="w-4 h-4 text-[#2D5016]" />, label: "Phone", val: content.contactPhone },
                      { icon: <Mail className="w-4 h-4 text-[#2D5016]" />, label: "Email", val: content.contactEmail },
                      { icon: <Clock className="w-4 h-4 text-[#2D5016]" />, label: "Hours", val: content.contactHours },
                    ].map(({ icon, label, val }) => (
                      <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F9FA]">
                        <div className="w-8 h-8 rounded-lg bg-[#EEF5E8] flex items-center justify-center flex-shrink-0">{icon}</div>
                        <div>
                          <p className="text-[9px] text-[#aaa] uppercase tracking-wide">{label}</p>
                          <p className="text-[12px] text-[#333] font-medium">{val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === "venues" && (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-[#F2F0EB] p-4">
                      <div className="text-[9px] text-[#2D5016] uppercase tracking-widest mb-1">The Pavilion</div>
                      <p className="text-[12px] text-[#555] leading-relaxed">{content.pavilionDescription}</p>
                    </div>
                    <div className="rounded-xl bg-[#EBF4F8] p-4">
                      <div className="text-[9px] text-[#1A6080] uppercase tracking-widest mb-1">Swimming Pool</div>
                      <p className="text-[12px] text-[#555] leading-relaxed">{content.poolDescription}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const INPUT_CLS = "w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-1 focus:ring-[#2D5016]/15 transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] text-[#888] uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Section({ title, icon, onReset, children }: { title: string; icon: React.ReactNode; onReset: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2 font-semibold text-[15px]">
          <span className="text-[#2D5016]">{icon}</span>
          {title}
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-[12px] text-[#aaa] hover:text-[#666] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}
