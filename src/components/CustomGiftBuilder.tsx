import React, { useState } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Flower, 
  Sparkles, 
  Trash2, 
  MessageCircle, 
  ShoppingBag, 
  ArrowLeft, 
  Calendar, 
  Gift, 
  FileText, 
  Truck, 
  Smile, 
  Check, 
  Layers, 
  Grid 
} from "lucide-react";
import { PUNE_AREAS } from "../data";
import { Product } from "../types";

interface CustomGiftBuilderProps {
  onBack: () => void;
  onAddToCart: (customProduct: Product) => void;
  onOpenCart: () => void;
}

export default function CustomGiftBuilder({
  onBack,
  onAddToCart,
  onOpenCart
}: CustomGiftBuilderProps) {
  // Flower selection states (ID - quantities)
  const [flowers, setFlowers] = useState<{ [id: string]: number }>({
    "red_rose": 10, // Initial default choice
  });

  // Available flower options
  const FLOWER_OPTIONS = [
    { id: "red_rose", name: "Premium Red Roses", price: 25, img: "/images/gold_loop_roses.jpg", color: "bg-red-500" },
    { id: "pink_rose", name: "Soft Pink Roses", price: 25, img: "/images/pink_mixed_roses.jpg", color: "bg-pink-400" },
    { id: "white_lily", name: "Fragrant White Lilies", price: 80, img: "/images/blue_gold_lilies.jpg", color: "bg-orange-50" },
    { id: "pink_carnation", name: "Classic Pink Carnations", price: 22, img: "/images/peach_luxe_lilies.jpg", color: "bg-pink-300" },
    { id: "blue_orchid", name: "Exotic Blue Orchids", price: 95, img: "/images/iridescent_anthurium.jpg", color: "bg-blue-500" },
    { id: "yellow_gerbera", name: "Bright Yellow Gerberas", price: 24, img: "/images/holographic_sunflower.jpg", color: "bg-yellow-400" }
  ];

  // Wrapper selections
  const [selectedWrapper, setSelectedWrapper] = useState("kraft_eco");
  const WRAPPER_OPTIONS = [
    { id: "kraft_eco", name: "Eco Kraft Paper (Brown)", price: 50, desc: "Rustic vintage look with golden jute rope twine." },
    { id: "luxe_velvet_pink", name: "Luxe Pink Velvet", price: 90, desc: "Premium touch velvety wrap styled with soft pink ribbon." },
    { id: "royal_blue_matte", name: "Royal Matte Blue", price: 75, desc: "Sleek and rich contrast modern matte sheet styling." },
    { id: "crimson_silk", name: "Classic Scarlet Silk", price: 80, desc: "Gorgeous double folded shiny scarlet premium sheets." },
    { id: "glass_vase", name: "Glass Floral Vase Arrangement", price: 150, desc: "Waterfilled elegant countertop vase. Keeps stems healthy longer." },
    { id: "no_wrap", name: "Unwrapped (Bundle in simple ties)", price: 0, desc: "Plain tied stems ready for your own custom domestic vase." }
  ];

  // Chocolate selections
  const [chocolates, setChocolates] = useState<{ [id: string]: number }>({});
  const CHOCOLATE_OPTIONS = [
    { id: "silk_bar", name: "Cadbury Dairy Milk Silk (60g)", price: 100, img: "/images/pink_mixed_roses.jpg", emoji: "🍫" },
    { id: "ferrero_4", name: "Ferrero Rocher Premium (4 Pcs Pack)", price: 180, img: "/images/pink_mixed_roses.jpg", emoji: "🍬" },
    { id: "ferrero_16", name: "Ferrero Rocher Deluxe (16 Pcs Pack)", price: 550, img: "/images/pink_mixed_roses.jpg", emoji: "🎁" },
    { id: "kitkat", name: "Nestle KitKat Shareable Pack", price: 70, img: "/images/pink_mixed_roses.jpg", emoji: "🍫" }
  ];

  // Ribbon options (free addon)
  const [selectedRibbon, setSelectedRibbon] = useState("gold_satin");
  const RIBBON_OPTIONS = [
    { id: "gold_satin", name: "Elegant Glossy Golden Ribbon", color: "bg-amber-400" },
    { id: "pink_bow", name: "Soft Plush Pink Velvet Bow", color: "bg-pink-400" },
    { id: "emerald_silk", name: "Emerald Green Satin Ribbon", color: "bg-emerald-600" },
    { id: "red_satin", name: "Scarlet Crimson Luxury Bow", color: "bg-red-600" }
  ];

  // Decorative Extras (filler foliage, fairy lights, teddy, etc.)
  const [extras, setExtras] = useState<{ [id: string]: number }>({});
  const EXTRA_OPTIONS = [
    { id: "gyp_fillers", name: "Delicate White Baby's Breath (Gypsophila) filler", price: 90, desc: "Adds stellar volume & starry look between main blossoms." },
    { id: "mini_teddy", name: "Bespoke Mini Soft Teddy Bear (6 inches)", price: 160, desc: "Cute plush teddy companion tucked inside custom wrap." },
    { id: "amber_leds", name: "Warm White Twinkling LED fairy lights string", price: 100, desc: "Interactive button-battery string wrapping the flowers." },
    { id: "euc_leaves", name: "Fragrant Fresh Eucalyptus green branches", price: 60, desc: "Adds elegant mint aromatic foliage & luxurious length shape." },
    { id: "bday_balloon", name: "Metallic Helium Happy Birthday Balloon", price: 120, desc: "Premium quality helium balloon tied gracefully to bouquet." }
  ];

  // Delivery details states
  const [pincode, setPincode] = useState("411028");
  const [deliveryArea, setDeliveryArea] = useState("Hadapsar");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryType, setDeliveryType] = useState<"standard" | "sameday" | "midnight">("standard");

  // Personal message states
  const [customMessage, setCustomMessage] = useState("");

  const handleAreaChange = (areaName: string) => {
    setDeliveryArea(areaName);
    const matched = PUNE_AREAS.find((a) => a.name === areaName);
    if (matched) {
      setPincode(matched.postcode);
    }
  };

  // Add & Subtract counters
  const handleModifyFlower = (id: string, delta: number) => {
    setFlowers((prev) => {
      const curr = prev[id] || 0;
      const nextVal = curr + delta;
      if (nextVal <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: nextVal };
    });
  };

  const handleModifyChocolate = (id: string, delta: number) => {
    setChocolates((prev) => {
      const curr = prev[id] || 0;
      const nextVal = curr + delta;
      if (nextVal <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: nextVal };
    });
  };

  const handleModifyExtra = (id: string, delta: number) => {
    setExtras((prev) => {
      const curr = prev[id] || 0;
      const nextVal = curr + delta;
      if (nextVal <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: nextVal };
    });
  };

  // Calculations
  const flowersCost = Object.entries(flowers).reduce<number>((sum, [id, qtyVal]) => {
    const qty = qtyVal as number;
    const matched = FLOWER_OPTIONS.find((f) => f.id === id);
    return sum + (matched ? matched.price * qty : 0);
  }, 0);

  const wrapperObj = WRAPPER_OPTIONS.find((w) => w.id === selectedWrapper);
  const wrapperCost = wrapperObj ? wrapperObj.price : 0;

  const chocolatesCost = Object.entries(chocolates).reduce<number>((sum, [id, qtyVal]) => {
    const qty = qtyVal as number;
    const matched = CHOCOLATE_OPTIONS.find((c) => c.id === id);
    return sum + (matched ? matched.price * qty : 0);
  }, 0);

  const extrasCost = Object.entries(extras).reduce<number>((sum, [id, qtyVal]) => {
    const qty = qtyVal as number;
    const matched = EXTRA_OPTIONS.find((e) => e.id === id);
    return sum + (matched ? matched.price * qty : 0);
  }, 0);

  const getDeliveryFee = () => {
    if (deliveryType === "sameday") return 99;
    if (deliveryType === "midnight") return 249;
    return 0;
  };

  const deliveryCost = getDeliveryFee();
  const subtotal = flowersCost + wrapperCost + chocolatesCost + extrasCost;
  const grandTotal = subtotal + deliveryCost;

  const totalFlowerStems = Object.values(flowers).reduce<number>((sum, qtyVal) => {
    const qty = qtyVal as number;
    return sum + qty;
  }, 0);

  const isFormValid = pincode.trim() !== "" && deliveryArea.trim() !== "" && totalFlowerStems > 0;

  // Custom add-to-cart mechanism packaging details together
  const handleAddToCartFlow = () => {
    if (totalFlowerStems === 0) return;

    // Build custom bouquet manifest summary details
    let summaryArr: string[] = [];
    Object.entries(flowers).forEach(([id, qtyVal]) => {
      const qty = qtyVal as number;
      const matched = FLOWER_OPTIONS.find((f) => f.id === id);
      if (matched) summaryArr.push(`${qty}x ${matched.name}`);
    });
    if (wrapperObj && wrapperObj.id !== "no_wrap") {
      summaryArr.push(`Wrapper: ${wrapperObj.name}`);
    }
    Object.entries(chocolates).forEach(([id, qtyVal]) => {
      const qty = qtyVal as number;
      const matched = CHOCOLATE_OPTIONS.find((c) => c.id === id);
      if (matched) summaryArr.push(`${qty}x ${matched.name}`);
    });
    Object.entries(extras).forEach(([id, qtyVal]) => {
      const qty = qtyVal as number;
      const matched = EXTRA_OPTIONS.find((e) => e.id === id);
      if (matched) summaryArr.push(`Addon: ${qty}x ${matched.name}`);
    });

    const descriptionText = summaryArr.join(", ");

    // Generate dynamic standard product model for global shopping Cart system
    const customProduct: Product = {
      id: `custom_bundle_${Date.now()}`,
      title: `✨ Custom Bespoke arrangement (${totalFlowerStems} Stems)`,
      category: "Bespoke Builder",
      price: subtotal,
      originalPrice: subtotal + 150, // Fictive MSRP pricing savings logic
      rating: 4.9,
      reviewsCount: 1,
      image: "/images/pink_mixed_roses.jpg",
      description: `Custom curated bundle: ${descriptionText}. Delivered around ${deliveryArea} (${pincode}). Message: ${customMessage || "None"}`,
      isBestSeller: false,
      isNew: true
    };

    onAddToCart(customProduct);
    onOpenCart();
  };

  // WhatsApp checkout builder
  const triggerWhatsAppDirectLink = () => {
    const floristWhatsApp = "918484905722";
    
    let text = `🎨 *NEW DESIGN: CUSTOM BOUQUET CREATED* 🎨\n\n`;
    text += `*🌸 CHOSEN STEMS & FLOWERS:*\n`;
    let flowerLines = "";
    Object.entries(flowers).forEach(([id, qtyVal]) => {
      const qty = qtyVal as number;
      const matched = FLOWER_OPTIONS.find((f) => f.id === id);
      if (matched) {
        flowerLines += `• *${matched.name}* (Qty: ${qty}) - ₹${matched.price * qty}\n`;
      }
    });
    text += flowerLines || `• No flowers selected (?)\n`;
    text += `*Stems Total:* ₹${flowersCost}\n\n`;

    if (wrapperObj) {
      text += `*🎁 BOUQUET WRAPPER:* \n`;
      text += `• ${wrapperObj.name} (Cost: ₹${wrapperObj.price})\n\n`;
    }

    const rib = RIBBON_OPTIONS.find((r) => r.id === selectedRibbon);
    if (rib) {
      text += `*🎀 DECORATIVE BOW:* \n`;
      text += `• ${rib.name} (Free)\n\n`;
    }

    const chocs = Object.entries(chocolates).filter(([_, qtyVal]) => (qtyVal as number) > 0);
    if (chocs.length > 0) {
      text += `*🍫 SELECTED CHOCOLATES:* \n`;
      chocs.forEach(([id, qtyVal]) => {
        const qty = qtyVal as number;
        const matched = CHOCOLATE_OPTIONS.find((c) => c.id === id);
        if (matched) {
          text += `• *${matched.name}* (Qty: ${qty}) - ₹${matched.price * qty}\n`;
        }
      });
      text += `*Chocolates Total:* ₹${chocolatesCost}\n\n`;
    }

    const exList = Object.entries(extras).filter(([_, qtyVal]) => (qtyVal as number) > 0);
    if (exList.length > 0) {
      text += `*🌿 EXTRA COMPLIMENTS / FOLIAGES:*\n`;
      exList.forEach(([id, qtyVal]) => {
        const qty = qtyVal as number;
        const matched = EXTRA_OPTIONS.find((e) => e.id === id);
        if (matched) {
          text += `• *${matched.name}* (Qty: ${qty}) - ₹${matched.price * qty}\n`;
        }
      });
      text += `*Extras Total:* ₹${extrasCost}\n\n`;
    }

    text += `🚚 *DELIVERY PREFERENCE:*\n`;
    text += `• *Area Name:* ${deliveryArea}\n`;
    text += `• *Postcode:* ${pincode}\n`;
    text += `• *Preferred Date:* ${deliveryDate ? deliveryDate : "Immediate Urgent"}\n`;
    text += `• *Delivery Option:* ${deliveryType.toUpperCase()} (Fee: ₹${deliveryCost})\n`;

    if (customMessage.trim()) {
      text += `\n💌 *PERSONAL MESSAGE CARD:* \n`;
      text += `_"${customMessage.trim()}"_\n`;
    }

    text += `\n--------------------------------\n`;
    text += `⭐ *Subtotal:* ₹${subtotal}\n`;
    text += `🚚 *Delivery:* ₹${deliveryCost}\n`;
    text += `💰 *Grand Payable Total:* *₹${grandTotal}*\n\n`;
    text += `💬 Hi Sajawat Pune, please look at this custom arrangement blueprint and let me know when your rider can dispatch this! Thank you.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?phone=${floristWhatsApp}&text=${encoded}`, "_blank");
  };

  return (
    <div className="bg-white min-h-screen text-stone-850 pb-20 font-sans antialiased" id="custom-gift-builder-root">
      
      {/* 1. Header Back Breadcrumb row */}
      <div className="border-b border-stone-100 bg-stone-50/60 sticky top-16 z-20" id="custom-builder-breadcrumb">
        <div className="max-w-[1600px] w-full mx-auto px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-extrabold text-stone-600 hover:text-rose-600 transition-colors uppercase tracking-widest cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Go Back</span>
          </button>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] text-[#82862F] font-bold uppercase tracking-widest">
              Live Custom Bouquet Architect 🎨
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-6 py-6">
        
        {/* Intro Promo banner */}
        <div className="bg-[#F9FAEE]/50 border border-[#82862F]/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 md:max-w-xl text-center md:text-left">
            <span className="text-[10px] bg-[#82862F] text-white px-3 py-1 uppercase tracking-widest font-black rounded-full">
              Bespoke Gifting Studio
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 tracking-tight pt-2">
              Be Your Own Florist: Design a Custom Masterpiece 💐
            </h2>
            <p className="text-xs text-stone-605">
              Select premium roses, lilies, wrapper folds, and extra compliments. We arrange them fresh on-demand with premium ribbons and deliver to any Pune pincode.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-150 shadow-xs max-w-sm shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#82862F]/10 flex items-center justify-center text-[#82862F]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">Fresh Stems Guaranteed</p>
              <p className="text-[10px] text-stone-500">Photo confirmation shared on WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Builder Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT HAND & CENTER COLUMN FORM WORKSPACE (60% / 8 columns) */}
          <div className="lg:col-span-8 space-y-8" id="design-creator-workspace">
            
            {/* STEP 1: SELECT FLOWERS & QUANTITIES */}
            <div className="border border-stone-200 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
              <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-serif text-stone-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">1</span>
                    Choose Your Flowers & Quantities
                  </h3>
                  <p className="text-[11px] text-stone-500 pl-8">Select multiple flowers to build a stunning mixed bouquet! Stems have daily florist pricing.</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider font-sans">
                  Total stems: {totalFlowerStems}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                {FLOWER_OPTIONS.map((flower) => {
                  const qty = flowers[flower.id] || 0;
                  return (
                    <div 
                      key={flower.id} 
                      className={`border rounded-xl p-2.5 flex flex-col justify-between transition-all ${
                        qty > 0 
                          ? "border-rose-400 bg-rose-50/10 shadow-xs" 
                          : "border-stone-200 hover:border-rose-200 hover:shadow-xs"
                      }`}
                    >
                      <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-stone-100 mb-2">
                        <img src={flower.img} alt={flower.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1.5 left-1.5 bg-stone-900/75 text-white text-[10px] font-bold py-0.5 px-2 rounded font-mono">
                          ₹{flower.price}/stem
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${flower.color} shrink-0`} />
                          <h4 className="text-xs font-bold text-stone-850 line-clamp-1 leading-tight">{flower.name}</h4>
                        </div>
                      </div>

                      <div className="mt-3">
                        {qty > 0 ? (
                          <div className="flex items-center justify-between border-2 border-rose-500 rounded-lg overflow-hidden h-7 bg-white">
                            <button
                              onClick={() => handleModifyFlower(flower.id, -1)}
                              className="w-10 text-stone-600 hover:bg-stone-50 font-bold text-sm cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold font-mono text-stone-900">{qty} stems</span>
                            <button
                              onClick={() => handleModifyFlower(flower.id, 1)}
                              className="w-10 text-stone-600 hover:bg-stone-50 font-bold text-sm cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleModifyFlower(flower.id, 5)} // Starts with 5 stems initial addition
                            className="w-full py-1.5 bg-white hover:bg-rose-50 text-rose-600 text-[10px] uppercase font-black rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          >
                            + Add Stems
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: CHOOSE WRAPPING STYLE */}
            <div className="border border-stone-200 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-serif text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">2</span>
                  Select Wrapper fold & Presentation
                </h3>
                <p className="text-[11px] text-stone-500 pl-8">Wrappers set the overall mood of the gift package.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {WRAPPER_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setSelectedWrapper(opt.id)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      selectedWrapper === opt.id
                        ? "border-[#82862F] bg-[#F9FAEE]/30"
                        : "border-stone-200 hover:border-[#82862F]/35"
                    }`}
                  >
                    <input
                      type="radio"
                      name="wrapper_opt"
                      value={opt.id}
                      checked={selectedWrapper === opt.id}
                      onChange={() => {}}
                      className="text-[#82862F] focus:ring-0 h-4.5 w-4.5 mt-0.5 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900">{opt.name}</span>
                        <span className="text-xs font-bold text-[#82862F] font-mono shrink-0">
                          {opt.price === 0 ? "Free" : `₹${opt.price}`}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 leading-normal font-sans font-light">
                        {opt.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* STEP 3: CHOOSE RIBBON COLOR (FREE AD-ON) */}
            <div className="border border-stone-200 rounded-xl p-4 bg-white/95 space-y-3 shadow-xs">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[10px]">3</span>
                  Choose a ribbon tie (complimentary bow)
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-sans">
                {RIBBON_OPTIONS.map((rib) => (
                  <div
                    key={rib.id}
                    onClick={() => setSelectedRibbon(rib.id)}
                    className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                      selectedRibbon === rib.id
                        ? "border-amber-400 bg-amber-50/20"
                        : "border-stone-200 hover:border-amber-200"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-sm ${rib.color} border border-white shrink-0`} />
                    <span className="text-[10px] font-bold text-stone-850 truncate">{rib.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 4: PACK ADDITIONAL CHOCOLATES */}
            <div className="border border-stone-200 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-serif text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">4</span>
                  Add Sweet Chocolates
                </h3>
                <p className="text-[11px] text-stone-500 pl-8">Indulge their taste buds by layering Cadburys or premium Ferrers into the delivery parcel.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {CHOCOLATE_OPTIONS.map((choc) => {
                  const qty = chocolates[choc.id] || 0;
                  return (
                    <div 
                      key={choc.id}
                      className={`border rounded-xl p-2 flex flex-col justify-between transition-colors ${
                        qty > 0 ? "border-rose-400 bg-rose-50/5" : "border-stone-200 hover:border-rose-100"
                      }`}
                    >
                      <img src={choc.img} alt={choc.name} className="w-full h-16 object-cover rounded-md mb-2" />
                      <div>
                        <p className="text-[10px] font-bold text-stone-800 line-clamp-2 leading-tight">{choc.name}</p>
                        <span className="text-[10px] font-mono font-bold text-rose-600">₹{choc.price}</span>
                      </div>

                      <div className="mt-2.5">
                        {qty > 0 ? (
                          <div className="flex items-center justify-between border border-rose-500 rounded h-6 bg-white overflow-hidden">
                            <button 
                              onClick={() => handleModifyChocolate(choc.id, -1)} 
                              className="w-1/3 text-xs font-bold text-rose-600 text-center cursor-pointer hover:bg-stone-50"
                            >
                              -
                            </button>
                            <span className="w-1/3 text-[10px] font-bold text-center font-mono">{qty}</span>
                            <button 
                              onClick={() => handleModifyChocolate(choc.id, 1)} 
                              className="w-1/3 text-xs font-bold text-rose-600 text-center cursor-pointer hover:bg-stone-50"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleModifyChocolate(choc.id, 1)}
                            className="w-full py-1 bg-white hover:bg-rose-50 text-rose-600 text-[9.5px] font-extrabold uppercase rounded border border-rose-150 cursor-pointer"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 5: DECORATIVE EXTRAS & FILLERS */}
            <div className="border border-stone-200 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-serif text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">5</span>
                  Add Foliage fillers & Interactive Extras
                </h3>
                <p className="text-[11px] text-stone-505 pl-8">Incorporate starry Gypsophila flowers, twinkling LED strings, or a fluffy mini teddy bear companion.</p>
              </div>

              <div className="space-y-2.5 pt-1.5">
                {EXTRA_OPTIONS.map((ext) => {
                  const qty = extras[ext.id] || 0;
                  return (
                    <div 
                      key={ext.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                        qty > 0 ? "border-[#FC8019] bg-orange-50/5" : "border-stone-200 hover:border-[#FC8019]/30"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-stone-900">{ext.name}</span>
                          <span className="text-xs font-black text-[#FC8019] font-mono">₹{ext.price}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-sans">{ext.desc}</p>
                      </div>

                      <div className="shrink-0 w-24">
                        {qty > 0 ? (
                          <div className="flex items-center justify-between border border-[#FC8019] rounded-lg h-7 bg-white overflow-hidden">
                            <button
                              onClick={() => handleModifyExtra(ext.id, -1)}
                              className="w-8 text-[#FC8019] hover:bg-stone-50 font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-[11px] font-bold font-mono">{qty}</span>
                            <button
                              onClick={() => handleModifyExtra(ext.id, 1)}
                              className="w-8 text-[#FC8019] hover:bg-stone-50 font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleModifyExtra(ext.id, 1)}
                            className="w-full py-1.5 bg-white text-[#FC8019] hover:bg-[#FC8019]/5 text-[10px] font-extrabold uppercase rounded-lg border border-[#FC8019]/40 cursor-pointer text-center"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 6: DELIVERY TIMEFRAME & PINCODE */}
            <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50/40 space-y-4 shadow-xs" id="custom-builder-delivery-pune">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider pb-2 border-b border-stone-100">
                <Truck className="w-4.5 h-4.5 text-rose-500" />
                <span>Specify Delivery Location & Scheduling</span>
              </div>

              {/* Area select */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Select delivery area</label>
                  <select
                    value={deliveryArea}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full text-xs rounded-md border border-stone-200 bg-white py-2 px-2.5 outline-none font-bold text-stone-800 focus:border-rose-400"
                  >
                    {PUNE_AREAS.map((a) => (
                      <option key={a.postcode} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Postcode checker</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs rounded-md border border-stone-200 bg-white py-2 px-2.5 outline-none font-mono font-bold text-stone-850"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">Preferred Delivery Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full text-xs rounded-md border border-stone-200 bg-white py-2 px-2.5 outline-none text-stone-800 font-semibold cursor-pointer focus:border-rose-400"
                  />
                  <div className="absolute top-2.5 right-3 text-stone-450 pointer-events-none">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Preferred Timeframe radios */}
              <div className="space-y-2 font-sans pt-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">Delivery timeframe mode</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center justify-between p-2 rounded-lg border border-stone-200 bg-white cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="custom_del_type"
                        value="standard"
                        checked={deliveryType === "standard"}
                        onChange={() => setDeliveryType("standard")}
                        className="text-rose-600 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                      />
                      <span className="text-[11px] font-bold text-stone-800">Standard</span>
                    </div>
                    <span className="text-[9px] text-[#82862F] font-black uppercase font-mono">Free</span>
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg border border-stone-200 bg-white cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="custom_del_type"
                        value="sameday"
                        checked={deliveryType === "sameday"}
                        onChange={() => setDeliveryType("sameday")}
                        className="text-rose-600 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                      />
                      <span className="text-[11px] font-bold text-stone-800">Same-Day</span>
                    </div>
                    <span className="text-[9px] text-rose-600 font-extrabold font-mono">+₹99</span>
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg border border-stone-200 bg-white cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="custom_del_type"
                        value="midnight"
                        checked={deliveryType === "midnight"}
                        onChange={() => setDeliveryType("midnight")}
                        className="text-rose-600 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                      />
                      <span className="text-[11px] font-bold text-stone-800">Midnight</span>
                    </div>
                    <span className="text-[9px] text-rose-600 font-extrabold font-mono">+₹249</span>
                  </label>
                </div>
              </div>
            </div>

            {/* STEP 7: PERSONAL MESSAGE CARD */}
            <div className="border border-stone-200 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider pb-1 border-b border-stone-100">
                <FileText className="w-4.5 h-4.5 text-[#82862F]" />
                <span>Handwrite a personalized Greeting Card❤️</span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={250}
                  placeholder="Happy Birthday! Wishing you lots of happiness, fun, and warm surprises..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-200 bg-white p-3 outline-none text-stone-850 resize-none focus:border-rose-450 focus:ring-1 focus:ring-rose-200"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold font-sans">
                <span>🍀 Card attached securely with wrapper twine ribbon.</span>
                <span className={customMessage.length >= 240 ? "text-rose-600 font-bold" : ""}>
                  {customMessage.length}/250 chars
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT STICKY LIVE SUMMARY PREVIEW PANEL (40% / 4 columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-5" id="design-creator-summary-sticky">
            
            <div className="border-2 border-stone-200 rounded-2xl p-5 bg-white shadow-md space-y-5">
              
              {/* Visual mini status icon indicators */}
              <div className="text-center pb-3 border-b border-stone-100 space-y-1">
                <span className="text-[10px] tracking-widest uppercase font-extrabold text-stone-400">Live Blueprint Estimate</span>
                <h3 className="text-lg font-bold font-serif text-stone-900">Custom Bouquet Blueprint</h3>
                <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wide">
                  ✔ Arranged fresh in Pune Sajawat Studio
                </p>
              </div>

              {/* Items Breakdown list */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-extrabold block">Arrangement Manifest</span>
                
                {totalFlowerStems === 0 ? (
                  <p className="text-xs text-stone-400 italic text-center py-4">No foliage or stems chosen yet. Click dynamic addition buttons on the left!</p>
                ) : (
                  <div className="space-y-2">
                    
                    {/* Flowers manifest */}
                    {Object.entries(flowers).map(([id, qtyVal]) => {
                      const qty = qtyVal as number;
                      const matched = FLOWER_OPTIONS.find((f) => f.id === id);
                      if (!matched) return null;
                      return (
                        <div key={id} className="flex justify-between items-center text-xs">
                          <span className="text-stone-700 font-sans font-medium">{qty}x {matched.name}</span>
                          <span className="font-bold text-stone-900 font-mono">₹{matched.price * qty}</span>
                        </div>
                      );
                    })}

                    {/* Wrapper fold selected */}
                    {wrapperObj && wrapperObj.id !== "no_wrap" && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 font-sans font-light">Wrap style: {wrapperObj.name}</span>
                        <span className="font-bold text-stone-900 font-mono">₹{wrapperObj.price}</span>
                      </div>
                    )}

                    {/* Ribbon color selected */}
                    {selectedRibbon && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-505 font-sans font-light">Complimentary ribbon tie</span>
                        <span className="text-[9.5px] text-emerald-600 font-extrabold font-mono uppercase bg-emerald-50 px-1 py-0.2 rounded">Free</span>
                      </div>
                    )}

                    {/* Chocolates count helper summary */}
                    {Object.entries(chocolates).map(([id, qtyVal]) => {
                      const qty = qtyVal as number;
                      const matched = CHOCOLATE_OPTIONS.find((c) => c.id === id);
                      if (!matched) return null;
                      return (
                        <div key={id} className="flex justify-between items-center text-xs">
                          <span className="text-stone-600 font-sans">{qty}x {matched.name}</span>
                          <span className="font-bold text-stone-900 font-mono">₹{matched.price * qty}</span>
                        </div>
                      );
                    })}

                    {/* Decorative compliment foilages additions */}
                    {Object.entries(extras).map(([id, qtyVal]) => {
                      const qty = qtyVal as number;
                      const matched = EXTRA_OPTIONS.find((e) => e.id === id);
                      if (!matched) return null;
                      return (
                        <div key={id} className="flex justify-between items-center text-xs">
                          <span className="text-stone-605 font-sans">{qty}x {matched.name}</span>
                          <span className="font-bold text-stone-900 font-mono">₹{matched.price * qty}</span>
                        </div>
                      );
                    })}

                  </div>
                )}
              </div>

              {/* Math totals pricing breakdown FNP layout */}
              <div className="space-y-2 border-t border-stone-150 pt-4 text-xs">
                
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium font-sans">Craft Items Total:</span>
                  <span className="font-bold text-stone-900 font-mono">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium font-sans">Pune Courier ({deliveryArea}):</span>
                  {deliveryCost === 0 ? (
                    <span className="text-emerald-700 font-extrabold uppercase font-sans">Free</span>
                  ) : (
                    <span className="font-bold text-stone-900 font-mono">₹{deliveryCost} ({deliveryType})</span>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-stone-100">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Grand Total:</span>
                  <span className="text-2xl font-black text-rose-600 font-mono">₹{grandTotal}</span>
                </div>

              </div>

              {/* Delivery Assurance Checklists */}
              <div className="bg-stone-50 p-3 rounded-xl space-y-1.5 text-[10px] font-bold text-stone-600 font-sans">
                <div className="flex items-center gap-1 text-stone-705">
                  <Smile className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real photo proof sent before rider sets off.</span>
                </div>
                {deliveryDate && (
                  <div className="flex items-center gap-1 text-stone-705">
                    <Calendar className="w-3.5 h-3.5 text-[#82862F] shrink-0" />
                    <span>Scheduled Delivery preferred on: {deliveryDate}</span>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3" id="custom-builder-checkout-actions">
                
                {/* 1. Add Custom Masterpiece to Shopping Basket */}
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={handleAddToCartFlow}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border transition-all ${
                    isFormValid
                      ? "bg-white border-emerald-600 text-emerald-700 hover:bg-emerald-50/50 cursor-pointer active:scale-98"
                      : "bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Queue to Basket</span>
                </button>

                {/* 2. Direct Instant checkout on WhatsApp with complete layout */}
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={triggerWhatsAppDirectLink}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-md transition-all ${
                    isFormValid
                      ? "bg-[#25D366] hover:bg-[#20ba59] cursor-pointer active:scale-98"
                      : "bg-stone-100 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  <MessageCircle className="w-4.5 h-4.5 fill-white stroke-none" />
                  <span>Order on WhatsApp • ₹{grandTotal}</span>
                </button>

                {!isFormValid && (
                  <div className="p-2 bg-rose-50 border border-rose-100 rounded text-center">
                    <span className="text-[10px] text-rose-600 font-bold block uppercase tracking-wide">
                      ⚠️ Stems count is empty
                    </span>
                    <p className="text-[9px] text-stone-500 leading-normal">
                      Click "+ Add Stems" or "+ Add" in Step 1 to select or build your custom gift.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
