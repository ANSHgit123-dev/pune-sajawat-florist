import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, ShoppingBag, Eye, Store, Sparkles, Phone, ArrowUpRight, Flower, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AnnouncementBar from "./components/AnnouncementBar";
import Categories from "./components/Categories";
import ProductCard from "./components/ProductCard";
import Occasions from "./components/Occasions";
import WhyChooseUs from "./components/WhyChooseUs";
import Gallery from "./components/Gallery";
import Breadcrumbs from "./components/Breadcrumbs";
import FloatingQuickNav from "./components/FloatingQuickNav";
import Reviews from "./components/Reviews";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProductDetailModal from "./components/ProductDetailModal";
import ProductDetailPage from "./components/ProductDetailPage";
import AdminDashboard from "./components/AdminDashboard";
import { Product, CartItem, CmsSettings, MediaItem } from "./types";
import { PRODUCTS } from "./data";
import InventoryUpload from "./components/InventoryUpload";
import CreationsInAction from "./components/CreationsInAction";

const CATEGORY_EMOJIS: { [key: string]: string } = {
  "Flowers": "🌸",
  "Bouquets": "💐",
  "Rose Bouquets": "🌹",
  "Flower Baskets": "🧺",
  "Birthday Bouquets": "🎂",
  "Anniversary Bouquets": "💖",
  "Chocolate Bouquets": "🍫",
  "Gift Hampers": "🎁",
  "Teddy Bears": "🧸",
  "Cakes": "🍰",
  "Plants": "🌿",
  "Decorations": "🎈",
  "Wedding": "💍"
};

const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
  "Flowers": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a3 3 0 0 0-3 3c0 1.25.5 2 1.5 3 .5.5 1 1 1.5 1.5.5-.5 1-1 1.5-1.5 1-.75 1.5-1.75 1.5-3a3 3 0 0 0-3-3z" />
      <path d="M12 22a3 3 0 0 0 3-3c0-1.25-.5-2-1.5-3-.5-.5-1-1-1.5-1.5-.5.5-1 1-1.5 1.5-1 .75-1.5 1.75-1.5 3a3 3 0 0 0 3 3z" />
      <path d="M2 12a3 3 0 0 0 3 3c1.25 0 2-.5 3-1.5.5-.5 1-1 1.5-1.5-.5-.5-1-1-1.5-1.5C7.25 9.5 6.5 9 5 9a3 3 0 0 0-3 3z" />
      <path d="M22 12a3 3 0 0 0-3-3c-1.25 0-2 .5-3 1.5-.5.5-1 1-1.5 1.5.5.5 1 1 1.5 1.5.75 1 1.5 1.5 3 1.5a3 3 0 0 0 3-3z" />
    </svg>
  ),
  "Roses": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10c0-3.5 2.5-6 5.5-6 2 0 3.5 1.5 3.5 3.5 0 3-2.5 5.5-5.5 5.5h-3.5" />
      <path d="M12 10c0-3.5-2.5-6-5.5-6-2 0-3.5 1.5-3.5 3.5 0 3 2.5 5.5 5.5 5.5H12" />
      <path d="M12 10v10c0 1 1 2 2 2" />
      <path d="M12 14c-1 0-2-.5-2.5-1.5" />
      <circle cx="12" cy="10" r="1.5" />
    </svg>
  ),
  "Bouquets": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-8M9 22l2-8M15 22l-2-8" />
      <path d="M12 7a4 4 0 0 1 4 4c0 1.5-1.5 2.5-3 3.5-.5.5-1 1-1 1.5s-.5-1-1-1.5c-1.5-1-3-2-3-3.5a4 4 0 0 1 4-4z" />
      <path d="M7 6a3.5 3.5 0 0 1 6.5-1.5A3.5 3.5 0 0 1 17 9.5c0 1.5-1 2.5-2.5 3.5-.5.3-1 .7-1.2 1.2" />
      <path d="M17 6a3.5 3.5 0 0 0-6.5-1.5A3.5 3.5 0 0 0 7 9.5c0 1.5 1 2.5 2.5 3.5.5.3 1 .7 1.2 1.2" />
    </svg>
  ),
  "Rose Bouquets": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10c0-3.5 2.5-6 5.5-6 2 0 3.5 1.5 3.5 3.5 0 3-2.5 5.5-5.5 5.5h-3.5" />
      <path d="M12 10c0-3.5-2.5-6-5.5-6-2 0-3.5 1.5-3.5 3.5 0 3 2.5 5.5 5.5 5.5H12" />
      <path d="M12 10v10c0 1 1 2 2 2" />
      <path d="M12 14c-1 0-2-.5-2.5-1.5" />
      <circle cx="12" cy="10" r="1.5" />
    </svg>
  ),
  "Flower Baskets": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11h18v4a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-4z" />
      <path d="M12 2a8 8 0 0 0-8 9h16a8 8 0 0 0-8-9z" />
      <path d="M12 11V2M8 11V3.5M16 11V3.5" />
    </svg>
  ),
  "Birthday Bouquets": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 11a5 5 0 0 0-5 5v3h10v-3a5 5 0 0 0-5-5z" />
      <path d="M8 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
      <path d="M12 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
      <path d="M5 22h14v-3H5v3z" />
    </svg>
  ),
  "Anniversary Bouquets": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  "Chocolate Bouquets": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" ry="2" />
      <path d="M5 9h14M5 15h14M12 3v18" />
    </svg>
  ),
  "Gift Hampers": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v10H4V12" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
  "Teddy Bears": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <circle cx="9" cy="6" r="2.5" />
      <circle cx="15" cy="6" r="2.5" />
      <path d="M9 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM15 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      <path d="M12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  ),
  "Cakes": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16h16" />
      <path d="M12 11V7M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  ),
  "Plants": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12M12 12c-2-2.5-5-2.5-7 0M12 12c2-2.5 5-2.5 7 0" />
      <path d="M12 16c-2-2-4.5-2-6 0M12 16c2-2 4.5-2 6 0" />
    </svg>
  ),
  "Decorations": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5c0 4-5 9-5 9s-5-5-5-5a5 5 0 0 1 5-5z" />
      <path d="M12 16v6M10 22h4" />
    </svg>
  ),
  "Wedding": (
    <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="14" r="5" />
      <circle cx="16" cy="14" r="5" />
      <path d="M8 9a3 3 0 0 1 6-3 3 3 0 0 1 2 3" />
    </svg>
  )
};

const DEFAULT_CATEGORY_ICON = (
  <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>
);

const ROUTE_TO_CAT_MAP: { [key: string]: string } = {
  "/flowers": "Flowers",
  "/bouquets": "Bouquets",
  "/rose-bouquets": "Rose Bouquets",
  "/flower-baskets": "Flower Baskets",
  "/birthday-bouquets": "Birthday Bouquets",
  "/anniversary-bouquets": "Anniversary Bouquets",
  "/chocolate-bouquets": "Chocolate Bouquets",
  "/gift-hampers": "Gift Hampers",
  "/teddy-bears": "Teddy Bears",
  "/cakes": "Cakes",
  "/plants": "Plants",
  "/decorations": "Decorations",
  "/wedding": "Wedding"
};

const CAT_TO_ROUTE_MAP: { [key: string]: string } = {
  "Flowers": "/flowers",
  "Bouquets": "/bouquets",
  "Rose Bouquets": "/rose-bouquets",
  "Flower Baskets": "/flower-baskets",
  "Birthday Bouquets": "/birthday-bouquets",
  "Anniversary Bouquets": "/anniversary-bouquets",
  "Chocolate Bouquets": "/chocolate-bouquets",
  "Gift Hampers": "/gift-hampers",
  "Teddy Bears": "/teddy-bears",
  "Cakes": "/cakes",
  "Plants": "/plants",
  "Decorations": "/decorations",
  "Wedding": "/wedding"
};

export function mergeDuplicateProducts(products: Product[]): Product[] {
  const mergedMap = new Map<string, Product>();

  products.forEach(p => {
    const clusterKey = p.id;

    if (mergedMap.has(clusterKey)) {
      const existing = mergedMap.get(clusterKey)!;
      const existingImages = existing.images || (existing.image ? [existing.image] : []);
      const pImages = p.images || (p.image ? [p.image] : []);
      const mergedImages = Array.from(new Set([...existingImages, ...pImages]));

      const existingGallery = existing.galleryImages || (existing.image ? [existing.image] : []);
      const pGallery = p.galleryImages || (p.image ? [p.image] : []);
      const mergedGallery = Array.from(new Set([...existingGallery, ...pGallery]));

      const existingQty = existing.quantity || 0;
      const pQty = p.quantity || 0;

      mergedMap.set(clusterKey, {
        ...existing,
        images: mergedImages,
        galleryImages: mergedGallery,
        quantity: Math.max(existingQty, pQty),
        description: existing.description || p.description,
        longDescription: existing.longDescription || p.longDescription,
        shortDescription: existing.shortDescription || p.shortDescription,
      });
    } else {
      mergedMap.set(clusterKey, { ...p });
    }
  });

  return Array.from(mergedMap.values());
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Success toast logic for "Add to Cart" action
  const [showToast, setShowToast] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [animateCartIcon, setAnimateCartIcon] = useState(false);

  // Selected addons globally tracked for checkout & grand totals
  const [selectedAddons, setSelectedAddons] = useState<{ [addonId: string]: number }>({});
  
  // Track currently inspected product for FNP style details page popup
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 📸 Dynamic catalog state — three explicit states: loading / loaded / empty
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cmsSettings, setCmsSettings] = useState<CmsSettings>({
    sections: [],
    homepage: {
      sectionOrder: [],
      featuredProductIds: [],
      trendingProductIds: [],
      bannerProductIds: []
    }
  });

  // 📸 Dynamic media files loaded from Supabase Storage
  const [heroMedia, setHeroMedia] = useState<MediaItem[]>([]);
  const [galleryMedia, setGalleryMedia] = useState<MediaItem[]>([]);
  const [videosMedia, setVideosMedia] = useState<MediaItem[]>([]);

  const loadMedia = async () => {
    try {
      const folders: ("hero" | "gallery" | "videos")[] = ["hero", "gallery", "videos"];
      const promises = folders.map(async (folder) => {
        const res = await fetch(`/api/media/list?folder=${folder}`);
        if (res.ok) {
          const data = await res.json();
          return { folder, files: data.files || [] };
        }
        return { folder, files: [] };
      });
      const results = await Promise.all(promises);
      results.forEach(({ folder, files }) => {
        if (folder === "hero") setHeroMedia(files);
        if (folder === "gallery") setGalleryMedia(files);
        if (folder === "videos") setVideosMedia(files);
      });
    } catch (e) {
      console.error("Failed to load media files", e);
    }
  };

  const loadCmsSettings = async () => {
    try {
      const res = await fetch("/api/cms");
      if (res.ok) {
        const data = await res.json();
        setCmsSettings(data);
      }
    } catch (e) {
      console.error("Failed to load CMS settings", e);
    }
  };

  // Returns the resolved product list — does NOT call setLoadedProducts.
  // This lets the caller batch setLoadedProducts + setIsLoadingProducts(false)
  // into a single React commit, eliminating any intermediate empty-catalog render.
  const loadProductsFromStorage = async (): Promise<Product[]> => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const serverProds = await res.json();
        // Only accept a non-empty array from the API.
      // An empty array ([] ) means Supabase cold-start returned no rows yet —
      // fall through to localStorage / static PRODUCTS instead of surfacing
      // the empty-catalog page during startup.
      if (Array.isArray(serverProds) && serverProds.length > 0) {
          localStorage.setItem("sajawat_catalog_products", JSON.stringify(serverProds));
          return serverProds;
        }
      }
    } catch (apiErr) {
      console.warn("Could not fetch products from backend API, falling back to storage:", apiErr);
    }

    try {
      const saved = localStorage.getItem("sajawat_catalog_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }

    return PRODUCTS;
  };

  const loadProductsAndCmsAndMedia = async () => {
    try {
      // loadProductsFromStorage now RETURNS products instead of calling setState.
      // setLoadedProducts and setIsLoadingProducts(false) are called on adjacent
      // lines in the same synchronous block — React 18 batches them into ONE commit.
      // There is NO intermediate render where isLoadingProducts=false AND
      // loadedProducts=[] can both be true at the same time.
      const [products] = await Promise.all([
        loadProductsFromStorage(),
        loadCmsSettings(),
        loadMedia()
      ]);
      // ?? only catches null/undefined — NOT an empty array.
      // Use explicit length check so an empty result always falls back to PRODUCTS.
      setLoadedProducts(products && products.length > 0 ? products : PRODUCTS);
      setIsLoadingProducts(false); // ← same sync block as line above
    } catch (err) {
      console.error("Error loading application data:", err);
      setLoadedProducts(PRODUCTS);
      setIsLoadingProducts(false); // ← same sync block as line above
    }
  };

  useEffect(() => {
    loadProductsAndCmsAndMedia();
    window.addEventListener("sajawat_catalog_updated", loadProductsAndCmsAndMedia);
    return () => window.removeEventListener("sajawat_catalog_updated", loadProductsAndCmsAndMedia);
  }, []);



  // Popstate handler for back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Redirect unauthenticated user from /admin/upload to /admin
  useEffect(() => {
    if (currentPath === "/admin/upload") {
      const isAuth = sessionStorage.getItem("sajawat_admin_auth") === "true";
      if (!isAuth) {
        window.history.replaceState({}, "", "/admin");
        setCurrentPath("/admin");
      }
    }
  }, [currentPath]);

  // Synchronize category selection on path changes
  useEffect(() => {
    let matchedCat = ROUTE_TO_CAT_MAP[currentPath];
    if (!matchedCat && currentPath.startsWith("/category/")) {
      const route = currentPath.replace("/category/", "");
      matchedCat = ROUTE_TO_CAT_MAP[`/${route}`];
    }
    if (matchedCat) {
      setSelectedCategory(matchedCat);
    } else if (currentPath === "/") {
      setSelectedCategory("All");
    }
  }, [currentPath]);

  // Timer to auto-hide the Add-to-Cart toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (catId: string) => {
    if (catId === "All") {
      setSelectedCategory("All");
      navigateTo("/");
    } else {
      setSelectedCategory(catId);
      const route = CAT_TO_ROUTE_MAP[catId];
      if (route) {
        navigateTo(`/category${route}`);
      } else {
        navigateTo("/");
      }
    }
  };

  // Load existing cart and addons if any from localStorage (client comfort)
  useEffect(() => {
    try {
      const persisted = localStorage.getItem("sajawat_cart");
      if (persisted) {
        setCart(JSON.parse(persisted));
      }
      const persistedAddons = localStorage.getItem("sajawat_addons");
      if (persistedAddons) {
        setSelectedAddons(JSON.parse(persistedAddons));
      }
    } catch (e) {
      console.warn("Could not read cart from localStorage:", e);
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem("sajawat_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not write cart to localStorage:", e);
    }
  }, [cart]);

  // Save addons changes
  useEffect(() => {
    try {
      localStorage.setItem("sajawat_addons", JSON.stringify(selectedAddons));
    } catch (e) {
      console.warn("Could not write addons to localStorage:", e);
    }
  }, [selectedAddons]);

  const handleAddAddon = (addonId: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: (prev[addonId] || 0) + 1,
    }));
  };

  const handleRemoveAddon = (addonId: string) => {
    setSelectedAddons((prev) => {
      const val = (prev[addonId] || 0) - 1;
      const copied = { ...prev };
      if (val <= 0) {
        delete copied[addonId];
      } else {
        copied[addonId] = val;
      }
      return copied;
    });
  };

  const handleClearAddons = () => {
    setSelectedAddons({});
  };

  const handleAddToCart = (product: Product) => {
    if (product.quantity !== undefined && product.quantity <= 0) {
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setLastAddedProduct(product);
    setShowToast(true);
    setAnimateCartIcon(true);
    setTimeout(() => {
      setAnimateCartIcon(false);
    }, 1000);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // ─── STATE 1: INITIAL LOADING ───────────────────────────────────────────────
  // Evaluated immediately after all state and effect hooks.
  // This makes it structurally impossible to calculate or evaluate deduplicatedProducts,
  // homepageProducts, etc. while isLoadingProducts is true.
  if (isLoadingProducts) {
    return (
      <div
        className="fixed inset-0 min-h-screen w-full flex flex-col justify-center items-center p-6 text-center select-none bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F3EDE0]"
        id="app-loading-screen"
      >
        {/* Background Floral Accents */}
        <div className="absolute top-0 left-0 w-48 h-48 opacity-15 text-[#82862F] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <path d="M0,0 Q30,10 40,40 Q10,30 0,0" />
            <path d="M0,0 Q10,30 40,40 Q30,10 0,0" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-15 text-[#82862F] pointer-events-none rotate-180">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <path d="M0,0 Q30,10 40,40 Q10,30 0,0" />
            <path d="M0,0 Q10,30 40,40 Q30,10 0,0" />
          </svg>
        </div>

        <div className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-3xl p-10 border border-[#82862F]/10 shadow-2xl space-y-6 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Pune Sajawat Florist Logo"
            className="h-[80px] w-auto object-contain bg-transparent border-none shadow-none"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="w-20 h-20 rounded-full bg-[#82862F]/10 flex items-center justify-center text-[#82862F]">
            <Flower className="w-10 h-10 animate-sjwt-bloom text-[#82862F]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-stone-900 font-serif tracking-wide">Pune Sajawat Florist</h2>
            <p className="text-sm text-stone-500 font-sans tracking-wide">
              Preparing today's fresh flowers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const deduplicatedProducts = mergeDuplicateProducts(loadedProducts);

  const categoryProductCounts = deduplicatedProducts.reduce((acc, p) => {
    if (p.isEnabled !== false && !p.isHidden) {
      acc[p.category] = (acc[p.category] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const homepageProducts = deduplicatedProducts.filter(p => p.isEnabled !== false && !p.isHidden);
  
  const categoryProducts = deduplicatedProducts.filter(p => 
    p.isEnabled !== false && !p.isHidden && p.category === selectedCategory
  );

  const searchFilteredProducts = deduplicatedProducts.filter((product) => {
    if (product.isEnabled === false || product.isHidden) {
      return false;
    }
    return (
      searchTerm === "" ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleScrollToProducts = () => {
    const section = document.getElementById("featured-products-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDirectWhatsAppHotline = () => {
    const phoneNumber = "918484905722";
    const text = encodeURIComponent(
      "Hello Pune Sajawat Florist! I would like to place a custom order or inquiry."
    );
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, "_blank");
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };



  // ─── POST-LOAD ROUTING ───────────────────────────────────────────────────────
  let activeProductPage: Product | null = null;
  if (currentPath.startsWith("/product/")) {
    const id = currentPath.replace("/product/", "");
    activeProductPage = deduplicatedProducts.find((p) => p.id === id) || null;
  }

  if (currentPath === "/admin") {
    return (
      <div className="min-h-screen flex flex-col bg-stone-900" id="pune-sajawat-admin-root">
        <AdminDashboard onBack={() => navigateTo("/")} />
      </div>
    );
  }

  if (currentPath === "/admin/upload") {
    const isAuth = sessionStorage.getItem("sajawat_admin_auth") === "true";
    if (!isAuth) {
      return null;
    }
    return (
      <div className="min-h-screen flex flex-col bg-stone-950" id="pune-sajawat-admin-upload-root">
        <InventoryUpload onBack={() => navigateTo("/")} onCatalogBuilt={(prods) => setLoadedProducts(prods)} />
      </div>
    );
  }

  // ─── STATE 2: LOADED BUT EMPTY ──────────────────────────────────────────────────
  // Reachable only after isLoadingProducts=false, which is ALWAYS committed in the
  // same React batch as setLoadedProducts([...]), so loadedProducts is guaranteed
  // to reflect actual API/localStorage/static results at this point.
  if (deduplicatedProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50 p-6 text-center select-none font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#82862F]/10 flex items-center justify-center text-[#82862F] mx-auto animate-pulse">
            <Flower className="w-8 h-8 animate-spin-lazy" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-stone-900 font-serif">TEST 123456789</h2>
            <p className="text-xs text-stone-500 leading-relaxed font-light">
              New floral arrangements are coming soon. In the meantime, please contact us on WhatsApp for custom orders and inquiries.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleDirectWhatsAppHotline}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-1.5"
            >
              Contact on WhatsApp 💬
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans select-none antialiased bg-stone-50/20 pr-0" id="pune-sajawat-app">
      {/* Announcement Bar at the very top of all pages */}
      <AnnouncementBar />
      {/* Breadcrumbs navigation only on subpages */}
      {(currentPath !== "/" || activeProductPage !== null) && (
        <Breadcrumbs selectedCategory={selectedCategory} activeProduct={activeProductPage} navigateTo={navigateTo} />
      )}
      {/* Navbar Container */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSelectCategory={handleSelectCategory}
        currentCategory={selectedCategory}
        currentPath={currentPath}
        navigateTo={navigateTo}
        cmsSettings={cmsSettings}
        products={loadedProducts}
      />
      <FloatingQuickNav scrollToSection={scrollToSection} navigateTo={navigateTo} openWhatsApp={handleDirectWhatsAppHotline} />
      {activeProductPage ? (
        /* Dedicated Premium Product Details Page View */
        <ProductDetailPage
          product={activeProductPage}
          onBack={() => navigateTo("/")}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onSelectProduct={(p) => navigateTo(`/product/${p.id}`)}
          products={loadedProducts}
        />
      ) : currentPath.startsWith("/category/") ? (
        /* Dedicated Category Page View */
        <>
          {/* Category Header */}
          <section className="py-10 bg-white border-b border-stone-100" id="category-header-section">
            <div className="max-w-[1600px] w-full mx-auto px-6">
              <div className="inline-block bg-[#82862F] text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 mb-2 rounded-sm font-sans">
                Category Collection
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight">
                {selectedCategory}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 font-sans font-light">
                Discover our premium selection under {selectedCategory.toLowerCase()}. Handcrafted fresh in Pune.
              </p>
            </div>
          </section>

          {/* Categories Strip */}
          <Categories
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            products={loadedProducts}
          />

          {/* Category Products Grid */}
          <section className="py-10 bg-white" id="category-products-section">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              {categoryProducts.length === 0 ? (
                <div className="py-10 text-center space-y-4 max-w-sm mx-auto bg-stone-50 rounded-3xl p-8 border border-stone-100">
                  <h4 className="font-bold text-stone-900 text-base">No designs available yet</h4>
                  <p className="text-xs text-stone-500">
                    Check back soon or WhatsApp our florists to request custom ordering for {selectedCategory.toLowerCase()}!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-start">
                  {categoryProducts.map((product) => {
                    const catCount = categoryProductCounts[product.category] || 0;
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onOpenCart={() => setIsCartOpen(true)}
                        onSelectProduct={(p) => navigateTo(`/product/${p.id}`)}
                        hideStatusBadges={catCount < 3}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        /* Standard Single-Section Homepage Layout */
        <>
          {/* Hero Section */}
          <Hero 
            onExploreProducts={handleScrollToProducts} 
            cmsSettings={cmsSettings}
            products={deduplicatedProducts}
            heroMedia={heroMedia}
          />

          {/* Main Core Gifting Categories */}
          <Categories
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            products={loadedProducts}
          />

          {/* Featured Products Section */}
          <section className="py-10 bg-white border-t border-stone-100 w-full" id="featured-products-section">
            <div className="w-full px-6">
              
              {/* Header row details */}
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
                <div>
                  <div className="inline-block bg-[#046142] text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 mb-2 rounded-sm font-sans">
                    Sajawat Signature Selection
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                    {searchTerm !== "" ? "Search Results" : "Featured Products"}
                  </h3>
                  <p className="text-xs text-slate-550 max-w-md mt-1 font-sans font-light">
                    {searchTerm !== "" 
                      ? `Showing products matching search term "${searchTerm}"`
                      : "Browse all our handcrafted premium florist collections."}
                  </p>
                </div>
              </div>

              {/* Horizontal Slider/Carousel Layout */}
              {(searchTerm !== "" ? searchFilteredProducts : homepageProducts).length === 0 ? (
                <div className="py-10 text-center space-y-4 max-w-sm mx-auto bg-stone-50 rounded-3xl p-8 border border-stone-100" id="products-not-found-view">
                  <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-brand-pink-500 mx-auto">
                    <Store className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-base">No Matching Designs Found</h4>
                    <p className="text-xs text-stone-500 mt-1">
                      We customize anything! Message our designers on WhatsApp to share a custom reference image or budget pattern.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                      }}
                      className="px-5 py-2.5 bg-stone-900 text-white hover:bg-stone-850 rounded-xl font-bold text-xs tracking-wider cursor-pointer font-sans"
                    >
                      Reset Catalog Filters
                    </button>
                    <button
                      onClick={handleDirectWhatsAppHotline}
                      className="px-5 py-2.5 bg-[#046142] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                      <span>Send Custom Image on WhatsApp</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-start" id="featured-products-grid">
                  {(searchTerm !== "" ? searchFilteredProducts : homepageProducts).map((product) => {
                    const catCount = categoryProductCounts[product.category] || 0;
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onOpenCart={() => setIsCartOpen(true)}
                        onSelectProduct={(p) => navigateTo(`/product/${p.id}`)}
                        hideStatusBadges={catCount < 3}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Categories Section (Only shown when not in search results mode) */}
          {searchTerm === "" && (
            <section className="py-10 bg-stone-50 border-t border-stone-150" id="categories-carousel-section">
              <div className="max-w-[1600px] w-full mx-auto px-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
                    Explore Categories
                  </h3>
                  <div className="flex items-center justify-center select-none text-stone-300 font-light text-xs gap-1.5 my-2">
                    <span className="tracking-tighter">────────</span>
                    <span className="text-[#82862F] font-normal text-sm">✿</span>
                    <span className="tracking-tighter">────────</span>
                  </div>
                  <p className="text-xs text-stone-500 font-sans font-light max-w-md mx-auto mt-1">
                    Discover handcrafted bouquets, flower baskets and gift hampers for every occasion.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-5 w-full">
                  {Object.entries(categoryProductCounts).map(([catName, count]) => {
                    return (
                      <div
                        key={catName}
                        onClick={() => handleSelectCategory(catName)}
                        className="p-4 bg-white border border-stone-150 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-[#82862F] hover:bg-[#f6f7e8] cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group flex flex-col items-center justify-center text-center gap-2.5"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#82862F]/10 text-[#82862F] flex items-center justify-center group-hover:bg-[#82862F]/20 transition-all duration-300 transform group-hover:scale-110">
                          {CATEGORY_ICONS[catName] || DEFAULT_CATEGORY_ICON}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#82862F] transition-colors line-clamp-1">{catName}</h4>
                          <span className="text-[10px] sm:text-xs text-stone-400 font-medium block mt-0.5">({count} {count === 1 ? 'Design' : 'Designs'})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Occasions Filter Grid Section */}
          <Occasions onSelectOccasion={handleSelectCategory} />

          {/* Why Choose Us Values Assurances */}
          <WhyChooseUs />

          {/* Portfolio Design Gallery */}
          <Gallery galleryMedia={galleryMedia} />

          {/* Creations in Action Video Reels Slider */}
          <CreationsInAction videos={videosMedia} />

          {/* Client Feedback Reviews Section */}
          <Reviews />

          {/* Shop Location Address & Contact Form Section */}
          <ContactSection />
        </>
      )}

      {/* Elegant Copyright Footer */}
      <Footer />

      {/* Sliding Checkout/Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedAddons={selectedAddons}
        onAddAddon={handleAddAddon}
        onRemoveAddon={handleRemoveAddon}
        onClearAddons={handleClearAddons}
      />

      {/* Dynamic Floating Sticky Contact Action buttons for high mobile conversion */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3" id="floating-conversion-actions">
        {/* Floating Cart Button (only if hidden and we have items queued) */}
        {cartCount > 0 && !isCartOpen && (
          <motion.button
            onClick={() => setIsCartOpen(true)}
            animate={animateCartIcon ? { scale: [1, 1.25, 0.95, 1.1, 1], rotate: [0, -10, 10, -5, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-rose-200 cursor-pointer hover:bg-rose-700"
            title="Open Flowers Cart"
            id="floating-cart-shortcut"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-3 -right-3 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shadow-sm border border-white shrink-0">
                {cartCount}
              </span>
            </div>
          </motion.button>
        )}

        {/* Continuous WhatsApp help Button */}
        <button
          onClick={handleDirectWhatsAppHotline}
          className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200 cursor-pointer hover:bg-emerald-700 transition-all hover:scale-105 group/help relative"
          title="Fast Help on WhatsApp"
          id="floating-whatsapp-shortcut"
        >
          <MessageCircle className="w-7 h-7 fill-white stroke-none" />
          <span className="absolute right-16 top-3 bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md opacity-0 group-hover/help:opacity-100 transition-opacity uppercase tracking-wider block font-sans whitespace-nowrap hidden sm:block">
            Need Flowers? Chat Now ⚡
          </span>
        </button>
      </div>

      {/* Modern Interactive Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToCart={handleAddToCart}
        selectedAddons={selectedAddons}
        onAddAddon={handleAddAddon}
        onRemoveAddon={handleRemoveAddon}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && lastAddedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.85, x: "-50%" }}
            transition={{ type: "spring", damping: 15, stiffness: 220 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-900/98 backdrop-blur-md border border-stone-800 text-white px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl z-55 max-w-[92vw] w-max font-sans whitespace-nowrap"
            id="cart-added-toast"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-xs font-semibold tracking-tight text-stone-100">
                Added <span className="text-rose-400 font-bold">"{lastAddedProduct.title}"</span> to basket!
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(true);
                setShowToast(false);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[9px] uppercase tracking-widest px-3.5 py-1.5 rounded-full transition-colors font-sans cursor-pointer active:scale-95 shrink-0"
              id="toast-view-cart-btn"
            >
              Checkout 🌸
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
