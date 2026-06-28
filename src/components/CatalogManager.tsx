import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Package, 
  DollarSign, 
  Tag, 
  Eye, 
  EyeOff, 
  Star, 
  TrendingUp, 
  Sparkles, 
  Upload, 
  Check, 
  X, 
  Search,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  CheckSquare,
  Square,
  AlertTriangle,
  Gift,
  Truck,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Product, CmsSection, CmsSettings, ProductAddon, ProductDeliverySettings } from "../types";

interface CatalogManagerProps {
  products: Product[];
  onProductsUpdated: (updated: Product[]) => void;
  onBack: () => void;
}

const PRESET_CATEGORIES = [
  "Flowers",
  "Bouquets",
  "Roses",
  "Cakes",
  "Chocolates",
  "Gift Hampers",
  "Teddy Bears",
  "Birthday Decorations",
  "Anniversary Specials",
  "Wedding Collection",
  "Car Decorations"
];

const PRESET_ADDON_CATEGORIES = [
  { id: "chocolates", label: "Chocolates", emoji: "🍫" },
  { id: "teddies", label: "Teddy Bears", emoji: "🧸" },
  { id: "cards", label: "Greeting Cards", emoji: "💌" },
  { id: "hampers", label: "Gift Hampers", emoji: "🎁" },
  { id: "balloons", label: "Balloons", emoji: "🎈" },
  { id: "cakes", label: "Cakes", emoji: "🎂" }
];

export default function CatalogManager({ products, onProductsUpdated, onBack }: CatalogManagerProps) {
  // CMS Settings States loaded from server
  const [cmsSettings, setCmsSettings] = useState<CmsSettings>({ sections: [], homepage: { sectionOrder: [], featuredProductIds: [], trendingProductIds: [], bannerProductIds: [] } });
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Selection for bulk actions
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Modals & Panels toggle
  const [activePanel, setActivePanel] = useState<"sections" | "products" | "homepage">("products");
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Section Form State
  const [newSectionName, setNewSectionName] = useState("");
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [selectedPresetSection, setSelectedPresetSection] = useState(PRESET_CATEGORIES[0]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [sectionSuccessMsg, setSectionSuccessMsg] = useState("");

  // Product Form States
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  // String states allow clean UX (no leading-zero bug, empty-on-backspace)
  const [price, setPrice] = useState<string>("0");
  const [originalPrice, setOriginalPrice] = useState<string>("0");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState<number>(10);
  const [lowStockAlert, setLowStockAlert] = useState<number>(3);
  
  // Product checkboxes
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  // Product Delivery
  const [delAvailable, setDelAvailable] = useState(true);
  const [delCharge, setDelCharge] = useState<number>(50);
  const [delSameday, setDelSameday] = useState(true);
  const [delFixed, setDelFixed] = useState(true);
  const [delNight, setDelNight] = useState(true);
  const [delMidnight, setDelMidnight] = useState(true);
  const [delCustomChargeEnabled, setDelCustomChargeEnabled] = useState(false);
  const [delCustomCharge, setDelCustomCharge] = useState<number>(50);

  // Product Addons State in Form
  const [attachedAddons, setAttachedAddons] = useState<ProductAddon[]>([]);
  const [newAddonName, setNewAddonName] = useState("");
  const [newAddonPrice, setNewAddonPrice] = useState<number>(100);
  const [newAddonCat, setNewAddonCat] = useState<ProductAddon["category"]>("chocolates");
  const [addonImageBase64, setAddonImageBase64] = useState("");

  // Product Images State in Form
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [imageUploadLogs, setImageUploadLogs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Save / delete UX states
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionBannerInputRef = useRef<HTMLInputElement>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Bulk actions states
  const [bulkPriceChange, setBulkPriceChange] = useState("");
  const [bulkCategoryChange, setBulkCategoryChange] = useState("");

  // Load CMS settings
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

  useEffect(() => {
    loadCmsSettings();
  }, []);

  // Save CMS Settings Helper
  const saveCmsSettings = async (updatedSettings: CmsSettings) => {
    try {
      const csrfToken = sessionStorage.getItem("sajawat_csrf_token") || "";
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        setCmsSettings(updatedSettings);
      }
    } catch (e) {
      console.error("Failed to save CMS settings", e);
    }
  };

  // Helper auto-calculate discount/originalPrice
  useEffect(() => {
    const p = Number(price);
    const op = Number(originalPrice);
    if (op > 0 && p > 0) {
      const diff = op - p;
      const pct = Math.round((diff / op) * 100);
      setDiscountPercent(pct > 0 ? pct : 0);
    } else {
      setDiscountPercent(0);
    }
  }, [price, originalPrice]);

  // Convert files to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload base64 image endpoint
  const uploadImageToServer = async (file: File): Promise<string> => {
    try {
      const base64 = await fileToBase64(file);
      const csrfToken = sessionStorage.getItem("sajawat_csrf_token") || "";
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ name: file.name, base64 })
      });
      if (res.ok) {
        const data = await res.json();
        return data.url; // e.g. /public/products/filename.webp
      }
    } catch (e) {
      console.error("Upload error", e);
    }
    return "";
  };

  // Handle product images upload
  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsUploading(true);
    const files = Array.from(e.target.files) as File[];
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setImageUploadLogs(prev => [...prev, `Uploading file ${i + 1}/${files.length}...`]);
      const url = await uploadImageToServer(files[i]);
      if (url) {
        urls.push(url);
      }
    }

    setUploadedImages(prev => [...prev, ...urls]);
    setImageUploadLogs([]);
    setIsUploading(false);
  };

  // Section Banner image upload
  const handleSectionBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = await uploadImageToServer(file);
    if (url) {
      const updated = cmsSettings.sections.map(s => s.id === sectionId ? { ...s, bannerImage: url } : s);
      const newSettings = { ...cmsSettings, sections: updated };
      saveCmsSettings(newSettings);
      setSectionSuccessMsg("Banner image updated successfully! 📸");
      setTimeout(() => setSectionSuccessMsg(""), 2000);
    }
  };

  // Section Management Add Section
  const handleAddSection = () => {
    const sectionName = isCustomCategory ? customCategoryName.trim() : selectedPresetSection;
    if (!sectionName) return;
    
    const sectionId = sectionName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const exists = cmsSettings.sections.some(s => s.id === sectionId);
    
    if (exists) {
      alert("This section/category already exists!");
      return;
    }

    const newSection: CmsSection = {
      id: sectionId,
      name: sectionName,
      displayOrder: cmsSettings.sections.length + 1,
      bannerImage: "",
      hidden: false,
      isFeatured: false
    };

    const updatedSections = [...cmsSettings.sections, newSection];
    const newSettings = {
      ...cmsSettings,
      sections: updatedSections,
      homepage: {
        ...cmsSettings.homepage,
        sectionOrder: [...cmsSettings.homepage.sectionOrder, sectionId]
      }
    };

    saveCmsSettings(newSettings);
    setShowAddSectionModal(false);
    setNewSectionName("");
    setCustomCategoryName("");
    setSectionSuccessMsg("Added new category section successfully! 🎉");
    setTimeout(() => setSectionSuccessMsg(""), 2500);
  };

  const handleUpdateSectionName = (sectionId: string, nextName: string) => {
    const updated = cmsSettings.sections.map(s => s.id === sectionId ? { ...s, name: nextName } : s);
    saveCmsSettings({ ...cmsSettings, sections: updated });
    setEditingSectionId(null);
  };

  const handleToggleHideSection = (sectionId: string) => {
    const updated = cmsSettings.sections.map(s => s.id === sectionId ? { ...s, hidden: !s.hidden } : s);
    saveCmsSettings({ ...cmsSettings, sections: updated });
  };

  const handleToggleFeaturedSection = (sectionId: string) => {
    const updated = cmsSettings.sections.map(s => s.id === sectionId ? { ...s, isFeatured: !s.isFeatured } : s);
    saveCmsSettings({ ...cmsSettings, sections: updated });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section? This will hide products in it unless their category is changed.")) return;
    const updatedSections = cmsSettings.sections.filter(s => s.id !== sectionId);
    const updatedOrder = cmsSettings.homepage.sectionOrder.filter(id => id !== sectionId);
    saveCmsSettings({
      ...cmsSettings,
      sections: updatedSections,
      homepage: { ...cmsSettings.homepage, sectionOrder: updatedOrder }
    });
  };

  const handleMoveSectionOrder = (index: number, direction: "up" | "down") => {
    const updated = [...cmsSettings.sections].sort((a, b) => a.displayOrder - b.displayOrder);
    if (direction === "up" && index > 0) {
      const temp = updated[index].displayOrder;
      updated[index].displayOrder = updated[index - 1].displayOrder;
      updated[index - 1].displayOrder = temp;
    } else if (direction === "down" && index < updated.length - 1) {
      const temp = updated[index].displayOrder;
      updated[index].displayOrder = updated[index + 1].displayOrder;
      updated[index + 1].displayOrder = temp;
    }
    // Re-index cleanly
    const reindexed = updated
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((s, idx) => ({ ...s, displayOrder: idx + 1 }));
    saveCmsSettings({ ...cmsSettings, sections: reindexed });
  };

  // Add Product Form Open
  const handleOpenProductForm = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductName(product.name || product.title);
      setProductCategory(product.category);
      setShortDesc(product.shortDescription || "");
      setLongDesc(product.longDescription || product.description || "");
      setPrice(String(product.price));
      setOriginalPrice(String(product.originalPrice || product.price));
      setSku(product.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setQuantity(product.quantity ?? 10);
      setLowStockAlert(product.lowStockAlert ?? 3);
      
      setIsBestSeller(product.isBestSeller || false);
      setIsNew(product.isNew || false);
      setIsTrending(product.isTrending || false);
      setIsRecommended(product.isRecommended || false);
      setIsFeatured(product.isFeatured || false);
      setIsEnabled(product.isEnabled !== false);
      setIsHidden(product.isHidden || false);

      const dS = product.deliverySettings || {
        available: true,
        charge: 50,
        sameday: true,
        fixed: true,
        night: true,
        midnight: true,
        customChargeEnabled: false,
        customCharge: 50
      };
      setDelAvailable(dS.available);
      setDelCharge(dS.charge);
      setDelSameday(dS.sameday);
      setDelFixed(dS.fixed);
      setDelNight(dS.night);
      setDelMidnight(dS.midnight);
      setDelCustomChargeEnabled(dS.customChargeEnabled || false);
      setDelCustomCharge(dS.customCharge || 50);

      setAttachedAddons(product.addons || []);
      setUploadedImages(product.images || [product.image]);
      setCoverImageIndex(0);
    } else {
      setEditingProduct(null);
      setProductName("");
      setProductCategory(cmsSettings.sections[0]?.name || "Bouquets");
      setShortDesc("");
      setLongDesc("");
      setPrice("0");
      setOriginalPrice("0");
      setSku(`SKU-${Math.floor(10000 + Math.random() * 90000)}`);
      setQuantity(10);
      setLowStockAlert(3);

      setIsBestSeller(false);
      setIsNew(true);
      setIsTrending(false);
      setIsRecommended(false);
      setIsFeatured(false);
      setIsEnabled(true);
      setIsHidden(false);

      setDelAvailable(true);
      setDelCharge(50);
      setDelSameday(true);
      setDelFixed(true);
      setDelNight(true);
      setDelMidnight(true);
      setDelCustomChargeEnabled(false);
      setDelCustomCharge(50);

      setAttachedAddons([]);
      setUploadedImages([]);
      setCoverImageIndex(0);
    }
    setShowProductModal(true);
  };

  // Add Product Add-on inside Product Edit Modal
  const handleAddAddonToProduct = () => {
    if (!newAddonName.trim()) return;
    const newAddon: ProductAddon = {
      id: "addon_" + Date.now() + "_" + Math.floor(Math.random() * 100),
      name: newAddonName.trim(),
      category: newAddonCat,
      price: newAddonPrice,
      enabled: true,
      image: addonImageBase64 || "/public/products/anthurium_mix.png" // default placeholder inside server images
    };
    setAttachedAddons([...attachedAddons, newAddon]);
    setNewAddonName("");
    setNewAddonPrice(100);
    setAddonImageBase64("");
  };

  const handleToggleAddonEnabled = (addonId: string) => {
    setAttachedAddons(attachedAddons.map(a => a.id === addonId ? { ...a, enabled: !a.enabled } : a));
  };

  const handleDeleteAddonFromProduct = (addonId: string) => {
    setAttachedAddons(attachedAddons.filter(a => a.id !== addonId));
  };

  // Save/Commit Product to DB
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || Number(price) <= 0 || uploadedImages.length === 0) {
      alert("Please enter a valid product name, price, and upload at least 1 image cover!");
      return;
    }
    setIsSaving(true);

    const coverUrl = uploadedImages[coverImageIndex] || uploadedImages[0];
    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : "prod_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: productName.trim(),
      title: productName.trim(),
      category: productCategory,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      image: coverUrl,
      images: uploadedImages,
      galleryImages: uploadedImages,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
      description: shortDesc.trim() || productName.trim(),
      shortDescription: shortDesc.trim(),
      longDescription: longDesc.trim(),
      sku: sku.trim(),
      quantity: Number(quantity),
      lowStockAlert: Number(lowStockAlert),
      isBestSeller,
      isNew,
      isTrending,
      isRecommended,
      isFeatured,
      isEnabled,
      isHidden,
      deliverySettings: {
        available: delAvailable,
        charge: Number(delCharge),
        sameday: delSameday,
        fixed: delFixed,
        night: delNight,
        midnight: delMidnight,
        customChargeEnabled: delCustomChargeEnabled,
        customCharge: Number(delCustomCharge)
      },
      addons: attachedAddons,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };

    let updatedProducts: Product[] = [];
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productPayload : p);
    } else {
      updatedProducts = [...products, productPayload];
    }

    try {
      const csrfToken = sessionStorage.getItem("sajawat_csrf_token") || "";
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(updatedProducts)
      });
      if (res.ok) {
        onProductsUpdated(updatedProducts);
        setShowProductModal(false);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2200);
      } else {
        alert("Failed to save product in database.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save product on server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    // Open custom confirm dialog instead of native confirm()
    setDeleteConfirmId(productId);
  };

  const executeDeleteProduct = async (productId: string) => {
    setDeleteConfirmId(null);
    try {
      const csrfToken = sessionStorage.getItem("sajawat_csrf_token") || "";
      const res = await fetch("/api/products/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ id: productId })
      });
      if (res.ok) {
        const updated = products.filter(p => p.id !== productId);
        onProductsUpdated(updated);
      } else {
        alert("Failed to delete product from server.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete product.");
    }
  };

  // Bulk Actions
  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllProducts = (filtered: Product[]) => {
    if (selectedProductIds.length === filtered.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filtered.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProductIds.length} products?`)) return;
    
    try {
      const csrfToken = sessionStorage.getItem("sajawat_csrf_token") || "";
      const res = await fetch("/api/products/delete", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ ids: selectedProductIds })
      });
      if (res.ok) {
        const updated = products.filter(p => !selectedProductIds.includes(p.id));
        onProductsUpdated(updated);
        setSelectedProductIds([]);
      } else {
        alert("Failed to delete products in bulk.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to execute bulk delete.");
    }
  };

  const handleBulkChangeCategory = async () => {
    if (selectedProductIds.length === 0 || !bulkCategoryChange) return;
    const updated = products.map(p => 
      selectedProductIds.includes(p.id) ? { ...p, category: bulkCategoryChange } : p
    );
    try {
      const csrfToken = sessionStorage.getItem("sajawat_csrf_token") || "";
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        onProductsUpdated(updated);
        setSelectedProductIds([]);
        setBulkCategoryChange("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkUpdatePrice = async () => {
    if (selectedProductIds.length === 0 || !bulkPriceChange) return;
    const updated = products.map(p => {
      if (selectedProductIds.includes(p.id)) {
        const nextPrice = Number(bulkPriceChange);
        const originalDiff = p.originalPrice - p.price;
        return {
          ...p,
          price: nextPrice,
          originalPrice: nextPrice + originalDiff
        };
      }
      return p;
    });
    try {
      const csrfToken = sessionStorage.getItem("sajawat_csrf_token") || "";
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        onProductsUpdated(updated);
        setSelectedProductIds([]);
        setBulkPriceChange("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkToggleSetting = async (setting: "isBestSeller" | "isEnabled" | "isHidden") => {
    if (selectedProductIds.length === 0) return;
    const updated = products.map(p => {
      if (selectedProductIds.includes(p.id)) {
        const val = p[setting];
        return { ...p, [setting]: !val };
      }
      return p;
    });
    try {
      const csrfToken = sessionStorage.getItem("sajawat_csrf_token") || "";
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        onProductsUpdated(updated);
        setSelectedProductIds([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Homepage controls
  const handleToggleHomepageSectionOrder = (sectionId: string, dir: "up" | "down") => {
    const order = [...cmsSettings.homepage.sectionOrder];
    const index = order.indexOf(sectionId);
    if (index === -1) return;
    
    if (dir === "up" && index > 0) {
      const temp = order[index];
      order[index] = order[index - 1];
      order[index - 1] = temp;
    } else if (dir === "down" && index < order.length - 1) {
      const temp = order[index];
      order[index] = order[index + 1];
      order[index + 1] = temp;
    }

    saveCmsSettings({
      ...cmsSettings,
      homepage: { ...cmsSettings.homepage, sectionOrder: order }
    });
  };

  const handleToggleProductOnHomepage = (id: string, group: "featuredProductIds" | "trendingProductIds" | "bannerProductIds") => {
    const list = [...cmsSettings.homepage[group]];
    const updatedList = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    saveCmsSettings({
      ...cmsSettings,
      homepage: { ...cmsSettings.homepage, [group]: updatedList }
    });
  };

  // Search Filter — searches name, category, SKU, description, short desc, long desc
  const filteredProducts = products.filter(p => {
    const nameStr = p.name || p.title || "";
    const catStr = p.category || "";
    const skuStr = p.sku || "";
    const descStr = p.description || "";
    const shortStr = p.shortDescription || "";
    const longStr = p.longDescription || "";
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch = !query ||
      nameStr.toLowerCase().includes(query) ||
      catStr.toLowerCase().includes(query) ||
      skuStr.toLowerCase().includes(query) ||
      descStr.toLowerCase().includes(query) ||
      shortStr.toLowerCase().includes(query) ||
      longStr.toLowerCase().includes(query);

    const matchesCategory = filterCategory === "All" || catStr === filterCategory;

    let matchesStatus = true;
    const isOutOfStock = (p.quantity ?? 0) <= 0;
    const isLowStock = !isOutOfStock && (p.quantity ?? 0) <= (p.lowStockAlert ?? 3);

    if (filterStatus === "enabled") matchesStatus = p.isEnabled !== false;
    else if (filterStatus === "disabled") matchesStatus = p.isEnabled === false;
    else if (filterStatus === "hidden") matchesStatus = p.isHidden === true;
    else if (filterStatus === "outofstock") matchesStatus = isOutOfStock;
    else if (filterStatus === "lowstock") matchesStatus = isLowStock;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="bg-stone-900 min-h-[90vh] text-stone-150 font-sans p-6 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden" id="pune-cms-manager">
      
      {/* Save toast */}
      {saveToast && (
        <div className="fixed top-20 right-6 bg-emerald-600 text-white border border-emerald-500/40 p-4 rounded-xl flex items-center gap-2.5 z-999 shadow-2xl animate-fade-in text-xs font-bold uppercase tracking-wider">
          <Check className="w-4 h-4" />
          <span>✓ Product saved successfully</span>
        </div>
      )}

      {/* CMS Success feedback message */}
      {sectionSuccessMsg && (
        <div className="fixed top-20 right-6 bg-[#82862F] text-white border border-[#F9FAEE]/25 p-4 rounded-xl flex items-center gap-2.5 z-999 shadow-2xl animate-fade-in text-xs font-bold uppercase tracking-wider">
          <CheckCircle className="w-5 h-5" />
          <span>{sectionSuccessMsg}</span>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/75 z-[9999] flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-950 border border-rose-800 rounded-full flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Delete this product?</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-stone-850 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#82862F]/15 border border-[#82862F]/30 text-[#82862F] rounded-2xl flex items-center justify-center shadow-inner">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-white tracking-tight">Pune Sajawat Florist CMS</h2>
            <p className="text-xs text-stone-400 mt-1">Directly manage homepage banner sliders, categories, inventory, and attachments</p>
          </div>
        </div>

        <div className="flex bg-stone-950 p-1.5 rounded-xl border border-stone-800 gap-1.5 shrink-0">
          {[
            { id: "products", label: "Catalog Products" },
            { id: "sections", label: "Category Sections" },
            { id: "homepage", label: "Homepage Control" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setActivePanel(p.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activePanel === p.id 
                  ? "bg-[#82862F] text-white shadow-md" 
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* PANEL 1: SECTIONS PANEL */}
      {activePanel === "sections" && (
        <div className="space-y-6 animate-fade-in" id="cms-sections-panel">
          <div className="flex justify-between items-center border-b border-stone-850 pb-3">
            <h3 className="text-sm uppercase tracking-widest font-extrabold text-[#82862F] flex items-center gap-1.5">
              <span>🗂️ Active Category Sections</span>
              <span className="text-[10px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded font-mono font-normal">
                {cmsSettings.sections.length} categories
              </span>
            </h3>
            
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="px-4 py-2.5 bg-[#82862F] hover:bg-[#6C7026] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cmsSettings.sections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((section, idx) => (
                <div 
                  key={section.id}
                  className="bg-stone-950/70 border border-stone-850 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden group/card"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-stone-500 block">
                        ID: {section.id} • Order: {section.displayOrder}
                      </span>
                      {editingSectionId === section.id ? (
                        <input
                          type="text"
                          defaultValue={section.name}
                          onBlur={(e) => handleUpdateSectionName(section.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateSectionName(section.id, e.currentTarget.value);
                            }
                          }}
                          autoFocus
                          className="bg-stone-900 border border-stone-800 text-white rounded px-2.5 py-1 text-sm font-bold w-48 outline-none"
                        />
                      ) : (
                        <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                          <span>{section.name}</span>
                          <button 
                            onClick={() => setEditingSectionId(section.id)}
                            className="p-1 text-stone-400 hover:text-white transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </h4>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleMoveSectionOrder(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none rounded transition-colors text-stone-300"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleMoveSectionOrder(idx, "down")}
                        disabled={idx === cmsSettings.sections.length - 1}
                        className="p-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none rounded transition-colors text-stone-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Section Banner preview */}
                  <div className="relative aspect-[16/6] bg-stone-900 rounded-xl overflow-hidden border border-stone-850 flex items-center justify-center text-stone-500">
                    {section.bannerImage ? (
                      <img src={section.bannerImage} alt={section.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-3 text-[10px]">
                        <ImageIcon className="w-6 h-6 mx-auto opacity-40 mb-1" />
                        <span>No Category Banner Set</span>
                      </div>
                    )}
                    
                    <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-[10.5px] font-bold uppercase tracking-wider text-white cursor-pointer gap-1.5">
                      <Upload className="w-4 h-4" />
                      <span>Upload Banner</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleSectionBannerUpload(e, section.id)}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Config settings */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-850/80">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleHideSection(section.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          section.hidden 
                            ? "bg-rose-950/40 text-rose-400 border border-rose-900/40" 
                            : "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                        }`}
                      >
                        {section.hidden ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hidden</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleFeaturedSection(section.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          section.isFeatured 
                            ? "bg-amber-950/40 text-amber-400 border border-amber-900/40" 
                            : "bg-stone-900 text-stone-400 border border-stone-800"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Featured</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-2 bg-stone-900 hover:bg-rose-950/60 hover:text-rose-400 rounded-lg transition-colors text-stone-500 cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* PANEL 2: CATALOG PRODUCTS PANEL */}
      {activePanel === "products" && (
        <div className="space-y-6 animate-fade-in" id="cms-products-panel">
          
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-850">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search product by name, SKU, price, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 text-white rounded-xl pl-9 pr-4 py-2 text-xs font-semibold placeholder-stone-500 outline-none focus:border-[#82862F]"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2.5">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-stone-900 border border-stone-800 text-stone-300 text-xs px-3 py-2 rounded-xl outline-none font-bold cursor-pointer"
              >
                <option value="All">All Categories</option>
                {cmsSettings.sections.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-stone-900 border border-stone-800 text-stone-300 text-xs px-3 py-2 rounded-xl outline-none font-bold cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="enabled">Enabled Only</option>
                <option value="disabled">Disabled Only</option>
                <option value="hidden">Hidden Only</option>
                <option value="outofstock">Out of Stock Only</option>
                <option value="lowstock">Low Stock Only</option>
              </select>

              <button
                onClick={() => handleOpenProductForm(null)}
                className="px-4 py-2 bg-[#82862F] hover:bg-[#6C7026] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Bulk Actions Box */}
          {selectedProductIds.length > 0 && (
            <div className="bg-stone-950 border-2 border-[#82862F]/40 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in" id="cms-bulk-actions">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#82862F] animate-ping" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Bulk Actions ({selectedProductIds.length} items selected)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category shift */}
                <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
                  <select
                    value={bulkCategoryChange}
                    onChange={(e) => setBulkCategoryChange(e.target.value)}
                    className="bg-transparent text-stone-300 text-[10.5px] px-2 py-1 outline-none font-bold cursor-pointer"
                  >
                    <option value="">Move Category...</option>
                    {cmsSettings.sections.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleBulkChangeCategory}
                    disabled={!bulkCategoryChange}
                    className="p-1 bg-[#82862F] text-white rounded hover:bg-[#6C7026] text-[9.5px] font-black uppercase disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Apply
                  </button>
                </div>

                {/* Price update */}
                <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
                  <input
                    type="number"
                    placeholder="New Price..."
                    value={bulkPriceChange}
                    onChange={(e) => setBulkPriceChange(e.target.value)}
                    className="bg-transparent text-white text-[10.5px] px-2 py-1 outline-none font-bold w-20 placeholder-stone-600"
                  />
                  <button
                    onClick={handleBulkUpdatePrice}
                    disabled={!bulkPriceChange}
                    className="p-1 bg-[#82862F] text-white rounded hover:bg-[#6C7026] text-[9.5px] font-black uppercase disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Apply
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkToggleSetting("isBestSeller")}
                    className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-850 text-stone-300 rounded-lg text-[9.5px] font-black uppercase border border-stone-800"
                  >
                    Toggle Best Seller
                  </button>
                  <button
                    onClick={() => handleBulkToggleSetting("isEnabled")}
                    className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-850 text-stone-300 rounded-lg text-[9.5px] font-black uppercase border border-stone-800"
                  >
                    Toggle Enable
                  </button>
                  <button
                    onClick={() => handleBulkToggleSetting("isHidden")}
                    className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-850 text-stone-300 rounded-lg text-[9.5px] font-black uppercase border border-stone-800"
                  >
                    Toggle Hide
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 rounded-lg text-[9.5px] font-black uppercase border border-rose-900/40"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Inventory Grid Table */}
          <div className="bg-stone-950 rounded-2xl border border-stone-850 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-medium text-stone-350">
                <thead>
                  <tr className="bg-stone-900/80 border-b border-stone-850 text-stone-400 uppercase tracking-widest text-[9.5px] font-extrabold select-none h-11">
                    <th className="px-4 text-center w-12">
                      <button 
                        onClick={() => handleSelectAllProducts(filteredProducts)}
                        className="text-stone-450 hover:text-white"
                      >
                        {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                          <CheckSquare className="w-4.5 h-4.5 text-[#82862F] mx-auto" />
                        ) : (
                          <Square className="w-4.5 h-4.5 mx-auto" />
                        )}
                      </button>
                    </th>
                    <th className="px-4">Product Info</th>
                    <th className="px-4">SKU</th>
                    <th className="px-4">Category</th>
                    <th className="px-4">Price</th>
                    <th className="px-4">Stock Status</th>
                    <th className="px-4 text-center">Badges</th>
                    <th className="px-4 text-center">Settings</th>
                    <th className="px-4 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850/50">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    const stock = p.quantity ?? 10;
                    const isOutOfStock = stock <= 0;
                    const isLowStock = !isOutOfStock && stock <= (p.lowStockAlert ?? 3);

                    return (
                      <tr 
                        key={p.id}
                        className={`hover:bg-stone-900/30 transition-colors ${
                          isSelected ? "bg-[#82862F]/5" : ""
                        }`}
                      >
                        {/* Select checkbox */}
                        <td className="px-4 text-center">
                          <button
                            onClick={() => handleToggleSelectProduct(p.id)}
                            className="text-stone-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4.5 h-4.5 text-[#82862F] mx-auto" />
                            ) : (
                              <Square className="w-4.5 h-4.5 mx-auto" />
                            )}
                          </button>
                        </td>

                        {/* Image + Title */}
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-850 overflow-hidden shrink-0 relative">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            {p.images && p.images.length > 1 && (
                              <span className="absolute bottom-1 right-1 bg-stone-950/85 text-[8px] px-1 py-0.2 rounded text-white font-mono font-bold">
                                {p.images.length}P
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white line-clamp-1 font-serif text-sm">{p.name || p.title}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-1 leading-normal font-sans font-light mt-0.5">{p.description}</p>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-4 font-mono text-[10.5px] font-bold text-stone-400">
                          {p.sku || "N/A"}
                        </td>

                        {/* Category */}
                        <td className="px-4">
                          <span className="px-2 py-0.5 bg-stone-900 rounded text-stone-300 font-bold border border-stone-800">
                            {p.category}
                          </span>
                        </td>

                        {/* Pricing */}
                        <td className="px-4 font-mono font-bold text-white">
                          <div className="space-y-0.5">
                            <span>₹{p.price}</span>
                            {p.originalPrice > p.price && (
                              <span className="text-[10px] text-stone-500 line-through block font-normal">₹{p.originalPrice}</span>
                            )}
                          </div>
                        </td>

                        {/* Stock status */}
                        <td className="px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              {isOutOfStock ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-950/40 text-rose-400 border border-rose-900/40 rounded text-[9.5px]">
                                  Out of Stock
                                </span>
                              ) : isLowStock ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-950/40 text-amber-400 border border-amber-900/40 rounded text-[9.5px]">
                                  Low Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded text-[9.5px]">
                                  In Stock
                                </span>
                              )}
                            </div>
                            <span className="text-[9.5px] text-stone-450 block font-normal font-mono">
                              Qty: <strong>{stock}</strong> (Alert: {p.lowStockAlert ?? 3})
                            </span>
                          </div>
                        </td>

                        {/* Badges indicators */}
                        <td className="px-4 text-center">
                          <div className="flex flex-wrap justify-center gap-1 max-w-[120px] mx-auto select-none font-sans text-[8.5px] font-extrabold uppercase">
                            {p.isBestSeller && <span className="px-1.5 py-0.2 bg-[#FC8019]/15 text-[#FC8019] rounded-sm">Trending</span>}
                            {p.isNew && <span className="px-1.5 py-0.2 bg-[#82862F]/15 text-[#82862F] rounded-sm">New</span>}
                            {p.isFeatured && <span className="px-1.5 py-0.2 bg-purple-950/20 text-purple-400 rounded-sm">Featured</span>}
                            {p.isTrending && <span className="px-1.5 py-0.2 bg-blue-950/20 text-blue-400 rounded-sm">Popular</span>}
                          </div>
                        </td>

                        {/* Toggle indicators */}
                        <td className="px-4 text-center select-none font-sans text-[9px] font-extrabold uppercase">
                          <div className="space-y-1">
                            {p.isEnabled !== false ? (
                              <span className="text-emerald-400">Enabled</span>
                            ) : (
                              <span className="text-stone-500">Disabled</span>
                            )}
                            {p.isHidden && (
                              <span className="block text-rose-400 font-bold">Hidden</span>
                            )}
                          </div>
                        </td>

                        {/* Edit/Delete triggers */}
                        <td className="px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenProductForm(p)}
                              className="p-1.5 bg-stone-900 hover:bg-[#82862F]/20 hover:text-white rounded transition-colors text-stone-400 cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 bg-stone-900 hover:bg-rose-950/50 hover:text-rose-400 rounded transition-colors text-stone-500 cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-stone-500 text-xs italic">
                        No products match your search or filter requirements.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 3: HOMEPAGE LAYOUT CONTROL PANEL */}
      {activePanel === "homepage" && (
        <div className="space-y-8 animate-fade-in" id="cms-homepage-panel">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Box: Layout sections ordering */}
            <div className="bg-stone-950/70 border border-stone-850 p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="border-b border-stone-850 pb-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4.5 h-4.5 text-[#82862F]" />
                  <span>Homepage Sections Layout Order</span>
                </h3>
                <p className="text-[10px] text-stone-400 leading-normal mt-0.5">Drag, reorder, or filter active category cards directly on the live landing screen.</p>
              </div>

              <div className="space-y-2">
                {cmsSettings.homepage.sectionOrder.map((sectionId, idx) => {
                  const section = cmsSettings.sections.find(s => s.id === sectionId);
                  if (!section) return null;
                  return (
                    <div
                      key={sectionId}
                      className="p-3 bg-stone-900 rounded-xl flex items-center justify-between border border-stone-850 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-stone-950 text-stone-400 font-mono text-[9px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-white font-serif">{section.name}</span>
                          {section.hidden && (
                            <span className="text-[8px] ml-2 px-1.5 py-0.2 bg-rose-950 text-rose-400 rounded-sm font-sans uppercase font-bold">Hidden</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleHomepageSectionOrder(sectionId, "up")}
                          disabled={idx === 0}
                          className="p-1 bg-stone-950 hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none rounded transition-colors text-stone-300"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleHomepageSectionOrder(sectionId, "down")}
                          disabled={idx === cmsSettings.homepage.sectionOrder.length - 1}
                          className="p-1 bg-stone-950 hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none rounded transition-colors text-stone-300"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Box: Layout Products Assignment */}
            <div className="bg-stone-950/70 border border-stone-850 p-5 rounded-2xl space-y-6 shadow-sm">
              <div className="border-b border-stone-850 pb-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4.5 h-4.5 text-[#82862F]" />
                  <span>Homepage Products Assignments</span>
                </h3>
                <p className="text-[10px] text-stone-400 leading-normal mt-0.5">Toggle catalog products to show as featured slider, trending cards, or hero background highlights.</p>
              </div>

              {/* Scroll list of products to assign */}
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {products.map(p => {
                  const isFeatured = cmsSettings.homepage.featuredProductIds.includes(p.id);
                  const isTrending = cmsSettings.homepage.trendingProductIds.includes(p.id);
                  const isBanner = cmsSettings.homepage.bannerProductIds.includes(p.id);

                  return (
                    <div 
                      key={p.id}
                      className="p-3 bg-stone-900 rounded-xl flex items-center justify-between border border-stone-850 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={p.image} className="w-10 h-10 object-cover rounded bg-stone-950 border border-stone-850" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate leading-tight font-serif">{p.name || p.title}</span>
                          <span className="text-[9.5px] text-[#82862F] font-bold block mt-0.5">{p.category}</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5 select-none font-sans text-[8.5px] font-extrabold uppercase">
                        {/* Featured */}
                        <button
                          onClick={() => handleToggleProductOnHomepage(p.id, "featuredProductIds")}
                          className={`px-2 py-1 rounded transition-all cursor-pointer border ${
                            isFeatured 
                              ? "bg-purple-950/40 text-purple-400 border-purple-900/40 font-black" 
                              : "bg-stone-950 text-stone-500 border-stone-850 hover:text-white"
                          }`}
                        >
                          Featured
                        </button>
                        {/* Trending */}
                        <button
                          onClick={() => handleToggleProductOnHomepage(p.id, "trendingProductIds")}
                          className={`px-2 py-1 rounded transition-all cursor-pointer border ${
                            isTrending 
                              ? "bg-amber-950/40 text-amber-400 border-amber-900/40 font-black" 
                              : "bg-stone-950 text-stone-500 border-stone-850 hover:text-white"
                          }`}
                        >
                          Trending
                        </button>
                        {/* Banner */}
                        <button
                          onClick={() => handleToggleProductOnHomepage(p.id, "bannerProductIds")}
                          className={`px-2 py-1 rounded transition-all cursor-pointer border ${
                            isBanner 
                              ? "bg-[#82862F]/20 text-[#82862F] border-[#82862F]/30 font-black" 
                              : "bg-stone-950 text-stone-500 border-stone-850 hover:text-white"
                          }`}
                        >
                          Banner
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODAL 1: ADD SECTION / CATEGORY MODAL */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black/80 z-999 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowAddSectionModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-left space-y-1">
              <h4 className="text-base font-bold text-white font-serif">Create Category Section</h4>
              <p className="text-[10px] text-stone-500 leading-normal">Configure name for custom display categories built in Pune Sajawat storefront.</p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Type Select */}
              <div className="flex gap-4 border-b border-stone-800 pb-3 select-none font-sans text-xs font-bold text-stone-400">
                <button
                  onClick={() => setIsCustomCategory(false)}
                  className={`flex-1 py-1 px-2 rounded-lg text-center ${!isCustomCategory ? "bg-[#82862F] text-white" : "hover:text-white"}`}
                >
                  Preset List
                </button>
                <button
                  onClick={() => setIsCustomCategory(true)}
                  className={`flex-1 py-1 px-2 rounded-lg text-center ${isCustomCategory ? "bg-[#82862F] text-white" : "hover:text-white"}`}
                >
                  Custom Name
                </button>
              </div>

              {!isCustomCategory ? (
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">Select preset category</label>
                  <select
                    value={selectedPresetSection}
                    onChange={(e) => setSelectedPresetSection(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-stone-200 outline-none font-bold"
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">Custom Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Exotic Carnations"
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-stone-700 outline-none focus:border-[#82862F]"
                  />
                </div>
              )}

              <button
                onClick={handleAddSection}
                className="w-full py-3 bg-[#82862F] hover:bg-[#6C7026] text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-98"
              >
                Create Section Category 📁
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD & EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/85 z-999 flex items-center justify-center p-4 overflow-y-auto">
          <form 
            onSubmit={handleSaveProduct}
            className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl relative space-y-6 max-h-[92vh] overflow-y-auto"
            id="product-edit-form"
          >
            <button 
              type="button"
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5.5 h-5.5" />
            </button>

            <div className="text-left space-y-1 border-b border-stone-850 pb-3">
              <h4 className="text-lg font-bold text-white font-serif">
                {editingProduct ? `Modify Product: ${editingProduct.name || editingProduct.title}` : "Add New Catalog Product"}
              </h4>
              <p className="text-[10.5px] text-stone-500 mt-0.5">Enrich parameters such as SKU, attached add-ons, stock quantity, and logistics overrides</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT SIDE FORM BLOCK (Descriptions & pricing) */}
              <div className="space-y-4">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Asiatic White Lily Hand-tied Bouquet"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-stone-750 outline-none focus:border-[#82862F]"
                  />
                </div>

                {/* Category select */}
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">Display Category</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-stone-200 outline-none font-bold"
                  >
                    {[...cmsSettings.sections]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    {cmsSettings.sections.length === 0 && (
                      <option value="Bouquets">Bouquets</option>
                    )}
                  </select>
                </div>

                {/* Stock Quantity */}
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>

                {/* Final Selling Price — full width */}
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block font-sans">Final Selling Price (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={price}
                    onFocus={(e) => {
                      if (e.target.value === "0") e.target.select();
                    }}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setPrice(raw);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "" || e.target.value === "0") setPrice("0");
                      else setPrice(String(Number(e.target.value)));
                    }}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono text-[#82862F] font-bold"
                  />
                </div>

                {/* Descriptions */}
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">Short Description</label>
                  <input
                    type="text"
                    placeholder="Short subtitle summary displayed on cards..."
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-stone-700 outline-none focus:border-[#82862F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">Long Description Details</label>
                  <textarea
                    rows={4}
                    placeholder="Provide full care guidelines, wrapping colors, vase specifications..."
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 rounded-xl p-3 text-xs text-white placeholder-stone-700 outline-none focus:border-[#82862F] resize-none"
                  />
                </div>
              </div>

              {/* RIGHT SIDE FORM BLOCK (Images + Status switches) */}
              <div className="space-y-6">

                {/* Images Manager */}
                <div className="bg-stone-950/50 border border-stone-850 rounded-2xl p-4.5 space-y-3">
                  <div className="flex justify-between items-center border-b border-stone-850 pb-2">
                    <label className="text-[10.5px] text-stone-400 uppercase tracking-wider font-extrabold block">Product Images</label>
                    <span className="text-[9px] text-[#82862F] bg-[#82862F]/10 px-1.5 py-0.2 rounded font-black font-mono">Cover: #{coverImageIndex + 1}</span>
                  </div>

                  {uploadedImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.map((url, i) => (
                        <div key={i} className={`relative aspect-square bg-stone-950 rounded-lg overflow-hidden border-2 transition-all ${
                          coverImageIndex === i ? "border-[#82862F] ring-2 ring-[#82862F]/20" : "border-stone-800"
                        }`}>
                          <img src={url} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCoverImageIndex(i)}
                            className="absolute top-1 left-1 bg-stone-950/80 hover:bg-[#82862F] text-white p-0.5 rounded text-[8px] font-bold"
                          >
                            Set Cover
                          </button>
                          <button
                            type="button"
                            onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                            className="absolute bottom-1 right-1 bg-rose-950/90 text-rose-400 hover:text-white p-0.5 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-500 italic text-center py-4">No images uploaded. Add photos below.</p>
                  )}

                  {/* Upload button wrapper */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-850 rounded-xl text-[10.5px] font-bold border border-stone-800 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-stone-400" />
                      <span>{isUploading ? "Uploading file buffers..." : "Upload local product files"}</span>
                    </button>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImagesUpload}
                      className="hidden" 
                    />
                    
                    {imageUploadLogs.length > 0 && (
                      <span className="text-[9.5px] text-[#82862F] block mt-1 animate-pulse font-bold">{imageUploadLogs[imageUploadLogs.length - 1]}</span>
                    )}
                  </div>
                </div>

                {/* Product status switches — simplified for owner */}
                <div className="bg-stone-950/50 border border-stone-850 rounded-2xl p-4.5 space-y-2 select-none text-[10.5px] text-stone-300 font-bold uppercase">
                  <span className="text-[10px] text-stone-400 tracking-wider block border-b border-stone-850 pb-2">Product Status</span>

                  <div className="flex flex-col gap-2 pt-1 font-sans">
                    <label className="flex items-center gap-2 cursor-pointer py-1 text-emerald-400">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => setIsEnabled(e.target.checked)}
                        className="text-emerald-500 focus:ring-0 rounded border-stone-800"
                      />
                      <span>Enable Product (Active)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-1 text-rose-400">
                      <input
                        type="checkbox"
                        checked={isHidden}
                        onChange={(e) => setIsHidden(e.target.checked)}
                        className="text-rose-500 focus:ring-0 rounded border-stone-800"
                      />
                      <span>Hide Product</span>
                    </label>
                  </div>
                </div>

                {/* Add-ons Attacher box */}
                <div className="bg-stone-950/50 border border-stone-850 rounded-2xl p-4.5 space-y-4">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block border-b border-stone-850 pb-2">Attach Customizable Gift Add-ons</span>
                  
                  {/* Current addons list */}
                  {attachedAddons.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {attachedAddons.map((addon) => (
                        <div key={addon.id} className="bg-stone-900 border border-stone-850 rounded-lg p-2 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base shrink-0">
                              {PRESET_ADDON_CATEGORIES.find(c => c.id === addon.category)?.emoji || "🎁"}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate">{addon.name}</span>
                              <span className="text-[10px] text-stone-500 block font-mono">₹{addon.price} • {addon.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleAddonEnabled(addon.id)}
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors ${
                                addon.enabled 
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40" 
                                  : "bg-stone-950 text-stone-500 border border-stone-850"
                              }`}
                            >
                              {addon.enabled ? "Active" : "Disabled"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddonFromProduct(addon.id)}
                              className="p-1 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9.5px] text-stone-500 italic text-center py-2">No custom addons linked to this product.</p>
                  )}

                  {/* Add addon form */}
                  <div className="border-t border-stone-850/80 pt-3.5 space-y-3 font-sans">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[9px] text-stone-500 uppercase tracking-wider block">Add-on Item Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Ferrero Box"
                          value={newAddonName}
                          onChange={(e) => setNewAddonName(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-850 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none focus:border-[#82862F]"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] text-stone-500 uppercase tracking-wider block">Add-on Type</label>
                        <select
                          value={newAddonCat}
                          onChange={(e) => setNewAddonCat(e.target.value as any)}
                          className="w-full bg-stone-950 border border-stone-850 rounded-lg px-2.5 py-1.5 text-[11px] text-stone-300 outline-none font-bold"
                        >
                          {PRESET_ADDON_CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-stone-500 font-bold">Addon Price (₹):</span>
                        <input
                          type="number"
                          min={0}
                          value={newAddonPrice}
                          onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                          className="bg-stone-950 border border-stone-850 text-white text-[11px] px-2 py-1 w-20 rounded font-mono outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddAddonToProduct}
                        className="px-3.5 py-1.5 bg-stone-900 hover:bg-[#82862F] hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider border border-stone-800 transition-all cursor-pointer"
                      >
                        + Attach Add-on
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="border-t border-stone-850 pt-4 flex justify-end gap-3 select-none font-sans text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                disabled={isSaving}
                className="px-5 py-2.5 bg-stone-950 hover:bg-stone-900 border border-stone-850 rounded-xl text-stone-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#82862F] hover:bg-[#6C7026] text-white rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#82862F]/10 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Check className="w-4.5 h-4.5" />
                <span>{isSaving ? "Saving..." : "Save Product"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
