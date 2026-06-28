import React from "react";
import { Star, MessageCircle, ShoppingBag, Eye } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  onSelectProduct?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  hideStatusBadges?: boolean;
}

export default function ProductCard({ product, onAddToCart, onOpenCart, onSelectProduct, onQuickView, hideStatusBadges }: ProductCardProps): React.JSX.Element {
  const percentOff = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isOutOfStock = product.quantity !== undefined && product.quantity <= 0;

  const handleInstantWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    
    const phoneNumber = "918484905722";
    const rawMessage = `Hello *Pune Sajawat Florist*! 🌸\n` +
      `I would like to order: *${product.title || product.name}*\n` +
      `🏷️ *Price:* ₹${product.price} (Saved ₹${product.originalPrice - product.price})\n` +
      `📦 *Category:* ${product.category}\n` +
      `Please let me know if same-day delivery is available for this product in Pune right now. Thank you!`;
    
    const encoded = encodeURIComponent(rawMessage);
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encoded}`, "_blank");
  };

  const handleQueueCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product);
  };

  const handleQuickViewTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div 
      onClick={() => onSelectProduct?.(product)}
      className="bg-white rounded-3xl border border-slate-100 hover:border-rose-300 hover:shadow-xl hover:scale-[1.03] transition-all duration-350 flex flex-col justify-between overflow-hidden group h-full cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* Product Image and Badges */}
      <div className="relative w-full h-[320px] bg-slate-50 overflow-hidden shrink-0 rounded-t-3xl">
        <img
          src={product.image}
          alt={product.title || product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
        />

        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors" />

        {/* Promo/Stock badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 bg-rose-600 text-white font-sans text-[9px] uppercase tracking-[0.15em] font-bold rounded-sm shadow-sm">
              Out of Stock
            </span>
          ) : (
            <>
              {product.isBestSeller && !hideStatusBadges && (
                <span className="px-2 py-0.5 bg-[#FC8019] text-white font-sans text-[9px] uppercase tracking-[0.15em] font-bold rounded-sm shadow-sm">
                  Trending
                </span>
              )}
              {product.isNew && (
                <span className="px-2 py-0.5 bg-[#82862F] text-white font-sans text-[9px] uppercase tracking-[0.15em] font-bold rounded-sm shadow-sm">
                  New
                </span>
              )}
            </>
          )}
        </div>

        {/* Savings Badge */}
        {percentOff > 0 && !isOutOfStock && (
          <div className="absolute bottom-3 right-3 bg-[#82862F] text-white px-2 py-0.5 rounded-sm text-[9px] font-sans font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <span>{percentOff}% OFF</span>
          </div>
        )}
      </div>

      {/* Content details description */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          {/* Category title */}
          <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.15em] text-[#82862F]">
            {product.category}
          </span>

          {/* Product Title */}
          <h4 className="text-sm font-sans font-bold text-slate-900 line-clamp-1 group-hover:text-[#82862F] transition-colors">
            {product.name || product.title}
          </h4>

          {/* Description summary */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Pricing, review ratings row */}
        <div className="space-y-3 pt-2.5 border-t border-slate-100">
          
          {/* Star Ratings & Delivery Line */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium flex-wrap">
            <div className="flex items-center text-amber-400">
              <Star className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />
              <span className="text-stone-700 font-bold ml-1">{product.rating || 5}</span>
            </div>
            <span className="text-stone-300 font-sans">•</span>
            <span className="text-slate-500 underline">{product.reviewsCount || 10} Reviews</span>
            <span className="text-stone-300 font-sans">•</span>
            <span className="bg-emerald-50 text-emerald-700 font-bold text-[8px] px-1 rounded-sm shrink-0 uppercase tracking-widest">Free Delivery</span>
          </div>

          <div className="flex items-center justify-between gap-1">
            {/* Price Container */}
            <div className="flex items-baseline gap-1.5 flex-wrap font-sans">
              <span className="text-lg font-black text-slate-950">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-slate-400 text-xs line-through">₹{product.originalPrice}</span>
              )}
              {percentOff > 0 && (
                <span className="text-[#82862F] text-[11px] font-bold">({percentOff}% Off)</span>
              )}
            </div>
          </div>

          {/* Demand Booster Ribbon */}
          {!isOutOfStock && !hideStatusBadges && (
            <div className="flex items-center gap-1 text-[9px] text-[#FC8019] font-semibold bg-amber-50/60 py-1 px-2 rounded-sm border border-amber-100/50">
              <span>🔥 Ordered</span>
              <span className="font-bold underline">{product.isBestSeller ? '420+' : '180+'} times</span>
              <span>in Pune this month</span>
            </div>
          )}

          {/* Double call to action button group */}
          <div className="pt-1">
            {isOutOfStock ? (
              <button
                disabled
                className="w-full py-2 bg-stone-100 text-stone-400 font-extrabold text-[10px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-1 cursor-not-allowed select-none border border-stone-200"
              >
                Out of Stock
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2" id="card-action-btn-group">
                <button
                  onClick={handleQuickViewTrigger}
                  className="py-2 px-2 border border-[#82862F] text-[#82862F] bg-white hover:bg-[#F9FAEE] rounded-sm font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="View details"
                  id={`quick-view-btn-${product.id}`}
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={handleQueueCart}
                  className="py-2 px-2 bg-[#82862F] hover:bg-[#6C7026] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
                  id={`quick-add-to-cart-btn-${product.id}`}
                >
                  <span>🛒 Add to Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
