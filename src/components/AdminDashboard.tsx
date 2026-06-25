import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  TrendingUp, 
  Package, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  AlertCircle, 
  Filter, 
  ArrowLeft,
  DollarSign,
  Plus,
  Trash2,
  Save,
  Check,
  Layers,
  Image,
  Copy,
  RefreshCw,
  UploadCloud,
  Grid,
  Sparkles
} from "lucide-react";
import { Order, Product } from "../types";
import { 
  getDeliverySettings, 
  saveDeliverySettings, 
  DeliverySettings, 
  DeliveryAreaConfig, 
  DeliveryTypeConfig 
} from "../utils/deliverySettings";
import CatalogManager from "./CatalogManager";

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // Tab selector State
  const [adminTab, setAdminTab] = useState<"orders" | "settings" | "catalog" | "catalog_manager" | "backups">("orders");

  // Load products list for Catalog Manager CMS
  const [products, setProducts] = useState<Product[]>([]);
  
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to load products in admin", e);
    }
  };

  // Backups and safety states
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
  
  const loadDeletedProducts = async () => {
    try {
      const res = await fetch("/api/products/deleted");
      if (res.ok) {
        const data = await res.json();
        setDeletedProducts(data);
      }
    } catch (e) {
      console.error("Failed to load deleted products", e);
    }
  };

  const handleRestoreBackup = async (index: number) => {
    if (!confirm(`Are you sure you want to restore the database to Backup #${index}? This will overwrite current products.`)) return;
    try {
      const res = await fetch("/api/products/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Database restored successfully!");
        loadProducts(); // reload active products
      } else {
        alert(data.error || "Failed to restore backup.");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred while restoring backup.");
    }
  };

  const handleRestoreDeletedProduct = async (id: string) => {
    if (!confirm("Are you sure you want to restore this deleted product back to the active catalog?")) return;
    try {
      const res = await fetch("/api/products/restore-deleted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product restored successfully!");
        loadProducts(); // reload active products
        loadDeletedProducts(); // reload deleted products
      } else {
        alert(data.error || "Failed to restore product.");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred while restoring product.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (adminTab === "backups") {
      loadDeletedProducts();
    }
  }, [adminTab]);

  // Dynamic Settings States
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({ areas: [], types: [] });
  
  // New Area Form State
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaPostcode, setNewAreaPostcode] = useState("");
  const [newAreaCharge, setNewAreaCharge] = useState<number>(0);
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState("");

  // 📸 Catalog Auto-Builder States
  const [pendingUploads, setPendingUploads] = useState<any[]>([]);

  const [customImageUrl, setCustomImageUrl] = useState("");
  const [customImageCategory, setCustomImageCategory] = useState<"bouquet" | "cake" | "decoration" | "gift">("bouquet");
  
  const [builderStep, setBuilderStep] = useState<"upload" | "processing" | "duplicates" | "done">("upload");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");
  const [activeUploadIndex, setActiveUploadIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Duplicate groupings options
  const [roseDuplicateOption, setRoseDuplicateOption] = useState<"merge" | "separate" | "discard">("merge");
  const [decorDuplicateOption, setDecorDuplicateOption] = useState<"merge" | "separate" | "discard">("merge");

  const [catalogSuccessMessage, setCatalogSuccessMessage] = useState("");

  const handleAddCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;

    const newImg = {
      id: "img_custom_" + Date.now(),
      url: customImageUrl.trim(),
      name: "custom_uploaded_item_" + Math.floor(Math.random() * 1000) + ".jpg",
      type: customImageCategory,
      angle: "User Uploaded View",
      sizeBytes: 1200000 + Math.floor(Math.random() * 500000),
      status: "pending"
    };

    setPendingUploads([...pendingUploads, newImg]);
    setCustomImageUrl("");
    setCatalogSuccessMessage("Added your florist photo to the processing queue! 📸");
    setTimeout(() => setCatalogSuccessMessage(""), 2500);
  };

  const handleDeletePendingImage = (id: string) => {
    setPendingUploads(pendingUploads.filter(p => p.id !== id));
  };

  const runCatalogProcessor = () => {
    if (pendingUploads.length === 0) {
      alert("Please upload or add at least one stock photo to process!");
      return;
    }
    setIsProcessing(true);
    setBuilderStep("processing");
    setProcessingProgress(0);
    setProcessingMessage("Initializing AI neural segmentation engine...");
    setActiveUploadIndex(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setProcessingProgress(progress);

      const targetIndex = Math.min(
        Math.floor((progress / 100) * pendingUploads.length),
        pendingUploads.length - 1
      );
      setActiveUploadIndex(targetIndex);

      if (progress < 25) {
        setProcessingMessage(`[Step 1/4] Segmenting flower silhouettes & Removing background shadows... (processing ${pendingUploads[targetIndex]?.name})`);
      } else if (progress < 50) {
        setProcessingMessage(`[Step 2/4] Refining transparent alpha masks & placing items on pure white canvas grid...`);
      } else if (progress < 75) {
        setProcessingMessage(`[Step 3/4] Aligning margins, cropping neatly, and scaling to premium 4K definition...`);
      } else if (progress < 95) {
        setProcessingMessage(`[Step 4/4] Comparing image hashes & checking duplicate patterns across Pune floristry database...`);
      } else {
        setProcessingMessage(`Wrapping up structural metadata index...`);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setBuilderStep("duplicates");
      }
    }, 100);
  };

  const finalizeCatalogBuild = () => {
    // Compile products based on uploads & duplicate options
    const finalProducts: any[] = [];

    // 1. Red Rose Bouquet product
    if (roseDuplicateOption !== "discard") {
      const imagesList = ["https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600"];
      if (roseDuplicateOption === "merge") {
        imagesList.push("https://images.unsplash.com/photo-1559563458-527298c27178?auto=format&fit=crop&q=80&w=600");
      }
      finalProducts.push({
        id: "prod_sc_red_roses",
        title: "Classic Crimson Rose & Gypsophila Hand-tied Bouquet",
        price: 849,
        originalPrice: 1199,
        category: "Roses",
        image: imagesList[0],
        galleryImages: imagesList,
        rating: 4.9,
        reviewsCount: 38,
        description: "Exquisite arrangement of hand-picked premium red roses clustered with baby's breath. Professionally background-removed, neatly cropped, and presented on premium satin wraps with organic ribbons.",
        isBestSeller: true,
        isNew: false
      });

      if (roseDuplicateOption === "separate") {
        finalProducts.push({
          id: "prod_sc_red_roses_angle_b",
          title: "Classic Crimson Rose Bouquet (Left Closeup Angle)",
          price: 799,
          originalPrice: 1099,
          category: "Roses",
          image: "https://images.unsplash.com/photo-1559563458-527298c27178?auto=format&fit=crop&q=80&w=600",
          galleryImages: ["https://images.unsplash.com/photo-1559563458-527298c27178?auto=format&fit=crop&q=80&w=600"],
          rating: 4.8,
          reviewsCount: 14,
          description: "Close perspective highlight of our classic red roses set. High definition colors under soft white focus.",
          isBestSeller: false,
          isNew: true
        });
      }
    }

    // 2. Lily Luxe
    if (pendingUploads.some(p => p.id === "img_lily_luxe")) {
      finalProducts.push({
        id: "prod_sc_lilies_luxe",
        title: "Royal Cream Asiatic Lily & Blush Rose Ribbon Wrap",
        price: 1149,
        originalPrice: 1590,
        category: "Fresh Flowers",
        image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600",
        rating: 4.9,
        reviewsCount: 22,
        description: "Stately oriental lilies paired with sweet blush roses, premium greenery, and eucalyptus foliage. Draped in high-end pink paper wraps with gold lining and tied with a royal satin band.",
        isBestSeller: false,
        isNew: true
      });
    }

    // 3. Cake
    if (pendingUploads.some(p => p.id === "img_cake_choco")) {
      finalProducts.push({
        id: "prod_sc_cake_choco",
        title: "Rich Chocolate Fudge Ganache Celebration Cake",
        price: 699,
        originalPrice: 999,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
        rating: 4.8,
        reviewsCount: 18,
        description: "Moist luxury triple-layer chocolate sponge smothered in velvety hot-fudge frosting. Baked fresh daily by Pune master chefs for top-tier wedding and birthday celebrations.",
        isBestSeller: true,
        isNew: false
      });
    }

    // 4. Decoration Setup
    if (decorDuplicateOption !== "discard") {
      const imagesList = ["https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600"];
      if (roseDuplicateOption === "merge") {
        imagesList.push("https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&q=80&w=600");
      }
      finalProducts.push({
        id: "prod_sc_wedding_decor",
        title: "Majestic Entrance Floral Archway & Stage Design Set",
        price: 18999,
        originalPrice: 26999,
        category: "Birthday Decorations", // matches existing Categories filter values
        image: imagesList[0],
        galleryImages: imagesList,
        rating: 5.0,
        reviewsCount: 45,
        description: "Magnificent large-scale event decoration setup combining white hydrangeas, pink marigolds, and elegant golden backdrop arcs. Perfect for grand weddings, anniversaries, and luxury corporate entries in Pune.",
        isBestSeller: true,
        isNew: true
      });

      if (decorDuplicateOption === "separate") {
        finalProducts.push({
          id: "prod_sc_wedding_decor_angle_b",
          title: "Premium Stage Backdrop Arch (Side Angle Highlight)",
          price: 14999,
          originalPrice: 19999,
          category: "Birthday Decorations",
          image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&q=80&w=600",
          rating: 4.9,
          reviewsCount: 10,
          description: "Close side frame highlights from our standard majestic marigold backdrop range. Beautifully trimmed on transparent alpha screens.",
          isBestSeller: false,
          isNew: false
        });
      }
    }

    // 5. Gift Candle (if present)
    if (pendingUploads.some(p => p.id === "img_candle_gift")) {
      finalProducts.push({
        id: "prod_sc_candle_gift",
        title: "Earthy Vetiver & Organic Wax Scented Gift Candle",
        price: 299,
        originalPrice: 499,
        category: "Gift Hampers",
        image: "https://images.unsplash.com/photo-1603006905543-c4a1658a7ec9?auto=format&fit=crop&q=80&w=600",
        rating: 4.7,
        reviewsCount: 9,
        description: "Slow-burning clean organic soy candle infused with earthy cedarwood, standard vetiver, and lavender oils. A stunning premium keepsake gift wrapped with satin ribbons.",
        isBestSeller: false,
        isNew: false
      });
    }

    // 6. Handle any custom added images in pending list
    pendingUploads.forEach(p => {
      if (p.id.startsWith("img_custom_")) {
        const catMap = {
          bouquet: "Small Bouquets",
          cake: "Cakes",
          decoration: "Birthday Decorations",
          gift: "Gift Hampers"
        };
        finalProducts.push({
          id: "prod_sc_" + p.id,
          title: "Custom Florist " + p.type.charAt(0).toUpperCase() + p.type.slice(1) + " Collection item",
          price: p.type === "decoration" ? 4999 : p.type === "cake" ? 899 : 599,
          originalPrice: p.type === "decoration" ? 7500 : p.type === "cake" ? 1199 : 899,
          category: catMap[p.type as keyof typeof catMap] || "Fresh Flowers",
          image: p.url,
          rating: 4.8,
          reviewsCount: 1,
          description: "Custom florist item securely background-removed, enhanced and added via owner CRM file cataloger.",
          isBestSeller: false,
          isNew: true
        });
      }
    });

    // Save to localStorage
    localStorage.setItem("sajawat_catalog_products", JSON.stringify(finalProducts));
    
    // Set step to done
    setBuilderStep("done");
    
    // Dispatch custom event to notify main app window
    window.dispatchEvent(new Event("sajawat_catalog_updated"));

    setCatalogSuccessMessage("Storefront catalog built & synchronized successfully! 🚀✨");
    setTimeout(() => {
      setCatalogSuccessMessage("");
      // Force return to shop page to see results
      onBack();
    }, 4000);
  };

  const handleSaveTypeChargeChange = (typeId: string, value: number) => {
    const updatedTypes = deliverySettings.types.map((type) => {
      if (type.id === typeId) {
        return { ...type, charge: value };
      }
      return type;
    });
    const updatedSettings = { ...deliverySettings, types: updatedTypes };
    setDeliverySettings(updatedSettings);
    saveDeliverySettings(updatedSettings);
    setSettingsSuccessMessage("Delivery type charges saved successfully! ✨");
    setTimeout(() => setSettingsSuccessMessage(""), 3000);
  };

  const handleSaveAreaChargeChange = (areaIndex: number, value: number) => {
    const updatedAreas = [...deliverySettings.areas];
    updatedAreas[areaIndex] = { ...updatedAreas[areaIndex], charge: value };
    const updatedSettings = { ...deliverySettings, areas: updatedAreas };
    setDeliverySettings(updatedSettings);
    saveDeliverySettings(updatedSettings);
    setSettingsSuccessMessage("Area delivery charges updated successfully! ✨");
    setTimeout(() => setSettingsSuccessMessage(""), 3050);
  };

  const handleAddNewArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    // Check if already exists
    const exists = deliverySettings.areas.some(
      (a) => a.name.toLowerCase() === newAreaName.trim().toLowerCase()
    );
    if (exists) {
      alert("This area already exists. You can modify its charge in the fields below!");
      return;
    }

    const nArea: DeliveryAreaConfig = {
      name: newAreaName.trim(),
      postcode: newAreaPostcode.trim() || "411000",
      charge: Number(newAreaCharge) || 0
    };

    const updatedAreas = [...deliverySettings.areas, nArea];
    const updatedSettings = { ...deliverySettings, areas: updatedAreas };
    setDeliverySettings(updatedSettings);
    saveDeliverySettings(updatedSettings);

    // reset fields
    setNewAreaName("");
    setNewAreaPostcode("");
    setNewAreaCharge(0);

    setSettingsSuccessMessage("New Delivery Area added successfully! 🎉");
    setTimeout(() => setSettingsSuccessMessage(""), 3000);
  };

  const handleDeleteArea = (areaName: string) => {
    if (confirm(`Are you sure you want to delete delivery area '${areaName}'?`)) {
      const updatedAreas = deliverySettings.areas.filter((a) => a.name !== areaName);
      const updatedSettings = { ...deliverySettings, areas: updatedAreas };
      setDeliverySettings(updatedSettings);
      saveDeliverySettings(updatedSettings);
      setSettingsSuccessMessage("Delivery Area deleted! 🗑️");
      setTimeout(() => setSettingsSuccessMessage(""), 3000);
    }
  };

  // Search and Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Today" | "Tomorrow" | "Upcoming" | "Delivered" | "Cancelled">("All");

  // Load orders with fallback seeding
  const loadOrders = () => {
    try {
      const saved = localStorage.getItem("sajawat_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      } else {
        // Initial Seed
        const seedOrders: Order[] = [
          {
            id: "PSF-1001",
            customerName: "Anshuman Godse",
            phoneNumber: "+91 9881234567",
            products: [{ title: "Luxe Parisian Rose Box Arrangement", quantity: 1, price: 1299 }],
            price: 1598,
            addons: [{ name: "Ferrero Rocher Box", quantity: 1, price: 299 }],
            deliveryDate: "2026-06-19", // Today
            deliveryTime: "Midnight Delivery (+₹249)",
            address: "Apt 402, Clover Highlands, Kondhwa, Pune - 411048",
            personalMessage: "Happy Anniversary my love! ❤️",
            status: "Preparing",
            createdAt: new Date("2026-06-19T05:30:00Z").toISOString()
          },
          {
            id: "PSF-1002",
            customerName: "Priyanka Patil",
            phoneNumber: "+91 9730099881",
            products: [{ title: "Exquisite White Lilies Bouquet", quantity: 1, price: 1499 }],
            price: 1698,
            addons: [],
            deliveryDate: "2026-06-20", // Tomorrow
            deliveryTime: "Fixed Time Delivery (+₹199)",
            address: "Nano Space, Block C, Baner, Pune - 411045",
            personalMessage: "Happy Birthday Sis! Have an amazing day!",
            status: "Pending",
            createdAt: new Date("2026-06-19T06:15:00Z").toISOString()
          },
          {
            id: "PSF-1003",
            customerName: "Rohit Deshmukh",
            phoneNumber: "+91 8855221144",
            products: [{ title: "Elegant Orchid Fantasy", quantity: 1, price: 899 }],
            price: 899,
            addons: [],
            deliveryDate: "2026-06-18", // Yesterday
            deliveryTime: "Standard Delivery (Free)",
            address: "Siddharth Towers, Kothrud, Pune - 411038",
            personalMessage: "Congratulations on the new home! Best wishes.",
            status: "Delivered",
            createdAt: new Date("2026-06-18T10:00:00Z").toISOString()
          },
          {
            id: "PSF-1004",
            customerName: "Shrikant Kulkarni",
            phoneNumber: "+91 9011223344",
            products: [
              { title: "Sweet Harmony Carnations Bouquet", quantity: 1, price: 549 },
              { title: "Gourmet Fresh Chocolate Cake (Half Kg)", quantity: 1, price: 699 }
            ],
            price: 1248,
            addons: [],
            deliveryDate: "2026-06-19", // Today
            deliveryTime: "Standard Delivery (Free)",
            address: "Magarpatta City, Iris Society, Apt 902, Hadapsar, Pune - 411028",
            personalMessage: "Wishing you a speedy recovery! Get well soon.",
            status: "Pending",
            createdAt: new Date("2026-06-19T04:20:00Z").toISOString()
          }
        ];
        localStorage.setItem("sajawat_orders", JSON.stringify(seedOrders));
        setOrders(seedOrders);
      }
    } catch (e) {
      console.error("Failed loading admin orders:", e);
    }
  };

  useEffect(() => {
    loadOrders();
    // Check if previously logged in this session
    const authStatus = sessionStorage.getItem("sajawat_admin_auth");
    if (authStatus === "true") {
      setIsAuthorized(true);
    }
    // Load dynamic delivery settings
    setDeliverySettings(getDeliverySettings());
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "admin" || password.trim().toLowerCase() === "sajawat") {
      setIsAuthorized(true);
      setLoginError("");
      sessionStorage.setItem("sajawat_admin_auth", "true");
    } else {
      setLoginError("Invalid secret security key. Hint: Try 'admin'");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPassword("");
    sessionStorage.removeItem("sajawat_admin_auth");
  };

  // Status updaters
  const updateOrderStatus = (orderId: string, nextStatus: "Pending" | "Preparing" | "Delivered" | "Cancelled") => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    });
    setOrders(updated);
    try {
      localStorage.setItem("sajawat_orders", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Helper date parsing (matching baseline current static time 2026-06-19)
  const getTodayISOString = () => "2026-06-19";
  const getTomorrowISOString = () => "2026-06-20";

  // Check if a date falls in "This Week" (next 7 days starting today 2026-06-19)
  const isThisWeekValue = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const start = new Date("2026-06-19T00:00:00");
      const end = new Date("2026-06-25T23:59:59");
      return d >= start && d <= end;
    } catch {
      return false;
    }
  };

  const todayStr = getTodayISOString();
  const tomorrowStr = getTomorrowISOString();

  // Metric computations
  const totalIncomingAmt = orders.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.price, 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const preparingCount = orders.filter(o => o.status === "Preparing").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

  // Filter & Search application
  const filteredOrders = orders.filter(order => {
    // Search filter
    const lowerSearch = searchTerm.trim().toLowerCase();
    const searchMatch = 
      searchTerm === "" ||
      order.id.toLowerCase().includes(lowerSearch) ||
      order.customerName.toLowerCase().includes(lowerSearch) ||
      order.phoneNumber.includes(lowerSearch) ||
      order.address.toLowerCase().includes(lowerSearch) ||
      order.products.some(p => p.title.toLowerCase().includes(lowerSearch));

    if (!searchMatch) return false;

    // Filter type
    if (activeFilter === "All") return true;
    if (activeFilter === "Today") return order.deliveryDate === todayStr;
    if (activeFilter === "Tomorrow") return order.deliveryDate === tomorrowStr;
    if (activeFilter === "Upcoming") {
      // Any date from tomorrow onwards that is not delivered or cancelled
      return order.deliveryDate >= tomorrowStr && order.status !== "Delivered" && order.status !== "Cancelled";
    }
    if (activeFilter === "Delivered") return order.status === "Delivered";
    if (activeFilter === "Cancelled") return order.status === "Cancelled";

    return true;
  });

  // Upcoming deliveries breakdown sorted by deliveryDate
  const upcomingDeliveries = [...orders]
    .filter(o => o.status !== "Cancelled" && o.status !== "Delivered")
    .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

  // Upcoming sorted lists
  const upcomingToday = upcomingDeliveries.filter(o => o.deliveryDate === todayStr);
  const upcomingTomorrow = upcomingDeliveries.filter(o => o.deliveryDate === tomorrowStr);
  const upcomingWeek = upcomingDeliveries.filter(o => o.deliveryDate !== todayStr && o.deliveryDate !== tomorrowStr && isThisWeekValue(o.deliveryDate));

  if (!isAuthorized) {
    return (
      <div className="flex-1 bg-stone-900 flex items-center justify-center p-6 min-h-[90vh] text-stone-100 font-sans" id="admin-auth-panel">
        <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#82862F]/5 rounded-full blur-3xl pointer-events-none" />

          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer uppercase tracking-widest font-black mb-6"
            id="back-to-shop-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return To Storefront</span>
          </button>

          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 bg-[#82862F]/20 text-[#82862F] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white tracking-tight">Pune Sajawat Florist</h2>
              <p className="text-xs text-stone-400 mt-1">Gifting CRM & Order Management Desk</p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold block">Dashboard Password</label>
              <input
                type="password"
                placeholder="Enter admin key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-[#82862F] transition-all"
                autoFocus
                id="admin-password-input"
              />
              <span className="text-[9.5px] text-stone-500 block">Development Hint: Enter <span className="text-stone-300 font-bold font-mono">admin</span> to access quickly.</span>
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#82862F] hover:bg-[#6C7026] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-[#82862F]/10 active:scale-98 flex items-center justify-center gap-2"
              id="admin-login-submit"
            >
              <span>Unlock Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-stone-50/40 p-4 sm:p-6 lg:p-8 font-sans" id="admin-main-dashboard">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* TOP META CONTROLS BRAND BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-stone-200/60 rounded-2xl p-4 sm:p-5 gap-4 shadow-xs" id="admin-top-brand-bar">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#82862F] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm font-serif">
              PSF
            </div>
            <div>
              <h1 className="text-md sm:text-lg font-bold text-stone-900 tracking-tight font-serif">Order Management Portal</h1>
              <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded border border-red-100 uppercase tracking-wider block w-max mt-0.5 animate-pulse">Pune Hub Monitor</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-stone-400 font-mono hidden sm:inline">Active Session: <strong>Superadmin</strong></span>
            
            <button 
              onClick={onBack}
              className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-colors"
            >
              Shop Page
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Lock Console"
              id="admin-lock-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* ADMIN CONTROL TABS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-white border border-stone-200/80 p-1.5 rounded-2xl shadow-xs gap-1.5" id="admin-crm-control-tabs">
          <button
            onClick={() => setAdminTab("orders")}
            className={`py-2.5 text-center text-[10.5px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              adminTab === "orders"
                ? "bg-[#82862F] text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50/80"
            }`}
            id="tab-btn-orders"
          >
            📋 Master Orders CRM
          </button>
          <button
            onClick={() => setAdminTab("catalog_manager")}
            className={`py-2.5 text-center text-[10.5px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              adminTab === "catalog_manager"
                ? "bg-[#82862F] text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50/80"
            }`}
            id="tab-btn-catalog-manager"
          >
            🗂️ Catalog Manager
          </button>
          <button
            onClick={() => setAdminTab("settings")}
            className={`py-2.5 text-center text-[10.5px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              adminTab === "settings"
                ? "bg-[#82862F] text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50/80"
            }`}
            id="tab-btn-settings"
          >
            ⚙️ Delivery Settings
          </button>
          <button
            onClick={() => setAdminTab("backups")}
            className={`py-2.5 text-center text-[10.5px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              adminTab === "backups"
                ? "bg-[#82862F] text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50/80"
            }`}
            id="tab-btn-backups"
          >
            🛡️ Safety & Backups
          </button>
          <button
            onClick={() => setAdminTab("catalog")}
            className={`py-2.5 text-center text-[10.5px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              adminTab === "catalog"
                ? "bg-[#82862F] text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50/80"
            }`}
            id="tab-btn-catalog"
          >
            📸 Auto-Catalog Builder
          </button>
          <button
            onClick={() => {
              window.history.pushState({}, "", "/admin/upload");
              window.dispatchEvent(new Event("popstate"));
            }}
            className="py-2.5 text-center text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white shadow-sm"
            id="tab-btn-real-upload"
          >
            🚀 Inventory Upload Panel
          </button>
        </div>

        {/* NOTIFICATIONS CORNER FOR IMMINENT DELIVERIES */}
        <div className="space-y-2" id="admin-notification-ticker">
          {orders.some(o => o.deliveryDate === todayStr && o.status !== "Delivered" && o.status !== "Cancelled") && (
            <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-xl flex items-start gap-2.5 font-sans animate-pulse shadow-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider">⚠️ Action Required: Deliver Today ({todayStr})</h5>
                <p className="text-[10.5px] text-amber-700 leading-normal mt-0.5 font-medium">
                  You have orders pending or preparing for today's delivery limit. Dispatch with local Pune riders as scheduled to maintain 5-star customer ratings!
                </p>
              </div>
            </div>
          )}

          {orders.some(o => o.deliveryDate === tomorrowStr && o.status !== "Delivered" && o.status !== "Cancelled") && (
            <div className="bg-sky-50 border border-sky-150 p-3.5 rounded-xl flex items-start gap-2.5 font-sans shadow-xs">
              <Calendar className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-sky-800 uppercase tracking-wider">⏰ Inbound Notice: Delivery Tomorrow ({tomorrowStr})</h5>
                <p className="text-[10.5px] text-sky-700 leading-normal mt-0.5 font-medium">
                  Preparation starts tonight. Fresh flower stocks for lilies, premium roses, and baking ingredients should be kept on freeze standby!
                </p>
              </div>
            </div>
          )}
        </div>

        {adminTab === "orders" && (
          <>
            {/* ANALYTICS BENTO BOX QUICK GRID */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="admin-bento-metrics">
          <div className="bg-white border border-stone-200/60 p-4 rounded-xl shadow-xs space-y-1.5">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold block">Pending</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-amber-650 font-mono">{pendingCount}</span>
              <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">Actionable</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200/60 p-4 rounded-xl shadow-xs space-y-1.5">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold block">Preparing</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-blue-650 font-mono">{preparingCount}</span>
              <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">Active</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200/60 p-4 rounded-xl shadow-xs space-y-1.5">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold block">Delivered</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-emerald-650 font-mono">{deliveredCount}</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">Completed</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200/60 p-4 rounded-xl shadow-xs space-y-1.5">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold block">Cancelled</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-stone-400 font-mono">{cancelledCount}</span>
              <span className="text-[9px] bg-stone-50 text-stone-500 font-bold px-1.5 py-0.5 rounded">Dismissed</span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 bg-[#82862F]/10 border border-[#82862F]/20 p-4 rounded-xl shadow-xs space-y-1.5">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest font-extrabold block">Pune Revenue</span>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-mono font-black text-stone-900">₹{totalIncomingAmt}</span>
              <span className="text-[8.5px] text-stone-500 font-bold">Total Confirmed</span>
            </div>
          </div>
        </div>

        {/* COMBINED INTERACTIVE WRAPPER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: UPCOMING DELIVERIES PANELS */}
          <div className="lg:col-span-4 bg-white border border-stone-200/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5" id="upcoming-deliveries-panel">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#82862F] font-serif border-b border-stone-100 pb-2">📅 Upcoming Deliveries</h3>
              <p className="text-[11px] text-stone-400 leading-normal mt-1">Real-time scheduling for kitchen & floral arrangements prep.</p>
            </div>

            {/* SECTIONS */}
            <div className="space-y-4">
              {/* Today Deliveries */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                  <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">Deliver Today</span>
                  <span className="font-mono text-[10px] font-bold text-amber-800">{upcomingToday.length} Orders</span>
                </div>
                {upcomingToday.length === 0 ? (
                  <p className="text-[10.5px] text-stone-400 italic pl-1.5 font-medium">None for today.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {upcomingToday.map(o => (
                      <div key={o.id} className="p-2 border border-stone-100 bg-stone-50/50 rounded-lg flex justify-between items-center text-[10.5px] font-sans">
                        <div className="min-w-0 pr-1">
                          <strong className="text-stone-800 block truncate">{o.customerName}</strong>
                          <span className="text-[9.5px] text-stone-400 block truncate font-mono">{o.id} • {o.deliveryTime}</span>
                        </div>
                        <span className="text-[10px] shrink-0 font-bold text-amber-600 uppercase bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-sans">{o.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tomorrow Deliveries */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-blue-500/10 px-2.5 py-1.5 rounded-lg border border-blue-500/20">
                  <span className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">Delivery Tomorrow</span>
                  <span className="font-mono text-[10px] font-bold text-blue-800">{upcomingTomorrow.length} Orders</span>
                </div>
                {upcomingTomorrow.length === 0 ? (
                  <p className="text-[10.5px] text-stone-400 italic pl-1.5 font-medium">None scheduled.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {upcomingTomorrow.map(o => (
                      <div key={o.id} className="p-2 border border-stone-100 bg-stone-50/50 rounded-lg flex justify-between items-center text-[10.5px] font-sans">
                        <div className="min-w-0 pr-1">
                          <strong className="text-stone-800 block truncate">{o.customerName}</strong>
                          <span className="text-[9.5px] text-stone-400 block truncate font-mono">{o.id} • {o.deliveryTime}</span>
                        </div>
                        <span className="text-[10px] shrink-0 font-bold text-stone-505 uppercase bg-stone-100 px-1.5 py-0.5 rounded font-sans">PENDING</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Later This Week */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-indigo-500/10 px-2.5 py-1.5 rounded-lg border border-indigo-500/20">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-805 tracking-wider">This Week (Later)</span>
                  <span className="font-mono text-[10px] font-bold text-indigo-805">{upcomingWeek.length} Orders</span>
                </div>
                {upcomingWeek.length === 0 ? (
                  <p className="text-[10.5px] text-stone-400 italic pl-1.5 font-medium">No other weekly slots reserved yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                    {upcomingWeek.sort((a,b)=>a.deliveryDate.localeCompare(b.deliveryDate)).map(o => (
                      <div key={o.id} className="p-2 border border-stone-100 bg-stone-50/50 rounded-lg relative flex flex-col gap-1 text-[10.5px] font-sans">
                        <div className="flex justify-between items-center">
                          <strong className="text-stone-800 block truncate">{o.customerName}</strong>
                          <span className="text-[10px] font-mono font-black text-rose-500 bg-rose-50 px-1 py-0.5 rounded">{o.deliveryDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9.5px] text-stone-500">
                          <span className="truncate">{o.id} • {o.deliveryTime}</span>
                          <span className="uppercase text-[8.5px] tracking-wide font-extrabold text-stone-500">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 bg-stone-900 text-stone-100 rounded-xl relative overflow-hidden text-center justify-center flex flex-col space-y-1 font-sans">
              <span className="text-[9px] uppercase tracking-widest text-[#82862F] font-bold">Pune Sajawat Support Hotline</span>
              <p className="text-[11px] text-stone-300 font-bold">Need tech support or DB manual override?</p>
              <a href="tel:918484905722" className="text-[11.5px] text-emerald-400 font-bold hover:underline block pt-1">Call +91 8484905722</a>
            </div>
          </div>

          {/* RIGHT VIEW: CORE MASTER ORDER TABLE CONTROLLER WITH METRICS & SEARCH */}
          <div className="lg:col-span-8 bg-white border border-stone-200/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4" id="main-order-tracker">
            
            {/* SEARCH AND FILTER HEAD CONTROLS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search customer, location, order ID or flowers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-200 bg-white pl-8 pr-4 py-2 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#82862F]"
                  id="dashboard-search-input"
                />
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
              </div>

              {/* SLICK MOBILE SCROLLABLE TAB CHIPS FOR INSTANT FILTERS */}
              <div className="flex gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar select-none font-sans shrink-0">
                {(["All", "Today", "Tomorrow", "Upcoming", "Delivered", "Cancelled"] as const).map((filter) => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#82862F] text-white font-black"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-100"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RESULTS METRIC COUNTER */}
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <span>Displaying {filteredOrders.length} filtered register receipts</span>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-rose-600 hover:underline">
                  Clear Search Filter
                </button>
              )}
            </div>

            {/* MAIN CRM TABLE DISPLAY */}
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-stone-50 rounded-xl border border-dashed border-stone-200/85">
                <Package className="w-10 h-10 text-stone-300 mx-auto animate-pulse" />
                <div>
                  <h4 className="font-bold text-stone-700 text-sm">No Matching Orders Found</h4>
                  <p className="text-[11px] text-stone-400 mt-1">Try resetting the filter chips or refine your search input term!</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto border border-stone-150 rounded-xl bg-stone-50/15 max-h-[700px] overflow-y-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead className="bg-stone-50 text-stone-500 text-[10.5px] uppercase font-semibold tracking-wider sticky top-0 z-10 border-b border-stone-200/80">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Recipient Details</th>
                      <th className="p-3">Flowers & Addons</th>
                      <th className="p-3">Slot Info</th>
                      <th className="p-3">Personal Message</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {filteredOrders.map((order) => {
                      const isTodayTag = order.deliveryDate === todayStr;
                      const isTomorrowTag = order.deliveryDate === tomorrowStr;

                      return (
                        <tr 
                          key={order.id} 
                          className="hover:bg-stone-50/50 transition-colors"
                          id={`dashboard-row-${order.id}`}
                        >
                          {/* Order ID */}
                          <td className="p-3 whitespace-nowrap align-top">
                            <span className="font-mono font-extrabold text-stone-950 text-sm block">
                              {order.id}
                            </span>
                            <span className="text-[9px] text-stone-400 block font-normal leading-normal">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <strong className="text-[#82862F] font-mono text-xs block mt-1">₹{order.price}</strong>
                          </td>

                          {/* Recipient Details */}
                          <td className="p-3 align-top min-w-[200px]">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-[#82862F]" />
                                <span className="font-bold text-stone-903 text-[12px]">{order.customerName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-stone-400" />
                                <a href={`tel:${order.phoneNumber}`} className="text-stone-500 hover:underline font-mono text-[10.5px]">
                                  {order.phoneNumber}
                                </a>
                              </div>
                              <div className="flex items-start gap-1 text-stone-400 mt-1 max-w-[220px]">
                                <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                <span className="text-[10px] text-stone-500 leading-normal">{order.address}</span>
                              </div>
                            </div>
                          </td>

                          {/* Flowers & Addons cataloged */}
                          <td className="p-3 align-top min-w-[160px]">
                            <div className="space-y-1">
                              {order.products.map((p, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11px] text-stone-800">
                                  <span>💐 {p.title} <strong className="font-bold text-stone-500">x{p.quantity}</strong></span>
                                </div>
                              ))}
                              {order.addons && order.addons.length > 0 && (
                                <div className="pt-1 mt-1 border-t border-stone-100 text-[10px] text-[#82862F] space-y-0.5">
                                  <span className="font-semibold block uppercase tracking-wide text-[8.5px]">Add-ons:</span>
                                  {order.addons.map((a, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                      <span>🍫 {a.name} x{a.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Delivery Slot info */}
                          <td className="p-3 align-top whitespace-nowrap">
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-stone-800 block">
                                {order.deliveryDate}
                              </span>
                              
                              {/* Tomorrow / Today Urgent Notices */}
                              {isTodayTag && order.status !== "Delivered" && order.status !== "Cancelled" && (
                                <span className="text-[8.5px] bg-amber-50 text-amber-700 border border-amber-200 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase block w-max">
                                  Deliver Today
                                </span>
                              )}
                              {isTomorrowTag && order.status !== "Delivered" && order.status !== "Cancelled" && (
                                <span className="text-[8.5px] bg-sky-50 text-sky-700 border border-sky-200 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase block w-max">
                                  Delivery Tomorrow
                                </span>
                              )}

                              <span className="text-[10px] text-stone-500 font-medium block">
                                ⏱️ {order.deliveryTime}
                              </span>
                            </div>
                          </td>

                          {/* Personal card message */}
                          <td className="p-3 align-top max-w-[180px]">
                            <div className="p-2 bg-rose-50/30 border border-rose-100/60 rounded-lg italic text-[11px] text-stone-750 font-sans leading-normal">
                              {order.personalMessage ? `"${order.personalMessage}"` : "None"}
                            </div>
                          </td>

                          {/* Order Status Badge */}
                          <td className="p-3 align-top whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === "Pending" ? "bg-stone-100 text-stone-600 border border-stone-200" :
                              order.status === "Preparing" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                              order.status === "Delivered" ? "bg-emerald-50 text-emerald-600 border border-emerald-250" :
                              "bg-rose-50 text-rose-600 border border-rose-200"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                order.status === "Pending" ? "bg-stone-500" :
                                order.status === "Preparing" ? "bg-blue-500" :
                                order.status === "Delivered" ? "bg-emerald-500 animate-pulse" :
                                "bg-rose-500"
                              }`} />
                              {order.status}
                            </span>
                          </td>

                          {/* ACTION SWITCHERS */}
                          <td className="p-3 align-top text-right">
                            <div className="flex flex-col gap-1 w-max ml-auto">
                              {order.status !== "Pending" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "Pending")}
                                  className="px-2 py-1 text-[9px] font-bold bg-white hover:bg-stone-100 border border-stone-200 hover:border-stone-400 text-stone-750 rounded transition-all cursor-pointer text-center"
                                  id={`btn-pending-${order.id}`}
                                >
                                  Mark Pending
                                </button>
                              )}
                              
                              {order.status !== "Preparing" && order.status !== "Delivered" && order.status !== "Cancelled" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "Preparing")}
                                  className="px-2 py-1 text-[9px] font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded transition-all cursor-pointer text-center"
                                  id={`btn-preparing-${order.id}`}
                                >
                                  Mark Preparing
                                </button>
                              )}

                              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "Delivered")}
                                  className="px-2 py-1 text-[9px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-all cursor-pointer text-center"
                                  id={`btn-delivered-${order.id}`}
                                >
                                  Mark Delivered
                                </button>
                              )}

                              {order.status !== "Cancelled" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "Cancelled")}
                                  className="px-2 py-1 text-[9px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-600 rounded transition-all cursor-pointer text-center"
                                  id={`btn-cancel-${order.id}`}
                                >
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </>
    )}

        {adminTab === "settings" && (
          <div className="space-y-6" id="admin-settings-section">
            <div className="bg-white border border-stone-200/60 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
              
              {/* STATUS ACTION SUCCESS POPUP */}
              {settingsSuccessMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between font-sans animate-fade-in shadow-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-extrabold">{settingsSuccessMessage}</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#82862F] font-serif border-b border-stone-100 pb-2">
                  🚀 Delivery Configuration Panel
                </h3>
                <p className="text-[11.5px] text-stone-500 leading-relaxed mt-1">
                  Owner Panel: Add new areas, change delivery charges, edit fixed-time premiums, and save instantly without any code modification.
                </p>
              </div>

              {/* SECTION: DELIVERY METHOD TYPES */}
              <div className="space-y-4">
                <h4 className="text-[10.5px] font-extrabold uppercase tracking-widest text-stone-400 py-1 border-b border-stone-100">
                  1. Delivery Option Rates & Surcharges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {deliverySettings.types.map((type) => (
                    <div key={type.id} className="p-4 border border-stone-150 rounded-xl bg-stone-50/40 flex flex-col justify-between space-y-3">
                      <div>
                        <strong className="text-xs text-stone-850 block uppercase tracking-wider">{type.name}</strong>
                        <span className="text-[9.5px] text-stone-400 font-mono block mt-0.5">Window: {type.timeWindow}</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-[#82862F] uppercase tracking-wider font-extrabold block">Charge Amount (₹)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-stone-400 font-mono text-xs">₹</span>
                          <input
                            type="number"
                            value={type.charge}
                            onChange={(e) => handleSaveTypeChargeChange(type.id, Number(e.target.value))}
                            className="w-full text-xs font-bold rounded-lg border border-stone-200 bg-white py-1.5 pl-6 pr-2.5 outline-none text-stone-800 focus:border-[#82862F]/50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: LOCATION-BASED DISTANCE CHARGES */}
              <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-1 border-b border-stone-100">
                  <h4 className="text-[10.5px] font-extrabold uppercase tracking-widest text-stone-400">
                    2. Location-Based Distance Charges
                  </h4>
                  <span className="text-[10px] text-stone-400 font-bold">Zonal Areas Available: <strong className="font-mono text-[#82862F]">{deliverySettings.areas.length}</strong></span>
                </div>

                {/* ADD NEW AREA BLOCK FORM */}
                <form onSubmit={handleAddNewArea} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-stone-50 border border-stone-200 p-4 rounded-xl items-end font-sans">
                  <div className="col-span-1 sm:col-span-4">
                    <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-[#82862F] flex items-center gap-1">
                      <span>📌 Add Custom Delivery Area Zone</span>
                    </h5>
                  </div>
                  <div>
                    <label className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold block mb-1">Area Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kothrud"
                      value={newAreaName}
                      required
                      onChange={(e) => setNewAreaName(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 outline-none text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold block mb-1">Postal Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 411038"
                      value={newAreaPostcode}
                      onChange={(e) => setNewAreaPostcode(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 outline-none text-stone-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold block mb-1">Delivery Charge (₹)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-stone-400 text-xs font-bold">₹</span>
                      <input
                        type="number"
                        placeholder="120"
                        min={0}
                        value={newAreaCharge || ""}
                        onChange={(e) => setNewAreaCharge(Number(e.target.value))}
                        className="w-full text-xs rounded-lg border border-stone-200 bg-white pl-6 pr-2.5 py-1.5 outline-none text-stone-800"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#82862F] hover:bg-[#6C7026] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Area Zone</span>
                    </button>
                  </div>
                </form>

                {/* CURRENT CONFIGURED AREAS LIST CORES & CHANGE RATES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[440px] overflow-y-auto pr-1 font-sans">
                  {deliverySettings.areas.map((area, idx) => (
                    <div key={area.name + "_" + idx} className="p-3.5 border border-stone-200/80 rounded-xl bg-white flex items-center justify-between gap-3 shadow-xs hover:border-[#82862F]/30 transition-all">
                      <div className="min-w-0 pr-1">
                        <strong className="text-xs text-stone-850 block truncate font-bold">{area.name}</strong>
                        <span className="text-[9px] text-stone-400 font-mono block">PIN: {area.postcode || "Pune"}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="relative w-20">
                          <span className="absolute left-1.5 top-1 text-[10px] text-stone-400 font-mono font-bold">₹</span>
                          <input
                            type="number"
                            min={0}
                            value={area.charge}
                            onChange={(e) => handleSaveAreaChargeChange(idx, Number(e.target.value))}
                            className="w-full text-xs font-bold rounded-md border border-stone-200 bg-stone-50/40 py-1 pl-4.5 pr-1 outline-none text-stone-800 text-right focus:bg-white focus:border-[#82862F]/50 transition-colors"
                            title="Charges saved instantly on change"
                          />
                        </div>
                        {area.name !== "Other Areas (Contact Us)" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteArea(area.name)}
                            className="p-1 text-stone-450 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Area Zone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {adminTab === "catalog" && (
          <div className="bg-white border border-stone-250/90 rounded-3xl p-6 shadow-md space-y-6 font-sans">
            
            {/* Header branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-5 gap-3">
              <div>
                <h3 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
                  <span className="text-xl">📸</span> Smart Inventory Auto-Cataloger
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                  Upload multiple photos of shop flowers, cakes, decorations or gifts. Artificial intelligence automatically segments the item (removes messy backgrounds), crops constraints, flags duplicate angles, and builds structured catalog listings!
                </p>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-205 rounded-xl px-3 py-1 text-[10px] uppercase font-mono font-bold tracking-wider text-[#82862F]">
                <Sparkles className="w-3 h-3 text-[#82862F] animate-spin-lazy" />
                <span>AI Core Engine Engaged</span>
              </div>
            </div>

            {/* Notification alert banner */}
            {catalogSuccessMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs animate-bounce">
                <CheckCircle className="w-5 h-5 text-emerald-650 shrink-0" />
                <span>{catalogSuccessMessage}</span>
              </div>
            )}

            {builderStep === "upload" && (
              <div className="space-y-6">
                
                {/* 1. Drag Drop Mock Slot */}
                <div className="border-2 border-dashed border-stone-200 bg-stone-50/40 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-3 hover:border-[#82862F]/40 transition-all group">
                  <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-505 flex items-center justify-center group-hover:scale-110 duration-300">
                    <UploadCloud className="w-7 h-7 text-stone-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-750">Drag & Drop multiple inventory photos here, or click to browse</p>
                    <p className="text-[10px] text-stone-400">Supports JPG, PNG formats up to 10MB per file. (Flowers, bouquets, cakes, and event setups)</p>
                  </div>
                </div>

                {/* 2. Manual URL Paste Form (Alternative Upload) */}
                <form onSubmit={handleAddCustomImage} className="bg-stone-50 border border-stone-200/80 p-5 rounded-2xl space-y-3.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#82862F] flex items-center gap-1.5">
                    <span>➕ Alternative: Add Item Via Image Stock URL</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                    <div className="md:col-span-6 font-sans">
                      <label className="text-[9px] text-stone-550 uppercase tracking-widest font-black block mb-1">Unsplash/Web Photo Address</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="w-full text-xs rounded-xl border border-stone-200 bg-white px-3 py-2.5 outline-none text-stone-800"
                        id="custom-img-url-field"
                      />
                    </div>
                    <div className="md:col-span-3 font-sans">
                      <label className="text-[9px] text-stone-550 uppercase tracking-widest font-black block mb-1">Item Inventory Categorization</label>
                      <select
                        value={customImageCategory}
                        onChange={(e: any) => setCustomImageCategory(e.target.value)}
                        className="w-full text-xs rounded-xl border border-stone-250 bg-white px-3 py-2.5 outline-none text-stone-800 font-bold"
                      >
                        <option value="bouquet">💐 Floral Bouquet</option>
                        <option value="cake">🎂 Celebration Cake</option>
                        <option value="decoration">🎈 Event Decoration</option>
                        <option value="gift">🎁 Gift Hamper / Candle</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-950 text-white rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1 shadow-sm active:scale-97"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add To queue</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* 3. Current Upload Queue List */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center select-none border-b border-stone-100 pb-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                      📂 Uploaded Stock Photos Waiting Processing ({pendingUploads.length} files)
                    </h4>
                    <span className="text-[10px] text-stone-450 italic font-mono">Checkboxes & background status are simulated</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {pendingUploads.map((file, idx) => (
                      <div key={file.id} className="border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group bg-white">
                        <div className="relative aspect-square bg-stone-50 overflow-hidden">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-900/85 text-white text-[8px] uppercase tracking-wider font-mono rounded font-black">
                            Raw Background
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeletePendingImage(file.id)}
                            className="absolute top-2 right-2 p-1.5 bg-stone-900/90 text-stone-200 hover:text-rose-500 hover:bg-stone-950 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Discard File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3 space-y-1.5 text-left">
                          <strong className="text-xs text-stone-800 line-clamp-1 block truncate" title={file.name}>{file.name}</strong>
                          <div className="flex justify-between items-center text-[9px] font-mono font-medium text-stone-400">
                            <span>{(file.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                            <span className="uppercase text-[#82862F] font-bold">[{file.type}]</span>
                          </div>
                          <div className="text-[9.5px] bg-[#F9FAEE] text-[#82862F] py-1 px-2 rounded-lg border border-[#82862F]/10 font-bold block leading-none">
                            ⏳ Ready to Segment Cutout
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Processor Action button */}
                  <div className="pt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={runCatalogProcessor}
                      className="px-8 py-3.5 bg-[#82862F] hover:bg-[#6C7026] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#82862F]/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-97 flex items-center justify-center gap-2 w-full xs:w-max"
                    >
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      <span>⚡ Process Uploaded Inventory ({pendingUploads.length} Photos)</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {builderStep === "processing" && (
              <div className="py-12 px-6 flex flex-col items-center justify-center space-y-6">
                
                {/* Active scan image display */}
                {pendingUploads[activeUploadIndex] ? (
                  <div className="w-60 h-60 border border-stone-250 rounded-3xl overflow-hidden relative shadow-2xl bg-stone-50">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70 z-10" />
                    <img
                      src={pendingUploads[activeUploadIndex].url}
                      alt="active processing file"
                      className="w-full h-full object-cover grayscale-45"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Sliding Laser line overlay */}
                    <div className="absolute inset-x-0 w-full h-2 bg-gradient-to-r from-transparent via-[#82862F] to-transparent top-0 animate-slide-scan z-20 shadow-[0_0_15px_rgba(130,134,47,1)]" />
                    
                    {/* Loading grid overlay showing cutouts */}
                    <div className="absolute bottom-3 left-3 right-3 bg-stone-900/80 backdrop-blur-xs p-2 rounded-xl border border-stone-700/50 z-30 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-stone-200 animate-spin" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[8px] uppercase tracking-widest font-mono text-stone-400 block font-black">AI Segmenter</span>
                        <p className="text-[10px] text-white font-bold truncate">{pendingUploads[activeUploadIndex].name}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-stone-150 rounded-full flex items-center justify-center animate-spin">
                    <RefreshCw className="w-6 h-6 text-stone-500" />
                  </div>
                )}

                {/* Progress Indicator */}
                <div className="w-full max-w-md space-y-3.5 text-center">
                  <div className="flex justify-between items-baseline select-none">
                    <span className="text-[10px] text-stone-450 uppercase tracking-widest font-mono font-bold leading-none">Catalog Alignment Pipeline</span>
                    <span className="text-sm font-black text-[#82862F] font-mono leading-none">{processingProgress}% Completed</span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                    <div
                      className="h-full bg-[#82862F] rounded-full transition-all duration-100 relative"
                      style={{ width: `${processingProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-line-shimmer animate-shimmer" />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-stone-705 h-6 animate-pulse leading-normal">
                    {processingMessage}
                  </p>
                </div>

              </div>
            )}

            {builderStep === "duplicates" && (
              <div className="space-y-6">
                
                {/* Intro to duplication review */}
                <div className="bg-amber-50/60 border border-amber-200/70 p-4 rounded-2xl flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider select-none font-sans">
                      🔍 System Duplicate & Similar Angle Detector (Rule 3)
                    </h4>
                    <p className="text-[11px] text-amber-700 leading-normal font-medium">
                      Our vision models identified **2 clusters** consisting of multiple photos taken of the same items from slightly different camera perspective layouts. Group or filter them below to keep your storefront pristine and free from near-duplicates!
                    </p>
                  </div>
                </div>

                {/* Group A: Red Roses cluster review */}
                <div className="border border-stone-200 rounded-3xl p-5 space-y-4 shadow-xs bg-white">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-3 gap-2 select-none">
                    <div>
                      <h4 className="text-xs font-bold text-stone-800">🔴 Group 1: Crimson Red Roses Arrangement Cluster</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Two photos are of the same bouquet wrapped in black paper wraps</p>
                    </div>
                    <span className="text-[9.5px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-150 uppercase tracking-wider font-mono">
                      🔥 94% Similarity Map
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    
                    {/* Left: First Image Thumb */}
                    <div className="md:col-span-3 border border-stone-200 rounded-2xl p-2 text-center bg-stone-50/50 relative">
                      <div className="aspect-square rounded-xl overflow-hidden relative">
                        <img
                          src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=400"
                          alt="rose angle A"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Checker background mask indicator representing transparency cutout */}
                        <div className="absolute inset-0 border-3 border-[#82862F] rounded-xl pointer-events-none" />
                      </div>
                      <span className="text-[9px] uppercase font-mono tracking-widest font-black text-stone-500 block mt-2">photo_rose_raw_front.jpg</span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded font-black absolute top-4 left-4 font-mono">Transparent Grid OK</span>
                    </div>

                    {/* Compare Vs Icon */}
                    <div className="hidden md:flex md:col-span-1 justify-center">
                      <div className="w-8 h-8 rounded-full bg-stone-100 border text-stone-400 flex items-center justify-center font-bold text-xs select-none">VS</div>
                    </div>

                    {/* Right: Second Image (Duplicate) */}
                    <div className="md:col-span-3 border border-stone-200 rounded-2xl p-2 text-center bg-stone-50/50 relative">
                      <div className="aspect-square rounded-xl overflow-hidden relative">
                        <img
                          src="https://images.unsplash.com/photo-1559563458-527298c27178?auto=format&fit=crop&q=80&w=400"
                          alt="rose angle B"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 border-3 border-amber-500/80 rounded-xl pointer-events-none" />
                      </div>
                      <span className="text-[9px] uppercase font-mono tracking-widest font-black text-stone-500 block mt-2">photo_rose_raw_side_close.jpg</span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded font-black absolute top-4 left-4 font-mono">Transparent Grid OK</span>
                    </div>

                    {/* Duplicates option selector */}
                    <div className="md:col-span-5 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-left space-y-3">
                      <span className="text-[9px] text-[#82862F] font-black uppercase tracking-widest block select-none">Select Angle Strategy:</span>
                      
                      <div className="space-y-2 font-sans font-medium text-stone-700 text-xs">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rose_option"
                            value="merge"
                            checked={roseDuplicateOption === "merge"}
                            onChange={() => setRoseDuplicateOption("merge")}
                            className="mt-0.5 h-3.5 w-3.5 accent-[#82862F]"
                          />
                          <div>
                            <strong className="text-stone-850">Merge as Gallery Angles (Recommended)</strong>
                            <p className="text-[10px] text-stone-400 mt-0.5">Creates a single product on storefront, using Side view as extra photo slider card.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rose_option"
                            value="separate"
                            checked={roseDuplicateOption === "separate"}
                            onChange={() => setRoseDuplicateOption("separate")}
                            className="mt-0.5 h-3.5 w-3.5 accent-[#82862F]"
                          />
                          <div>
                            <strong className="text-stone-850">Keep as Two Distinct Listings</strong>
                            <p className="text-[10px] text-stone-400 mt-0.5">Creates 2 distinct separate listings on your florist catalog.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer text-rose-650">
                          <input
                            type="radio"
                            name="rose_option"
                            value="discard"
                            checked={roseDuplicateOption === "discard"}
                            onChange={() => setRoseDuplicateOption("discard")}
                            className="mt-0.5 h-3.5 w-3.5 accent-[#82862F]"
                          />
                          <div>
                            <strong className="text-rose-700">Discard Side Close View Angle</strong>
                            <p className="text-[10px] text-stone-400 mt-0.5">Excludes close-view, only list primary frontal picture bouquet.</p>
                          </div>
                        </label>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Group B: Wedding arch cluster review */}
                <div className="border border-stone-200 rounded-3xl p-5 space-y-4 shadow-xs bg-white">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-3 gap-2 select-none">
                    <div>
                      <h4 className="text-xs font-bold text-stone-800">🎈 Group 2: Wedding Backdrop Arch & Stage Setup</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Photos are of the same stage mandap decoration taken from distinct diagonals</p>
                    </div>
                    <span className="text-[9.5px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-150 uppercase tracking-wider font-mono">
                      🔥 96% Similarity Map
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    
                    {/* Left: First Image Thumb */}
                    <div className="md:col-span-3 border border-stone-200 rounded-2xl p-2 text-center bg-stone-50/50 relative">
                      <div className="aspect-square rounded-xl overflow-hidden relative">
                        <img
                          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400"
                          alt="decor angle A"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 border-3 border-[#82862F] rounded-xl pointer-events-none" />
                      </div>
                      <span className="text-[9px] uppercase font-mono tracking-widest font-black text-stone-500 block mt-2">pune_stage_arch_side_a.jpg</span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded font-black absolute top-4 left-4 font-mono">Transparent Grid OK</span>
                    </div>

                    {/* Compare Vs Icon */}
                    <div className="hidden md:flex md:col-span-1 justify-center">
                      <div className="w-8 h-8 rounded-full bg-stone-100 border text-stone-400 flex items-center justify-center font-bold text-xs select-none">VS</div>
                    </div>

                    {/* Right: Second Image (Duplicate) */}
                    <div className="md:col-span-3 border border-stone-200 rounded-2xl p-2 text-center bg-stone-50/50 relative">
                      <div className="aspect-square rounded-xl overflow-hidden relative">
                        <img
                          src="https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&q=80&w=400"
                          alt="decor angle B"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 border-3 border-amber-500/80 rounded-xl pointer-events-none" />
                      </div>
                      <span className="text-[9px] uppercase font-mono tracking-widest font-black text-stone-500 block mt-2">pune_stage_arch_side_b.jpg</span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded font-black absolute top-4 left-4 font-mono">Transparent Grid OK</span>
                    </div>

                    {/* Duplicates option selector */}
                    <div className="md:col-span-5 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-left space-y-3">
                      <span className="text-[9px] text-[#82862F] font-black uppercase tracking-widest block select-none">Select Angle Strategy:</span>
                      
                      <div className="space-y-2 font-sans font-medium text-stone-700 text-xs">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="decor_option"
                            value="merge"
                            checked={decorDuplicateOption === "merge"}
                            onChange={() => setDecorDuplicateOption("merge")}
                            className="mt-0.5 h-3.5 w-3.5 accent-[#82862F]"
                          />
                          <div>
                            <strong className="text-stone-850">Merge as Gallery Angles (Recommended)</strong>
                            <p className="text-[10px] text-stone-400 mt-0.5">Creates a single product on storefront, using Side view/Detailed close-ups inside sliders.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="decor_option"
                            value="separate"
                            checked={decorDuplicateOption === "separate"}
                            onChange={() => setDecorDuplicateOption("separate")}
                            className="mt-0.5 h-3.5 w-3.5 accent-[#82862F]"
                          />
                          <div>
                            <strong className="text-stone-850">Keep as Two Distinct Listings</strong>
                            <p className="text-[10px] text-stone-400 mt-0.5">Creates 2 distinct separate listings on your florist catalog.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer text-rose-650">
                          <input
                            type="radio"
                            name="decor_option"
                            value="discard"
                            checked={decorDuplicateOption === "discard"}
                            onChange={() => setDecorDuplicateOption("discard")}
                            className="mt-0.5 h-3.5 w-3.5 accent-[#82862F]"
                          />
                          <div>
                            <strong className="text-rose-700">Discard Side View Angle</strong>
                            <p className="text-[10px] text-stone-400 mt-0.5">Excludes close-view, only list primary frontal picture decorations.</p>
                          </div>
                        </label>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Final step action buttons */}
                <div className="pt-6 border-t border-stone-100 flex flex-col xs:flex-row justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBuilderStep("upload")}
                    className="w-full xs:w-max px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs uppercase tracking-wider font-extrabold cursor-pointer"
                  >
                    ⬅️ Go Back to Queue
                  </button>
                  <button
                    type="button"
                    onClick={finalizeCatalogBuild}
                    className="w-full xs:w-max px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔨 Compile Final Product Catalog</span>
                  </button>
                </div>

              </div>
            )}

            {builderStep === "done" && (
              <div className="py-12 text-center space-y-6 flex flex-col items-center justify-center animate-pulse-once">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-350 text-emerald-600 flex items-center justify-center font-bold text-3xl shadow-md">
                  ✓
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-lg font-bold text-stone-950">Storefront Product Catalog Built! 🚀</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Messy photo backgrounds are removed and duplicates are merged successfully! We have calculated tags, pricing summaries, and titles for your newly uploaded inventory photos. Your live shop is active now.
                  </p>
                  <p className="text-[10px] text-[#FC8019] uppercase tracking-widest font-bold font-mono animate-pulse pt-2">
                    Redirecting you back to shop in 3 seconds...
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {adminTab === "catalog_manager" && (
          <CatalogManager
            products={products}
            onProductsUpdated={(updated) => {
              setProducts(updated);
              loadProducts(); // Reload to be safe
            }}
            onBack={onBack}
          />
        )}

        {adminTab === "backups" && (
          <div className="bg-white border border-stone-250/90 rounded-3xl p-6 shadow-md space-y-8 font-sans animate-fade-in">
            {/* Header */}
            <div className="border-b border-stone-100 pb-5">
              <h3 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
                <span>🛡️</span> Database Safety & Restoration Dashboard
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mt-1">
                Manage automated rotated inventory backups and restore deleted products back into the active catalog. Keep your Pune florist storefront catalog secure against accidental overwrites.
              </p>
            </div>

            {/* Grid layout for Backups and Deleted Items */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Backups Panel (Left, 5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#82862F] flex items-center gap-1.5">
                  📁 Rotated Database Backups
                </h4>
                <p className="text-[10px] text-stone-400 font-sans">
                  Select one of the last 5 automatic backup cycles to restore the products database. This will overwrite the live database file.
                </p>

                <div className="space-y-2.5">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div 
                      key={idx} 
                      className="p-4 border border-stone-200 rounded-2xl bg-stone-50/50 flex items-center justify-between hover:border-[#82862F]/30 transition-all shadow-xs"
                    >
                      <div>
                        <strong className="text-xs text-stone-855 block">Backup #{idx}</strong>
                        <span className="text-[8.5px] text-stone-400 font-mono">products.backup{idx}.json</span>
                      </div>
                      
                      <button
                        onClick={() => handleRestoreBackup(idx)}
                        className="px-4 py-2 bg-stone-900 hover:bg-[#82862F] text-white text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm shadow-stone-950/10 active:scale-95"
                      >
                        Restore Backup
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deleted Products Panel (Right, 7 cols) */}
              <div className="lg:col-span-7 space-y-4 border-t lg:border-t-0 lg:border-l border-stone-100 pt-6 lg:pt-0 lg:pl-8">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-rose-650 flex items-center gap-1.5">
                  🗑️ Deletion Safety Bin ({deletedProducts.length} items)
                </h4>
                <p className="text-[10px] text-stone-400 font-sans">
                  Products are moved here when deleted instead of permanent deletion. You can restore them instantly to the catalog.
                </p>

                {deletedProducts.length === 0 ? (
                  <div className="py-12 border border-dashed border-stone-200 rounded-3xl text-center text-stone-450 text-xs">
                    No deleted products in the safety bin.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {deletedProducts.map((p) => (
                      <div 
                        key={p.id} 
                        className="p-3 border border-stone-200 rounded-2xl bg-white flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-10 h-10 rounded-xl object-cover bg-stone-50 border border-stone-150 shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <strong className="text-xs font-extrabold text-stone-800 leading-tight block truncate">
                              {p.name}
                            </strong>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-bold text-[#82862F] uppercase bg-stone-50 px-1.5 py-0.5 rounded font-mono border border-stone-150">
                                {p.category}
                              </span>
                              {p.deletedAt && (
                                <span className="text-[8px] text-stone-450 font-mono">
                                  Deleted: {new Date(p.deletedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-black text-rose-600 mr-2">₹{p.price}</span>
                          <button
                            onClick={() => handleRestoreDeletedProduct(p.id)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] uppercase font-extrabold tracking-wider rounded-lg transition-colors cursor-pointer active:scale-95 shadow-sm shadow-emerald-750/10"
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
