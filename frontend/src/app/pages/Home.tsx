import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import {
  MapPin, Phone, Mail, ChevronDown,
  Star, ArrowRight, Check, Clock,
  Sparkles, Camera, Trees, Users, Instagram, Facebook, Shield,
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FadeUp, ScaleIn } from "../components/shared";
import { contentService } from "../services/contentService";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "../utils/adminData";
import { scheduleService } from "../services/scheduleService";

const IMGS = {
  hero:      "https://images.unsplash.com/photo-1778514253639-3bd14410db8b?w=1920&h=1080&fit=crop&auto=format",
  pavilion:  "https://images.unsplash.com/photo-1767131626424-c4ab452bb34b?w=1200&h=900&fit=crop&auto=format",
  pavilion2: "https://images.unsplash.com/photo-1665607437981-973dcd6a22bb?w=900&h=600&fit=crop&auto=format",
  pool:      "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=1200&h=900&fit=crop&auto=format",
  pool2:     "https://images.unsplash.com/photo-1549294413-26f195200c16?w=900&h=600&fit=crop&auto=format",
  cta:       "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=1920&h=800&fit=crop&auto=format",
  g1:        "https://images.unsplash.com/photo-1561593367-66c79c2294e6?w=600&h=900&fit=crop&auto=format",
  g2:        "https://images.unsplash.com/photo-1533120921505-7f40f5237ee1?w=600&h=420&fit=crop&auto=format",
  g3:        "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=600&h=420&fit=crop&auto=format",
  g4:        "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=600&h=900&fit=crop&auto=format",
  g5:        "https://images.unsplash.com/photo-1773916793372-d52e7294e6cf?w=600&h=420&fit=crop&auto=format",
  g6:        "https://images.unsplash.com/photo-1741810356659-db8319beef3e?w=600&h=420&fit=crop&auto=format",
};

export default function Home() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  
  // Form State
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    title: "", // event type
    date: "",
    facilityId: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("idle");
    try {
      const res = await scheduleService.createInquiry({
        ...formData,
        facilityId: formData.facilityId || "pavilion", // default fallback
        startTime: "09:00",
        endTime: "17:00",
        status: "pending",
      });
      if (res.success) {
        setFormStatus("success");
        setFormData({ clientName: "", phone: "", email: "", title: "", date: "", facilityId: "", notes: "" });
      } else {
        setFormStatus("error");
      }
    } catch (err) {
      console.error(err);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY    = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    contentService.get().then(res => {
      if (res.success && res.data) {
        setContent(prev => ({ ...prev, ...res.data }));
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#111] font-sans overflow-x-hidden">
      <Nav transparent />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] overflow-hidden">
        <motion.div style={{ y: heroImgY }} className="absolute inset-0 scale-[1.12]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A0B]/60 via-[#0B1A0B]/40 to-[#0B1A0B]/65 z-10" />
          <img
            src={IMGS.hero}
            alt="Felizardo's Event Place — serene indoor-outdoor venue"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="inline-flex items-center gap-2 text-[#B8D4A0] text-[11px] tracking-[0.45em] uppercase mb-7 font-medium"
          >
            <span className="w-8 h-px bg-[#B8D4A0]/50" />
            {content.heroTagline}
            <span className="w-8 h-px bg-[#B8D4A0]/50" />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[88px] text-white font-bold leading-[1.04] max-w-5xl mb-8 whitespace-pre-line"
          >
            {content.heroTitle}
            <br />
            <em className="not-italic text-[#A8C88A]">{content.heroHighlight}</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.85 }}
            className="text-white/65 text-[17px] max-w-lg mb-10 leading-relaxed"
          >
            {content.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href="#contact"
              className="px-9 py-4 bg-[#2D5016] text-white rounded-full text-[13px] font-medium tracking-wide hover:bg-[#3A6B1E] transition-all duration-300 hover:shadow-xl hover:shadow-[#1E3A1E]/40 hover:-translate-y-0.5"
            >
              Book Your Event
            </a>
            <a
              href="#venues"
              className="px-9 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/25 rounded-full text-[13px] font-medium tracking-wide hover:bg-white/18 transition-all duration-300"
            >
              Explore Venues
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <ChevronDown className="text-white/40 w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <section className="bg-[#1A3319]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "200+", label: "Guests Capacity" },
            { value: "2",    label: "Exclusive Venues" },
            { value: "10+",  label: "Years of Excellence" },
            { value: "500+", label: "Events Hosted" },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div>
                <div className="font-display text-[40px] font-bold text-[#A8C88A] leading-none mb-2">{s.value}</div>
                <div className="text-white/45 text-[10px] tracking-[0.35em] uppercase">{s.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Venues Header ──────────────────────────────────── */}
      <section id="venues" className="pt-28 pb-4 px-6 text-center">
        <FadeUp>
          <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Our Venues</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Two Iconic Spaces</h2>
          <p className="text-[#666] mt-4 max-w-xl mx-auto leading-relaxed">
            Each venue offers a distinct atmosphere — choose the Pavilion's garden elegance or the Pool's tropical vibrancy.
          </p>
        </FadeUp>
      </section>

      {/* ── Pavilion ───────────────────────────────────────── */}
      <section className="py-20 lg:py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-center">
          <ScaleIn className="relative">
            <Link to="/venues/pavilion" className="block overflow-hidden rounded-2xl aspect-[4/3] bg-stone-200 group cursor-pointer">
              <img
                src={IMGS.pavilion}
                alt="Felizardo's Pavilion — open-air venue with lush garden backdrop"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm pointer-events-none">
              <span className="text-[11px] font-semibold text-[#1E3A1E] tracking-[0.25em] uppercase">The Pavilion</span>
            </div>
            <div className="absolute -bottom-5 -right-5 w-44 h-32 overflow-hidden rounded-xl border-4 border-[#F9F8F4] shadow-xl bg-stone-100 hidden lg:block pointer-events-none">
              <img src={IMGS.pavilion2} alt="Pavilion dining setup" className="w-full h-full object-cover" />
            </div>
          </ScaleIn>

          <FadeUp delay={0.12} className="lg:pl-4">
            <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Venue 01</span>
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-[1.08]">The Pavilion</h3>
            <p className="text-[#555] leading-relaxed mb-8 text-[17px] whitespace-pre-line">
              {content.pavilionDescription}
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Up to 200 guests (seated)",
                "Surrounded by manicured gardens",
                "Full catering kitchen access",
                "Customizable lighting & décor",
                "Dedicated event coordinator",
                "Ample on-site parking",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-[#444] text-[15px]">
                  <span className="w-5 h-5 rounded-full bg-[#EEF5E8] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#2D5016]" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#1E3A1E] text-white px-7 py-3.5 rounded-full text-[13px] font-medium hover:bg-[#2D5016] transition-all duration-300 group/b"
              >
                Inquire About Pavilion
                <ArrowRight className="w-4 h-4 transition-transform group-hover/b:translate-x-1" />
              </a>
              <Link
                to="/venues/pavilion"
                className="inline-flex items-center gap-2 border border-[#D4CBBA] text-[#444] px-7 py-3.5 rounded-full text-[13px] font-medium hover:border-[#2D5016] hover:text-[#1E3A1E] transition-all duration-300 group/v"
              >
                View Gallery
                <ArrowRight className="w-4 h-4 transition-transform group-hover/v:translate-x-1" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4CBBA] to-transparent" />
      </div>

      {/* ── Swimming Pool ───────────────────────────────────── */}
      <section className="py-20 lg:py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20 items-center">
          <FadeUp delay={0.12} className="order-2 lg:order-1 lg:pr-4">
            <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Venue 02</span>
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-[1.08]">Swimming Pool</h3>
            <p className="text-[#555] leading-relaxed mb-8 text-[17px] whitespace-pre-line">
              {content.poolDescription}
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Crystal-clear resort-style pool",
                "Spacious pool deck with lounge seating",
                "Safety-compliant facilities & lifeguards",
                "Poolside bar & refreshment area",
                "Ambient underwater evening lighting",
                "Changing rooms & shower facilities",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-[#444] text-[15px]">
                  <span className="w-5 h-5 rounded-full bg-[#EEF5E8] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#2D5016]" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#1E3A1E] text-white px-7 py-3.5 rounded-full text-[13px] font-medium hover:bg-[#2D5016] transition-all duration-300 group/b"
              >
                Inquire About Pool
                <ArrowRight className="w-4 h-4 transition-transform group-hover/b:translate-x-1" />
              </a>
              <Link
                to="/venues/pool"
                className="inline-flex items-center gap-2 border border-[#D4CBBA] text-[#444] px-7 py-3.5 rounded-full text-[13px] font-medium hover:border-[#2D5016] hover:text-[#1E3A1E] transition-all duration-300 group/v"
              >
                View Gallery
                <ArrowRight className="w-4 h-4 transition-transform group-hover/v:translate-x-1" />
              </Link>
            </div>
          </FadeUp>

          <ScaleIn className="relative order-1 lg:order-2">
            <Link to="/venues/pool" className="block overflow-hidden rounded-2xl aspect-[4/3] bg-sky-100 group cursor-pointer">
              <img
                src={IMGS.pool}
                alt="Felizardo's Swimming Pool — resort-style pool with tropical surroundings"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm pointer-events-none">
              <span className="text-[11px] font-semibold text-[#1E3A1E] tracking-[0.25em] uppercase">Swimming Pool</span>
            </div>
            <div className="absolute -bottom-5 -right-5 w-44 h-32 overflow-hidden rounded-xl border-4 border-[#F9F8F4] shadow-xl bg-sky-50 hidden lg:block pointer-events-none">
              <img src={IMGS.pool2} alt="Pool lounge chairs" className="w-full h-full object-cover" />
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────────────── */}
      <section id="gallery" className="py-24 lg:py-32 bg-[#F2F0EB]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Photo Gallery</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Moments Captured</h2>
          </FadeUp>

          <div className="columns-2 md:columns-3 gap-4" style={{ columnGap: "1rem" }}>
            {[
              { src: IMGS.g1, alt: "Elegant table setting with tall wine glasses",           aspect: "aspect-[3/4]" },
              { src: IMGS.g2, alt: "Fine outdoor dining setup under open sky",               aspect: "aspect-[4/3]" },
              { src: IMGS.g3, alt: "Festive table with candles and flowers",                 aspect: "aspect-[4/3]" },
              { src: IMGS.g4, alt: "Long-stem crystal wine glasses at reception",            aspect: "aspect-[3/4]" },
              { src: IMGS.g5, alt: "Bokeh fairy lights in lush tropical garden at night",   aspect: "aspect-[4/3]" },
              { src: IMGS.g6, alt: "Palm trees illuminated for an evening event",           aspect: "aspect-[4/3]" },
            ].map((img, i) => (
              <FadeUp key={i} delay={i * 0.06} className="break-inside-avoid mb-4">
                <div className={`overflow-hidden rounded-xl bg-stone-200 group cursor-pointer ${img.aspect}`}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" />
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="flex flex-col sm:flex-row justify-center gap-3 mt-10">
            <Link to="/venues/pavilion" className="inline-flex items-center justify-center gap-2 border border-[#D4CBBA] bg-white text-[#444] px-7 py-3 rounded-full text-[13px] font-medium hover:border-[#2D5016] hover:text-[#1E3A1E] transition-all duration-300 group">
              Pavilion Gallery <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/venues/pool" className="inline-flex items-center justify-center gap-2 border border-[#D4CBBA] bg-white text-[#444] px-7 py-3 rounded-full text-[13px] font-medium hover:border-[#2D5016] hover:text-[#1E3A1E] transition-all duration-300 group">
              Pool Gallery <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────────────── */}
      <section id="about" className="py-24 lg:py-32 px-6 max-w-7xl mx-auto">
        <FadeUp className="text-center mb-16">
          <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Why Choose Us</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            More Than a Venue —<br />An Experience
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { Icon: Sparkles, title: "Immersive Atmosphere",   desc: "Every corner is meticulously designed to feel effortlessly luxurious and deeply personal — a setting your guests will talk about for years." },
            { Icon: Users,    title: "Dedicated Event Team",   desc: "Our experienced coordinators work closely with you from inquiry to final cleanup, ensuring every detail exceeds your vision." },
            { Icon: Shield,   title: "Trusted for a Decade",   desc: "Over ten years of hosting hundreds of celebrations, we've built a reputation for consistency, professionalism, and genuine warmth." },
            { Icon: Trees,    title: "Scenic Natural Setting",  desc: "Nestled amid lush greenery, our venues offer a serene tropical escape that photographs beautifully and feels wonderfully alive." },
            { Icon: Camera,   title: "Built for Photography",   desc: "Every angle is crafted with visual storytelling in mind. Your photos will be as stunning as your memories." },
            { Icon: Clock,    title: "Flexible Packages",       desc: "Half-day, full-day, or multi-day bookings — with customizable add-ons tailored to your event and budget." },
          ].map(({ Icon, title, desc }, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div className="p-7 rounded-2xl border border-[#E4DFCF] bg-white hover:border-[#A8C88A] hover:shadow-lg hover:shadow-[#1E3A1E]/6 transition-all duration-400 group cursor-default">
                <div className="w-11 h-11 rounded-xl bg-[#EEF5E8] flex items-center justify-center mb-5 group-hover:bg-[#1E3A1E] transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#2D5016] group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="font-display font-bold text-[18px] mb-3">{title}</h4>
                <p className="text-[#666] text-[14px] leading-relaxed">{desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Event Types ────────────────────────────────────── */}
      <section id="events" className="py-24 bg-[#172E17] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-[#A8C88A] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Perfect For</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Every Occasion</h2>
          </FadeUp>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { emoji: "💍", label: "Weddings",            sub: "Intimate & Grand" },
              { emoji: "🎂", label: "Birthdays & Debuts",  sub: "All Ages Welcome" },
              { emoji: "🎓", label: "Graduations",          sub: "Honor the Milestone" },
              { emoji: "🏢", label: "Corporate Events",     sub: "Team & Client" },
              { emoji: "🏊", label: "Pool Parties",         sub: "Splash in Style" },
              { emoji: "🎉", label: "Reunions & Fiestas",  sub: "Family & Friends" },
            ].map((ev, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="bg-white/6 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/12 hover:border-[#A8C88A]/40 transition-all duration-300 cursor-pointer group">
                  <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 inline-block">{ev.emoji}</div>
                  <p className="text-white text-[13px] font-semibold mb-1">{ev.label}</p>
                  <p className="text-white/40 text-[11px]">{ev.sub}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="py-24 lg:py-32 px-6 max-w-7xl mx-auto">
        <FadeUp className="text-center mb-16">
          <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">What Our Clients Say</h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Maria Santos", event: "Wedding Reception · March 2024", initials: "MS",
              text: "Our wedding at Felizardo's was absolutely magical. The pavilion looked like a fairytale, the staff was incredibly attentive, and every detail was perfect. We couldn't have asked for a more beautiful venue." },
            { name: "Ricardo Cruz", event: "Corporate Team Building · January 2024", initials: "RC",
              text: "We used both the pavilion and pool for our company event. Top-notch facilities, stunning grounds, and a professional team that was accommodating throughout the entire day. Will definitely book again." },
            { name: "Ana Reyes", event: "18th Debut Party · September 2023", initials: "AR",
              text: "My daughter's debut exceeded every expectation. The venue transformed beautifully with our decorations, and the pool at night with all the lights was absolutely breathtaking. Highly recommend!" },
          ].map((r, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="bg-white border border-[#E4DFCF] rounded-2xl p-8 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-400 flex flex-col">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#C8A840] text-[#C8A840]" />
                  ))}
                </div>
                <p className="text-[#555] leading-relaxed text-[14px] flex-1 mb-6 italic">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#F0EDE6]">
                  <div className="w-10 h-10 rounded-full bg-[#EEF5E8] flex items-center justify-center text-[#2D5016] font-bold text-[13px] flex-shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[14px]">{r.name}</div>
                    <div className="text-[#999] text-[12px]">{r.event}</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Booking Process ─────────────────────────────────── */}
      <section className="py-24 lg:py-28 bg-[#F2F0EB] px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">How It Works</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Simple Booking Process</h2>
          </FadeUp>

          <div className="grid md:grid-cols-4 gap-10 relative">
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#C0D4B0] via-[#A8C88A] to-[#C0D4B0]" />
            {[
              { step: "01", title: "Reach Out",  desc: "Contact us via phone, email, or fill out our inquiry form with your event details and preferred date." },
              { step: "02", title: "Site Visit", desc: "Schedule a free venue tour to experience both spaces and discuss your vision with our event coordinator." },
              { step: "03", title: "Confirm",    desc: "Sign the booking agreement and secure your date with a reservation fee. Simple and transparent." },
              { step: "04", title: "Celebrate!", desc: "Arrive, relax, and create beautiful memories. Our team handles everything so you can be fully present." },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="text-center relative z-10">
                  <div className="w-12 h-12 rounded-full border-2 border-[#2D5016] bg-[#F2F0EB] flex items-center justify-center mx-auto mb-5">
                    <span className="font-display text-[13px] font-bold text-[#2D5016]">{s.step}</span>
                  </div>
                  <h4 className="font-display font-bold text-[17px] mb-2">{s.title}</h4>
                  <p className="text-[#666] text-[13px] leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMGS.cta} alt="Elegantly decorated event tables in the Pavilion" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A0B]/80 via-[#0B1A0B]/65 to-[#0B1A0B]/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <FadeUp>
            <span className="text-[#A8C88A] text-[11px] tracking-[0.45em] uppercase font-medium mb-5 block">Limited Dates Available</span>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-7 leading-[1.06]">
              Your Dream Event<br />Starts Here
            </h2>
            <p className="text-white/60 text-[17px] max-w-md mx-auto mb-10 leading-relaxed">
              Book your preferred date early. We host one event at a time — your celebration gets our full attention.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white text-[#1E3A1E] px-10 py-4 rounded-full font-medium text-[13px] tracking-wide hover:bg-[#EEF5E8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl group/c"
            >
              Check Availability
              <ArrowRight className="w-4 h-4 transition-transform group-hover/c:translate-x-1" />
            </a>
          </FadeUp>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────── */}
      <section id="contact" className="py-24 lg:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
          <FadeUp>
            <span className="text-[#2D5016] text-[11px] tracking-[0.45em] uppercase font-medium mb-4 block">Contact Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Let's Plan Your<br />Perfect Event
            </h2>
            <p className="text-[#555] leading-relaxed mb-10 text-[17px] max-w-md">
              Ready to book or just curious? Fill out the form and our team will respond within 24 hours to discuss your dream event.
            </p>
            <div className="space-y-6">
              {[
                { Icon: MapPin, label: "Location",    value: content.contactAddress },
                { Icon: Phone,  label: "Phone",        value: content.contactPhone },
                { Icon: Mail,   label: "Email",        value: content.contactEmail },
                { Icon: Clock,  label: "Office Hours", value: content.contactHours },
              ].map(({ Icon, label, value }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF5E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#2D5016]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#999] tracking-[0.2em] uppercase mb-0.5">{label}</div>
                    <div className="text-[#333] font-medium text-[15px]">{value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-[#E4DFCF]">
              <p className="text-[12px] text-[#999] mb-3 tracking-wide">Follow our events</p>
              <div className="flex gap-3">
                {[{ Icon: Instagram, label: "Instagram" }, { Icon: Facebook, label: "Facebook" }].map(({ Icon, label }) => (
                  <a key={label} href="#" aria-label={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E4DFCF] text-[#555] hover:border-[#A8C88A] hover:text-[#1E3A1E] transition-all duration-300 text-[13px]">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.14}>
            <div className="bg-white border border-[#E4DFCF] rounded-3xl p-8 shadow-sm">
              <h3 className="font-display text-[22px] font-bold mb-6">Send an Inquiry</h3>
              {formStatus === "success" && (
                <div className="mb-6 p-4 bg-[#EEF5E8] text-[#2D5016] rounded-xl border border-[#C0D4B0] text-[14px]">
                  Thank you for your inquiry! Our team will contact you within 24 hours.
                </div>
              )}
              {formStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-[14px]">
                  Something went wrong. Please try again or contact us directly.
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[11px] tracking-[0.2em] text-[#999] uppercase mb-1.5 block">Full Name *</label>
                    <input required name="clientName" value={formData.clientName} onChange={handleFormChange} type="text" placeholder="Maria Santos" className="w-full border border-[#E4DFCF] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition-all bg-[#FDFCF8] placeholder:text-[#bbb]" />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.2em] text-[#999] uppercase mb-1.5 block">Phone Number *</label>
                    <input required name="phone" value={formData.phone} onChange={handleFormChange} type="tel" placeholder="+63 912 345 6789" className="w-full border border-[#E4DFCF] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition-all bg-[#FDFCF8] placeholder:text-[#bbb]" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.2em] text-[#999] uppercase mb-1.5 block">Email Address *</label>
                  <input required name="email" value={formData.email} onChange={handleFormChange} type="email" placeholder="maria@example.com" className="w-full border border-[#E4DFCF] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition-all bg-[#FDFCF8] placeholder:text-[#bbb]" />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[11px] tracking-[0.2em] text-[#999] uppercase mb-1.5 block">Event Type</label>
                    <select name="title" value={formData.title} onChange={handleFormChange} className="w-full border border-[#E4DFCF] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition-all bg-[#FDFCF8] text-[#444] appearance-none cursor-pointer">
                      <option value="">Select type…</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday / Debut">Birthday / Debut</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Pool Party">Pool Party</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.2em] text-[#999] uppercase mb-1.5 block">Preferred Date *</label>
                    <input required name="date" value={formData.date} onChange={handleFormChange} type="date" className="w-full border border-[#E4DFCF] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition-all bg-[#FDFCF8] text-[#444]" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.2em] text-[#999] uppercase mb-1.5 block">Venue Preference *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "pavilion", label: "Pavilion" },
                      { id: "pool", label: "Pool" },
                      { id: "both", label: "Both Venues" }
                    ].map(v => (
                      <label key={v.id} className={`flex items-center justify-center gap-2 border rounded-xl px-3 py-2.5 text-[13px] cursor-pointer transition-all duration-200 ${formData.facilityId === v.id ? "border-[#2D5016] bg-[#EEF5E8]" : "border-[#E4DFCF] hover:border-[#2D5016] hover:bg-[#EEF5E8]"}`}>
                        <input required type="radio" name="facilityId" value={v.id} checked={formData.facilityId === v.id} onChange={handleFormChange} className="hidden" />
                        <span className="text-[#444]">{v.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.2em] text-[#999] uppercase mb-1.5 block">Message</label>
                  <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows={4} placeholder="Tell us about your event, expected number of guests, and any special requirements…" className="w-full border border-[#E4DFCF] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition-all resize-none bg-[#FDFCF8] placeholder:text-[#bbb]" />
                </div>
                <button disabled={isSubmitting} type="submit" className="w-full bg-[#1E3A1E] text-white py-4 rounded-xl text-[13px] font-medium tracking-wide hover:bg-[#2D5016] transition-all duration-300 hover:shadow-lg hover:shadow-[#1E3A1E]/20 active:scale-[0.99] disabled:opacity-70">
                  {isSubmitting ? "Sending..." : "Send Inquiry"}
                </button>
                <p className="text-center text-[12px] text-[#aaa]">We respond within 24 hours · No commitment required</p>
              </form>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
