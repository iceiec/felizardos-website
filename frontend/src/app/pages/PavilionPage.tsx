import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, X, Check, ChevronLeft, ChevronRight, Users, Clock, Utensils, Car, Wifi, Music } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FadeUp, ScaleIn } from "../components/shared";
import { contentService } from "../services/contentService";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "../utils/adminData";

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1767131626424-c4ab452bb34b?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1767131626424-c4ab452bb34b?w=600&h=450&fit=crop&auto=format",
    alt: "Open pavilion with tables overlooking a garden field",
    caption: "Main Pavilion — Garden View",
    size: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1665607437981-973dcd6a22bb?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1665607437981-973dcd6a22bb?w=600&h=450&fit=crop&auto=format",
    alt: "Large room with tables set for a wedding",
    caption: "Wedding Banquet Setup",
    size: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1780682569879-f271082ae2cd?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1780682569879-f271082ae2cd?w=600&h=450&fit=crop&auto=format",
    alt: "Outdoor event under white tents with red tables and chairs",
    caption: "Outdoor Tented Reception",
    size: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1768791211104-7f1c5474f07d?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1768791211104-7f1c5474f07d?w=600&h=450&fit=crop&auto=format",
    alt: "Modern building with outdoor seating and string lights at night",
    caption: "Evening Ambiance — String Lights",
    size: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1561593367-66c79c2294e6?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1561593367-66c79c2294e6?w=600&h=450&fit=crop&auto=format",
    alt: "Elegant dining table setup with tall wine glasses",
    caption: "Elegant Table Settings",
    size: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1533120921505-7f40f5237ee1?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1533120921505-7f40f5237ee1?w=600&h=450&fit=crop&auto=format",
    alt: "Fine outdoor dining setup under open sky",
    caption: "Alfresco Fine Dining",
    size: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=600&h=450&fit=crop&auto=format",
    alt: "Table decorated with candles and floral arrangements",
    caption: "Candlelit Centerpieces",
    size: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=600&h=450&fit=crop&auto=format",
    alt: "Table settings arranged in a grand event room",
    caption: "Grand Banquet Hall Style",
    size: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1778514253639-3bd14410db8b?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1778514253639-3bd14410db8b?w=600&h=450&fit=crop&auto=format",
    alt: "Indoor space with wooden ceiling and sunlit patio view",
    caption: "Wooden Ceiling Interior",
    size: "normal",
  },
];

const AMENITIES = [
  { Icon: Users,    label: "Up to 200 Guests",        desc: "Seated banquet or cocktail style" },
  { Icon: Utensils, label: "Full Catering Kitchen",   desc: "Professional-grade prep facilities" },
  { Icon: Music,    label: "Sound System",             desc: "Built-in PA with mic & playlist support" },
  { Icon: Clock,    label: "Half or Full Day",         desc: "Flexible 6-hour & 12-hour packages" },
  { Icon: Car,      label: "Ample Parking",            desc: "Free on-site parking for all guests" },
  { Icon: Wifi,     label: "Wi-Fi Included",           desc: "High-speed connectivity throughout" },
];

const FALLBACK_HERO_IMAGE = "https://images.unsplash.com/photo-1767131626424-c4ab452bb34b?w=1920&h=1080&fit=crop&auto=format";

const PACKAGES = [
  {
    name: "Half Day",
    hours: "6 Hours",
    price: "₱15,000",
    features: ["Up to 100 guests", "Basic sound system", "Table & chair setup", "Parking access"],
    highlight: false,
  },
  {
    name: "Full Day",
    hours: "12 Hours",
    price: "₱25,000",
    features: ["Up to 200 guests", "Full PA sound system", "Table, chair & linen setup", "Kitchen access", "Parking access", "Event coordinator"],
    highlight: true,
  },
  {
    name: "Premium",
    hours: "12 Hours + Setup",
    price: "₱38,000",
    features: ["Up to 200 guests", "Full PA + lighting rig", "Styled table & linen setup", "Catering kitchen", "Bridal room", "Dedicated coordinator", "Post-event cleanup"],
    highlight: false,
  },
];

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: typeof GALLERY;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        onClick={e => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        onClick={e => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        src={photo.src}
        alt={photo.alt}
        className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      />

      <div className="mt-5 text-center" onClick={e => e.stopPropagation()}>
        <p className="text-white/80 text-[14px] font-medium">{photo.caption}</p>
        <p className="text-white/35 text-[12px] mt-1">{index + 1} / {photos.length}</p>
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-6 pb-1" onClick={e => e.stopPropagation()}>
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              if (i < index) { for (let k = index; k > i; k--) onPrev(); }
              if (i > index) { for (let k = index; k < i; k++) onNext(); }
            }}
            className={`flex-shrink-0 w-12 h-9 rounded overflow-hidden transition-all duration-200 ${
              i === index ? "ring-2 ring-[#A8C88A] opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <img src={p.thumb} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function PavilionPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    contentService.get().then(res => {
      if (res.success && res.data) {
        setContent(prev => ({ ...prev, ...res.data }));
      }
    }).catch(console.error);
  }, []);

  const galleryPhotos = (content.pavilionGallery.length ? content.pavilionGallery : GALLERY.map(item => item.src)).map((src, index) => ({
    src,
    thumb: src,
    alt: GALLERY[index % GALLERY.length]?.alt ?? "Pavilion venue photo",
    caption: GALLERY[index % GALLERY.length]?.caption ?? "Pavilion photo",
    size: GALLERY[index % GALLERY.length]?.size ?? "normal",
  }));
  const amenities = content.pavilionAmenities.length ? content.pavilionAmenities.map((label, index) => ({
    Icon: AMENITIES[index % AMENITIES.length].Icon,
    label,
    desc: AMENITIES[index % AMENITIES.length].desc,
  })) : AMENITIES;
  const packageCards = content.pavilionPackages.length ? content.pavilionPackages : PACKAGES;
  const heroImage = content.pavilionImage || FALLBACK_HERO_IMAGE;

  const openLightbox = (i: number) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () => setLightboxIdx(i => (i === null ? null : (i - 1 + galleryPhotos.length) % galleryPhotos.length));
  const nextPhoto = () => setLightboxIdx(i => (i === null ? null : (i + 1) % galleryPhotos.length));

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#111] font-sans overflow-x-hidden">
      <Nav transparent />

      {/* Hero */}
      <section ref={heroRef} className="relative h-[75vh] min-h-[540px] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-[1.1]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A0B]/55 via-[#0B1A0B]/30 to-[#0B1A0B]/70 z-10" />
          <img
            src={heroImage}
            alt="Felizardo's Pavilion — open-air garden venue"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/55 hover:text-white/90 transition-colors text-[12px] tracking-wide mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="inline-flex items-center gap-2 text-[#B8D4A0] text-[11px] tracking-[0.45em] uppercase mb-5 font-medium"
          >
            <span className="w-6 h-px bg-[#B8D4A0]/50" />
            Venue 01
            <span className="w-6 h-px bg-[#B8D4A0]/50" />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-[1.05] mb-6"
          >
            The Pavilion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.75 }}
            className="text-white/65 text-[17px] max-w-lg leading-relaxed mb-10"
          >
            {content.pavilionIntro || "An open-air garden sanctuary for weddings, debuts, and milestone celebrations — up to 200 guests in effortless elegance."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a href="#gallery" className="px-8 py-3.5 bg-[#2D5016] text-white rounded-full text-[13px] font-medium tracking-wide hover:bg-[#3A6B1E] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1E3A1E]/40">
              View Gallery
            </a>
            <a href="/#contact" className="px-8 py-3.5 bg-white/12 backdrop-blur-sm text-white border border-white/25 rounded-full text-[13px] font-medium tracking-wide hover:bg-white/20 transition-all duration-300">
              Check Availability
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="bg-[#1A3319]">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "200",       label: "Max Guests" },
            { value: "3,500 m²", label: "Venue Area" },
            { value: "6–12",     label: "Hours Available" },
            { value: "Free",     label: "Parking" },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div>
                <div className="font-display text-[34px] font-bold text-[#A8C88A] leading-none mb-1.5">{s.value}</div>
                <div className="text-white/45 text-[10px] tracking-[0.35em] uppercase">{s.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* About the Venue */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">About the Venue</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Garden Elegance,<br />Naturally Yours
            </h2>
            <p className="text-[#555] leading-relaxed mb-5 text-[16px]">
              {content.pavilionDescription || "The Pavilion is an open-air event space nestled within lush tropical gardens, where natural light filters through greenery and gentle breezes carry the scent of blossoms. Designed to blur the boundary between indoors and out, it creates an atmosphere that feels at once grand and intimate."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {(content.pavilionAmenities.length ? content.pavilionAmenities : [
                "Garden & greens backdrop",
                "Natural & artificial lighting",
                "Flexible layout configurations",
                "Bridal suite available",
                "Backup generator",
                "Climate-managed comfort",
              ]).map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[14px] text-[#444]">
                  <span className="w-5 h-5 rounded-full bg-[#EEF5E8] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#2D5016]" />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </FadeUp>

          <ScaleIn>
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-2xl aspect-[3/4] bg-stone-200 row-span-2 group cursor-pointer" onClick={() => openLightbox(0)}>
                <img
                  src="https://images.unsplash.com/photo-1665607437981-973dcd6a22bb?w=600&h=800&fit=crop&auto=format"
                  alt="Grand wedding banquet setup in the Pavilion"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-stone-200 group cursor-pointer" onClick={() => openLightbox(5)}>
                <img
                  src="https://images.unsplash.com/photo-1533120921505-7f40f5237ee1?w=600&h=400&fit=crop&auto=format"
                  alt="Outdoor fine dining setting"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-stone-200 group cursor-pointer" onClick={() => openLightbox(6)}>
                <img
                  src="https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=600&h=400&fit=crop&auto=format"
                  alt="Candlelit table with floral centerpieces"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 bg-[#F2F0EB] px-6">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Amenities</span>
            <h2 className="font-display text-4xl font-bold">Everything Included</h2>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {amenities.map(({ Icon, label, desc }, i) => (
              <FadeUp key={`${label}-${i}`} delay={i * 0.07}>
                <div className="bg-white rounded-2xl p-6 border border-[#E4DFCF] hover:border-[#A8C88A] hover:shadow-md transition-all duration-300 flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF5E8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E3A1E] transition-colors duration-300">
                    <Icon className="w-4.5 h-4.5 text-[#2D5016] group-hover:text-white transition-colors duration-300 w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] mb-0.5">{label}</div>
                    <div className="text-[#888] text-[13px]">{desc}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
        <FadeUp className="text-center mb-14">
          <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Photo Gallery</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">The Pavilion in Every Light</h2>
          <p className="text-[#666] mt-4 max-w-xl mx-auto text-[15px] leading-relaxed">
            From intimate morning setups to glittering evening receptions — see how the Pavilion transforms for every occasion.
          </p>
        </FadeUp>

        {/* Masonry gallery grid */}
        <div className="columns-2 md:columns-3 gap-4">
          {galleryPhotos.map((photo, i) => (
            <FadeUp key={`${photo.src}-${i}`} delay={i * 0.05} className="break-inside-avoid mb-4">
              <div
                className={`overflow-hidden rounded-xl bg-stone-200 group cursor-pointer relative ${
                  photo.size === "tall" ? "aspect-[3/4]" : photo.size === "wide" ? "aspect-[4/3]" : "aspect-[4/3]"
                }`}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={photo.thumb}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-[#0B1A0B]/0 group-hover:bg-[#0B1A0B]/40 transition-all duration-400 flex items-end p-4">
                  <span className="text-white text-[13px] font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {photo.caption}
                  </span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="text-center mt-10">
          <p className="text-[#999] text-[13px]">{galleryPhotos.length} photos · Click any image to view full size</p>
        </FadeUp>
      </section>

      {/* Packages */}
      <section className="py-24 bg-[#F2F0EB] px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Pricing</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Pavilion Packages</h2>
            <p className="text-[#666] mt-4 text-[15px]">All packages include basic setup. Custom arrangements available upon request.</p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {packageCards.map((pkg, i) => (
              <FadeUp key={`${pkg.name}-${i}`} delay={i * 0.1}>
                <div className={`rounded-2xl p-7 h-full flex flex-col transition-all duration-300 ${
                  pkg.highlight
                    ? "bg-[#1E3A1E] text-white shadow-2xl shadow-[#1E3A1E]/25 scale-[1.02]"
                    : "bg-white border border-[#E4DFCF] hover:border-[#A8C88A] hover:shadow-lg"
                }`}>
                  {pkg.highlight && (
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8C88A] font-medium mb-3 block">Most Popular</span>
                  )}
                  <div className="mb-5">
                    <h3 className={`font-display text-2xl font-bold mb-1 ${pkg.highlight ? "text-white" : ""}`}>{pkg.name}</h3>
                    <p className={`text-[13px] ${pkg.highlight ? "text-white/55" : "text-[#999]"}`}>{pkg.hours}</p>
                  </div>
                  <div className={`text-4xl font-display font-bold mb-7 ${pkg.highlight ? "text-[#A8C88A]" : "text-[#1E3A1E]"}`}>
                    {pkg.price}
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-8">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-[14px]">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          pkg.highlight ? "bg-[#A8C88A]/20" : "bg-[#EEF5E8]"
                        }`}>
                          <Check className={`w-2.5 h-2.5 ${pkg.highlight ? "text-[#A8C88A]" : "text-[#2D5016]"}`} />
                        </span>
                        <span className={pkg.highlight ? "text-white/75" : "text-[#555]"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/#contact"
                    className={`block text-center py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all duration-300 ${
                      pkg.highlight
                        ? "bg-[#A8C88A] text-[#0E1E0E] hover:bg-[#B8D4A0]"
                        : "bg-[#1E3A1E] text-white hover:bg-[#2D5016]"
                    }`}
                  >
                    Book This Package
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1780682569879-f271082ae2cd?w=1920&h=600&fit=crop&auto=format"
            alt="Outdoor event reception"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0B1A0B]/72" />
        </div>
        <div className="relative z-10 text-center px-6">
          <FadeUp>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
              Reserve the Pavilion
            </h2>
            <p className="text-white/60 text-[16px] max-w-md mx-auto mb-9">
              Dates fill quickly — secure your preferred date with a simple inquiry. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1E3A1E] px-9 py-4 rounded-full font-medium text-[13px] tracking-wide hover:bg-[#EEF5E8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group"
              >
                Check Availability
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/venues/pool"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/25 px-9 py-4 rounded-full font-medium text-[13px] tracking-wide hover:bg-white/18 transition-all duration-300"
              >
                View Swimming Pool
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={galleryPhotos}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  );
}
