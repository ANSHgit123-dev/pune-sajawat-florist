import React from "react";

export default function AnnouncementBar() {
  return (
    <div 
      className="py-2.5 text-center text-xs font-semibold text-[#046142] tracking-wide select-none"
      style={{
        background: "linear-gradient(90deg, #fef9f3, #fffef9, #fef9f3)",
        borderBottom: "1px solid rgba(161, 150, 72, 0.2)"
      }}
      id="brand-announcement-bar"
    >
      <div className="max-w-[1600px] mx-auto px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 md:gap-x-12 select-none">
        <span className="flex items-center gap-1.5 select-none">
          <span>🌸</span>
          <span>Pune's Trusted Florist</span>
        </span>
        <span className="text-stone-300 select-none hidden md:inline">•</span>
        <span className="flex items-center gap-1.5 select-none">
          <span>🚚</span>
          <span>Same Day Delivery</span>
        </span>
        <span className="text-stone-300 select-none hidden md:inline">•</span>
        <span className="flex items-center gap-1.5 select-none">
          <span>⭐</span>
          <span>1200+ Happy Customers</span>
        </span>
        <span className="text-stone-300 select-none hidden md:inline">•</span>
        <span className="flex items-center gap-1.5 select-none">
          <span>💐</span>
          <span>Fresh Flowers Daily</span>
        </span>
      </div>
    </div>
  );
}
