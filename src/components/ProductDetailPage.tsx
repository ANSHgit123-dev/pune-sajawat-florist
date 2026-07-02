import React, { useState, useEffect } from "react";
import { Star, ShoppingBag, MessageCircle, Heart, ArrowLeft, Calendar, MapPin, Truck, ShieldCheck, HeartHandshake, Smile, Gift, Plus, Minus, FileText, Check, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Addon } from "../types";
import { PRODUCTS, ADDONS, PUNE_AREAS } from "../data";
import { getDeliverySettings } from "../utils/deliverySettings";
import ProductCard from "./ProductCard";

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity?: (productId: string, delta: number) => void;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

export default function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
  onOpenCart,
  onSelectProduct,
  products
}: ProductDetailPageProps) {
  // Gallery states
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // FNP Redesign States
  const [deliverySettings, setDeliverySettings] = useState(() => getDeliverySettings());
  const [searchQuery, setSearchQuery] = useState("Hadapsar");
  const [selectedAreaName, setSelectedAreaName] = useState("Hadapsar");
  const [pincode, setPincode] = useState("411028");
  const [recipientName, setRecipientName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dates
  const getFormattedShortDate = (offsetDays: number): { raw: string; display: string } => {
    const d = new Date(new Date().getTime() + offsetDays * 24 * 60 * 60 * 1000);
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const m = months[d.getMonth()];
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return {
      raw: `${yyyy}-${mm}-${dd}`,
      display: `${day} ${m}`
    };
  };

  const todayObj = getFormattedShortDate(0);
  const tomorrowObj = getFormattedShortDate(1);

  const [deliveryDateTab, setDeliveryDateTab] = useState<"today" | "tomorrow" | "future">(() => {
    return new Date().getHours() >= 23 ? "tomorrow" : "today";
  });
  const [deliveryDate, setDeliveryDate] = useState(() => {
    return new Date().getHours() >= 23 ? tomorrowObj.raw : todayObj.raw;
  });
  const [customFutureDate, setCustomFutureDate] = useState("");

  const [deliveryType, setDeliveryType] = useState<"standard" | "sameday" | "fixed" | "night" | "midnight">("standard");
  const [fixedTimeSlot, setFixedTimeSlot] = useState("12:00 PM");

  const [customMessage, setCustomMessage] = useState("");
  const [premiumWrapping, setPremiumWrapping] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "care" | "deliv">("desc");

  // Local selected addons
  // Explicit requested add-ons:
  // a1: Dairy Milk Silk (100)
  // a3: Teddy Bear (199)
  // a4: Gift Hamper (499)
  // a5: Greeting Card (50)
  const [localAddons, setLocalAddons] = useState<{ [addonId: string]: number }>({});

  // Synchronize main image when product changes
  useEffect(() => {
    const hr = new Date().getHours();
    setSelectedImage(product.image);
    setLocalAddons({});
    setCustomMessage("");
    setDeliveryDateTab(hr >= 23 ? "tomorrow" : "today");
    setDeliveryDate(hr >= 23 ? tomorrowObj.raw : todayObj.raw);
    setDeliveryType("standard");
    setPremiumWrapping(false);
    setSearchQuery("Hadapsar");
    setSelectedAreaName("Hadapsar");
    setPincode("411028");
    setRecipientName("");
  }, [product]);

  // Redirect out of same day delivery if it becomes hidden after 8 PM
  useEffect(() => {
    if (new Date().getHours() >= 20 && deliveryType === "sameday") {
      setDeliveryType("standard");
    }
  }, [deliveryType]);

  // Gallery image definitions
  const galleryImages = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages.map((url: string, i: number) => ({
        label: i === 0 ? "Front view" : i === 1 ? "Side closeup" : `Angle ${i + 1}`,
        url
      }))
    : [
        { label: "Front view", url: product.image }
      ];

  // Hover zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Local add-on modifier
  const handleModifyAddon = (addonId: string, delta: number) => {
    setLocalAddons((prev) => {
      const current = prev[addonId] || 0;
      const nextQuery = current + delta;
      if (nextQuery <= 0) {
        const copy = { ...prev };
        delete copy[addonId];
        return copy;
      }
      return { ...prev, [addonId]: nextQuery };
    });
  };

  // Autocomplete matching area lookups
  const matchedArea = deliverySettings.areas.find(
    (area) =>
      area.name.toLowerCase() === searchQuery.trim().toLowerCase() ||
      area.postcode === searchQuery.trim()
  );

  const isDeliveryAvailable = !!matchedArea;
  const distanceCharge = matchedArea ? matchedArea.charge : 0;

  // Time Fee Dynamic Loading
  const getDeliveryFee = () => {
    const matchedType = deliverySettings.types.find((t) => t.id === deliveryType);
    return matchedType ? matchedType.charge : 0;
  };

  const getDeliveryLabel = () => {
    switch (deliveryType) {
      case "standard":
        return "Standard Delivery (10 AM - 8 PM)";
      case "sameday":
        return "Same Day Delivery (Within 4 Hours)";
      case "fixed":
        return `Fixed Time Delivery (${fixedTimeSlot})`;
      case "night":
        return "Night Delivery (8 PM - 11 PM)";
      case "midnight":
        return "Midnight Delivery (11 PM - 12 AM)";
      default:
        return "Standard Delivery";
    }
  };

  const addonsSubtotal = Object.entries(localAddons).reduce((acc, [addonId, qty]) => {
    const template = ADDONS.find((a) => a.id === addonId);
    const price = template ? template.price : 0;
    return acc + price * (qty as number);
  }, 0);

  const deliveryCost = getDeliveryFee();
  const wrappingCost = premiumWrapping ? 49 : 0;
  
  // Total includes distance charge + delivery type surcharge + addons + wrapping + product price
  const currentTotal = product.price + distanceCharge + deliveryCost + addonsSubtotal + wrappingCost;

  // Date selection updates handler
  const handleDateTabChange = (tab: "today" | "tomorrow" | "future") => {
    setDeliveryDateTab(tab);
    if (tab === "today") {
      setDeliveryDate(todayObj.raw);
    } else if (tab === "tomorrow") {
      setDeliveryDate(tomorrowObj.raw);
    } else if (customFutureDate) {
      setDeliveryDate(customFutureDate);
    }
  };

  const handleCustomDateChange = (dateVal: string) => {
    setCustomFutureDate(dateVal);
    setDeliveryDate(dateVal);
    setDeliveryDateTab("future");
  };

  const handleSelectSuggestedArea = (areaName: string) => {
    setSearchQuery(areaName);
    setSelectedAreaName(areaName);
    setIsDropdownOpen(false);
    const matched = deliverySettings.areas.find((a) => a.name.toLowerCase() === areaName.toLowerCase());
    if (matched) {
      setPincode(matched.postcode);
    }
  };

  // WhatsApp Message Formatter
  const triggerWhatsAppDirectLink = () => {
    const floristWhatsApp = "918484905722";
    const orderIdCode = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = `#SAJ-2026-${orderIdCode}`;
    
    let text = `🌱 *PUNE SAJAWAT FLORIST - CUSTOMER ORDER* 📍\n`;
    text += `--------------------------------------\n`;
    text += `*Order ID:* ${generatedOrderId}\n`;
    text += `*Customer Name:* ${recipientName.trim() ? recipientName.trim() : "Guest"}\n`;
    text += `--------------------------------------\n`;
    text += `*Gift Product:* *${product.title}* (₹${product.price})\n`;
    
    if (premiumWrapping) {
      text += `🎁 *Premium Wrapping:* Yes (+₹49)\n`;
    }

    const activeAddons = Object.entries(localAddons).filter(([_, qty]) => (qty as number) > 0);
    if (activeAddons.length > 0) {
      text += `\n*Selected Add-ons:*\n`;
      activeAddons.forEach(([id, qty]) => {
        const ad = ADDONS.find((a) => a.id === id);
        if (ad) {
          text += `- *${ad.name}* x${qty} (₹${ad.price * (qty as number)})\n`;
        }
      });
    }

    text += `\n*Delivery Details:*\n`;
    text += `- *Receiver Location:* ${selectedAreaName || searchQuery}\n`;
    if (pincode) text += `- *Pincode:* ${pincode}\n`;
    text += `- *Delivery Date:* ${deliveryDate ? deliveryDate : "Today"}\n`;
    text += `- *Timeframe Window:* ${getDeliveryLabel()}\n`;
    text += `- *Area Surcharge:* ₹${distanceCharge}\n`;
    text += `- *Time slot fee:* ₹${deliveryCost}\n`;

    if (customMessage.trim()) {
      text += `\n*Personal card message:*\n`;
      text += `📝 _"${customMessage.trim()}"_\n`;
    }

    text += `--------------------------------------\n`;
    text += `⭐️ *Grand Total:* *₹${currentTotal}*\n`;
    text += `--------------------------------------\n\n`;
    text += `Please process and confirm product availability on WhatsApp. Thanks!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?phone=${floristWhatsApp}&text=${encoded}`, "_blank");
  };

  // Add to cart workflow
  const handleAddToCartFlow = () => {
    const customizedProduct: Product = {
      ...product,
      title: premiumWrapping ? `${product.title} (+ Premium Velvet Wrapping)` : product.title,
      price: product.price + (premiumWrapping ? 49 : 0),
    };
    onAddToCart(customizedProduct);
  };

  // Similars / "You may also like" suggestions
  const similarProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const extraRecommendations = products.filter(
    (p) => p.category !== product.category
  ).slice(0, 4);

  const combinedSuggestions = [...similarProducts, ...extraRecommendations].slice(0, 6);

  const percentOff = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="bg-white min-h-screen text-stone-800 pb-16 font-sans antialiased" id="product-details-root">
      
      {/* 1. Slim breadcrumb navigation bar */}
      <div className="border-b border-stone-100 bg-stone-50/50 sticky top-16 z-20" id="product-details-breadcrumbs">
        <div className="max-w-[1600px] w-full mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-rose-600 transition-colors uppercase tracking-widest cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Browse</span>
          </button>
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
            Home / {product.category} / <span className="text-stone-700">{product.title}</span>
          </div>
        </div>
      </div>

      {/* 2. Main content grids styled inspired by Amazon/FNP */}
      <div className="max-w-[1600px] w-full mx-auto px-6 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDE (66%) / Vertical Gallery & Main Image ================= */}
          <div className="lg:col-span-8 flex flex-col-reverse md:flex-row gap-4 items-start" id="gallery-layout-combined">
            
            {/* Vertical thumbnails on left (desktop), horizontal on mobile */}
            <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 shrink-0 w-full md:w-24" id="gallery-thumbnails">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-16 h-16 md:w-24 md:h-24 border-2 rounded-xl overflow-hidden shrink-0 bg-stone-50 transition-all ${
                    selectedImage === img.url 
                      ? "border-rose-500 shadow-md ring-3 ring-rose-100 scale-102" 
                      : "border-stone-200 hover:border-rose-400"
                  }`}
                  title={img.label}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Large Main Image on right with hover zoom and fade-in transition */}
            <div className="flex-1 w-full flex flex-col items-center" id="gallery-main-frame">
              <div 
                className="relative w-full overflow-hidden rounded-3xl border-2 border-stone-100 bg-stone-50/50 aspect-square cursor-zoom-in group shadow-md"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
                id="details-zoom-container"
              >
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt={product.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    style={{
                      transform: isHovered ? "scale(2)" : "scale(1)",
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transition: isHovered ? "transform 0.05s ease-out" : "transform 0.2s ease"
                    }}
                  />
                </AnimatePresence>

                {/* Badge overlay on product view */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  {product.isBestSeller && (
                    <span className="px-3 py-1.5 bg-[#FC8019] text-white text-[9px] uppercase tracking-widest font-extrabold rounded-md shadow-lg">
                      🔥 Best Seller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] uppercase tracking-widest font-extrabold rounded-md shadow-lg">
                      ✨ New Gifting Choice
                    </span>
                  )}
                </div>

                {/* Actual Angle zoom prompt */}
                <div className="absolute bottom-4 right-4 bg-stone-900/65 text-white text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg backdrop-blur-md font-mono font-bold shadow-md">
                  🔍 Hover to Zoom
                </div>
              </div>
              
              <p className="text-center text-xs text-stone-400 mt-4 font-medium font-sans">
                💡 Move your cursor over the photo to zoom in on delicate accents and fresh blooms
              </p>
            </div>

          </div>

          {/* ================= RIGHT SIDE (34%) / Product Details & Checkout Widget ================= */}
          <div className="lg:col-span-4 space-y-6" id="product-detail-forms-hub">
            
            {/* Header info card */}
            <div className="border-b border-stone-100 pb-5 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#82862F] font-bold block">
                {product.category}
              </span>
              <h2 className="text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
                {product.title}
              </h2>

              {/* Reviews Star count row */}
              <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <Star className="w-3.5 h-3.5 stroke-amber-400" />
                </div>
                <span className="font-bold text-stone-850 font-sans">{product.rating}</span>
                <span className="text-stone-300">|</span>
                <span className="underline hover:text-stone-900 transition-colors pointer-events-none cursor-default">
                  {product.reviewsCount} Verified Customer Reviews
                </span>
              </div>

              {/* Pricing section matching Amazon layout exactly */}
              <div className="pt-3 flex items-baseline gap-3" id="pricing-amazon-segment">
                <span className="text-3xl font-black text-rose-600 font-sans">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-stone-400 line-through text-sm">
                      M.R.P: ₹{product.originalPrice}
                    </span>
                    <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm tracking-wide">
                      {percentOff}% OFF Save ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Verified Taxes indicator */}
              <p className="text-[10px] text-stone-400 font-medium">
                Inclusive of all taxes & free standard packaging delivery across Pune
              </p>

              {/* Short standard summary description */}
              <p className="text-xs text-stone-600 leading-relaxed pt-2.5 font-light font-sans">
                {product.description || "Fresh hand-picked selection arranged exquisitely with designer floral accents to convey sweet celebrations."}
              </p>
            </div>

            {/* ================= FNP REDESIGNED CHECKOUT & ORDERING WIDGET ================= */}
            <div id="fnp-premium-checkout-panel">
              <div className="bg-white border-2 border-stone-100 rounded-3xl p-6 shadow-xl space-y-6 sticky top-24" id="checkout-card-main">
              
              {/* SECTION 1: Product Title & Price Header */}
              <div className="border-b border-stone-100 pb-5 space-y-3" id="checkout-section-price">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-[#82862F] font-extrabold font-mono bg-[#82862F]/5 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  
                  {/* Fire Order Badge */}
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs animate-pulse bg-rose-50 px-2.5 py-1 rounded-full">
                    <span>🔥 Ordered 100+ times this month</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
                  {product.title}
                </h2>

                {/* Stars reviews count row */}
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <Star className="w-3.5 h-3.5 stroke-amber-400" />
                  </div>
                  <span className="font-bold text-stone-800">{product.rating}</span>
                  <span className="text-stone-300">|</span>
                  <span>{product.reviewsCount} Verified Bookings</span>
                </div>

                {/* Big Premium Price Layout */}
                <div className="pt-2 flex items-baseline gap-3" id="pricing-display-row">
                  <span className="text-3xl font-black text-stone-900 font-sans tracking-tight">
                    ₹{product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-stone-400 line-through text-sm font-medium">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-[#82862F] bg-[#82862F]/10 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-stone-500 font-light pt-1">
                  {product.description || "Freshly custom-crafted bouquet hand-arranged with decorative wrapper coordinates for doorside doorstep smiles."}
                </p>
              </div>

              {/* SECTION 2: Delivery Location Input with autocomplete lookup */}
              <div className="space-y-3" id="checkout-section-location">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Gift Receiver's Location 📍
                </label>
                
                <div className="relative">
                  <div className="flex items-center border-2 border-stone-200 focus-within:border-[#82862F] rounded-xl overflow-hidden px-3 bg-stone-50/50">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      placeholder="Enter area, locality or pincode"
                      className="w-full text-xs py-3 px-2 outline-none font-bold text-stone-850 bg-transparent placeholder-stone-400"
                    />
                    {searchQuery.trim() && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedAreaName("");
                          setPincode("");
                        }}
                        className="text-[10px] uppercase font-bold text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown list */}
                  {isDropdownOpen && (
                    <div className="absolute top-12 left-0 right-0 max-h-56 overflow-y-auto bg-white border border-stone-200 rounded-xl shadow-2xl z-30 divide-y divide-stone-50">
                      {deliverySettings.areas
                        .filter(
                          (a) =>
                            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.postcode.includes(searchQuery)
                        )
                        .map((area) => (
                          <button
                            key={area.postcode}
                            onClick={() => handleSelectSuggestedArea(area.name)}
                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-stone-50/80 font-bold text-stone-800 flex justify-between items-center transition-colors"
                          >
                            <span>{area.name}</span>
                            <span className="text-[11px] text-stone-400 font-normal">PIN {area.postcode}</span>
                          </button>
                        ))}
                      {deliverySettings.areas.filter(
                        (a) =>
                          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.postcode.includes(searchQuery)
                      ).length === 0 && (
                        <div className="p-4 text-center text-xs text-stone-400 font-medium">
                          No matching Pune areas. Use suggested below.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Recipient Sender Client-Input Name optional field */}
                <div className="pt-1.5">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient's Name (e.g. Priyanshu Godse) - Optional"
                    className="w-full text-[11.5px] py-2 px-3 border border-stone-200 focus:border-[#82862F] rounded-lg outline-none text-stone-800 bg-stone-50/20"
                  />
                </div>

                {/* Clickable Quick suggestions list of requested examples */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">
                    Popular Delivery Hubs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Hadapsar", "Magarpatta", "Kharadi", "Viman Nagar", "Wagholi", "Baner", "Koregaon Park"].map((hub) => (
                      <button
                        key={hub}
                        type="button"
                        onClick={() => handleSelectSuggestedArea(hub)}
                        className={`text-[10.5px] px-2.5 py-1 rounded-full border transition-all cursor-pointer font-semibold ${
                          selectedAreaName === hub
                            ? "bg-[#82862F] border-[#82862F] text-white"
                            : "bg-white border-stone-200 hover:border-[#82862F] text-stone-600"
                        }`}
                      >
                        {hub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Delivery Availability Display */}
                <div className="pt-2 animate-fade-in" id="delivery-availability-badge">
                  {isDeliveryAvailable ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0">
                          ✓
                        </span>
                        <div>
                          <p className="text-xs font-bold text-emerald-800">Delivery Available</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Direct home concierge verified</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-800 font-mono">
                          ₹{distanceCharge === 0 ? "FREE" : `₹${distanceCharge}`}
                        </span>
                        <p className="text-[9px] text-stone-400 font-sans block uppercase font-bold tracking-wider">Charge</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-2.5">
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-rose-800">❌ Delivery not available.</p>
                        <p className="text-[10px] text-rose-500 font-medium">Please lookup/enter a valid Pune locality name above.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Beautiful Date Selector */}
              <div className="space-y-2.5" id="checkout-section-date">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Select Delivery Date 📅
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  
                  {/* Today Button */}
                  <button
                    type="button"
                    disabled={new Date().getHours() >= 23}
                    onClick={() => handleDateTabChange("today")}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                      new Date().getHours() >= 23
                        ? "border-stone-200 bg-stone-50 text-stone-300 opacity-40 cursor-not-allowed"
                        : deliveryDateTab === "today"
                        ? "border-[#82862F] bg-[#82862F]/5 ring-2 ring-[#82862F]"
                        : "border-stone-200 bg-white hover:border-[#82862F]"
                    }`}
                  >
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Today</span>
                    <span className="text-xs font-black text-stone-850">{todayObj.display}</span>
                  </button>

                  {/* Tomorrow Button */}
                  <button
                    type="button"
                    onClick={() => handleDateTabChange("tomorrow")}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                      deliveryDateTab === "tomorrow"
                        ? "border-[#82862F] bg-[#82862F]/5 ring-2 ring-[#82862F]"
                        : "border-stone-200 bg-white hover:border-[#82862F]"
                    }`}
                  >
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Tomorrow</span>
                    <span className="text-xs font-black text-stone-850">{tomorrowObj.display}</span>
                  </button>

                  {/* Custom Picker Button */}
                  <div className="relative">
                    <input
                      type="date"
                      value={customFutureDate}
                      onChange={(e) => handleCustomDateChange(e.target.value)}
                      min={todayObj.raw}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    />
                    <button
                      type="button"
                      className={`w-full p-2.5 rounded-xl border text-center transition-all flex flex-col justify-center items-center h-full ${
                        deliveryDateTab === "future"
                          ? "border-[#82862F] bg-[#82862F]/5 ring-2 ring-[#82862F]"
                          : "border-stone-200 bg-white hover:border-[#82862F]"
                      }`}
                    >
                      <span className="text-[10px] text-[#82862F] font-bold uppercase tracking-wider">Other Date</span>
                      <span className="text-xs font-black text-[#82862F] underline truncate">
                        {deliveryDateTab === "future" && customFutureDate
                          ? customFutureDate.split("-").reverse().slice(0, 2).join("/")
                          : "Select 📅"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Delivery Date Availability Banner */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-center">
                  {new Date().getHours() >= 23 ? (
                    <p className="text-[11.5px] font-bold text-amber-800 flex items-center justify-center gap-1.5 animate-pulse">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Next available delivery is tomorrow.</span>
                    </p>
                  ) : (
                    deliveryDateTab === "today" || deliveryDateTab === "tomorrow" ? (
                      <p className="text-[11.5px] font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        ✓ Same Day Delivery Available
                      </p>
                    ) : (
                      <p className="text-[11.5px] font-bold text-[#82862F] flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#82862F]"></span>
                        ✓ Advance Booking Available
                      </p>
                    )
                  )}
                </div>
              </div>

              {/* SECTION 4: Delivery Time Slot selection dropdown / menu */}
              <div className="space-y-2.5" id="checkout-section-time">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Delivery Time Slot 🕒
                </label>
                
                <div className="space-y-2">
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="w-full text-xs rounded-xl border-2 border-stone-200 focus:border-[#82862F] bg-white py-3 px-3 outline-none font-bold text-stone-850"
                  >
                    <option value="standard">Standard Delivery (10 AM - 8 PM) - FREE</option>
                    {new Date().getHours() < 20 && (
                      <option value="sameday">Same Day Delivery (Within 4 Hours) - +₹{deliverySettings.types.find(t => t.id === "sameday")?.charge ?? 99}</option>
                    )}
                    <option value="fixed">Fixed Time Delivery (Select Custom Hours) - +₹{deliverySettings.types.find(t => t.id === "fixed")?.charge ?? 149}</option>
                    <option value="night">Night Delivery (8 PM - 11 PM) - +₹{deliverySettings.types.find(t => t.id === "night")?.charge ?? 100}</option>
                    <option value="midnight">Midnight Delivery (11 PM - 12 AM) - +₹{deliverySettings.types.find(t => t.id === "midnight")?.charge ?? 249}</option>
                  </select>

                  {/* If Fixed Time Delivery, show specific hour selectors */}
                  {deliveryType === "fixed" && (
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2 animate-fade-in">
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest font-black leading-tight">
                        Select Fixed Delivery Time:
                      </p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFixedTimeSlot(slot)}
                            className={`text-[10px] py-1.5 font-bold rounded-lg transition-all border ${
                              fixedTimeSlot === slot
                                ? "bg-[#82862F] border-[#82862F] text-white"
                                : "bg-white border-stone-200 text-stone-700 hover:border-[#82862F]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: Add Personal Message Area */}
              <div className="space-y-2.5" id="checkout-section-message">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Write a Message ❤️
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={250}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Happy Birthday! Wishing you joy and happiness."
                    className="w-full text-xs rounded-xl border-2 border-stone-200 focus:border-[#82862F] bg-white p-3 outline-none text-stone-800 resize-none font-medium leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-semibold mt-1">
                    <span>⚡ Note card handwritten on envelope</span>
                    <span className={customMessage.length >= 240 ? "text-rose-600 font-bold" : ""}>
                      {customMessage.length}/250 chars
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 6: Recommended Gifting Add-ons */}
              <div className="space-y-3" id="checkout-section-addons">
                <div className="flex items-center justify-between pb-1">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Recommended Add-ons 🎁
                  </label>
                  <span className="text-[10px] text-[#82862F] bg-[#82862F]/10 px-2 py-0.5 rounded font-black font-mono">
                    Express Upgrade
                  </span>
                </div>

                {/* Horizontal row list of custom defined addons */}
                <div className="flex gap-3 overflow-x-auto pb-3 pt-0.5 scrollbar-thin scrollbar-thumb-stone-200 snap-x">
                  {ADDONS.map((ad) => {
                    const qty = localAddons[ad.id] || 0;
                    const getAddonEmoji = (cat: string) => {
                      return "🍫";
                    };
                    return (
                      <div
                        key={ad.id}
                        className="bg-white rounded-2xl border-2 border-stone-100 p-2.5 min-w-[125px] w-[125px] flex flex-col justify-between shrink-0 snap-start shadow-xs hover:border-[#82862F] transition-all"
                      >
                        <div className="relative rounded-lg overflow-hidden h-14 bg-stone-50 mb-1.5">
                          {ad.image ? (
                            <img src={ad.image} alt={ad.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-600 text-base font-bold">
                              {getAddonEmoji("chocolates")}
                            </div>
                          )}
                          <span className="absolute top-1 left-1 text-xs">{getAddonEmoji("chocolates")}</span>
                        </div>
                        
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-stone-850 line-clamp-1 leading-tight">{ad.name}</p>
                          <p className="text-[11px] font-black text-rose-600 font-mono">₹{ad.price}</p>
                        </div>

                        <div className="mt-2" id={`addon-act-${ad.id}`}>
                          {qty > 0 ? (
                            <div className="flex items-center justify-between border-2 border-[#82862F] rounded-lg h-7 bg-[#82862F]/5 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleModifyAddon(ad.id, -1)}
                                className="w-1/3 text-xs font-black text-[#82862F] text-center cursor-pointer hover:bg-white"
                              >
                                -
                              </button>
                              <span className="w-1/3 text-xs font-black text-center text-[#82862F] font-mono">{qty}</span>
                              <button
                                type="button"
                                onClick={() => handleModifyAddon(ad.id, 1)}
                                className="w-1/3 text-xs font-black text-[#82862F] text-center cursor-pointer hover:bg-white"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleModifyAddon(ad.id, 1)}
                              className="w-full py-1 bg-white hover:bg-[#82862F]/5 text-[#82862F] text-[10px] font-black uppercase rounded-lg border-2 border-stone-200 hover:border-[#82862F] cursor-pointer text-center transition-colors"
                            >
                              + ADD
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 7: Highly detailed Order Summary breakdown bill invoice */}
              <div className="bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 space-y-2 font-sans" id="checkout-section-summary">
                <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block border-b border-stone-200/50 pb-1.5">
                  Order Summary
                </span>
                
                <div className="space-y-1.5 text-xs text-stone-600 font-medium font-sans">
                  {/* Item price */}
                  <div className="flex justify-between items-center font-bold text-stone-850">
                    <span>Bouquet</span>
                    <span className="font-mono">₹{product.price}</span>
                  </div>

                  {/* Area Charge based on postcode lookup */}
                  <div className="flex justify-between items-center text-stone-650">
                    <span>Area Charge</span>
                    <span className="font-mono font-bold">₹{distanceCharge}</span>
                  </div>

                  {/* Dynamic Time Delivery Option Charge */}
                  <div className="flex justify-between items-center text-stone-650">
                    <span>{deliverySettings.types.find(t => t.id === deliveryType)?.name || "Standard Delivery"}</span>
                    <span className="font-mono font-bold">₹{deliveryCost}</span>
                  </div>

                  {/* Addons detailed individual rates list */}
                  {Object.entries(localAddons).map(([id, qty]) => {
                    const ad = ADDONS.find((a) => a.id === id);
                    if (!ad) return null;
                    return (
                      <div key={id} className="flex justify-between items-center text-stone-500 text-[11px] pl-2 border-l border-stone-200">
                        <span>• {ad.name} (Qty {qty})</span>
                        <span className="font-mono font-bold">₹{ad.price * (qty as number)}</span>
                      </div>
                    );
                  })}

                  {premiumWrapping && (
                    <div className="flex justify-between items-center text-xs text-rose-700 pl-2 border-l border-rose-200">
                      <span>Velvet Gift Wrapping Wrapper</span>
                      <span className="font-mono font-bold">+₹49</span>
                    </div>
                  )}
                </div>

                {/* Grand Total Footer row */}
                <div className="flex justify-between items-center border-t border-stone-200/60 pt-2.5 mt-2">
                  <span className="text-sm font-extrabold text-[#82862F] uppercase">Total</span>
                  <span className="text-xl font-black text-rose-600 font-mono font-sans font-bold">₹{currentTotal}</span>
                </div>
              </div>

              {/* SECTION 8: PRIMARY ACTION BUTTONS */}
              <div className="space-y-3 pt-2" id="checkout-section-actions">
                {product.quantity !== undefined && product.quantity <= 0 ? (
                  <button
                    disabled
                    className="w-full py-4 bg-stone-100 text-stone-400 font-extrabold text-sm uppercase tracking-wider rounded-xl cursor-not-allowed select-none border border-stone-200 text-center"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <>
                    {/* Button 1: Add to Basket */}
                    <button
                      onClick={handleAddToCartFlow}
                      className="w-full py-3.5 px-4 border-2 border-[#82862F] hover:bg-[#82862F]/5 text-[#82862F] bg-white rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                    >
                      <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
                      <span>Add to Basket</span>
                    </button>

                    {/* Button 2: Order instantly on WhatsApp → opens cart drawer for full validation */}
                    <button
                      onClick={() => {
                        handleAddToCartFlow();
                        onOpenCart();
                      }}
                      className="w-full py-4 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
                    >
                      <MessageCircle className="w-5 h-5 fill-white stroke-none shrink-0 animate-bounce" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </>
                )}

                <p className="text-center text-[10px] text-stone-400 font-medium">
                  💳 Security assure: Pay securely on WhatsApp via GPay or cash-on-door
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

        {/* ================= ABOUT PRODUCT TABS (Amazon / FNP Style) ================= */}
        <div className="mt-14 border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs" id="about-product-tabs-block">
          
          {/* Navigation Bar tabs headers */}
          <div className="flex border-b border-stone-200 bg-[#F9FAEE]/40 text-xs sm:text-sm font-bold text-stone-500">
            <button
              onClick={() => setActiveTab("desc")}
              className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "desc" 
                  ? "border-[#82862F] text-[#82862F] bg-white font-black" 
                  : "border-transparent hover:text-stone-800"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("care")}
              className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "care" 
                  ? "border-[#82862F] text-[#82862F] bg-white font-black" 
                  : "border-transparent hover:text-stone-800"
              }`}
            >
              Care Instructions
            </button>
            <button
              onClick={() => setActiveTab("deliv")}
              className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "deliv" 
                  ? "border-[#82862F] text-[#82862F] bg-white font-black" 
                  : "border-transparent hover:text-stone-800"
              }`}
            >
              Delivery Information
            </button>
          </div>

          {/* Interactive content based on active tab state */}
          <div className="p-6 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans" id="tab-interactive-content">
            {activeTab === "desc" && (
              <div className="space-y-3">
                <p>
                  Our <strong className="text-stone-900 font-semibold font-serif">"{product.title}"</strong> features gorgeous fresh stems hand-picked from the local nursery in Pune early in the morning. Each floral design complies with supreme standards of florist aesthetics.
                </p>
                <p>
                  Arranged elegantly in eco-friendly paper wrap and custom satin ribbons by local handcraft decorators. It makes a beautiful centerpiece for occasions like Birthdays, Anniversaries, Corporate functions, Weddings, and more.
                </p>
                <p>
                  <strong className="text-stone-800">Freshness Guarantee:</strong> All natural flower bouquets are guaranteed to maintain complete freshness for at least 3-5 days after doorstep delivery in Pune.
                </p>
              </div>
            )}

            {activeTab === "care" && (
              <div className="space-y-2">
                <p className="font-bold text-stone-800">For natural fresh flowers longevity, please follow these guidelines:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-1.5 font-sans font-medium text-stone-600">
                  <li>🚫 Keep the stems away from direct afternoon sunlight, radiator heat or cold drafts.</li>
                  <li>💧 For vase arrangements, replace local tap water once every single morning with fresh cool water.</li>
                  <li>✂️ Trim about 1-2 cm of the stem tips regularly at a 45-degree angle in clean shear scissors.</li>
                  <li>🍃 Remove any leaves that submerge below the water line to prevent bacterial growth.</li>
                </ul>
              </div>
            )}

            {activeTab === "deliv" && (
              <div className="space-y-2">
                <p className="font-bold text-stone-800 font-sans">Sajawat Florist Delivery Assurance Standards:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-1.5 font-sans font-medium text-stone-600">
                  <li>📍 Fast delivery available across Hadapsar, Viman Nagar, Kharadi, Baner, Kothrud and all main Pune PIN codes.</li>
                  <li>🕒 Standard Delivery is free, while Same Day is for +₹99 and Premium Midnight surprises are at +₹249.</li>
                  <li>📸 Actual photo proof is shared on WhatsApp before the dispatch rider sets off.</li>
                  <li>🍰 Cakes and decorations are prepared fresh on order with strict hygiene routines.</li>
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* ================= BOTTOM SECTION / Similar Gifting Suggestions ================= */}
        <div className="mt-16 space-y-6" id="you-may-also-like-block">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                You May Also Like
              </h3>
              <p className="text-xs text-stone-500 font-sans font-light">
                Complement with similar bouquets, premium chocolates, or cute teddy bears.
              </p>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-rose-500 border border-rose-100 bg-rose-50/50 py-1 px-3.5 rounded-full">
              ⭐ Premium Curations
            </div>
          </div>

          {/* Vertical Grid Layout matching all other product sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-start" id="suggestions-grid">
            {combinedSuggestions.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onAddToCart={onAddToCart}
                onOpenCart={onOpenCart}
                onSelectProduct={(p) => {
                  onSelectProduct(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ================= SMART STICKY BAR ACTIONS FOR MOBILE VIEW (Inspired by FNP/Amazon) ================= */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-4 py-3 sm:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.06)] flex justify-between items-center gap-3 font-sans"
        id="mobile-sticky-action-bar"
      >
        <div className="flex flex-col justify-center min-w-max shrink-0">
          <span className="text-[8.5px] text-stone-400 uppercase tracking-widest font-bold">Estimated Cost</span>
          <span className="text-lg font-black text-rose-600 font-mono">₹{currentTotal}</span>
        </div>
        
        {product.quantity !== undefined && product.quantity <= 0 ? (
          <button
            disabled
            className="flex-1 py-3 bg-stone-100 text-stone-400 font-extrabold text-xs uppercase tracking-wider rounded-lg cursor-not-allowed select-none border border-stone-200 text-center"
          >
            Out of Stock
          </button>
        ) : (
          <div className="flex-1 grid grid-cols-2 gap-2">
            {/* Add to Basket button */}
            <button
              onClick={handleAddToCartFlow}
              className="py-2.5 bg-white border border-emerald-600 text-emerald-700 text-[10px] uppercase tracking-wider font-extrabold rounded-lg flex items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Basket</span>
            </button>
            
            {/* Order on WhatsApp button */}
            <button
              onClick={triggerWhatsAppDirectLink}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase tracking-wider font-extrabold rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-md active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
              <span>WhatsApp Now</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
