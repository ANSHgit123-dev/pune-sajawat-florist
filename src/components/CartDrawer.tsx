import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Plus, Minus, Gift, MessageCircle, FileText, ScrollText, AlertCircle, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CartItem } from "../types";
import { ADDONS } from "../data";
import { getDeliverySettings } from "../utils/deliverySettings";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  selectedAddons: { [addonId: string]: number };
  onAddAddon: (addonId: string) => void;
  onRemoveAddon: (addonId: string) => void;
  onClearAddons: () => void;
}

// Time Slots Configuration
const TIME_SLOTS: Record<string, string[]> = {
  standard: [
    "10:00 AM – 1:00 PM",
    "1:00 PM – 4:00 PM",
    "4:00 PM – 8:00 PM"
  ],
  morning: [
    "7:00 AM – 9:00 AM",
    "8:00 AM – 10:00 AM",
    "9:00 AM – 11:00 AM"
  ],
  express: [
    "Within 60 Minutes",
    "Within 90 Minutes",
    "Within 2 Hours"
  ]
};

// Generate exact times from 10:00 AM to 10:00 PM (15-min intervals)
const FIXED_TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  // 10:00 AM to 11:45 AM
  for (let h = 10; h <= 11; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${h}:${String(m).padStart(2, '0')} AM`);
    }
  }
  // 12:00 PM to 12:45 PM
  for (let m = 0; m < 60; m += 15) {
    slots.push(`12:${String(m).padStart(2, '0')} PM`);
  }
  // 1:00 PM to 9:45 PM
  for (let h = 1; h <= 9; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${h}:${String(m).padStart(2, '0')} PM`);
    }
  }
  // 10:00 PM
  slots.push("10:00 PM");
  return slots;
})();

const PRE_MIDNIGHT_SLOTS = [
  "11:00 PM",
  "11:15 PM",
  "11:30 PM",
  "11:45 PM",
  "11:59 PM"
];

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedAddons,
  onAddAddon,
  onRemoveAddon,
  onClearAddons
}: CartDrawerProps) {
  const settings = getDeliverySettings();

  const getFormattedShortDate = (offsetDays: number): { raw: string; display: string } => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
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
  const isPastCutoff = new Date().getHours() >= 23;

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryArea, setDeliveryArea] = useState(settings.areas[0]?.name || "Hadapsar");
  const [pincode, setPincode] = useState(settings.areas[0]?.postcode || "411028");
  const [deliveryDate, setDeliveryDate] = useState(() => {
    return isPastCutoff ? tomorrowObj.raw : todayObj.raw;
  });
  const [address, setAddress] = useState("");
  
  // Delivery option state
  const [deliveryType, setDeliveryType] = useState<"standard" | "morning" | "express" | "fixed" | "midnight">("standard");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");

  // Validation states
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Personal message state
  const [customMessage, setCustomMessage] = useState("");

  // Mobile breakdown collapse state
  const [isMobileBreakdownExpanded, setIsMobileBreakdownExpanded] = useState(false);

  // Placed Order ID state
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Clear slot selection if deliveryType changes or if date rules apply
  useEffect(() => {
    const isToday = deliveryDate === todayObj.raw;
    if (deliveryType === "express" && !isToday) {
      setDeliveryTimeSlot("");
    } else if (deliveryType === "midnight" && !isToday) {
      setDeliveryTimeSlot("");
    } else {
      // Validate that current slot belongs to active type
      if (deliveryType === "fixed") {
        if (!FIXED_TIME_SLOTS.includes(deliveryTimeSlot)) {
          setDeliveryTimeSlot("");
        }
      } else if (deliveryType === "midnight") {
        if (!PRE_MIDNIGHT_SLOTS.includes(deliveryTimeSlot)) {
          setDeliveryTimeSlot("");
        }
      } else {
        const allowed = TIME_SLOTS[deliveryType] || [];
        if (!allowed.includes(deliveryTimeSlot)) {
          setDeliveryTimeSlot("");
        }
      }
    }
  }, [deliveryDate, deliveryType]);

  const handleAreaChange = (areaName: string) => {
    setDeliveryArea(areaName);
    const matched = settings.areas.find((a) => a.name === areaName);
    if (matched) {
      setPincode(matched.postcode);
    }
  };

  const itemsSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const itemsOriginalSubtotal = cart.reduce((total, item) => total + item.product.originalPrice * item.quantity, 0);
  
  // Calculate Addon charges
  const addonsSubtotal = Object.entries(selectedAddons).reduce((acc, [addonId, qty]) => {
    const template = ADDONS.find((a) => a.id === addonId);
    return acc + (template ? template.price * qty : 0);
  }, 0);

  // Delivery Charges mapping
  const getDeliveryFee = () => {
    switch (deliveryType) {
      case "standard": return 0;
      case "morning": return 99;
      case "express": return 149;
      case "fixed": return 199;
      case "midnight": return 299;
      default: return 0;
    }
  };

  const getDeliveryLabel = () => {
    switch (deliveryType) {
      case "standard": return "Standard Delivery";
      case "morning": return "Morning Delivery";
      case "express": return "Express Delivery";
      case "fixed": return "Fixed Time Delivery";
      case "midnight": return "Pre-Midnight Delivery";
      default: return deliveryType;
    }
  };

  const deliveryCost = getDeliveryFee(); // Selected type cost
  const finalTotal = itemsSubtotal + addonsSubtotal + deliveryCost;

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const monthIndex = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${months[monthIndex]}`;
  };

  const checkValidation = (): string[] => {
    const errors: string[] = [];
    if (!recipientName.trim()) errors.push("recipientName");
    if (!recipientPhone.trim()) errors.push("recipientPhone");
    if (!deliveryDate.trim()) errors.push("deliveryDate");
    if (!deliveryType) errors.push("deliveryType");
    
    const isToday = deliveryDate === todayObj.raw;
    if (deliveryType === "express" && !isToday) {
      errors.push("deliveryTimeSlot");
    } else if (deliveryType === "midnight" && !isToday) {
      errors.push("deliveryTimeSlot");
    } else if (!deliveryTimeSlot.trim()) {
      errors.push("deliveryTimeSlot");
    }

    if (!deliveryArea.trim()) errors.push("deliveryArea");
    if (!pincode.trim()) errors.push("pincode");
    if (!address.trim()) errors.push("address");
    return errors;
  };

  const isFormValid = checkValidation().length === 0;

  const triggerWhatsApp = () => {
    if (cart.length === 0) return;

    setSubmitAttempted(true);
    const errors = checkValidation();
    setValidationErrors(errors);

    if (errors.length > 0) {
      const fieldIdMap: Record<string, string> = {
        recipientName: "field-recipient-name",
        recipientPhone: "field-recipient-phone",
        deliveryDate: "field-delivery-date",
        deliveryType: "field-delivery-type",
        deliveryTimeSlot: "field-delivery-time-slot",
        deliveryArea: "field-delivery-area",
        pincode: "field-pincode",
        address: "field-address",
      };

      const firstError = errors[0];
      const targetId = fieldIdMap[firstError];
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = element.querySelector("input, select, textarea") as HTMLElement;
        if (input) input.focus();
      }
      return;
    }

    // 1. Fetch current orders and seed initial data if missing
    let existingOrders: any[] = [];
    try {
      const saved = localStorage.getItem("sajawat_orders");
      if (saved) {
        existingOrders = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not read orders localStorage:", e);
    }

    // 2. Generate next Order ID
    let nextNum = 1005;
    if (existingOrders.length > 0) {
      const ids = existingOrders.map(o => {
        const num = parseInt(o.id.replace("PSF-", ""));
        return isNaN(num) ? 1000 : num;
      });
      nextNum = Math.max(...ids) + 1;
    }
    const orderId = `PSF-${nextNum}`;

    // 3. Build current products summaries
    const orderProducts = cart.map(item => ({
      title: item.product.title,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.image
    }));

    const orderAddonsStr: any[] = [];
    Object.entries(selectedAddons).forEach(([addonId, qty]) => {
      if (qty > 0) {
        const ad = ADDONS.find(a => a.id === addonId);
        if (ad) {
          orderAddonsStr.push({
            name: ad.name,
            quantity: qty,
            price: ad.price
          });
        }
      }
    });

    // 4. Construct Order object
    const newOrder = {
      id: orderId,
      customerName: recipientName,
      phoneNumber: recipientPhone,
      products: orderProducts,
      price: finalTotal,
      addons: orderAddonsStr,
      deliveryDate: deliveryDate,
      deliveryTime: `${getDeliveryLabel()} (${deliveryTimeSlot})`,
      address: `${address.trim()}, ${deliveryArea}, Pune - ${pincode}`,
      personalMessage: customMessage.trim(),
      status: "Pending" as const,
      createdAt: new Date().toISOString()
    };

    // 5. Save order
    existingOrders.unshift(newOrder);
    try {
      localStorage.setItem("sajawat_orders", JSON.stringify(existingOrders));
    } catch (e) {
      console.error(e);
    }

    // Generate WhatsApp text and open WhatsApp
    const floristWhatsApp = "918484905722";
    
    let msg = `🌸 *Pune Sajawat Florist Order*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `👤 *Customer Details*\n`;
    msg += `* Recipient Name: ${recipientName.trim()}\n`;
    msg += `* Phone Number: ${recipientPhone.trim()}\n\n`;

    msg += `📦 *Delivery Details*\n`;
    msg += `* Delivery Date: ${deliveryDate}\n`;
    msg += `* Delivery Type: ${getDeliveryLabel()}\n`;
    msg += `* Requested Delivery Time: ${deliveryTimeSlot}\n`;
    msg += `* Delivery Area: ${deliveryArea}\n`;
    msg += `* Pincode: ${pincode}\n`;
    msg += `* Complete Address: ${address.trim()}\n\n`;

    msg += `🛒 *Products Ordered*\n`;
    cart.forEach(item => {
      msg += `* ${item.product.title} × ${item.quantity}\n`;
      msg += `  Price: ₹${item.product.price * item.quantity}\n`;
    });
    msg += `\n`;

    const activeAddons = Object.entries(selectedAddons).filter(([, qty]) => qty > 0);
    if (activeAddons.length > 0) {
      msg += `🍫 *Selected Add-ons*\n`;
      activeAddons.forEach(([addonId, qty]) => {
        const ad = ADDONS.find(a => a.id === addonId);
        if (ad) {
          msg += `* ${ad.name} × ${qty}\n`;
          msg += `  Price: ₹${ad.price * qty}\n`;
        }
      });
      msg += `\n`;
    }

    if (customMessage.trim()) {
      msg += `💌 *Greeting Card Message*\n`;
      msg += `"${customMessage.trim()}"\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `🧾 *Order Summary*\n`;
    msg += `* Products Total: ₹${itemsSubtotal}\n`;
    if (addonsSubtotal > 0) {
      msg += `* Add-ons Total: ₹${addonsSubtotal}\n`;
    }
    msg += `* Delivery Charge: ${deliveryCost > 0 ? `₹${deliveryCost}` : "Free"}\n`;
    msg += `* Grand Total: ₹${finalTotal}*\n\n`;

    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🙏 Thank you!\nPlease confirm this order.`;

    const encodedText = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${floristWhatsApp}&text=${encodedText}`, "_blank");

    // SetPlacedOrderId to trigger Success Modal State
    setPlacedOrderId(orderId);
  };

  const handleFullClear = () => {
    onClearCart();
    onClearAddons();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/65 z-50 cursor-pointer"
            id="cart-backdrop"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed top-0 right-0 h-full w-full ${cart.length > 0 ? "md:max-w-4xl lg:max-w-5xl xl:max-w-[1100px] shadow-2xl" : "max-w-md"} bg-white shadow-2xl z-55 flex flex-col overflow-hidden transition-all duration-350`}
            id="cart-panel"
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-10" id="cart-header">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 rounded-md text-rose-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-stone-900 font-sans tracking-tight">Checkout</h3>
                  <p className="text-[10px] text-[#82862F] font-bold uppercase tracking-wide">{cart.length} item(s) selected for Pune delivery</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                aria-label="Close cart"
                id="close-cart-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-stone-50/40" id="cart-contents">
              {placedOrderId ? (
                <div className="py-12 px-4 text-center max-w-md mx-auto flex flex-col items-center justify-center space-y-5 font-sans" id="order-success-view">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-emerald-700 font-extrabold uppercase tracking-widest bg-emerald-50 border border-emerald-100/60 px-3 py-1.5 rounded-full inline-block mb-3">Order System Saved Complete</span>
                    <h4 className="font-extrabold text-stone-900 text-lg tracking-tight">Your Order ID: <span className="text-rose-650 font-mono font-black">{placedOrderId}</span></h4>
                    <p className="text-[11.5px] text-stone-505 mt-2 leading-relaxed">
                      We've successfully registered your delivery details in Pune Sajawat's database order tracker. Click below to continue onto WhatsApp to verify stock availability & complete UPI transfer!
                    </p>
                  </div>

                  <div className="w-full bg-white border border-stone-150 p-4 rounded-xl text-left text-xs space-y-2.5 shadow-xs">
                    <div className="flex justify-between items-center text-stone-500 pb-1.5 border-b border-stone-50">
                      <span>Recipient Name</span>
                      <strong className="text-stone-800 font-bold">{recipientName}</strong>
                    </div>
                    <div className="flex justify-between items-center text-stone-500 pb-1.5 border-b border-stone-50">
                      <span>Phone Number</span>
                      <strong className="text-stone-850 font-bold font-mono">{recipientPhone}</strong>
                    </div>
                    <div className="flex justify-between items-center text-stone-500 pb-1.5 border-b border-stone-50">
                      <span>Preferred Date</span>
                      <strong className="text-stone-800 font-mono font-bold">{deliveryDate}</strong>
                    </div>
                    <div className="flex justify-between items-center text-stone-500 pb-1.5 border-b border-stone-50">
                      <span>Delivery Option</span>
                      <strong className="text-[#82862F] font-bold text-[11px]">{getDeliveryLabel()}</strong>
                    </div>
                    <div className="pt-1.5 flex justify-between items-center">
                      <span className="font-semibold text-stone-700 uppercase tracking-wide text-[11px]">Total Reserved</span>
                      <strong className="text-[#82862F] font-mono font-black text-sm">₹{finalTotal}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const floristWhatsApp = "918484905722";

                      let msg = `🌸 *Pune Sajawat Florist Order*\n`;
                      msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

                      msg += `👤 *Customer Details*\n`;
                      msg += `Recipient Name: ${recipientName}\n`;
                      msg += `Phone Number: ${recipientPhone}\n\n`;

                      msg += `📦 *Delivery Details*\n`;
                      msg += `Delivery Date: ${deliveryDate}\n`;
                      msg += `Delivery Type: ${getDeliveryLabel()}\n`;
                      if (deliveryTimeSlot) msg += `Time Slot: ${deliveryTimeSlot}\n`;
                      msg += `Area: ${deliveryArea}\n`;
                      msg += `Pincode: ${pincode}\n`;
                      msg += `Complete Address: ${address.trim()}\n`;
                      msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

                      msg += `🛒 *Products Ordered*\n`;
                      cart.forEach(item => {
                        msg += `• ${item.product.title} × ${item.quantity}\n`;
                        msg += `  ₹${item.product.price * item.quantity}\n`;
                      });
                      msg += `\n`;

                      const activeAddons = Object.entries(selectedAddons).filter(([, qty]) => qty > 0);
                      if (activeAddons.length > 0) {
                        msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                        msg += `🍫 *Selected Add-ons*\n`;
                        activeAddons.forEach(([addonId, qty]) => {
                          const ad = ADDONS.find(a => a.id === addonId);
                          if (ad) {
                            msg += `• ${ad.name} × ${qty}  — ₹${ad.price * qty}\n`;
                          }
                        });
                        msg += `\n`;
                      }

                      if (customMessage.trim()) {
                        msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                        msg += `💌 *Greeting Card Message*\n`;
                        msg += `"${customMessage.trim()}"\n\n`;
                      }

                      msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                      msg += `🧾 *Order Summary*\n`;
                      msg += `Products Total: ₹${itemsSubtotal}\n`;
                      if (addonsSubtotal > 0) msg += `Add-ons Total: ₹${addonsSubtotal}\n`;
                      msg += `Delivery: ${deliveryCost > 0 ? `₹${deliveryCost}` : "Free"}\n`;
                      msg += `*Grand Total: ₹${finalTotal}*\n\n`;

                      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
                      msg += `🙏 Thank you!\nPlease confirm this order.`;

                      const encodedText = encodeURIComponent(msg);
                      window.open(`https://api.whatsapp.com/send?phone=${floristWhatsApp}&text=${encodedText}`, "_blank");

                      onClearCart();
                      onClearAddons();
                      setPlacedOrderId(null);
                      onClose();
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10 active:scale-98"
                  >
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>Proceed to WhatsApp to Confirm ⚡</span>
                  </button>

                  <button
                    onClick={() => {
                      onClearCart();
                      onClearAddons();
                      setPlacedOrderId(null);
                      onClose();
                    }}
                    className="text-[10px] font-extrabold text-stone-400 hover:text-stone-700 uppercase tracking-widest cursor-pointer hover:underline pt-2 animate-pulse"
                  >
                    Skip & Close
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center space-y-3 font-sans" id="empty-cart-view">
                  <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-800 text-base">Your gifting basket is empty</h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto px-4">
                      Choose some beautiful fresh flowers, personalized cakes, and add-ons to begin!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-5 py-1.5 bg-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                    id="cart-shop-now-btn"
                  >
                    Start Gifting Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  
                  {/* LEFT COLUMN (70%) */}
                  <div className="md:col-span-8 space-y-4">
                    
                    {/* 1. Product details */}
                    <div className="bg-white p-3.5 rounded-lg border border-stone-200/60" id="cart-items-list">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                        <span>Items in Basket</span>
                        <button onClick={handleFullClear} className="hover:text-rose-600 hover:underline cursor-pointer">
                          Clear all
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex gap-2.5 p-2 rounded-md bg-stone-50/50 border border-stone-200/50"
                            id={`cart-item-${item.product.id}`}
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-sm object-cover bg-stone-100 shrink-0 border border-stone-200"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-stone-900 text-xs line-clamp-1 leading-snug">{item.product.title}</h4>
                                <p className="text-[9px] text-[#82862F] font-bold mt-0.5 uppercase tracking-wide">{item.product.category}</p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-1.5 font-sans">
                                <div className="flex items-center gap-1 font-mono text-xs">
                                  <span className="font-bold text-rose-600">₹{item.product.price}</span>
                                  {item.product.originalPrice > item.product.price && (
                                    <span className="text-stone-400 line-through text-[9px] ml-1 font-mono">₹{item.product.originalPrice}</span>
                                  )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-1.5 bg-white px-1.5 py-0.5 rounded-md border border-stone-200">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                    className="text-stone-500 hover:text-stone-950 p-0.5 cursor-pointer"
                                    id={`qty-minus-${item.product.id}`}
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span className="font-mono text-xs font-bold px-1 text-stone-800">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                    className="text-stone-500 hover:text-stone-950 p-0.5 cursor-pointer"
                                    id={`qty-plus-${item.product.id}`}
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. CHOSEN ADD-ONS SUB-LIST */}
                    {Object.entries(selectedAddons).some(([_, q]) => q > 0) && (
                      <div className="bg-white p-3 rounded-lg border border-stone-200/60" id="added-addons-summary-block">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Added Gifts & Extras</div>
                        <div className="space-y-1.5">
                          {Object.entries(selectedAddons).map(([addonId, qty]) => {
                            const ad = ADDONS.find((a) => a.id === addonId);
                            if (!ad || qty === 0) return null;
                            return (
                              <div key={addonId} className="flex items-center justify-between p-1.5 rounded-md bg-stone-50 border border-stone-200/40 text-xs">
                                <div className="flex items-center gap-2">
                                  <img src={ad.image} alt={ad.name} className="w-7 h-7 rounded-sm object-cover border border-stone-200" />
                                  <div>
                                    <p className="font-bold text-stone-800 leading-tight">{ad.name}</p>
                                    <p className="text-[9px] text-rose-600 font-mono">₹{ad.price} each</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white rounded border border-stone-200 px-1 py-0.5">
                                  <button
                                    onClick={() => onRemoveAddon(addonId)}
                                    className="text-stone-500 hover:text-rose-600 cursor-pointer"
                                    id={`addedaddon-minus-${addonId}`}
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span className="font-bold font-mono text-xs px-0.5">{qty}</span>
                                  <button
                                    onClick={() => onAddAddon(addonId)}
                                    className="text-stone-500 hover:text-rose-600 cursor-pointer"
                                    id={`addedaddon-plus-${addonId}`}
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quick Add-ons Recommended list */}
                    <div className="py-2.5 px-3 rounded-lg border border-[#82862F]/20 bg-[#F9FAEE]/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-[#82862F] font-bold text-[11px] uppercase tracking-wide">
                        <Gift className="w-3 h-3 text-[#FC8019]" />
                        <span>Recommended Add-ons & Extras</span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
                        {ADDONS.map((addon) => {
                          const qty = selectedAddons[addon.id] || 0;
                          return (
                            <div
                              key={addon.id}
                              className="bg-white rounded-md border border-stone-200 p-1.5 min-w-[95px] w-[95px] flex flex-col justify-between shrink-0 snap-start shadow-xs hover:border-rose-300 transition-colors"
                            >
                              <img src={addon.image} alt={addon.name} className="w-full h-11 object-cover rounded-sm mb-1" />
                              <p className="text-[8.5px] font-bold text-stone-800 line-clamp-1 leading-tight">{addon.name}</p>
                              <span className="text-[9px] font-mono font-bold text-rose-600">₹{addon.price}</span>
                              <div className="mt-1 font-sans">
                                {qty > 0 ? (
                                  <div className="flex items-center justify-between border border-rose-500 rounded h-4.5 overflow-hidden">
                                    <button onClick={() => onRemoveAddon(addon.id)} className="w-1/3 text-[9px] font-bold text-rose-600 text-center cursor-pointer">-</button>
                                    <span className="w-1/3 text-[8px] font-bold text-center font-mono">{qty}</span>
                                    <button onClick={() => onAddAddon(addon.id)} className="w-1/3 text-[9px] font-bold text-rose-600 text-center cursor-pointer">+</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => onAddAddon(addon.id)}
                                    className="w-full py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[8px] font-extrabold uppercase rounded border border-rose-200/50 cursor-pointer text-center transition-colors"
                                    id={`addon-quickadd-${addon.id}`}
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

                    {/* 2-Column fields layout for Address & Delivery details */}
                    <div className="p-3.5 rounded-lg border border-stone-200/60 bg-white space-y-4 font-sans" id="delivery-config-block">
                      <div className="flex items-center gap-1.5 text-stone-800 font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-stone-100">
                        <Gift className="w-3.5 h-3.5 text-[#82862F]" />
                        <span>Delivery Details</span>
                      </div>

                      {/* Validation Warning Banner */}
                      {submitAttempted && validationErrors.length > 0 && (
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-left flex items-start gap-2 animate-shake" id="validation-error-banner">
                          <AlertCircle className="w-4 h-4 text-rose-650 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="text-rose-700 font-bold block">
                              Please complete all required delivery details before placing your order.
                            </span>
                            <ul className="text-[10px] text-stone-500 list-disc list-inside mt-1 font-semibold space-y-0.5">
                              {validationErrors.map((err) => {
                                switch (err) {
                                  case "recipientName": return <li key={err}>Recipient Name</li>;
                                  case "recipientPhone": return <li key={err}>Phone Number</li>;
                                  case "deliveryDate": return <li key={err}>Delivery Date</li>;
                                  case "deliveryType": return <li key={err}>Delivery Type</li>;
                                  case "deliveryTimeSlot": return <li key={err}>Delivery Time</li>;
                                  case "deliveryArea": return <li key={err}>Local Area</li>;
                                  case "pincode": return <li key={err}>Pincode</li>;
                                  case "address": return <li key={err}>Complete Delivery Address</li>;
                                  default: return null;
                                }
                              })}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Recipient Name | Phone Number (2 columns) */}
                      <div className="grid grid-cols-2 gap-3" id="recipient-details-row">
                        <div id="field-recipient-name">
                          <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-0.5 block">Recipient Name <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            placeholder="Recipient's Name"
                            value={recipientName}
                            onChange={(e) => {
                              setRecipientName(e.target.value);
                              setSubmitAttempted(false);
                            }}
                            className={`w-full text-xs rounded-md border py-1.5 px-2.5 outline-none text-stone-850 transition-all font-sans ${
                              submitAttempted && validationErrors.includes("recipientName")
                                ? "border-rose-455 bg-rose-50/10 focus:border-rose-600"
                                : "border-stone-200 focus:border-[#82862F]/50"
                            }`}
                          />
                        </div>
                        <div id="field-recipient-phone">
                          <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-0.5 block">Phone Number <span className="text-rose-500">*</span></label>
                          <input
                            type="tel"
                            placeholder="Recipient's Phone"
                            value={recipientPhone}
                            onChange={(e) => {
                              setRecipientPhone(e.target.value);
                              setSubmitAttempted(false);
                            }}
                            className={`w-full text-xs rounded-md border py-1.5 px-2.5 outline-none text-stone-850 transition-all font-sans font-mono ${
                              submitAttempted && validationErrors.includes("recipientPhone")
                                ? "border-rose-455 bg-rose-50/10 focus:border-rose-600"
                                : "border-stone-200 focus:border-[#82862F]/50"
                            }`}
                          />
                        </div>
                      </div>

                      {/* PREMIUM DELIVERY DATE SELECTION */}
                      <div className="space-y-2" id="field-delivery-date">
                        <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-0.5 block">
                          Select Delivery Date <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {/* Today Button */}
                          <button
                            type="button"
                            disabled={isPastCutoff}
                            onClick={() => {
                              setDeliveryDate(todayObj.raw);
                              setSubmitAttempted(false);
                            }}
                            className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col justify-center items-center font-sans ${
                              isPastCutoff
                                ? "border-stone-150 bg-stone-50 text-stone-300 opacity-40 cursor-not-allowed"
                                : deliveryDate === todayObj.raw
                                ? "border-[#82862F] bg-[#82862F]/5 ring-1 ring-[#82862F] font-bold text-stone-900"
                                : "border-stone-200 bg-white hover:border-[#82862F] text-stone-750"
                            }`}
                            id="date-btn-today"
                          >
                            <span className="text-[9px] uppercase tracking-wider block font-semibold opacity-75">Today</span>
                            <span className="text-xs font-bold font-mono">{todayObj.display}</span>
                          </button>

                          {/* Tomorrow Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setDeliveryDate(tomorrowObj.raw);
                              setSubmitAttempted(false);
                            }}
                            className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col justify-center items-center font-sans ${
                              deliveryDate === tomorrowObj.raw
                                ? "border-[#82862F] bg-[#82862F]/5 ring-1 ring-[#82862F] font-bold text-stone-900"
                                : "border-stone-200 bg-white hover:border-[#82862F] text-stone-750"
                            }`}
                            id="date-btn-tomorrow"
                          >
                            <span className="text-[9px] uppercase tracking-wider block font-semibold opacity-75">Tomorrow</span>
                            <span className="text-xs font-bold font-mono">{tomorrowObj.display}</span>
                          </button>

                          {/* Choose Date Button */}
                          <div className="relative">
                            <input
                              type="date"
                              min={isPastCutoff ? tomorrowObj.raw : todayObj.raw}
                              value={deliveryDate !== todayObj.raw && deliveryDate !== tomorrowObj.raw ? deliveryDate : ""}
                              onChange={(e) => {
                                if (e.target.value) {
                                  setDeliveryDate(e.target.value);
                                  setSubmitAttempted(false);
                                }
                              }}
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 text-[16px]"
                            />
                            <button
                              type="button"
                              className={`w-full py-2 px-2 rounded-lg border text-center transition-all flex flex-col justify-center items-center h-full font-sans ${
                                deliveryDate !== todayObj.raw && deliveryDate !== tomorrowObj.raw && deliveryDate !== ""
                                  ? "border-[#82862F] bg-[#82862F]/5 ring-1 ring-[#82862F] font-bold text-stone-900"
                                  : "border-stone-200 bg-white hover:border-[#82862F] text-stone-750"
                              }`}
                              id="date-btn-choose"
                            >
                              <span className="text-[9px] uppercase tracking-wider block font-semibold opacity-75">Choose Date</span>
                              <span className="text-xs font-bold font-mono">
                                {deliveryDate !== todayObj.raw && deliveryDate !== tomorrowObj.raw && deliveryDate !== ""
                                  ? formatDateDisplay(deliveryDate)
                                  : "Select 📅"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* DELIVERY METHODS & TIME SLOTS WIDGET */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        
                        {/* LEFT COLUMN: Delivery Type Cards */}
                        <div className="space-y-2" id="field-delivery-type">
                          <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-0.5 block">
                            Delivery Type <span className="text-rose-500">*</span>
                          </label>
                          <div className="flex flex-col gap-2">
                            {[
                              { id: "standard", name: "Standard Delivery", price: 0, label: "FREE", info: "Flexible delivery slot" },
                              { id: "morning", name: "Morning Delivery", price: 99, label: "+₹99", info: "For early morning surprise" },
                              { id: "express", name: "Express Delivery", price: 149, label: "+₹149", info: "Delivery within 60-120 mins" },
                              { id: "fixed", name: "Fixed Time Delivery", price: 199, label: "+₹199", info: "Choose custom exact time" },
                              { id: "midnight", name: "Pre-Midnight Delivery", price: 299, label: "+₹299", info: "Deliver between 11 PM - midnight" },
                            ].map((opt) => {
                              const isSelected = deliveryType === opt.id;
                              const hasError = submitAttempted && validationErrors.includes("deliveryType");
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setDeliveryType(opt.id as any);
                                    setSubmitAttempted(false);
                                  }}
                                  className={`text-left p-2.5 rounded-xl border-2 transition-all flex justify-between items-center cursor-pointer ${
                                    isSelected
                                      ? "border-[#82862F] bg-[#82862F]/5 shadow-xs"
                                      : hasError
                                      ? "border-rose-300 bg-rose-50/10 hover:border-rose-400"
                                      : "border-stone-200 bg-white hover:border-[#82862F]"
                                  }`}
                                  id={`delivery-type-${opt.id}`}
                                >
                                  <div className="flex flex-col">
                                    <span className={`text-[11px] font-bold ${isSelected ? "text-stone-900" : "text-stone-700"}`}>
                                      {opt.name}
                                    </span>
                                    <span className="text-[9px] text-stone-400 font-medium">
                                      {opt.info}
                                    </span>
                                  </div>
                                  <span className={`text-xs font-mono font-black ${isSelected ? "text-[#82862F]" : "text-stone-600"}`}>
                                    {opt.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Time Slots Picker */}
                        <div className="space-y-2" id="field-delivery-time-slot">
                          <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-0.5 block">
                            Select Delivery Time <span className="text-rose-500">*</span>
                          </label>
                          <div className={`p-1 rounded-xl transition-all ${
                            submitAttempted && validationErrors.includes("deliveryTimeSlot")
                              ? "border border-dashed border-rose-350 bg-rose-50/5"
                              : ""
                          }`}>
                            {(() => {
                              const isToday = deliveryDate === todayObj.raw;
                              
                              if (deliveryType === "express") {
                                if (!isToday) {
                                  return (
                                    <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-center text-xs text-amber-805 font-bold flex items-center justify-center gap-1.5 animate-fade-in">
                                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                      <span>Express Delivery is only available for same-day orders.</span>
                                    </div>
                                  );
                                }
                                
                                const slots = TIME_SLOTS.express;
                                const hasError = submitAttempted && validationErrors.includes("deliveryTimeSlot");
                                return (
                                  <div className="grid grid-cols-1 gap-2">
                                    {slots.map((slot) => {
                                      const isSelected = deliveryTimeSlot === slot;
                                      return (
                                        <button
                                          key={slot}
                                          type="button"
                                          onClick={() => {
                                            setDeliveryTimeSlot(slot);
                                            setSubmitAttempted(false);
                                          }}
                                          className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col justify-center items-center min-h-[44px] ${
                                            isSelected
                                              ? "border-[#82862F] bg-[#82862F]/5 ring-1 ring-[#82862F] text-stone-900"
                                              : hasError
                                              ? "border-rose-300 bg-rose-50/10 hover:border-rose-400 text-stone-500"
                                              : "border-stone-200 bg-white hover:border-[#82862F] text-stone-600"
                                          }`}
                                          id={`time-slot-${slot.replace(/\s+/g, '-').toLowerCase()}`}
                                        >
                                          <span>{slot}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                );
                              }
                              
                              if (deliveryType === "midnight") {
                                if (!isToday) {
                                  return (
                                    <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-center text-xs text-amber-805 font-bold flex items-center justify-center gap-1.5 animate-fade-in">
                                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                      <span>Pre-Midnight Delivery is only available for same-day orders.</span>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <div className="space-y-2">
                                    <select
                                      value={deliveryTimeSlot}
                                      onChange={(e) => {
                                        setDeliveryTimeSlot(e.target.value);
                                        setSubmitAttempted(false);
                                      }}
                                      className={`w-full p-2.5 rounded-xl border bg-white text-xs font-bold text-stone-800 outline-none transition-all cursor-pointer ${
                                        submitAttempted && validationErrors.includes("deliveryTimeSlot")
                                          ? "border-rose-400 bg-rose-50/10 focus:border-rose-600"
                                          : "border-stone-200 focus:border-[#82862F]"
                                      }`}
                                      id="midnight-time-select"
                                    >
                                      <option value="">-- Choose Exact Time --</option>
                                      {PRE_MIDNIGHT_SLOTS.map((t) => (
                                        <option key={t} value={t}>
                                          {t}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="text-[9px] text-stone-400 font-semibold block text-center">
                                      🕒 Delivered between 11:00 PM and 11:59 PM
                                    </span>
                                  </div>
                                );
                              }
                              
                              if (deliveryType === "fixed") {
                                return (
                                  <div className="space-y-2">
                                    <select
                                      value={deliveryTimeSlot}
                                      onChange={(e) => {
                                        setDeliveryTimeSlot(e.target.value);
                                        setSubmitAttempted(false);
                                      }}
                                      className={`w-full p-2.5 rounded-xl border bg-white text-xs font-bold text-stone-850 outline-none transition-all cursor-pointer ${
                                        submitAttempted && validationErrors.includes("deliveryTimeSlot")
                                          ? "border-rose-400 bg-rose-50/10 focus:border-rose-600"
                                          : "border-stone-200 focus:border-[#82862F]"
                                      }`}
                                      id="fixed-time-select"
                                    >
                                      <option value="">-- Choose Exact Time --</option>
                                      {FIXED_TIME_SLOTS.map((t) => (
                                        <option key={t} value={t}>
                                          {t}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="text-[9px] text-stone-400 font-semibold block text-center">
                                      🕒 Delivery scheduled at your exact time choice (+/- 15 mins)
                                    </span>
                                  </div>
                                );
                              }
                              
                              // Standard or Morning
                              const slots = TIME_SLOTS[deliveryType] || [];
                              const hasError = submitAttempted && validationErrors.includes("deliveryTimeSlot");
                              return (
                                <div className="grid grid-cols-1 gap-2">
                                  {slots.map((slot) => {
                                    const isSelected = deliveryTimeSlot === slot;
                                    return (
                                      <button
                                        key={slot}
                                        type="button"
                                        onClick={() => {
                                          setDeliveryTimeSlot(slot);
                                          setSubmitAttempted(false);
                                        }}
                                        className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col justify-center items-center min-h-[44px] ${
                                          isSelected
                                            ? "border-[#82862F] bg-[#82862F]/5 ring-1 ring-[#82862F] text-stone-900"
                                            : hasError
                                            ? "border-rose-300 bg-rose-50/10 hover:border-rose-400 text-stone-500"
                                            : "border-stone-200 bg-white hover:border-[#82862F] text-stone-600"
                                        }`}
                                        id={`time-slot-${slot.replace(/\s+/g, '-').replace(/–/g, '-').toLowerCase()}`}
                                      >
                                        <span>{slot}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                      </div>

                      {/* Area | Pincode (2 columns) */}
                      <div className="grid grid-cols-2 gap-3" id="location-details-row">
                        <div id="field-delivery-area">
                          <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-0.5 block">Local Area <span className="text-rose-500">*</span></label>
                          <select
                            value={deliveryArea}
                            onChange={(e) => {
                              handleAreaChange(e.target.value);
                              setSubmitAttempted(false);
                            }}
                            className={`w-full text-xs rounded-md border bg-white py-1.5 px-2.5 outline-none text-stone-855 transition-all font-sans ${
                              submitAttempted && validationErrors.includes("deliveryArea")
                                ? "border-rose-400 bg-rose-50/10 focus:border-rose-600"
                                : "border-stone-200 focus:border-[#82862F]/50"
                            }`}
                          >
                            {settings.areas.map((area) => (
                              <option key={area.name + "_" + area.postcode} value={area.name}>
                                {area.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div id="field-pincode">
                          <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-0.5 block">Pincode <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            placeholder="Pincode"
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => {
                              setPincode(e.target.value);
                              setSubmitAttempted(false);
                            }}
                            className={`w-full text-xs rounded-md border py-1.5 px-2.5 outline-none text-stone-850 transition-all font-sans font-mono ${
                              submitAttempted && validationErrors.includes("pincode")
                                ? "border-rose-400 bg-rose-50/10 focus:border-rose-600"
                                : "border-stone-200 focus:border-[#82862F]/50"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Detailed Address (full width) */}
                      <div id="field-address">
                        <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-0.5 block">Detailed Address (Pune) <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          placeholder="Apartment name, Apartment Number, Local Landmark..."
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            setSubmitAttempted(false);
                          }}
                          className={`w-full text-xs rounded-md border py-1.5 px-2.5 outline-none text-stone-850 transition-all font-sans ${
                            submitAttempted && validationErrors.includes("address")
                              ? "border-rose-400 bg-rose-50/10 focus:border-rose-600"
                              : "border-stone-200 focus:border-[#82862F]/50"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Personal message note */}
                    <div className="p-3.5 rounded-lg border border-stone-200/60 bg-white space-y-2.5 font-sans" id="personal-note-block">
                      <div className="flex items-center gap-1.5 text-stone-800 font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-stone-100">
                        <FileText className="w-3.5 h-3.5 text-rose-500" />
                        <span>Add A Personal Message</span>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={2}
                          maxLength={250}
                          placeholder="Write a message for your loved one..."
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="w-full text-xs rounded-md border border-stone-200 bg-white p-2 outline-none text-stone-800 resize-none pr-8 focus:border-rose-400 transition-colors"
                        />
                        <div className="absolute top-2 right-2 text-stone-300">
                          <ScrollText className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-stone-400 font-medium">
                        <span>Card message is hand-crafted and delivered in premium tags 📝</span>
                        <span className={customMessage.length >= 240 ? "text-rose-600 font-bold" : ""}>
                          {customMessage.length}/250 chars
                        </span>
                      </div>

                      {/* Message preview tag */}
                      <div className="border border-dashed border-rose-200/65 bg-rose-50/20 p-2 rounded-md flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[8px] uppercase font-bold tracking-wider text-[#82862F] font-mono">
                          <span>Card Preview</span>
                        </div>
                        <p className="text-xs italic text-stone-700 font-sans min-h-[14px] border-l-2 border-rose-400 pl-2 leading-relaxed">
                          {customMessage.trim() ? `"${customMessage.trim()}"` : `"Happy Anniversary ❤️"`}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: 30% width sticky Order Summary for Desktop */}
                  <div className="hidden md:block md:col-span-4 sticky top-4 self-start max-w-[300px] w-full" id="desktop-sidebar-summary">
                    <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-xs space-y-3 font-sans">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#82862F] pb-1 border-b border-stone-100">Order Summary</h4>
                      
                      {/* Compact clean item breakdowns with specific delivery charges */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-stone-500 font-sans">
                          <span>Product Total</span>
                          <span className="font-mono text-stone-900 font-bold">₹{itemsSubtotal}</span>
                        </div>

                        <div className="flex justify-between items-center text-stone-500 font-sans">
                          <span>Add-ons Total</span>
                          <span className="font-mono text-stone-900 font-bold">₹{addonsSubtotal}</span>
                        </div>

                        <div className="flex justify-between items-center text-stone-500 font-sans">
                          <span>Delivery</span>
                          <span className="font-mono text-emerald-600 font-bold">
                            {deliveryCost === 0 ? "Free ✓" : `₹${deliveryCost}`}
                          </span>
                        </div>

                        <div className="border-t border-stone-100 pt-2 my-1 flex justify-between items-center">
                          <span className="font-sans font-bold text-stone-900 uppercase tracking-wide text-xs font-black">Final Total</span>
                          <span className="text-lg font-black text-rose-600 font-mono">₹{finalTotal}</span>
                        </div>
                      </div>

                      {/* Improved Premium WhatsApp checkout button */}
                      <button
                        onClick={triggerWhatsApp}
                        className="w-full py-2.5 rounded-lg transition-all font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.99]"
                        id="desktop-checkout-whatsapp-btn"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0 fill-white stroke-none" />
                        <span>Order on WhatsApp • ₹{finalTotal}</span>
                      </button>

                      <div className="text-center">
                        <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-left flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="text-[10px] text-stone-600 font-medium leading-relaxed">
                            <strong className="text-emerald-700 font-bold block mb-0.5">Instant order processing</strong>
                            Your order is routed directly to WhatsApp for confirmation & dispatch coordination.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Mobile-Only Collapsible Sticky Bottom Summary & Checkout card */}
            {cart.length > 0 && !placedOrderId && (
              <div className="md:hidden border-t border-stone-200/80 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)] font-sans z-25" id="cart-mobile-sticky-footer">
                
                {/* Mobile Collapsed mini-card summary matching spec exactly */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50/50 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-800">🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)} Item(s)</span>
                    <span className="text-stone-300">|</span>
                    <span className="text-xs font-black text-rose-600 font-mono">₹{finalTotal} Total</span>
                  </div>
                  <button
                    onClick={() => setIsMobileBreakdownExpanded(!isMobileBreakdownExpanded)}
                    className="flex items-center gap-1 text-[9.5px] font-extrabold uppercase tracking-wider text-[#82862F] cursor-pointer focus:outline-none"
                  >
                    <span>{isMobileBreakdownExpanded ? "Hide Details ▲" : "View Details ▼"}</span>
                  </button>
                </div>

                {/* Mobile expanded breakdown */}
                {isMobileBreakdownExpanded && (
                  <div className="px-4 py-2 bg-white space-y-1.5 text-xs border-b border-stone-100 animate-fade-in">
                    <div className="flex justify-between text-stone-500 font-sans">
                      <span>Product Total</span>
                      <span className="font-mono text-stone-850 font-bold">₹{itemsSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 font-sans">
                      <span>Addones Total</span>
                      <span className="font-mono text-stone-850 font-bold">₹{addonsSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 font-sans">
                      <span>Delivery</span>
                      <span className="font-mono text-emerald-600 font-bold">
                        {deliveryCost === 0 ? "Free ✓" : `₹${deliveryCost}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Sticky WhatsApp trigger */}
                <div className="p-3 bg-white relative">
                  {submitAttempted && validationErrors.length > 0 && (
                    <div className="absolute bottom-[72px] left-4 right-4 p-2 bg-rose-50 border border-rose-150 rounded-lg text-left flex items-start gap-1.5 font-sans shadow-lg z-30 animate-shake">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span className="text-[9.5px] font-bold text-rose-600 leading-snug">
                        Please complete all required delivery details before placing your order.
                      </span>
                    </div>
                  )}
                  <button
                    onClick={triggerWhatsApp}
                    className="w-full py-3 rounded-lg transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.99]"
                    id="mobile-checkout-whatsapp-btn"
                  >
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>Order on WhatsApp • ₹{finalTotal}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
