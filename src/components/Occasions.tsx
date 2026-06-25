import React from "react";
import { OCCASIONS } from "../data";
import { CalendarHeart, MessageSquareCode } from "lucide-react";

interface OccasionsProps {
  onSelectOccasion: (category: string) => void;
}

export default function Occasions({ onSelectOccasion }: OccasionsProps) {
  const handleOccasionClick = (id: string, name: string) => {
    // Depending on what was clicked, translate to categories:
    let categoryEquivalent = "All";
    if (id === "birthday") categoryEquivalent = "Birthday Decorations";
    else if (id === "anniversary") categoryEquivalent = "Anniversary Gifts";
    else if (id === "marriage") categoryEquivalent = "Wedding Decorations";
    else if (id === "romance") categoryEquivalent = "Roses";
    else if (id === "housewarming") categoryEquivalent = "Indoor Plants";
    else if (id === "congrats") categoryEquivalent = "Fresh Flowers";

    onSelectOccasion(categoryEquivalent);

    const ele = document.getElementById("featured-products-section");
    if (ele) {
      ele.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-10 bg-slate-50/50" id="occasions-section">
      <div className="max-w-[1600px] w-full mx-auto px-6">
        
        {/* Section Title */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-block bg-[#82862F] text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3.5 py-1 rounded-sm">
            Moments We Cherish
          </div>
          <h3 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-slate-900">
            Shop Arrangements By Occasion
          </h3>
          <p className="text-sm text-slate-500 max-w-lg mx-auto font-light leading-relaxed">
            Handcrafted with love for every emotion. Click on any block to filter our fresh items designed specifically for the day.
          </p>
        </div>

        {/* Occasions grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="occasions-grid">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => handleOccasionClick(occ.id, occ.name)}
              className="bg-white rounded-sm overflow-hidden border border-slate-200/60 hover:shadow-lg transition-all duration-350 cursor-pointer group flex flex-col justify-between"
              id={`occasion-card-${occ.id}`}
            >
              {/* Image with zoom on hover */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center">
                {occ.image ? (
                  <img
                    src={occ.image}
                    alt={occ.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 text-slate-350 flex flex-col items-center justify-center gap-2 p-4">
                    <CalendarHeart className="w-8 h-8 text-[#82862F] opacity-75" />
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Pune Showroom</span>
                  </div>
                )}
                {/* Visual flower symbol */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm text-[#82862F] px-3 py-1 rounded-sm text-[9px] uppercase font-bold tracking-wider">
                  ⚜️ Customize
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-[#82862F] transition-colors text-base font-sans">
                     {occ.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-light">
                    {occ.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-[#82862F] group-hover:underline flex items-center gap-1">
                    <span>Explore Collection</span>
                    <span>→</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                    Same-day Delivery
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
