import React from "react";
import { X, Star, ShoppingBag, MessageCircle, Heart, Check, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Addon } from "../types";
import { ADDONS } from "../data";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  selectedAddons: { [addonId: string]: number };
  onAddAddon: (addonId: string) => void;
  onRemoveAddon: (addonId: string) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  selectedAddons,
  onAddAddon,
  onRemoveAddon
}: ProductDetailModalProps) {
  if (!product) return null;

  const percentOff = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Instant WhatsApp Inquiry for this precise product
  const handleInstantWhatsAppInquiry = () => {
    const phoneNumber = "918484905722";
    const rawMessage = `Hello *Pune Sajawat Florist*! 🌸\n\n` +
      `I am looking at: *${product.title}*\n` +
      `🏷️ *Price:* ₹${product.price} (Original: ₹${product.originalPrice})\n` +
      `📦 *Category:* ${product.category}\n\n` +
      `Please let me know if same-day delivery is available for this product in Pune right now. Thank you!`;
    const encoded = encodeURIComponent(rawMessage);
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encoded}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/80 z-50 cursor-pointer backdrop-blur-xs"
            id="product-modal-backdrop"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="fixed inset-0 m-auto max-w-2xl h-fit sm:max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl z-55 flex flex-col p-0 border border-slate-100"
            id="product-detail-modal-panel"
          >
            {/* Modal Header/Sticky top */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/40 text-white hover:bg-stone-900/80 hover:scale-105 transition-all cursor-pointer shadow-md"
                aria-label="Close details"
                id="close-product-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body split into grid */}
            <div className="grid md:grid-cols-12 gap-0">
              {/* Product Visual Frame */}
              <div className="md:col-span-5 relative aspect-square md:aspect-auto md:h-full min-h-[250px] bg-slate-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Sale Ribbons */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 font-sans">
                  {product.isBestSeller && (
                    <span className="px-2.5 py-1 bg-[#FC8019] text-white text-[9px] uppercase tracking-wider font-extrabold rounded-sm shadow-md">
                      Trending Choice
                    </span>
                  )}
                  {percentOff > 0 && (
                    <span className="px-2.5 py-1 bg-rose-600 text-white text-[9.5px] uppercase tracking-wider font-extrabold rounded-sm shadow-md">
                      Save {percentOff}%
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs py-1 px-2.5 rounded-sm flex items-center gap-1 border border-stone-100 shadow-sm text-xs font-bold text-stone-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400 font-normal">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Product Info Block */}
              <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#82862F] font-mono">
                      {product.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight leading-tight mt-1">
                      {product.title}
                    </h3>
                  </div>

                  {/* Pricing row */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-rose-600">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-stone-400 text-sm line-through">₹{product.originalPrice}</span>
                        <span className="text-[#82862F] text-xs font-extrabold bg-[#F9FAEE] px-2 py-0.5 rounded-sm font-sans">
                          (Save ₹{product.originalPrice - product.price}!)
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-light font-sans">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2.5 text-[11px] text-emerald-700 font-bold bg-emerald-50/50 py-2 px-3 rounded-md border border-emerald-100">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>✓ Eligible for Same-Day Express Hand Delivery in Pune</span>
                  </div>
                </div>

                {/* RECOMMENDED ADD-ONS (FNP-style horizontal scroll list) */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider font-extrabold text-stone-900 flex items-center gap-1 font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-[#FC8019] fill-current" />
                      <span>Recommended Add-ons</span>
                    </h4>
                    <span className="text-[9.5px] text-stone-400">Upgrade your gift</span>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x" id="recommended-addons-tray">
                    {ADDONS.map((addon) => {
                      const qty = selectedAddons[addon.id] || 0;
                      const getAddonEmoji = (cat: string) => {
                        return "🍫";
                      };

                      return (
                        <div
                          key={addon.id}
                          className={`min-w-[110px] w-[110px] bg-stone-50 border rounded-md p-2 flex flex-col justify-between shadow-xs transition-all snap-start ${
                            qty > 0 
                              ? "border-rose-600 bg-rose-50/20 shadow-xs scale-98" 
                              : "border-stone-200"
                          }`}
                        >
                          <div className="relative aspect-square rounded-sm overflow-hidden mb-1.5 bg-white border border-stone-100 shrink-0">
                            {addon.image ? (
                              <img
                                src={addon.image}
                                alt={addon.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-600 text-xl font-bold">
                                {getAddonEmoji("chocolates")}
                              </div>
                            )}
                            <div className="absolute top-1 left-1 bg-black/60 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">
                              {getAddonEmoji("chocolates")}
                            </div>
                            {qty > 0 && (
                              <div className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-sm border border-white">
                                <Check className="w-2 h-2 stroke-[4]" />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-stone-800 line-clamp-1 leading-tight">{addon.name}</p>
                            <p className="text-[10px] font-mono font-black text-rose-600">₹{addon.price}</p>
                          </div>

                          <div className="mt-2 shrink-0">
                            {qty > 0 ? (
                              <div className="flex items-center justify-between bg-white border border-rose-600 rounded-sm overflow-hidden h-6">
                                <button
                                  onClick={() => onRemoveAddon(addon.id)}
                                  className="w-1/3 text-xs font-bold text-rose-600 hover:bg-rose-50 p-0.5 text-center cursor-pointer"
                                  id={`modal-addon-minus-${addon.id}`}
                                >
                                  -
                                </button>
                                <span className="w-1/3 text-[9.5px] font-bold text-center text-rose-600 font-mono">{qty}</span>
                                <button
                                  onClick={() => onAddAddon(addon.id)}
                                  className="w-1/3 text-xs font-bold text-rose-600 hover:bg-rose-50 p-0.5 text-center cursor-pointer"
                                  id={`modal-addon-plus-${addon.id}`}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => onAddAddon(addon.id)}
                                className="w-full py-1 bg-white hover:bg-[#F9FAEE] border border-rose-500 hover:border-rose-600 text-rose-600 font-extrabold text-[9px] uppercase tracking-wider rounded-sm text-center transition-colors cursor-pointer"
                                id={`modal-addon-addbtn-${addon.id}`}
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

                {/* Core action buttons row */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-150">
                  {product.quantity !== undefined && product.quantity <= 0 ? (
                    <button
                      disabled
                      className="col-span-2 w-full py-3.5 bg-stone-100 text-stone-400 font-extrabold text-[10.5px] uppercase tracking-widest rounded-sm cursor-not-allowed select-none border border-stone-200 text-center"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleInstantWhatsAppInquiry}
                        className="w-full py-3 border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 rounded-sm text-[10.5px] uppercase font-extrabold tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        id="modal-direct-whatsapp"
                      >
                        <MessageCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>Inquire Now</span>
                      </button>
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onClose();
                        }}
                        className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-sm text-[10.5px] uppercase font-extrabold tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-rose-100"
                        id="modal-add-to-cart"
                      >
                        <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
                        <span>Add To Cart</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="text-center font-sans">
                  <span className="text-[9.5px] text-stone-400 font-normal">
                    🔥 Highly in demand - Ordered 42 times in Pune today
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
