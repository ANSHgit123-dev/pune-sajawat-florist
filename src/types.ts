export interface Category {
  id: string;
  name: string;
  image: string;
  count?: string;
}

export interface ProductAddon {
  id: string;
  name: string;
  category: "chocolates" | "teddies" | "cards" | "hampers" | "balloons" | "cakes";
  price: number;
  enabled: boolean;
  image?: string;
}

export interface ProductDeliverySettings {
  available: boolean;
  charge: number;
  sameday: boolean;
  fixed: boolean;
  night: boolean;
  midnight: boolean;
  customChargeEnabled: boolean;
  customCharge: number;
}

export interface Product {
  id: string;
  title: string; // fallback matching previous code
  name?: string; // primary display product name
  price: number;
  originalPrice: number;
  category: string;
  image: string; // cover image path
  images?: string[]; // list of all product image paths
  galleryImages?: string[]; // synchronized with images for modal rendering
  rating: number;
  reviewsCount: number;
  description: string;
  createdAt?: string;

  // CMS Upgraded Fields
  shortDescription?: string;
  longDescription?: string;
  sku?: string;
  quantity?: number; // available stock
  lowStockAlert?: number; // threshold alert limit
  
  // Status settings
  isBestSeller?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  isFeatured?: boolean;
  isEnabled?: boolean; // active for sales
  isHidden?: boolean; // visibility control
  
  // Custom delivery toggles
  deliverySettings?: ProductDeliverySettings;
  
  // Associated Add-ons
  addons?: ProductAddon[];
}

export interface Occasion {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  image?: string;
  tag: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customMessage?: string;
  selectedAddons?: { [addonId: string]: number };
  deliveryDate?: string;
  deliveryTimeSlot?: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  products: {
    title: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  price: number;
  addons: {
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryDate: string;
  deliveryTime: string;
  address: string;
  personalMessage: string;
  status: "Pending" | "Preparing" | "Delivered" | "Cancelled";
  createdAt: string;
  notes?: string;
}

export interface CmsSection {
  id: string;
  name: string;
  displayOrder: number;
  bannerImage: string;
  hidden: boolean;
  isFeatured: boolean;
}

export interface CmsSettings {
  sections: CmsSection[];
  homepage: {
    sectionOrder: string[];
    featuredProductIds: string[];
    trendingProductIds: string[];
    bannerProductIds: string[];
  };
}
