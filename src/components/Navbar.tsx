import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  ShoppingBag, 
  Phone, 
  Menu, 
  X, 
  Flower, 
  Sparkles, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Instagram,
  ArrowRight,
  History,
  TrendingUp,
  AlertCircle,
  ArrowLeft,
  Home,
  Layers,
  Flame,
  Star,
  PhoneCall,
  ArrowUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "../data";
import { CmsSettings, Product } from "../types";

// Preferred display order for categories
const CATEGORY_DISPLAY_ORDER = [
  "Bouquets",
  "Rose Bouquets",
  "Flower Baskets",
  "Birthday Bouquets",
  "Anniversary Bouquets",
  "Chocolate Bouquets",
  "Gift Hampers",
  "Indoor Plants",
  "Succulents",
  "Flowering Plants"
];

// Category SVG icons matching the Categories component
const NavCategoryIcons: { [key: string]: React.ReactNode } = {
  "Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 3c-1.5 2-4 4-4 7a4 4 0 0 0 8 0c0-3-2.5-5-4-7z"/>
      <path d="M12 10v11"/>
      <path d="M9 18l3-3 3 3"/>
    </svg>
  ),
  "Rose Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 2C9 4.5 6.5 7 6.5 10.5a5.5 5.5 0 0 0 11 0C17.5 7 15 4.5 12 2z"/>
      <path d="M12 10.5v10"/>
      <path d="M8 14c1-1 2.5-.5 4 1 1.5-1.5 3-2 4-1"/>
    </svg>
  ),
  "Flower Baskets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M5 12h14l-1.5 8H6.5L5 12z"/>
      <path d="M5 12c0-3 3-5 7-5s7 2 7 5"/>
      <path d="M9 7c-.5-2 .5-4 3-4s3.5 2 3 4"/>
    </svg>
  ),
  "Birthday Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 2v4"/>
      <path d="M10 4h4"/>
      <rect x="4" y="8" width="16" height="4" rx="1"/>
      <rect x="6" y="12" width="12" height="6" rx="1"/>
      <path d="M12 8v10"/>
    </svg>
  ),
  "Anniversary Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  "Chocolate Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <rect x="3" y="6" width="18" height="12" rx="2"/>
      <path d="M12 6v12"/>
      <path d="M3 12h18"/>
      <path d="M8 3l4 3 4-3"/>
    </svg>
  ),
  "Gift Hampers": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <rect x="3" y="8" width="18" height="4" rx="1"/>
      <rect x="5" y="12" width="14" height="8" rx="1"/>
      <path d="M12 8v12"/>
      <path d="M12 8c-2-3-6-3-6 0"/>
      <path d="M12 8c2-3 6-3 6 0"/>
    </svg>
  ),
  "Indoor Plants": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 2v8M8 12c-1.5-1.5-4-1.5-5 0M12 12c1.5-1.5 4-1.5 5 0M9 16h6v4H9z" />
    </svg>
  ),
  "Succulents": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 2v20M17 8a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4M7 6a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4" />
    </svg>
  ),
  "Flowering Plants": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 22V12M12 12c-2-2-5-2-7 0M12 12c2-2 5-2 7 0" />
      <circle cx="12" cy="7" r="3" />
    </svg>
  ),
};

const highlightMatch = (text: string, query: string) => {
  if (!query) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-100 text-[#82862F] font-bold rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectCategory: (category: string) => void;
  currentCategory: string;
  currentPath?: string;
  navigateTo?: (path: string) => void;
  cmsSettings: CmsSettings;
  products: Product[];
}

export default function Navbar({
  cartCount,
  onOpenCart,
  searchTerm,
  onSearchChange,
  onSelectCategory,
  currentCategory,
  currentPath = "/",
  navigateTo,
  cmsSettings,
  products
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const persisted = localStorage.getItem("sajawat_recent_searches");
      return persisted ? JSON.parse(persisted) : [];
    } catch {
      return [];
    }
  });
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Build dynamic categories from products
  const dynamicCategories = React.useMemo(() => {
    const prods = products.length > 0 ? products : PRODUCTS;
    const categoryCounts: { [key: string]: number } = {};
    prods.forEach((p: any) => {
      if (p.isEnabled !== false && !p.isHidden && p.category) {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      }
    });
    const orderedCats = CATEGORY_DISPLAY_ORDER.filter(cat => categoryCounts[cat] > 0);
    const remainingCats = Object.keys(categoryCounts)
      .filter(cat => !CATEGORY_DISPLAY_ORDER.includes(cat))
      .sort();
    return [...orderedCats, ...remainingCats];
  }, [products]);

  // Dynamic autocomplete categories - only those that exist
  const autocompleteCategories = React.useMemo(() => {
    const emojiMap: { [key: string]: string } = {
      "Bouquets": "💐",
      "Rose Bouquets": "🌹",
      "Flower Baskets": "🧺",
      "Birthday Bouquets": "🎂",
      "Anniversary Bouquets": "💖",
      "Chocolate Bouquets": "🍫",
      "Gift Hampers": "🎁",
    };
    return dynamicCategories.map(cat => ({
      label: cat,
      value: cat,
      emoji: emojiMap[cat] || "🌸"
    }));
  }, [dynamicCategories]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const container = document.getElementById("fnp-search-container");
      if (container && !container.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const filtered = [term, ...recentSearches.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecentSearches(filtered);
    try {
      localStorage.setItem("sajawat_recent_searches", JSON.stringify(filtered));
    } catch (e) {
      console.warn("Could not save recent searches", e);
    }
  };

  const query = searchTerm.trim().toLowerCase();
  
  const matchedCategories = query 
    ? autocompleteCategories.filter(cat => 
        cat.label.toLowerCase().includes(query) ||
        cat.value.toLowerCase().includes(query)
      )
    : [];

  const matchedProducts = query
    ? products.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    : [];

  // Combine into a flat list for arrow key navigation
  const flatSearchResults = query
    ? [
        ...matchedCategories.map(cat => ({ type: "category" as const, data: cat })),
        ...matchedProducts.map(p => ({ type: "product" as const, data: p }))
      ]
    : [
        ...products.slice(0, 3).map(p => ({ type: "product" as const, data: p }))
      ];

  const startWhatsAppChat = () => {
    const phoneNumber = "918484905722";
    const greetingText = encodeURIComponent(
      "Hello Pune Sajawat Florist! I was browsing your premium website. I am looking for a beautiful floral arrangement/decor across Pune. Can you help me select one?"
    );
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${greetingText}`, "_blank");
  };

  const startPhoneCall = () => {
    window.open("tel:+918484905722", "_self");
  };

  const openInstagram = () => {
    window.open("https://www.instagram.com", "_blank");
  };

  const handleCategoryClick = (categoryValue: string) => {
    setIsMobileMenuOpen(false);
    onSelectCategory(categoryValue);
  };

  const handleCategorySelection = (categoryValue: string, label: string) => {
    addRecentSearch(label);
    setIsSearchFocused(false);
    handleCategoryClick(categoryValue);
    setTimeout(() => {
      const block = document.getElementById("featured-products-section");
      if (block) block.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleScrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    
    if (navigateTo && window.location.pathname !== "/") {
      navigateTo("/");
      setTimeout(() => {
        const ele = document.getElementById(sectionId);
        if (ele) {
          ele.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      const ele = document.getElementById(sectionId);
      if (ele) {
        ele.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatSearchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setKeyboardSelectedIndex((prev) => 
        prev < flatSearchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setKeyboardSelectedIndex((prev) => 
        prev > 0 ? prev - 1 : flatSearchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < flatSearchResults.length) {
        const selected = flatSearchResults[keyboardSelectedIndex];
        if (selected.type === "category") {
          handleCategoryClick(selected.data.value);
          addRecentSearch(selected.data.label);
        } else {
          if (navigateTo) {
            navigateTo(`/product/${selected.data.id}`);
          }
          addRecentSearch(selected.data.title);
        }
        setIsSearchFocused(false);
      } else if (searchTerm.trim()) {
        addRecentSearch(searchTerm);
        handleSearchSubmit(e as any);
        setIsSearchFocused(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsSearchFocused(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm);
    }
    if (window.location.pathname !== "/") {
      if (navigateTo) navigateTo("/");
    }
    setTimeout(() => {
      const productsBlock = document.getElementById("featured-products-section");
      if (productsBlock) {
        productsBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  return (
    <>
      {/* MAIN STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-stone-200/60 shadow-sm w-full" id="main-navbar">
        <div className="max-w-[1600px] w-full mx-auto px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-4" id="header-interactive-strip">
          
          {/* LEFT: Logo */}
          <div 
            onClick={() => {
              if (navigateTo) navigateTo("/");
              else onSelectCategory("All");
            }}
            className="flex items-center gap-2.5 sm:gap-4 cursor-pointer group shrink-0"
            id="top-logo-badge"
          >
            {!logoError ? (
              <img
                src="/logo.png"
                onError={() => setLogoError(true)}
                alt="Pune Sajawat Florist Logo"
                className="h-[50px] md:h-[75px] w-auto object-contain bg-transparent border-none shadow-none transition-all duration-300"
              />
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#046142] flex items-center justify-center text-white shadow-xs group-hover:bg-[#035037] transition-all duration-300">
                <Flower className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            )}
            <div className="flex flex-col justify-center select-none">
              <h1 className="text-[13px] sm:text-base md:text-xl font-black font-['Outfit'] uppercase tracking-wider leading-none flex items-center gap-1 select-none">
                <span className="text-[#046142] transition-colors group-hover:text-[#035037]">PUNE</span>
                <span className="text-[#046142] transition-colors group-hover:text-[#035037]">SAJAWAT</span>
                <span className="text-[#ee7d99] transition-colors group-hover:text-[#d3607a]">FLORIST</span>
              </h1>
              <span className="hidden sm:block text-[8px] md:text-[9.5px] font-sans font-bold uppercase tracking-widest text-[#046142]/60 mt-1 select-none font-sans">
                Premium Flowers & Gifts in Pune
              </span>
            </div>
          </div>

          {/* CENTER: Search */}
          <div className="hidden md:block flex-1 max-w-[500px] lg:max-w-[580px] relative mx-2 lg:mx-4" id="fnp-search-container">
            <div className={`relative flex items-center h-[42px] bg-white border rounded-[20px] px-3.5 transition-all duration-300 shadow-[0_4px_16px_rgba(4,97,66,0.05)] ${
              isSearchFocused 
                ? "border-[#046142] ring-3 ring-[#046142]/10" 
                : "border-[#8d9440]/30 hover:border-[#8d9440]/55"
            }`}>
              {/* Subtle floral background pattern */}
              <div className="absolute right-14 top-0 bottom-0 w-16 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center">
                <svg viewBox="0 0 100 100" fill="#046142" className="w-full h-full">
                  <path d="M50 0 C60 25 100 40 80 75 C60 100 40 100 20 75 C0 40 40 25 50 0 Z" />
                </svg>
              </div>

              <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2 z-10" />
              <input
                type="text"
                placeholder="Search bouquets, gifts, hampers..."
                value={searchTerm}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setKeyboardSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setKeyboardSelectedIndex(-1);
                  if (e.target.value && window.location.pathname !== "/") {
                    if (navigateTo) navigateTo("/");
                    setTimeout(() => {
                      const productsBlock = document.getElementById("featured-products-section");
                      if (productsBlock) {
                        productsBlock.scrollIntoView({ behavior: "smooth", block: "nearest" });
                      }
                    }, 100);
                  }
                }}
                className="flex-1 bg-transparent text-xs h-full outline-none text-stone-800 font-sans font-medium placeholder-stone-400 z-10"
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchSubmit(e as any);
                }}
                className="h-[30px] px-4 text-white rounded-[14px] text-[10px] uppercase font-black tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0 border-none font-sans hover:scale-105 active:scale-98 hover:shadow-md hover:brightness-105 z-10"
                style={{
                  background: "linear-gradient(135deg, #8d9440, #a7af4c)"
                }}
              >
                Search
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border border-stone-200 shadow-2xl rounded-2xl p-4 z-55 w-[620px] max-h-[480px] overflow-y-auto"
                  id="desktop-search-results-dropdown"
                >
                  {searchTerm.trim() !== "" ? (
                    <div className="grid grid-cols-12 gap-4 divide-x divide-stone-100">
                      {/* LEFT: Suggested Categories */}
                      <div className="col-span-5 pr-2 space-y-2 text-left">
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#82862F] border-b border-stone-100 pb-1.5 select-none font-sans">
                          Suggested Categories
                        </h4>
                        <div className="space-y-1">
                          {autocompleteCategories.slice(0, 5).map((cat, idx) => {
                            const isHighlighted = keyboardSelectedIndex === idx;
                            const lowerQuery = searchTerm.trim().toLowerCase();
                            const isMatchingQuery = lowerQuery 
                              ? cat.label.toLowerCase().includes(lowerQuery) || cat.value.toLowerCase().includes(lowerQuery) 
                              : false;
                            return (
                              <div
                                key={cat.label}
                                onClick={() => handleCategorySelection(cat.value, cat.label)}
                                onMouseEnter={() => setKeyboardSelectedIndex(idx)}
                                className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                                  isHighlighted 
                                    ? "bg-[#F9FAEE] text-[#82862F] font-semibold translate-x-1" 
                                    : isMatchingQuery 
                                      ? "bg-stone-50 text-[#82862F] font-semibold"
                                      : "text-stone-700 hover:bg-stone-50/70 hover:text-stone-900"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm shrink-0">{cat.emoji}</span>
                                  <span className="text-xs font-serif font-semibold">{highlightMatch(cat.label, searchTerm)}</span>
                                </div>
                                {isMatchingQuery && (
                                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#82862F] animate-pulse">Match</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* RIGHT: Matching Products */}
                      <div className="col-span-7 pl-3.5 space-y-2 text-left">
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-1.5 select-none font-sans">
                          Matching Products
                        </h4>
                        {matchedProducts.length > 0 ? (
                          <div className="space-y-1 pr-1 max-h-[350px] overflow-y-auto">
                            {matchedProducts.map((prod, idx) => {
                              const absoluteIndex = autocompleteCategories.slice(0, 5).length + idx;
                              const isHighlighted = keyboardSelectedIndex === absoluteIndex;
                              return (
                                <div
                                  key={prod.id}
                                  onClick={() => {
                                    if (navigateTo) navigateTo(`/product/${prod.id}`);
                                    addRecentSearch(prod.title);
                                    setIsSearchFocused(false);
                                  }}
                                  onMouseEnter={() => setKeyboardSelectedIndex(absoluteIndex)}
                                  className={`flex items-center gap-3 p-1.5 rounded-lg cursor-pointer transition-all ${
                                    isHighlighted 
                                      ? "bg-[#F9FAEE] border-l-4 border-[#82862F] shadow-xs translate-x-1" 
                                      : "hover:bg-stone-50 border-l-4 border-transparent"
                                  }`}
                                >
                                  <img
                                    src={prod.image}
                                    alt={prod.title}
                                    className="w-9 h-9 object-cover rounded bg-stone-100 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold font-serif text-stone-800 truncate leading-tight">
                                      {highlightMatch(prod.title, searchTerm)}
                                    </p>
                                    <span className="text-[9px] text-stone-400 font-medium block mt-0.5">
                                      {prod.category}
                                    </span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-bold text-[#82862F] font-mono block">₹{prod.price}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-4 text-center space-y-2">
                            <p className="text-xs font-bold text-stone-500">No matching products found</p>
                            <p className="text-[10px] text-stone-400 leading-normal">Try browsing suggested categories</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 gap-4 divide-x divide-stone-100">
                      {/* Left: Recent Searches */}
                      <div className="col-span-5 pr-2 space-y-2 text-left">
                        {recentSearches.length > 0 ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-0.5">
                              <h4 className="text-[10px] uppercase font-bold tracking-wider text-stone-400 select-none">Recent Searches</h4>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRecentSearches([]);
                                  localStorage.removeItem("sajawat_recent_searches");
                                }}
                                className="text-[9px] font-extrabold text-[#FC8019] hover:underline cursor-pointer"
                              >
                                Clear
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {recentSearches.map((term) => (
                                <div
                                  key={term}
                                  onClick={() => {
                                    onSearchChange(term);
                                    if (navigateTo && window.location.pathname !== "/") navigateTo("/");
                                    setTimeout(() => {
                                      const block = document.getElementById("featured-products-section");
                                      if (block) block.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }, 100);
                                    setIsSearchFocused(false);
                                  }}
                                  className="px-2 py-0.5 bg-stone-50 hover:bg-[#F9FAEE] border border-stone-100 rounded-full text-[10px] text-stone-600 font-bold hover:text-[#82862F] cursor-pointer flex items-center gap-1 transition-all"
                                >
                                  <span>⏱️</span>
                                  <span>{term}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#82862F] border-b border-stone-100 pb-1.5 select-none">
                              Browse Categories
                            </h4>
                            {autocompleteCategories.slice(0, 4).map((cat) => (
                              <div
                                key={cat.label}
                                onClick={() => handleCategorySelection(cat.value, cat.label)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-all"
                              >
                                <span className="text-sm">{cat.emoji}</span>
                                <span className="text-[11px] font-serif font-semibold">{cat.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Trending Flowers */}
                      <div className="col-span-7 pl-3.5 space-y-1.5 text-left">
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-0.5 select-none">
                          Trending Flowers & Gifts
                        </h4>
                        <div className="space-y-1">
                          {products.slice(0, 3).map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => {
                                if (navigateTo) navigateTo(`/product/${prod.id}`);
                                setIsSearchFocused(false);
                              }}
                              className="flex items-center gap-2.5 p-1 rounded-md hover:bg-stone-50 cursor-pointer transition-all"
                            >
                              <img src={prod.image} className="w-8 h-8 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-bold font-serif text-stone-700 truncate block leading-none">{prod.title}</span>
                                <span className="text-[9px] text-[#82862F] font-bold block mt-0.5">Best Seller</span>
                              </div>
                              <span className="text-xs font-bold text-stone-800 font-mono shrink-0">₹{prod.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0" id="top-right-socials-call">
            
            {/* Mobile Search */}
            <button 
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-1.5 text-stone-600 rounded-full hover:bg-stone-50 hover:text-[#82862F] transition-all cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Phone */}
            <button 
              onClick={startPhoneCall}
              className="p-1.5 sm:p-2 text-stone-600 rounded-full hover:bg-stone-50 hover:text-[#82862F] transition-all cursor-pointer"
              title="Call our florist hotline"
            >
              <Phone className="w-4 h-4" />
            </button>

            {/* Instagram */}
            <button 
              onClick={openInstagram}
              className="hidden sm:inline-flex p-1.5 sm:p-2 text-stone-600 rounded-full hover:bg-stone-50 hover:text-[#82862F] transition-all cursor-pointer"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </button>

            {/* WhatsApp */}
            <button 
              onClick={startWhatsAppChat}
              className="p-1.5 sm:p-2 text-emerald-600 rounded-full hover:bg-emerald-50 transition-all cursor-pointer"
              title="WhatsApp Chat"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 rounded-full bg-[#F9FAEE]/85 text-stone-800 hover:text-[#82862F] hover:bg-[#F9FAEE] transition-all cursor-pointer flex items-center justify-center shrink-0 border border-[#82862F]/10 gap-1"
              aria-label="Open Shopping Cart"
              id="shopping-bag-icon-header"
            >
              <ShoppingBag className="w-4 h-4 text-[#82862F]" strokeWidth={2} />
              <span className="hidden lg:inline text-[9px] uppercase font-bold tracking-wider text-[#82862F]">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#FC8019] text-white flex items-center justify-center font-mono font-bold text-[9px] shrink-0 border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-stone-700 rounded-md hover:bg-stone-50"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Row B: Horizontal Category Strip (Desktop Only) — NO "More" dropdown */}
        <div className="hidden md:flex w-full bg-white border-t border-stone-100 py-1 select-none h-10 justify-center items-center" id="fnp-menus-strip">
          <div className="max-w-[1280px] mx-auto px-4 flex justify-center items-center h-full w-full">
            <nav className="nav-category-strip">
              {dynamicCategories.map((cat) => {
                const isActive = currentCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`nav-cat-item ${isActive ? "nav-cat-item-active" : ""}`}
                  >
                    <span className="nav-cat-icon">
                      {NavCategoryIcons[cat] || (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                          <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"/>
                        </svg>
                      )}
                    </span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* MOBILE SIDE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-stone-900 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-55 flex flex-col justify-between shadow-2xl md:hidden overflow-y-auto"
              id="mobile-drawer-panel"
            >
              <div className="p-5 flex-1">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#82862F] flex items-center justify-center text-white">
                      <Flower className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-stone-900 font-sans text-sm">Pune Sajawat Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 px-2 text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Dynamic Category Links */}
                <div className="space-y-4">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block mb-2">Shop Categories</span>
                  
                  <div className="space-y-1.5" id="mobile-categories-list">
                    {dynamicCategories.map((cat) => {
                      const emojiMap: { [key: string]: string } = {
                        "Bouquets": "💐", "Rose Bouquets": "🌹", "Flower Baskets": "🧺",
                        "Birthday Bouquets": "🎂", "Anniversary Bouquets": "💖",
                        "Chocolate Bouquets": "🍫", "Gift Hampers": "🎁",
                      };
                      const isActive = currentCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className={`w-full text-left py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center gap-3 ${
                            isActive 
                              ? "bg-[#F9FAEE] text-[#82862F] border border-[#82862F]/20" 
                              : "text-stone-800 border border-stone-100 hover:bg-stone-50"
                          }`}
                        >
                          <span className="text-base">{emojiMap[cat] || "🌸"}</span>
                          <span>{cat}</span>
                          {isActive && <span className="ml-auto text-[9px] text-[#82862F] font-bold">●</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Navigation Links */}
                  <div className="pt-4 border-t border-stone-100 mt-4 space-y-2">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block mb-1">Quick Navigation</span>
                    
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (navigateTo) navigateTo("/");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full text-left py-3 px-4 border border-stone-100 rounded-xl font-bold text-stone-800 text-xs uppercase tracking-wide cursor-pointer hover:bg-stone-50 transition-colors flex items-center gap-3"
                    >
                      <Home className="w-4 h-4 text-[#82862F]" />
                      <span>Home</span>
                    </button>

                    <button
                      onClick={() => handleScrollToSection("featured-products-section")}
                      className="w-full text-left py-3 px-4 border border-stone-100 rounded-xl font-bold text-stone-800 text-xs uppercase tracking-wide cursor-pointer hover:bg-stone-50 transition-colors flex items-center gap-3"
                    >
                      <Flame className="w-4 h-4 text-[#82862F]" />
                      <span>Best Sellers</span>
                    </button>

                    <button
                      onClick={() => handleScrollToSection("contact-section")}
                      className="w-full text-left py-3 px-4 border border-stone-100 rounded-xl font-bold text-stone-800 text-xs uppercase tracking-wide cursor-pointer hover:bg-stone-50 transition-colors flex items-center gap-3"
                    >
                      <PhoneCall className="w-4 h-4 text-[#82862F]" />
                      <span>Contact Us</span>
                    </button>
                  </div>
                </div>

                {/* Hotline */}
                <div className="mt-8 p-4 bg-[#F9FAEE]/55 border border-[#82862F]/10 rounded-xl text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#82862F] block tracking-wide">📞 Direct Pune Hotline</span>
                  <a href="tel:+918484905722" className="text-sm font-bold text-stone-850 hover:underline block leading-tight">+91 84849 05722</a>
                  <span className="text-[9px] text-stone-500 block leading-none">Open today: 7:00 AM – 11:30 PM IST</span>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-stone-100 bg-stone-50/60 sticky bottom-0">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    startWhatsAppChat();
                  }}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-xs shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Inquiry</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE FULLSCREEN SEARCH OVERLAY */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-white z-999 flex flex-col md:hidden"
            id="mobile-fullscreen-search-overlay"
          >
            {/* Top Bar */}
            <div className="bg-stone-50 border-b border-stone-200 p-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileSearchOpen(false);
                    onSearchChange("");
                  }}
                  className="p-1 text-stone-600 hover:bg-stone-100 rounded-full cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search bouquets, gifts, hampers..."
                    value={searchTerm}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      if (e.target.value && window.location.pathname !== "/") {
                        if (navigateTo) navigateTo("/");
                      }
                    }}
                    className="w-full bg-white border border-stone-300 rounded-full pl-10 pr-4 py-2 text-xs outline-none focus:border-[#82862F] focus:ring-2 focus:ring-[#F9FAEE] text-stone-800 font-sans shadow-inner"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  {searchTerm && (
                    <button
                      onClick={() => onSearchChange("")}
                      className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-700 font-bold text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {searchTerm.trim() !== "" ? (
                flatSearchResults.length > 0 ? (
                  <div className="space-y-6">
                    {matchedCategories.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Suggested Collections</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {matchedCategories.map((cat) => (
                            <div
                              key={cat.label}
                              onClick={() => {
                                handleCategoryClick(cat.value);
                                addRecentSearch(cat.label);
                                setIsMobileSearchOpen(false);
                                setTimeout(() => {
                                  const block = document.getElementById("featured-products-section");
                                  if (block) block.scrollIntoView({ behavior: "smooth", block: "start" });
                                }, 150);
                              }}
                              className="flex items-center gap-2 p-2.5 border border-stone-100 bg-stone-50 rounded-xl cursor-pointer hover:bg-[#F9FAEE]/50 active:scale-95 transition-transform"
                            >
                              <span className="text-base">{cat.emoji}</span>
                              <span className="text-xs font-bold text-stone-700 font-serif truncate">{highlightMatch(cat.label, searchTerm)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchedProducts.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Sajawat Fresh Designs</h4>
                        <div className="space-y-2">
                          {matchedProducts.map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => {
                                if (navigateTo) navigateTo(`/product/${prod.id}`);
                                addRecentSearch(prod.title);
                                setIsMobileSearchOpen(false);
                              }}
                              className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-100 rounded-xl cursor-pointer hover:bg-white active:scale-98 transition-transform"
                            >
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold font-serif text-stone-850 truncate">
                                  {highlightMatch(prod.title, searchTerm)}
                                </h5>
                                <span className="text-[10px] text-stone-400 font-normal block leading-none mt-0.5">
                                  {prod.category}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-[#82862F] font-mono shrink-0">₹{prod.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-5">
                    <div className="space-y-1">
                      <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-150 flex items-center justify-center mx-auto text-stone-400">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-stone-600">No matching products found</p>
                      <p className="text-[10px] text-stone-400">Try browsing our categories below</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  {recentSearches.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-stone-400">Recent Searches</h4>
                        <button
                          type="button"
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem("sajawat_recent_searches");
                          }}
                          className="text-[10px] font-bold text-[#FC8019]"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            onClick={() => {
                              onSearchChange(term);
                              addRecentSearch(term);
                            }}
                            className="px-3.5 py-1.5 bg-stone-50 border border-stone-150 rounded-full text-xs text-stone-600 font-bold active:bg-stone-100 cursor-pointer flex items-center gap-1.5 transition-all"
                          >
                            <History className="w-3.5 h-3.5 text-stone-400" />
                            <span>{term}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-stone-400">Browse Categories</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {autocompleteCategories.map((item) => (
                        <div
                          key={item.label}
                          onClick={() => {
                            handleCategoryClick(item.value);
                            addRecentSearch(item.label);
                            setIsMobileSearchOpen(false);
                            setTimeout(() => {
                              const block = document.getElementById("featured-products-section");
                              if (block) block.scrollIntoView({ behavior: "smooth", block: "start" });
                            }, 150);
                          }}
                          className="p-3 border border-stone-150 rounded-xl hover:bg-[#F9FAEE] bg-white text-center cursor-pointer transition-all active:scale-95"
                        >
                          <span className="text-xl block">{item.emoji}</span>
                          <span className="text-[9px] text-stone-600 font-bold block mt-1 leading-tight">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-stone-400">Trending Flowers & Gifts</h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {products.slice(0, 4).map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            if (navigateTo) navigateTo(`/product/${prod.id}`);
                            setIsMobileSearchOpen(false);
                          }}
                          className="flex items-center gap-3 p-2 border border-stone-150 bg-white rounded-xl active:bg-stone-50 cursor-pointer shadow-xs"
                        >
                          <img src={prod.image} className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold font-serif text-stone-850 truncate block">{prod.title}</span>
                            <span className="text-[10px] text-[#82862F] font-bold block leading-none mt-0.5">⭐ Best Seller in Pune</span>
                          </div>
                          <span className="text-xs font-bold text-stone-850 font-mono shrink-0">₹{prod.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
