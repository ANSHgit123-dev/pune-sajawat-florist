import React, { useState } from "react";
import { MapPin, Phone, MessageCircle, Clock, Send, ShieldCheck, Mail } from "lucide-react";

export default function ContactSection() {
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryText, setInquiryText] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    // Send the custom form inquiry straight to WhatsApp!
    const phoneNumber = "918484905722";
    const rawMsg = `Hello *Pune Sajawat Florist*! 🌸\n` +
      `*Form Inquiry Details*:\n` +
      `• *Name:* ${inquiryName}\n` +
      `• *Phone:* ${inquiryPhone}\n` +
      `• *My Inquiry:* ${inquiryText || "Looking for fresh flowers / wedding quotations."}\n\n` +
      `Please reply with catalog details. Thanks!`;
    
    const encoded = encodeURIComponent(rawMsg);
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encoded}`, "_blank");
    
    setIsSent(true);
    setInquiryName("");
    setInquiryPhone("");
    setInquiryText("");
  };

  return (
    <section className="py-10 bg-white" id="contact-section">
      <div className="max-w-[1600px] w-full mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-brand-pink-600 font-bold text-xs uppercase tracking-widest bg-brand-pink-50 px-3 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            <span>LOCATE OUR WORKSHOP</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-stone-900">
            Visit Pune Sajawat Florist Boutique
          </h3>
          <p className="text-sm text-stone-500 max-w-lg mx-auto">
            Right in the heart of Hadapsar, Pune. Drop by to handpick fresh blossoms or meet our event decorators for customized consultations.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch" id="contact-panel-grid">
          
          {/* Left Block: Contact metrics details & Hours */}
          <div className="lg:col-span-4 bg-stone-50 border border-stone-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between gap-8 h-full" id="contact-info-list">
            <div className="space-y-6">
              <h4 className="font-extrabold text-stone-900 text-lg sm:text-xl font-serif">
                Boutique Details
              </h4>

              <div className="space-y-5">
                {/* Physical Location */}
                <div className="flex items-start gap-4" id="address-block">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink-50 text-brand-pink-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-0.5">Physical Address</span>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                      Building S, Ambrosia, Shop No.8, 28, <br />
                      Tupe Patil Rd, behind Amanora Mall, Hadapsar, <br />
                      Pune, Maharashtra 411028
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-4" id="phone-block">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink-50 text-brand-pink-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-0.5">Call & Quote</span>
                    <a href="tel:+918484905722" className="text-xs sm:text-sm text-stone-900 font-bold hover:underline">
                      +91 84849 05722
                    </a>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Quick delivery assistance</span>
                  </div>
                </div>

                {/* WhatsApp Chat Support */}
                <div className="flex items-start gap-4" id="support-chat-block">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink-50 text-brand-pink-600 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 fill-brand-pink-500 stroke-none" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-0.5">WhatsApp Inquiry</span>
                    <a
                      href="https://api.whatsapp.com/send?phone=918484905722&text=Hello%20Pune%20Sajawat%20Florist!%20I%2520would%2520like%2520to%2520inquire%2520about..."
                      target="_blank"
                      className="text-xs sm:text-sm text-brand-green-600 font-extrabold hover:underline block"
                    >
                      +91 84849 05722
                    </a>
                  </div>
                </div>

                {/* Operation Timings */}
                <div className="flex items-start gap-4" id="timings-block">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink-50 text-brand-pink-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-0.5">Store Timings</span>
                    <p className="text-xs sm:text-sm text-stone-700 font-bold">
                      Mon – Sun: 7:00 AM – 10:30 PM <br />
                      <span className="text-brand-pink-600 font-normal text-[11px] font-sans">Open 365 Days a year (Including festivals)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick trust assurances */}
            <div className="border-t border-stone-200/60 pt-4 text-xs text-stone-500 font-medium space-y-1">
              <p className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-green-600 shrink-0" /> No plastic wrap. Organic wood craft wrapping paper.</p>
              <p className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-green-600 shrink-0" /> Verified location behind Amanora Mall in Hadapsar.</p>
            </div>
          </div>

          {/* Center Block: Google Maps Embed Iframe */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-stone-200 min-h-80 relative shadow-sm" id="google-maps-embed-canvas">
            {/* Real coordinates mapped to Hadapsar Pune */}
            <iframe
              src="https://maps.google.com/maps?q=Pune%20Sajawat%20Florist,%20Hadapsar%20Pune&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "360px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pune Sajawat Florist Physical Location Map Hadapsar Pune"
              id="maps-iframe-view"
            />
          </div>

          {/* Right Block: Instant form inquiry */}
          <div className="lg:col-span-3 bg-stone-50 border border-stone-200 rounded-2xl p-6 flex flex-col justify-between gap-5 h-full" id="contact-inquiry-form-card">
            <div>
              <h4 className="font-extrabold text-stone-900 text-sm sm:text-base font-serif mb-2">
                Custom Decoration Quote
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Enter your event layout scope or questions below. We build custom drapes, light paths, and design stages matching your budget.
              </p>
            </div>

            {isSent ? (
              <div className="p-6 text-center space-y-3 bg-brand-pink-50/50 rounded-xl" id="inquiry-submitted-banner">
                <span className="text-2xl">⚡</span>
                <p className="text-xs font-bold text-brand-pink-700">Inquiry forwarded to WhatsApp!</p>
                <p className="text-[10px] text-stone-400">Our representative is checking availability now.</p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-[10px] uppercase tracking-wider font-semibold hover:bg-stone-850 cursor-pointer"
                >
                  Write Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3" id="contact-inquiry-form">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shruti Patil"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-200 bg-white p-2.5 outline-none font-sans text-stone-800 focus:border-brand-pink-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 99999 99999"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-200 bg-white p-2.5 outline-none font-sans text-stone-800 focus:border-brand-pink-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Scope details</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need Haldi decoration at home in Kharadi for 25th Dec, budget ₹15,000..."
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-200 bg-white p-2.5 outline-none font-sans text-stone-800 resize-none focus:border-brand-pink-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-green-600 hover:bg-brand-green-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  id="contact-form-submit-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send quote request</span>
                </button>
              </form>
            )}

            <div className="text-center">
              <p className="text-[9px] text-stone-400">
                Timely response guaranteed within 10-15 minutes!
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
