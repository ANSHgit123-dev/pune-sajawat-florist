import React from "react";
import { Home } from "lucide-react";
import { Product } from "../types";

interface BreadcrumbsProps {
  selectedCategory: string;
  activeProduct: Product | null;
  navigateTo: (path: string) => void;
}

export default function Breadcrumbs({ selectedCategory, activeProduct, navigateTo }: BreadcrumbsProps) {
  const items = [] as { label: string; path?: string }[];
  // Home always first
  items.push({ label: "Home", path: "/" });
  // Category if not All
  if (selectedCategory && selectedCategory !== "All") {
    const catPath = `/category/${selectedCategory.toLowerCase().replace(/ /g, "-")}`;
    items.push({ label: selectedCategory, path: catPath });
  }
  // Product if present
  if (activeProduct) {
    items.push({ label: activeProduct.title });
  }

  return (
    <nav className="flex items-center text-sm text-stone-600 space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-stone-200" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="mx-1">/</span>}
          {item.path ? (
            <button
              className="inline-flex items-center gap-1 hover:text-[#82862F] font-medium"
              onClick={() => navigateTo(item.path!)}
            >
              {idx === 0 && <Home className="w-4 h-4" />}
              <span>{item.label}</span>
            </button>
          ) : (
            <span className="font-semibold text-[#82862F]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
