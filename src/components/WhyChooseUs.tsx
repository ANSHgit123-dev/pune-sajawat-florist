import React from "react";
import { Truck, Flower2, Gift, MapPin, MessageSquare, Award, ShieldCheck } from "lucide-react";
import { WHY_CHOOSE_US } from "../data";

// Icon components helper mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Truck: Truck,
  Flower2: Flower2,
  Gift: Gift,
  MapPin: MapPin,
  MessageSquare: MessageSquare,
  Award: Award
};

export default function WhyChooseUs() {
  return (
    <section className="py-10 bg-white" id="why-choose-us-section">
      <div className="max-w-[1600px] w-full mx-auto px-6">
        
        {/* Header content block */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-block bg-pink-600 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3.5 py-1 rounded-sm">
              The Sajawat Assurance
            </div>
            <h3 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-slate-900 leading-tight">
              Why Discerning Clients Choose Pune Sajawat Florist
            </h3>
          </div>
          <div className="lg:col-span-6">
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
              We started with a simple belief: flower delivery shouldn't just be a transaction; it should be a high-sensory artistic experience. From custom satin wrappers to sending you preparation photos on WhatsApp, here is why we lead gifting in Pune.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="why-choose-us-grid">
          {WHY_CHOOSE_US.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Flower2;
            return (
              <div
                key={index}
                className="p-6 rounded-sm border border-slate-100/80 hover:border-pink-200 bg-slate-50/40 hover:bg-white transition-all duration-300 group shadow-sm flex items-start gap-4"
                id={`advantage-card-${index}`}
              >
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-sm bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                  <IconComponent className="w-5.5 h-5.5 stroke-[1.8]" />
                </div>

                {/* Text Content */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Localized Pune Highlights and Metrics Banner */}
        <div className="mt-12 bg-rose-50/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-around items-center gap-6 border border-rose-100/30" id="local-trust-banner">
          <div className="text-center font-serif">
            <p className="text-3xl md:text-4xl font-black text-brand-pink-600 font-mono">15+</p>
            <p className="text-xs text-stone-500 uppercase font-mono tracking-wider font-semibold mt-1">Years Designing in Pune</p>
          </div>
          <div className="w-px h-8 bg-rose-200/50 hidden md:block" />
          <div className="text-center font-serif">
            <p className="text-3xl md:text-4xl font-black text-brand-pink-600 font-mono">15,000+</p>
            <p className="text-xs text-stone-500 uppercase font-mono tracking-wider font-semibold mt-1">Hand-delivered Smiles</p>
          </div>
          <div className="w-px h-8 bg-rose-200/50 hidden md:block" />
          <div className="text-center font-serif">
            <p className="text-3xl md:text-4xl font-black text-brand-pink-600 font-mono">12+</p>
            <p className="text-xs text-stone-500 uppercase font-mono tracking-wider font-semibold mt-1">Pune Neighborhoods Served</p>
          </div>
          <div className="w-px h-8 bg-rose-200/50 hidden md:block" />
          <div className="text-center font-serif">
            <p className="text-3xl md:text-4xl font-black text-brand-pink-600 font-mono">90 Min</p>
            <p className="text-xs text-stone-500 uppercase font-mono tracking-wider font-semibold mt-1">Express Delivery Guarantee</p>
          </div>
        </div>

      </div>
    </section>
  );
}
