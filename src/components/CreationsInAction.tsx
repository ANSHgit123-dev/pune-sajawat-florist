import React, { useState, useRef } from "react";
import { Play, Volume2, VolumeX, MessageCircle, Sparkles, Film, ArrowRight } from "lucide-react";
import { MediaItem } from "../types";

interface CreationsInActionProps {
  videos: MediaItem[];
}

export default function CreationsInAction({ videos }: CreationsInActionProps) {
  const [mutedStates, setMutedStates] = useState<{ [id: string]: boolean }>({});
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const videoRefs = useRef<{ [id: string]: HTMLVideoElement | null }>({});

  if (!videos || videos.length === 0) {
    return null; // hide section if no promotional videos exist
  }

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (video) {
      const currentMuted = video.muted;
      video.muted = !currentMuted;
      setMutedStates((prev) => ({ ...prev, [id]: !currentMuted }));
    }
  };

  const handleWhatsAppConsult = (videoName: string) => {
    const cleanName = videoName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    const phoneNumber = "918484905722";
    const text = encodeURIComponent(
      `Hello Pune Sajawat Florist! I watched your creations-in-action video clip: "${cleanName}". Can I custom order a similar arrangement setup in Pune?`
    );
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, "_blank");
  };

  return (
    <section className="py-14 bg-stone-950 text-white relative overflow-hidden" id="creations-reels-section">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#82862F]/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[#82862F] font-bold text-xs uppercase tracking-[0.2em] bg-[#82862F]/10 px-3 py-1 rounded-sm">
              <Film className="w-3.5 h-3.5" />
              <span>LIVE CREATIONS SHORTS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white flex items-center gap-2">
              Creations In Action <Sparkles className="w-5 h-5 text-[#82862F] animate-pulse" />
            </h3>
            <p className="text-xs text-stone-400 max-w-md">
              Watch real-time setups and cinematic captures of our bespoke flower arrangements and birthday parties right from Pune.
            </p>
          </div>
          <span className="text-xs text-stone-500 font-mono hidden md:block">
            {videos.length} live clips found
          </span>
        </div>

        {/* Reels Horizontal Scroll Container */}
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {videos.map((video) => {
            const isMuted = mutedStates[video.id] !== false; // default muted is true
            const cleanTitle = video.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
            
            return (
              <div 
                key={video.id}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start bg-stone-900 border border-stone-850 rounded-3xl overflow-hidden hover:border-[#82862F]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                
                {/* Video container */}
                <div className="aspect-[9/16] relative bg-black flex items-center justify-center overflow-hidden">
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    src={video.url}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                  />

                  {/* Dark transparent gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />

                  {/* Top corner control (mute) */}
                  <button
                    onClick={(e) => toggleMute(video.id, e)}
                    className="absolute top-4 right-4 p-2 bg-stone-950/70 hover:bg-stone-850 text-white rounded-full z-20 transition-transform hover:scale-105 cursor-pointer backdrop-blur-xs"
                    title={isMuted ? "Unmute sound" : "Mute sound"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Details Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-left space-y-2 z-10">
                    <span className="text-[8.5px] bg-[#82862F] text-white px-2 py-0.5 rounded-sm font-mono font-bold tracking-widest uppercase inline-block">
                      Pune Setup
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm leading-snug text-white font-serif line-clamp-2">
                      {cleanTitle}
                    </h4>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-4 bg-stone-900 border-t border-stone-850 space-y-3">
                  <p className="text-[10px] text-stone-400 font-light leading-relaxed">
                    Love this arrangement style? We can custom craft a similar setup for your Pune event.
                  </p>
                  
                  <button
                    onClick={() => handleWhatsAppConsult(video.name)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] uppercase tracking-widest font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-97"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>Inquire Price</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
