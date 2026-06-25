import React, { useState, useEffect } from "react";
import { PRODUCTS } from "../data";
import { Product } from "../types";

// SVG icon components for each category — compact inline SVGs
const CategoryIcons: { [key: string]: React.ReactNode } = {
  "Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 3c-1.5 2-4 4-4 7a4 4 0 0 0 8 0c0-3-2.5-5-4-7z"/>
      <path d="M12 10v11"/>
      <path d="M9 18l3-3 3 3"/>
    </svg>
  ),
  "Rose Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2C9 4.5 6.5 7 6.5 10.5a5.5 5.5 0 0 0 11 0C17.5 7 15 4.5 12 2z"/>
      <path d="M12 10.5v10"/>
      <path d="M8 14c1-1 2.5-.5 4 1 1.5-1.5 3-2 4-1"/>
    </svg>
  ),
  "Flower Baskets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M5 12h14l-1.5 8H6.5L5 12z"/>
      <path d="M5 12c0-3 3-5 7-5s7 2 7 5"/>
      <path d="M9 7c-.5-2 .5-4 3-4s3.5 2 3 4"/>
    </svg>
  ),
  "Birthday Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2v4"/>
      <path d="M10 4h4"/>
      <rect x="4" y="8" width="16" height="4" rx="1"/>
      <rect x="6" y="12" width="12" height="6" rx="1"/>
      <path d="M12 8v10"/>
    </svg>
  ),
  "Anniversary Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  "Chocolate Bouquets": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="6" width="18" height="12" rx="2"/>
      <path d="M12 6v12"/>
      <path d="M3 12h18"/>
      <path d="M8 3l4 3 4-3"/>
    </svg>
  ),
  "Gift Hampers": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="8" width="18" height="4" rx="1"/>
      <rect x="5" y="12" width="14" height="8" rx="1"/>
      <path d="M12 8v12"/>
      <path d="M12 8c-2-3-6-3-6 0"/>
      <path d="M12 8c2-3 6-3 6 0"/>
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"/>
    <path d="M5 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/>
    <path d="M18 14l.75 1.5L20.25 16.25l-1.5.75L18 18.5l-.75-1.5-1.5-.75 1.5-.75L18 14z"/>
  </svg>
);

// Preferred display order for categories
const CATEGORY_DISPLAY_ORDER = [
  "Bouquets",
  "Rose Bouquets",
  "Flower Baskets",
  "Birthday Bouquets",
  "Anniversary Bouquets",
  "Chocolate Bouquets",
  "Gift Hampers"
];

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  products: Product[];
}

export default function Categories({ selectedCategory, onSelectCategory, products }: CategoriesProps) {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  useEffect(() => {
    const prods = products.length > 0 ? products : PRODUCTS;

    // Build category counts dynamically from products.json data
    const categoryCounts: { [key: string]: number } = {};
    prods.forEach((p: any) => {
      if (p.isEnabled !== false && !p.isHidden && p.category) {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      }
    });

    // Sort by preferred display order, then any remaining alphabetically
    const orderedCats = CATEGORY_DISPLAY_ORDER.filter(cat => categoryCounts[cat] > 0);
    const remainingCats = Object.keys(categoryCounts)
      .filter(cat => !CATEGORY_DISPLAY_ORDER.includes(cat))
      .sort();
    
    setActiveCategories([...orderedCats, ...remainingCats]);
  }, [products]);

  return (
    <section
      className="py-3 bg-white/95 backdrop-blur-lg border-b border-stone-200/60 sticky top-[56px] sm:top-[64px] z-30 shadow-sm w-full"
      id="categories-section"
    >
      <div
        className="w-full px-8 overflow-x-auto py-1 scrollbar-none whitespace-nowrap select-none justify-start scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollPaddingLeft: "32px",
          scrollPaddingRight: "32px",
        }}
        id="categories-list"
      >
        <style>{`
          #categories-list::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex items-center gap-3 justify-start pb-0.5">
          {/* "All Products" button */}
          <button
            onClick={() => onSelectCategory("All")}
            className={`category-pill group ${
              selectedCategory === "All" ? "category-pill-active" : "category-pill-inactive"
            }`}
            id="cat-btn-all"
          >
            <span className={`category-pill-icon ${selectedCategory === "All" ? "category-pill-icon-active" : ""}`}>
              {DEFAULT_ICON}
            </span>
            <span>All Products</span>
          </button>

          {activeCategories.map((catId) => (
            <button
              key={catId}
              onClick={() => onSelectCategory(catId)}
              className={`category-pill group ${
                selectedCategory === catId ? "category-pill-active" : "category-pill-inactive"
              }`}
              id={`cat-btn-${catId.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <span className={`category-pill-icon ${selectedCategory === catId ? "category-pill-icon-active" : ""}`}>
                {CategoryIcons[catId] || DEFAULT_ICON}
              </span>
              <span>{catId}</span>
            </button>
          ))}
          {/* Spacing element at the end of scroll container to guarantee 32px offset and prevent clipping */}
          <div className="w-8 flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}
