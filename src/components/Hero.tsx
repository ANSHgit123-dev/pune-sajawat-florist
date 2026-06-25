import React from "react";
import { MessageCircle, ShieldCheck, Clock, Flower } from "lucide-react";
import { Product, CmsSettings } from "../types";

interface HeroProps {
  onExploreProducts: () => void;
  cmsSettings: CmsSettings;
  products: Product[];
}

export default function Hero({ onExploreProducts, cmsSettings, products }: HeroProps) {
  // Find banner product
  const bannerProduct = products.find(p => cmsSettings.homepage.bannerProductIds.includes(p.id)) || products[0];

  const startWhatsAppChat = () => {
    const phoneNumber = "918484905722";
    const text = encodeURIComponent(
      "Hello Pune Sajawat Florist! I am visiting your website. I want to discuss order and delivery options in Pune."
    );
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, "_blank");
  };

  const bannerImageUrl = bannerProduct?.image || "";
  const bannerTitle = bannerProduct?.title || bannerProduct?.name || "Premium Floral Arrangement";
  const bannerDesc = bannerProduct?.description || "Freshly custom-crafted bouquet hand-arranged with designer floral accents.";
  const bannerCategory = bannerProduct?.category || "Premium Gifting";

  return (
    <section className="relative overflow-hidden bg-[#FDFDFB] py-14 lg:py-20" id="hero">
      {/* 1. Large background floral illustrations with very low opacity */}
      <div className="absolute top-6 left-6 -z-10 w-72 h-72 opacity-[0.03] text-[#046142] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M50 0 C60 15 85 20 85 45 C85 65 65 75 50 100 C35 75 15 65 15 45 C15 20 40 15 50 0 Z" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 -z-10 w-96 h-96 opacity-[0.03] text-[#046142] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M50 0 C60 25 100 40 80 75 C60 100 40 100 20 75 C0 40 40 25 50 0 Z" />
        </svg>
      </div>

      {/* 2. Soft floral background gradient glow */}
      <div className="absolute top-0 right-0 -z-10 w-[450px] h-[450px] bg-[#ee7d99]/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-[350px] h-[350px] bg-[#046142]/5 rounded-full blur-3xl opacity-40 pointer-events-none" />

      {/* 3. Small floating decorative flower/petal elements around hero */}
      <div className="absolute top-12 left-10 w-6 h-6 opacity-[0.14] blur-[0.3px] float-p1 select-none pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#ee7d99" className="w-full h-full">
          <path d="M 50,0 C 70,25 90,50 70,75 C 50,90 30,90 10,75 C -10,50 10,25 50,0 Z" />
        </svg>
      </div>
      <div className="absolute bottom-24 left-[20%] w-8 h-8 opacity-[0.10] blur-[0.6px] float-p2 select-none pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#046142" className="w-full h-full">
          <path d="M 10,50 C 30,20 70,20 90,50 C 70,80 30,80 10,50 Z" />
        </svg>
      </div>
      <div className="absolute top-28 right-[42%] w-5 h-5 opacity-[0.16] blur-[0.3px] float-p3 select-none pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#ee7d99" className="w-full h-full">
          <path d="M 50,0 C 70,25 90,50 70,75 C 50,90 30,90 10,75 C -10,50 10,25 50,0 Z" />
        </svg>
      </div>
      <div className="absolute bottom-16 right-[15%] w-9 h-9 opacity-[0.12] blur-[0.7px] float-p4 select-none pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#046142" className="w-full h-full">
          <path d="M 50,0 C 80,20 100,50 80,80 C 60,100 40,100 20,80 C 0,50 20,20 50,0 Z" />
        </svg>
      </div>
      <div className="absolute top-[60%] left-6 w-4 h-4 opacity-[0.15] float-p5 select-none pointer-events-none">
        <Flower className="w-full h-full text-[#ee7d99]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Brand Details */}
          <div className="lg:col-span-7 space-y-7 text-left" id="hero-text-block">
            {/* Logo and Brand Header aligned together */}
            <div className="flex items-center gap-3.5 select-none" id="hero-brand-header">
              <img
                src="/logo.png"
                alt="Pune Sajawat Florist Logo"
                className="h-[55px] sm:h-[65px] md:h-[75px] w-auto object-contain bg-transparent border-none shadow-none"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-['Outfit'] uppercase tracking-wider leading-none flex items-center gap-1 select-none">
                  <span className="text-[#046142]">PUNE</span>
                  <span className="text-[#046142]">SAJAWAT</span>
                  <span className="text-[#ee7d99]">FLORIST</span>
                </h1>
                <span className="text-[9.5px] md:text-[11px] font-sans font-bold uppercase tracking-widest text-[#046142]/65 mt-1 select-none">
                  Premium Flowers & Gifts in Pune
                </span>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-slate-900 leading-[1.12]">
                Fresh Flowers & <br />
                <span className="text-[#ee7d99] italic font-serif font-light">Bespoke Gifting</span> <br />
                Crafted For <span className="text-[#046142]">Pune</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-light leading-relaxed">
                Delight your loved ones with hand-designed luxury bouquets, gourmet gift hampers, fresh custom cakes, and elegant event decorations. Lovingly curated by master designers and hand-delivered same-day across Hadapsar, Kharadi, Koregaon Park, and all of Pune.
              </p>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-550" id="hero-feature-tags">
              {["Fresh Bouquets", "Luxury Car Arrangement", "Midnight Cakes", "Same-Day 90 Mins Delivery"].map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#046142]/5 border border-[#046142]/10 rounded-sm text-[9px] uppercase tracking-wider font-extrabold text-[#046142]"
                >
                  ⚜️ {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2" id="hero-action-buttons">
              <button
                onClick={onExploreProducts}
                className="px-7 py-3.5 bg-[#046142] hover:bg-[#035037] text-white rounded-md transition-colors uppercase text-xs font-bold tracking-widest cursor-pointer shadow-md shadow-[#046142]/10 text-center"
                id="hero-shop-btn"
              >
                <span>Shop Collections</span>
              </button>
              <button
                onClick={startWhatsAppChat}
                className="px-7 py-3.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all uppercase text-xs font-bold tracking-widest flex items-center justify-center gap-2 cursor-pointer text-center"
                id="hero-whatsapp-btn"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-white stroke-none" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Featured Bouquet Image with Badges */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0 overflow-visible mt-8 lg:mt-0" id="hero-graphic-block">
            {bannerImageUrl && (
              <div className="relative p-2.5">
                {/* Main Bouquet Card */}
                <div className="rounded-2xl overflow-hidden border border-stone-200/50 shadow-[0_20px_50px_rgba(4,97,66,0.12)] relative group max-h-[420px] md:max-h-[480px]">
                  <img
                    src={bannerImageUrl}
                    alt={bannerTitle}
                    referrerPolicy="no-referrer"
                    className="w-full object-cover aspect-square sm:aspect-[4/5] object-center group-hover:scale-105 transition-transform duration-750"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-stone-950/15 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-sans text-left">
                    <span className="px-2 py-0.5 bg-[#ee7d99] text-white font-mono text-[8.5px] uppercase tracking-widest rounded-sm font-bold inline-block mb-1.5">
                      {bannerCategory}
                    </span>
                    <p className="font-serif text-base font-bold">{bannerTitle}</p>
                    <p className="text-[10px] text-white/80 mt-1 font-light font-sans leading-snug">{bannerDesc}</p>
                  </div>
                </div>

                {/* Floating Badge: Same Day Delivery */}
                <div 
                  className="absolute -top-3 -left-3 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-stone-100 flex items-center gap-2.5 animate-bounce-subtle" 
                  id="floating-badge-same-day"
                >
                  <div className="w-8.5 h-8.5 rounded-full bg-[#ee7d99]/10 flex items-center justify-center text-[#ee7d99] shrink-0">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="text-[8.5px] text-[#046142] font-black uppercase tracking-wider block">Express Shipping</span>
                    <span className="text-[10.5px] font-black text-slate-800">Same Day Delivery</span>
                  </div>
                </div>

                {/* Floating Badge: Trusted by 1200+ Customers */}
                <div 
                  className="absolute -bottom-3 -right-3 bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-stone-100 flex items-center gap-2.5 animate-pulse-subtle" 
                  id="floating-badge-trusted"
                >
                  <div className="w-8.5 h-8.5 rounded-full bg-[#046142]/10 flex items-center justify-center text-[#046142] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="text-[11.5px] font-black text-slate-800 block leading-none">Trusted by 1200+</span>
                    <span className="text-[9.5px] text-[#046142] font-bold block mt-1 uppercase tracking-wider">Happy Customers</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Animations CSS */}
      <style>{`
        @keyframes floatPetal1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(6deg); }
        }
        @keyframes floatPetal2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-10deg); }
        }
        @keyframes floatPetal3 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-4deg); }
        }
        @keyframes floatPetal4 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(18px) rotate(8deg); }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulseSubtle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.96; }
        }
        
        .float-p1 { animation: floatPetal1 6s ease-in-out infinite; }
        .float-p2 { animation: floatPetal2 8s ease-in-out infinite; }
        .float-p3 { animation: floatPetal3 7s ease-in-out infinite; }
        .float-p4 { animation: floatPetal4 9s ease-in-out infinite; }
        .float-p5 { animation: floatPetal1 5s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounceSubtle 4.5s ease-in-out infinite; }
        .animate-pulse-subtle { animation: pulseSubtle 5.5s ease-in-out infinite; }
        
        .animate-spin-slow {
          animation: spinSlow 15s linear infinite;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
