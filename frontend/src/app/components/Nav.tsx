import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#venues",   label: "Venues" },
  { href: "/#gallery",  label: "Gallery" },
  { href: "/#events",   label: "Events" },
  { href: "/#about",    label: "About" },
  { href: "/#contact",  label: "Contact" },
];

export default function Nav({ transparent = false }: { transparent?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = transparent && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !transparent
          ? "bg-white/92 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)] py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className={`flex flex-col leading-none transition-colors duration-400 ${
            dark ? "text-white" : "text-[#1E3A1E]"
          }`}
        >
          <span className="font-display text-[15px] tracking-[0.22em] font-bold">FELIZARDO'S</span>
          <span className="text-[9px] tracking-[0.45em] font-medium opacity-60 mt-0.5">EVENT PLACE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={isHome ? l.href.replace("/#", "#") : l.href}
              className={`text-[13px] tracking-wide transition-all duration-300 hover:opacity-100 ${
                dark ? "text-white/75 hover:text-white" : "text-[#444] hover:text-[#1E3A1E]"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={isHome ? "#contact" : "/#contact"}
            className={`px-5 py-2.5 text-[13px] font-medium tracking-wide rounded-full transition-all duration-300 ${
              dark
                ? "bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25"
                : "bg-[#1E3A1E] text-white hover:bg-[#2D5016] hover:shadow-md"
            }`}
          >
            Book Now
          </a>
        </nav>

        <button
          className={`md:hidden transition-colors duration-300 ${dark ? "text-white" : "text-[#1E3A1E]"}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/96 backdrop-blur-xl border-t border-black/5 px-6 py-6 flex flex-col gap-3"
        >
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={isHome ? l.href.replace("/#", "#") : l.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#333] hover:text-[#1E3A1E] transition-colors py-2 text-sm tracking-wide border-b border-black/5 last:border-0"
            >
              {l.label}
            </a>
          ))}
          <a
            href={isHome ? "#contact" : "/#contact"}
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-[#1E3A1E] text-white px-5 py-3.5 rounded-full text-sm font-medium text-center"
          >
            Book Now
          </a>
        </motion.div>
      )}
    </header>
  );
}
