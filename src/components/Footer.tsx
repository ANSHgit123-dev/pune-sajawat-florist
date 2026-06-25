import React from "react";
import { Flower, Instagram, MessageCircle, MapPin, Heart, ArrowUp, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickScroll = (id: string) => {
    const ele = document.getElementById(id);
    if (ele) {
      ele.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-stone-800" id="main-footer">
      <div className="max-w-[1600px] w-full mx-auto px-6">
        
        {/* Footer Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" id="footer-menu-grid">
          
          {/* Column 1: Brand story & Social details */}
          <div className="space-y-4" id="footer-brand-summary">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleScrollToTop}>
              <div className="px-2 py-0.5 bg-[#82862F] text-white rounded-sm text-[11px] font-sans font-black tracking-widest uppercase">
                pune
              </div>
              <h4 className="text-white font-sans font-extrabold text-base tracking-tight">
                Sajawat Florist
              </h4>
            </div>
            
            <p className="text-stone-400 text-xs leading-relaxed font-sans">
              Inspired by international floral styling, we stand as Pune's elite florist delivering premium hand bouquets, bespoke cakes, and luxurious drapes across Hadapsar, Kharadi, Viman Nagar, and wider Pune neighborhoods daily.
            </p>

            {/* Social Vectors link buttons */}
            <div className="flex items-center gap-3 pt-2" id="footer-social-icons">
              {/* Instagram link */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow us on Instagram for beautiful layouts"
                className="w-8.5 h-8.5 bg-stone-800 hover:bg-[#82862F] hover:text-white text-stone-400 rounded-sm flex items-center justify-center transition-colors"
                id="instagram-social-btn"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>

              {/* WhatsApp direct chat link */}
              <a
                href="https://api.whatsapp.com/send?phone=918484905722&text=Hello%20Pune%20Sajawat%20Florist!%20I%20saw%20your%20Instagram%20layout..."
                target="_blank"
                rel="noopener noreferrer"
                title="Direct Chat on WhatsApp"
                className="w-8.5 h-8.5 bg-stone-800 hover:bg-emerald-600 hover:text-white text-stone-400 rounded-sm flex items-center justify-center transition-colors"
                id="whatsapp-social-btn"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-current stroke-none" />
              </a>

              {/* Google Maps link */}
              <a
                href="https://www.google.co.in/maps/place/Pune+Sajawat+Florist/@18.5177036,73.9372658"
                target="_blank"
                rel="noopener noreferrer"
                title="Locate us on Google Maps"
                className="w-8.5 h-8.5 bg-stone-800 hover:bg-emerald-700 hover:text-white text-stone-400 rounded-sm flex items-center justify-center transition-colors"
                id="maps-social-btn"
              >
                <MapPin className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Floral/Decor categories list */}
          <div className="space-y-4" id="footer-categories-links">
            <h5 className="text-white font-mono uppercase text-xs tracking-widest font-bold">
              Gifting Categories
            </h5>
            <div className="flex flex-col gap-2.5 text-xs text-stone-400 font-medium">
              {[
                { name: "Sajawat Signature Roses", cat: "Roses" },
                { name: "Luxury Lilies & Car Bouquet", cat: "Bouquets" },
                { name: "Wedding Arch Decorations", cat: "Weddings" },
                { name: "Wedding Car Drapes Setup", cat: "Cars" },
                { name: "Self-Watering Indoor Foliage", cat: "Plants" },
                { name: "Fresh Baked Birthday Cakes", cat: "Cakes" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickScroll("categories-section")}
                  className="text-left hover:text-[#82862F] hover:underline transition-colors block"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Pune locations list */}
          <div className="space-y-4" id="footer-locations-links">
            <h5 className="text-white font-mono uppercase text-xs tracking-widest font-bold">
              Pune Delivery Areas
            </h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-stone-400">
              {["Kharadi", "Viman Nagar", "Kalyani Nagar", "Hadapsar", "Koregaon Park", "Baner", "Hinjawadi", "Aundh", "Magarpatta", "Camp"].map((area, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickScroll("hero")}
                  className="text-left hover:text-[#82862F] hover:underline transition-colors block"
                >
                  ⚜️ {area}
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Timings & Rapid Call details */}
          <div className="space-y-4" id="footer-timings-section">
            <h5 className="text-white font-mono uppercase text-xs tracking-widest font-bold">
              Rapid Quick Delivery
            </h5>
            <div className="space-y-3.5 text-xs text-stone-400 font-medium leading-relaxed">
              <p>
                ⏰ <span className="text-white font-bold">Office Hours:</span> <br />
                Daily 7:00 AM – 10:30 PM (No Offs)
              </p>
              <p>
                🛵 <span className="text-white font-bold">Express Same-Day delivery:</span> <br />
                Bookings accepted till 9:00 PM for Pune night surprises.
              </p>
              
              <div className="border-t border-stone-850 pt-3">
                <p className="text-[10px] uppercase font-mono tracking-widest text-stone-500 block mb-1">Direct Helpline</p>
                <a
                  href="tel:+918484905722"
                  className="text-white font-bold text-sm bg-stone-800 hover:bg-stone-750 px-3 py-1.5 rounded-sm inline-flex items-center gap-1.5 transition-colors border border-stone-700"
                >
                  <Phone className="w-3.5 h-3.5 text-[#82862F]" />
                  <span>+91 84849 05722</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Divider separator bar */}
        <div className="border-t border-stone-800 my-10" />

        {/* Bottom copyright metadata details */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-medium" id="copyright-bar">
          <div className="flex items-center gap-2.5">
            <span>© {currentYear} Sajawat Florist. Associated with India's best gifting channels.</span>
            <span className="text-stone-700 font-normal">|</span>
            <button 
              onClick={() => {
                window.history.pushState({}, "", "/admin");
                window.dispatchEvent(new PopStateEvent("popstate"));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} 
              className="text-stone-500 hover:text-rose-500 hover:underline transition-colors cursor-pointer text-[10.5px] font-semibold"
            >
              Florist Console 🔐
            </button>
            <span className="text-stone-700 font-normal">|</span>
            <button 
              onClick={() => {
                localStorage.removeItem("sajawat_catalog_products");
                window.dispatchEvent(new Event("sajawat_catalog_updated"));
                window.location.reload();
              }} 
              className="text-stone-500 hover:text-[#82862F] hover:underline transition-colors cursor-pointer text-[10.5px] font-semibold"
              title="Reset processed catalog and view onboarding statistics"
            >
              Reset & Re-run AI Scanner 🔄
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#FC8019] fill-[#FC8019]" />
            <span>for clients across Pune, Maharashtra.</span>
          </div>

          <button
            onClick={handleScrollToTop}
            className="p-2 rounded-sm bg-stone-800 hover:bg-[#82862F] text-stone-400 hover:text-white transition-all hover:-translate-y-0.5"
            aria-label="Scroll to top of Pune Sajawat"
            id="scroll-to-top-footer-btn"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
