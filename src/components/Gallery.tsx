import React, { useState } from "react";
import { GALLERY_ITEMS } from "../data";
import { Image, Eye, X, MessageCircleIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    title: string;
    category: string;
  } | null>(null);

  const filterTabs = ["All", "Bouquets", "Weddings", "Cars", "Birthdays"];

  const filteredItems = activeTab === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => {
        if (activeTab === "Cars" && item.category === "Cars") return true;
        if (activeTab === "Weddings" && item.category === "Weddings") return true;
        if (activeTab === "Bouquets" && item.category === "Bouquets") return true;
        if (activeTab === "Birthdays" && item.category === "Birthdays") return true;
        return false;
      });

  const handleConsult = (title: string) => {
    const phoneNumber = "918484905722";
    const text = encodeURIComponent(
      `Hello Pune Sajawat Florist! I saw this design in your website gallery: "${title}". Can you give me a custom price quote for a similar arrangement in Pune?`
    );
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, "_blank");
  };

  return (
    <section className="py-10 bg-stone-50/50" id="gallery-section">
      <div className="max-w-[1600px] w-full mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-brand-pink-600 font-bold text-xs uppercase tracking-widest bg-brand-pink-50 px-3 py-1 rounded-full">
            <Image className="w-3.5 h-3.5" />
            <span>REAL SETUP CAPTURES</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-stone-900">
            Pune Sajawat Design Gallery
          </h3>
          <p className="text-sm text-stone-500 max-w-lg mx-auto">
            Browse genuine photographs of recent weddings, customized car layouts, and elegant anniversary surprise deliveries in Pune.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" id="gallery-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-brand-pink-600 text-white shadow-md shadow-brand-pink-50"
                  : "bg-white border border-stone-250 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {tab === "Cars" ? "🚙 Car Decor" : tab === "Weddings" ? "💒 Weddings" : tab === "Birthdays" ? "🎈 Birthdays" : tab}
            </button>
          ))}
        </div>

        {/* Gallery Grid (with smooth entries) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-grid">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border-4 border-white shadow-sm hover:shadow-lg transition-all duration-300 aspect-[4/3] bg-stone-100"
              id={`gallery-item-${item.id}`}
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-5 text-white">
                <span className="self-start text-[10px] font-mono uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md backdrop-blur-sm">
                  {item.category}
                </span>
                
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm sm:text-base font-serif">{item.title}</h4>
                  <p className="text-[10px] text-white/80 uppercase font-mono tracking-widest flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Click to Zoom & Ask Price</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full screen lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 bg-stone-950/95 z-55 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo component */}
              <div className="md:w-3/5 aspect-4/3 md:aspect-auto md:min-h-96 relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info sidebar */}
              <div className="p-6 md:w-2/5 flex flex-col justify-between gap-6 bg-white">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-brand-pink-600 bg-brand-pink-50 px-2.5 py-1 rounded-md">
                      {selectedImage.category}
                    </span>
                    <h4 className="text-xl font-bold text-stone-900 font-serif mt-2.5">
                      {selectedImage.title}
                    </h4>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    This premium design is customisable based on your budget, venue sizing, and theme color choices. Our veteran florists can deliver or configure this across Pune same day.
                  </p>

                  <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-stone-600 text-xs font-mono">
                    <p className="flex justify-between"><span>🛠️ Config Time:</span> <span className="font-bold">2-4 Hours</span></p>
                    <p className="flex justify-between"><span>🚚 Delivery:</span> <span className="font-bold">Anywhere in Pune</span></p>
                    <p className="flex justify-between"><span>🌿 Freshness:</span> <span className="font-bold">7-Day Guarantee</span></p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleConsult(selectedImage.title)}
                    className="w-full py-3 bg-brand-green-600 hover:bg-brand-green-700 transition-colors text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm shadow-green-100 cursor-pointer"
                  >
                    <MessageCircleIcon className="w-4 h-4 fill-white stroke-none" />
                    <span>Get Price quote on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-full py-2.5 text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
