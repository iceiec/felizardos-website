import { Link } from "react-router";
import { MapPin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0E1E0E] text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 mb-16">
          <div>
            <div className="mb-6">
              <div className="font-display text-[17px] tracking-[0.22em] font-bold text-white">FELIZARDO'S</div>
              <div className="text-[9px] tracking-[0.45em] text-white/35 mt-1">EVENT PLACE</div>
            </div>
            <p className="text-white/45 text-[14px] leading-relaxed max-w-[220px] mb-8">
              Creating unforgettable celebrations in the heart of Batangas. Two stunning venues, one exceptional experience.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-[#A8C88A] hover:text-[#A8C88A] transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-5">Venues</h5>
            <ul className="space-y-3">
              <li><Link to="/venues/pavilion" className="text-white/55 text-[14px] hover:text-white transition-colors duration-200">The Pavilion</Link></li>
              <li><Link to="/venues/pool" className="text-white/55 text-[14px] hover:text-white transition-colors duration-200">Swimming Pool</Link></li>
              <li><a href="/#gallery" className="text-white/55 text-[14px] hover:text-white transition-colors duration-200">Photo Gallery</a></li>
              <li><a href="#" className="text-white/55 text-[14px] hover:text-white transition-colors duration-200">Event Packages</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-5">Events</h5>
            <ul className="space-y-3">
              {["Weddings", "Birthdays & Debuts", "Corporate Events", "Pool Parties", "Graduations"].map(item => (
                <li key={item}>
                  <a href="#" className="text-white/55 text-[14px] hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-5">Company</h5>
            <ul className="space-y-3">
              {["About Us", "Book Now", "Contact", "FAQs", "Privacy Policy"].map(item => (
                <li key={item}>
                  <a href="#" className="text-white/55 text-[14px] hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-[12px]">© 2025 Felizardo's Event Place. All rights reserved.</p>
          <div className="flex items-center gap-2 text-white/20 text-[12px]">
            <MapPin className="w-3 h-3" />
            Batangas, Philippines
          </div>
        </div>
      </div>
    </footer>
  );
}
