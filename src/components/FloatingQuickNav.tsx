import React, { useState, useRef, useEffect } from "react";
import { Home, Flame, PhoneCall, MessageCircle, Flower } from "lucide-react";

/**
 * Redesigned Premium Floating Navigation Panel.
 * - Desktop/Tablet: Fixed right edge, vertically centered.
 * - Width: 65px only, keeping it sleek and unobtrusive.
 * - Auto-hide: Shows only a flower trigger at the right edge initially.
 * - Hover / click expands panel smoothly via sliding animation (300ms transition).
 * - Collapses 1 second after mouse leaves.
 * - Mobile: Hidden completely (only bottom right WhatsApp floating button is used).
 */
export default function FloatingQuickNav({
  scrollToSection,
  navigateTo,
  openWhatsApp,
}: {
  scrollToSection: (id: string) => void;
  navigateTo: (path: string) => void;
  openWhatsApp: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const startCloseTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const whatsappNumber = "918484905722";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=Hi%20Pune%20Sajawat,%20I%20want%20to%20order%20flowers`;

  const navItems = [
    {
      label: "Home",
      icon: <Home className="w-5 h-5 text-[#046142]" />,
      onClick: () => {
        navigateTo("/");
        scrollToSection("hero");
      },
    },
    {
      label: "Best Sellers",
      icon: <Flame className="w-5 h-5 text-[#046142]" />,
      onClick: () => scrollToSection("featured-products-section"),
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5 text-white fill-white" />,
      onClick: () => window.open(whatsappURL, "_blank"),
      special: true,
    },
    {
      label: "Call",
      icon: <PhoneCall className="w-5 h-5 text-[#046142]" />,
      onClick: () => window.open("tel:+918484905722", "_self"),
    },
  ];

  return (
    <>
      {/* Invisible Hover Zone on the Right Edge of screen to detect approach */}
      <div
        className="fixed right-0 top-0 bottom-0 w-5 z-35 hidden md:block"
        onMouseEnter={() => setIsOpen(true)}
      />

      {/* Flower Trigger Button (visible when collapsed) */}
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-l-full bg-gradient-to-br from-[#046142] to-[#ee7d99] flex items-center justify-center text-white shadow-lg transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(238,125,153,0.6)] group floating-quick-nav-desktop"
        style={{
          transform: `translateY(-50%) translateX(${isOpen ? "60px" : "0"})`,
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? "none" : "auto",
        }}
        title="Quick Navigation"
      >
        <Flower className="w-5 h-5 text-white animate-spin-slow group-hover:rotate-45 transition-transform duration-500" />
      </button>

      {/* Expanded Quick Nav Panel */}
      <div
        onMouseEnter={clearCloseTimer}
        onMouseLeave={startCloseTimer}
        className="fixed top-1/2 right-2.5 z-50 flex flex-col items-center py-4 px-2 w-[65px] bg-white/90 backdrop-blur-md border border-[#046142]/20 rounded-[35px] shadow-2xl transition-all duration-300 ease-in-out gap-3.5 floating-quick-nav-desktop"
        style={{
          transform: `translateY(-50%) translateX(${isOpen ? "0" : "100px"})`,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Flower logo/deco at top of panel */}
        <Flower className="w-5.5 h-5.5 text-[#ee7d99] animate-spin-slow" />

        {/* Buttons List */}
        <div className="flex flex-col gap-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              title={item.label}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                ${
                  item.special
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_15px_rgba(16,185,129,0.7)] animate-pulse-whatsapp"
                    : "bg-stone-50 hover:bg-[#046142]/10 text-[#046142] border border-stone-100 hover:border-[#046142]/10 shadow-sm"
                }
                hover:scale-110 active:scale-95`}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* Add custom CSS animations for pulse and slow rotation */}
        <style>{`
          @media (max-width: 1399px) {
            .floating-quick-nav-desktop {
              display: none !important;
            }
          }
          @media (min-width: 1400px) {
            .floating-quick-nav-desktop {
              display: flex !important;
            }
          }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spinSlow 12s linear infinite;
          }
          @keyframes pulseWhatsapp {
            0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(16,185,129,0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 16px rgba(16,185,129,0.7); }
          }
          .animate-pulse-whatsapp {
            animation: pulseWhatsapp 2.5s infinite ease-in-out;
          }
        `}</style>
      </div>
    </>
  );
}
