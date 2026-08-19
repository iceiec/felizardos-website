import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, X, Check, ChevronLeft, ChevronRight, Users, Clock, Waves, Sun, ShieldCheck, Music } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { FadeUp, ScaleIn } from "../components/shared";
import { contentService } from "../services/contentService";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "../utils/adminData";

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=600&h=450&fit=crop&auto=format",
    alt: "Resort-style pool with white house and tropical surroundings",
    caption: "Main Pool — Aerial View",
    size: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1780631742148-13fe417205d9?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1780631742148-13fe417205d9?w=600&h=450&fit=crop&auto=format",
    alt: "People relaxing by an infinity pool with pink flamingo floats",
    caption: "Pool Party Vibes",
    size: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&h=450&fit=crop&auto=format",
    alt: "Wooden lounge chairs near tropical pool with palm trees",
    caption: "Poolside Lounging",
    size: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1761138785581-194503520539?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1761138785581-194503520539?w=600&h=450&fit=crop&auto=format",
    alt: "People at a vibrant poolside bar with cocktails",
    caption: "Poolside Bar & Drinks",
    size: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1780631742409-c22fb9698390?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1780631742409-c22fb9698390?w=600&h=450&fit=crop&auto=format",
    alt: "Happy children playing in a vibrant resort swimming pool",
    caption: "Kids in the Pool",
    size: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=450&fit=crop&auto=format",
    alt: "Wooden lounge chairs on dock with pool view",
    caption: "Deck Lounge Area",
    size: "normal",
  },
  {
    src: "https://images.unsplash.com/photo-1711114378509-acc95d490b25?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1711114378509-acc95d490b25?w=600&h=450&fit=crop&auto=format",
    alt: "Large swimming pool with lounge chairs and a wide deck",
    caption: "Full Pool & Deck View",
    size: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1760754726379-7f450a8f23e6?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1760754726379-7f450a8f23e6?w=600&h=450&fit=crop&auto=format",
    alt: "Woman holding a tropical cocktail in the pool",
    caption: "Tropical Cocktail Hour",
    size: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=450&fit=crop&auto=format",
    alt: "Resort infinity pool overlooking blue sea and sky",
    caption: "Resort Paradise",
    size: "normal",
  },
];

const AMENITIES = [
  { Icon: Waves,      label: "Crystal-Clear Pool",         desc: "Maintained to resort-grade standards daily" },
  { Icon: Users,      label: "Up to 150 Guests",           desc: "Pool deck + lounging area combined" },
  { Icon: Sun,        label: "Poolside Lounge Seating",    desc: "Sun chairs, umbrellas & shade cabanas" },
  { Icon: ShieldCheck,label: "Safety Compliant",           desc: "Trained lifeguard on duty at all times" },
  { Icon: Music,      label: "Waterproof Sound System",   desc: "Bluetooth-ready poolside speakers" },
  { Icon: Clock,      label: "Evening Lighting",           desc: "Underwater LED ambiance for night events" },
];

const FALLBACK_HERO_IMAGE = "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=1920&h=1080&fit=crop&auto=format";

const PACKAGES = [
  {
    name: "Splash",
    hours: "4 Hours",
    price: "₱8,000",
    features: ["Up to 60 guests", "Pool access only", "Basic lounge chairs", "Parking access"],
    highlight: false,
  },
  {
    name: "Wave",
    hours: "8 Hours",
    price: "₱15,000",
    features: ["Up to 100 guests", "Pool + full deck access", "Lounge chairs & umbrellas", "Poolside bar setup", "Bluetooth sound system", "Safety lifeguard"],
    highlight: true,
  },
  {
    name: "Tide",
    hours: "12 Hours",
    price: "₱22,000",
    features: ["Up to 150 guests", "Full pool & deck access", "Premium lounge furniture", "Poolside bar + fridge", "Pro sound system", "Evening LED lighting", "Dedicated coordinator"],
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

export default function PoolPage() {
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

  const galleryPhotos = (content.poolGallery.length ? content.poolGallery : GALLERY.map(item => item.src)).map((src, index) => ({
    src,
    thumb: src,
    alt: GALLERY[index % GALLERY.length]?.alt ?? "Pool venue photo",
    caption: GALLERY[index % GALLERY.length]?.caption ?? "Pool photo",
    size: GALLERY[index % GALLERY.length]?.size ?? "normal",
  }));
  const amenities = content.poolAmenities.length ? content.poolAmenities.map((label, index) => ({
    Icon: AMENITIES[index % AMENITIES.length].Icon,
    label,
    desc: AMENITIES[index % AMENITIES.length].desc,
  })) : AMENITIES;
  const packageCards = content.poolPackages.length ? content.poolPackages : PACKAGES;
  const heroImage = content.poolImage || FALLBACK_HERO_IMAGE;

  const openLightbox = (i: number) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () => setLightboxIdx(i => (i === null ? null : (i - 1 + galleryPhotos.length) % galleryPhotos.length));
  const nextPhoto = () => setLightboxIdx(i => (i === null ? null : (i + 1) % galleryPhotos.length));

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#111] font-sans overflow-x-hidden">
      <SEO
        title={"Swimming Pool"}
        description={content.poolIntro || undefined}
        image={heroImage}
        url={typeof window !== "undefined" ? window.location.href : "/venues/pool"}
      />
      <Nav transparent />

      {/* Hero */}
      <section ref={heroRef} className="relative h-[75vh] min-h-[540px] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-[1.1]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#051015]/55 via-[#051015]/25 to-[#051015]/72 z-10" />
          <img
            src={heroImage}
            alt="Felizardo's Swimming Pool — resort-style tropical pool"
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
            className="inline-flex items-center gap-2 text-[#9DD4E8] text-[11px] tracking-[0.45em] uppercase mb-5 font-medium"
          >
            <span className="w-6 h-px bg-[#9DD4E8]/50" />
            Venue 02
            <span className="w-6 h-px bg-[#9DD4E8]/50" />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-[1.05] mb-6"
          >
            Swimming Pool
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.75 }}
            className="text-white/65 text-[17px] max-w-lg leading-relaxed mb-10"
          >
            {content.poolIntro || "A resort-style tropical paradise for pool parties, family celebrations, team events, and sunset gatherings."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a href="#gallery" className="px-8 py-3.5 bg-[#1A6080] text-white rounded-full text-[13px] font-medium tracking-wide hover:bg-[#1D748F] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1A6080]/40">
              View Gallery
            </a>
            <a href="/#contact" className="px-8 py-3.5 bg-white/12 backdrop-blur-sm text-white border border-white/25 rounded-full text-[13px] font-medium tracking-wide hover:bg-white/20 transition-all duration-300">
              Check Availability
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="bg-[#0D2A38]">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "150",     label: "Max Guests" },
            { value: "25m",     label: "Pool Length" },
            { value: "4–12",   label: "Hours Available" },
            { value: "Always", label: "Lifeguard on Duty" },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div>
                <div className="font-display text-[34px] font-bold text-[#9DD4E8] leading-none mb-1.5">{s.value}</div>
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
            <span className="text-[#1A6080] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">About the Venue</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Dive Into<br />Tropical Celebration
            </h2>
            <p className="text-[#555] leading-relaxed mb-5 text-[16px]">
              {content.poolDescription || "Our resort-style Swimming Pool turns any gathering into a sunlit tropical paradise. With crystal-clear water, a wide surrounding deck, and lush greenery framing every angle, the pool area creates an instantly festive and carefree atmosphere."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {(content.poolAmenities.length ? content.poolAmenities : [
                "Crystal-clear filtered water",
                "Wide surrounding deck",
                "Floating décor available",
                "Pool bar & refreshments",
                "Underwater LED lighting",
                "Changing rooms & showers",
              ]).map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[14px] text-[#444]">
                  <span className="w-5 h-5 rounded-full bg-[#E0F2FA] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#1A6080]" />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </FadeUp>

          <ScaleIn>
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-2xl aspect-[3/4] bg-sky-100 row-span-2 group cursor-pointer" onClick={() => openLightbox(1)}>
                <img
                  src="https://images.unsplash.com/photo-1780631742148-13fe417205d9?w=600&h=800&fit=crop&auto=format"
                  alt="Infinity pool party with tropical floaties"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-sky-50 group cursor-pointer" onClick={() => openLightbox(2)}>
                <img
                  src="https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&h=400&fit=crop&auto=format"
                  alt="Lounge chairs near tropical pool"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-sky-100 group cursor-pointer" onClick={() => openLightbox(5)}>
                <img
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop&auto=format"
                  alt="Pool deck lounge chairs"
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
            <span className="text-[#1A6080] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Amenities</span>
            <h2 className="font-display text-4xl font-bold">Everything Included</h2>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {amenities.map(({ Icon, label, desc }, i) => (
              <FadeUp key={`${label}-${i}`} delay={i * 0.07}>
                <div className="bg-white rounded-2xl p-6 border border-[#E4DFCF] hover:border-[#9DD4E8] hover:shadow-md transition-all duration-300 flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FA] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0D2A38] transition-colors duration-300">
                    <Icon className="text-[#1A6080] group-hover:text-white transition-colors duration-300 w-[18px] h-[18px]" />
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
          <span className="text-[#1A6080] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Photo Gallery</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">The Pool in Every Light</h2>
          <p className="text-[#666] mt-4 max-w-xl mx-auto text-[15px] leading-relaxed">
            From sun-drenched afternoon parties to glittering evening soirées — see how the pool transforms for every occasion.
          </p>
        </FadeUp>

        <div className="columns-2 md:columns-3 gap-4">
          {galleryPhotos.map((photo, i) => (
            <FadeUp key={`${photo.src}-${i}`} delay={i * 0.05} className="break-inside-avoid mb-4">
              <div
                className={`overflow-hidden rounded-xl bg-sky-100 group cursor-pointer relative ${
                  photo.size === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"
                }`}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={photo.thumb}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-[#051015]/0 group-hover:bg-[#051015]/45 transition-all duration-400 flex items-end p-4">
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
            <span className="text-[#1A6080] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Pricing</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Pool Packages</h2>
            <p className="text-[#666] mt-4 text-[15px]">All packages include lifeguard and basic setup. Add-ons available.</p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {packageCards.map((pkg, i) => (
              <FadeUp key={`${pkg.name}-${i}`} delay={i * 0.1}>
                <div className={`rounded-2xl p-7 h-full flex flex-col transition-all duration-300 ${
                  pkg.highlight
                    ? "bg-[#0D2A38] text-white shadow-2xl shadow-[#0D2A38]/30 scale-[1.02]"
                    : "bg-white border border-[#E4DFCF] hover:border-[#9DD4E8] hover:shadow-lg"
                }`}>
                  {pkg.highlight && (
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#9DD4E8] font-medium mb-3 block">Most Popular</span>
                  )}
                  <div className="mb-5">
                    <h3 className={`font-display text-2xl font-bold mb-1 ${pkg.highlight ? "text-white" : ""}`}>{pkg.name}</h3>
                    <p className={`text-[13px] ${pkg.highlight ? "text-white/55" : "text-[#999]"}`}>{pkg.hours}</p>
                  </div>
                  <div className={`text-4xl font-display font-bold mb-7 ${pkg.highlight ? "text-[#9DD4E8]" : "text-[#1A6080]"}`}>
                    {pkg.price}
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-8">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-[14px]">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          pkg.highlight ? "bg-[#9DD4E8]/20" : "bg-[#E0F2FA]"
                        }`}>
                          <Check className={`w-2.5 h-2.5 ${pkg.highlight ? "text-[#9DD4E8]" : "text-[#1A6080]"}`} />
                        </span>
                        <span className={pkg.highlight ? "text-white/75" : "text-[#555]"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/#contact"
                    className={`block text-center py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all duration-300 ${
                      pkg.highlight
                        ? "bg-[#9DD4E8] text-[#051015] hover:bg-[#B3DCF0]"
                        : "bg-[#0D2A38] text-white hover:bg-[#1A6080]"
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
            src="https://images.unsplash.com/photo-1780631742148-13fe417205d9?w=1920&h=600&fit=crop&auto=format"
            alt="Pool party aerial view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#051015]/75" />
        </div>
        <div className="relative z-10 text-center px-6">
          <FadeUp>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
              Reserve the Pool
            </h2>
            <p className="text-white/60 text-[16px] max-w-md mx-auto mb-9">
              Weekend dates book fast. Secure yours now with a quick inquiry — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0D2A38] px-9 py-4 rounded-full font-medium text-[13px] tracking-wide hover:bg-[#E0F2FA] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group"
              >
                Check Availability
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/venues/pavilion"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/25 px-9 py-4 rounded-full font-medium text-[13px] tracking-wide hover:bg-white/18 transition-all duration-300"
              >
                View the Pavilion
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />

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
