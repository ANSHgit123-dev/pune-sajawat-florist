import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Fail fast if ADMIN_PASSWORD is not configured
if (!process.env.ADMIN_PASSWORD) {
  console.error("FATAL CONFIGURATION ERROR: ADMIN_PASSWORD environment variable is not defined!");
  process.exit(1);
}

// Fail fast if Supabase keys are missing
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("FATAL CONFIGURATION ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required!");
  process.exit(1);
}

// Supabase Configuration & Client Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Modular Session Interface & Session Store
export interface Session {
  id: string;
  csrfToken: string;
  createdAt: number;
}

export interface SessionStore {
  create(sessionId: string, csrfToken: string): Promise<void> | void;
  get(sessionId: string): Promise<Session | null> | Session | null;
  delete(sessionId: string): Promise<void> | void;
}

// Database-backed Session Store for stateless serverless functions (Vercel)
class SupabaseSessionStore implements SessionStore {
  private readonly sessionExpiryMs = 24 * 60 * 60 * 1000; // 24 hours

  async create(sessionId: string, csrfToken: string): Promise<void> {
    await supabase.from("sessions").insert({
      id: sessionId,
      csrf_token: csrfToken,
      created_at: new Date().toISOString()
    });
  }

  async get(sessionId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !data) return null;

    const createdAtMs = new Date(data.created_at).getTime();
    if (Date.now() - createdAtMs > this.sessionExpiryMs) {
      await this.delete(sessionId);
      return null;
    }

    return {
      id: data.id,
      csrfToken: data.csrf_token,
      createdAt: createdAtMs
    };
  }

  async delete(sessionId: string): Promise<void> {
    await supabase.from("sessions").delete().eq("id", sessionId);
  }
}

const sessionStore = new SupabaseSessionStore();

// Rate limiting for login endpoint
const loginAttempts = new Map<string, { count: number; lockUntil?: number }>();

// Helper to manually parse cookie from headers
const getSessionFromRequest = (req: express.Request): string | null => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").reduce((acc: { [key: string]: string }, c) => {
    const parts = c.split("=");
    const name = parts[0]?.trim();
    const val = parts.slice(1).join("=").trim();
    if (name) acc[name] = val;
    return acc;
  }, {});
  return cookies["admin_session"] || null;
};

// Middleware to verify session for GET requests
const requireSession = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionId = getSessionFromRequest(req);
    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized. Missing session cookie." });
    }
    const session = await sessionStore.get(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized. Invalid or expired session." });
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware to verify session & CSRF token for POST/PUT/DELETE/modify requests
const requireSessionWithCsrf = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionId = getSessionFromRequest(req);
    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized. Missing session cookie." });
    }
    const session = await sessionStore.get(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized. Invalid or expired session." });
    }
    
    // CSRF verification: Check the custom request header
    const csrfToken = req.headers["x-csrf-token"];
    if (!csrfToken || csrfToken !== session.csrfToken) {
      return res.status(403).json({ error: "Forbidden. Invalid or missing CSRF token." });
    }
    
    next();
  } catch (err) {
    next(err);
  }
};

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase payload limit for Base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Default CMS Settings payload
function getDefaultCms() {
  return {
    sections: [
      { id: "flowers", name: "Flowers", displayOrder: 1, bannerImage: "", hidden: false, isFeatured: true },
      { id: "bouquets", name: "Bouquets", displayOrder: 2, bannerImage: "", hidden: false, isFeatured: true },
      { id: "rose-bouquets", name: "Rose Bouquets", displayOrder: 3, bannerImage: "", hidden: false, isFeatured: true },
      { id: "cakes", name: "Cakes", displayOrder: 4, bannerImage: "", hidden: false, isFeatured: true },
      { id: "chocolates", name: "Chocolates", displayOrder: 5, bannerImage: "", hidden: false, isFeatured: false },
      { id: "gift-hampers", name: "Gift Hampers", displayOrder: 6, bannerImage: "", hidden: false, isFeatured: true },
      { id: "teddy-bears", name: "Teddy Bears", displayOrder: 7, bannerImage: "", hidden: false, isFeatured: false },
      { id: "decorations", name: "Birthday Decorations", displayOrder: 8, bannerImage: "", hidden: false, isFeatured: true }
    ],
    homepage: {
      sectionOrder: ["flowers", "bouquets", "rose-bouquets", "cakes", "gift-hampers", "decorations"],
      featuredProductIds: [],
      trendingProductIds: [],
      bannerProductIds: []
    }
  };
}

// ============================================================================
// DATA MAPPING HELPERS FOR SUPABASE (camelCase frontend <-> snake_case database)
// ============================================================================
function mapDbProductToProduct(dbProduct: any): any {
  if (!dbProduct) return null;
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    title: dbProduct.title,
    category: dbProduct.category,
    price: Number(dbProduct.price),
    originalPrice: dbProduct.original_price !== null ? Number(dbProduct.original_price) : undefined,
    image: dbProduct.image,
    images: Array.isArray(dbProduct.images) ? dbProduct.images : [],
    galleryImages: Array.isArray(dbProduct.gallery_images) ? dbProduct.gallery_images : [],
    description: dbProduct.description,
    shortDescription: dbProduct.short_description,
    longDescription: dbProduct.long_description,
    rating: dbProduct.rating !== null ? Number(dbProduct.rating) : 5,
    reviewsCount: dbProduct.reviews_count !== null ? Number(dbProduct.reviews_count) : 0,
    isBestSeller: !!dbProduct.is_best_seller,
    isNew: !!dbProduct.is_new,
    isTrending: !!dbProduct.is_trending,
    isRecommended: !!dbProduct.is_recommended,
    isFeatured: !!dbProduct.is_featured,
    isEnabled: !!dbProduct.is_enabled,
    isHidden: !!dbProduct.is_hidden,
    createdAt: dbProduct.created_at,
    sku: dbProduct.sku,
    quantity: dbProduct.quantity !== null ? Number(dbProduct.quantity) : 1,
    lowStockAlert: dbProduct.low_stock_alert !== null ? Number(dbProduct.low_stock_alert) : 0,
    deliverySettings: dbProduct.delivery_settings || {},
    addons: Array.isArray(dbProduct.addons) ? dbProduct.addons : [],
    lastModified: dbProduct.last_modified,
    deletedAt: dbProduct.deleted_at
  };
}

function mapProductToDbProduct(product: any): any {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name || "",
    title: product.title || "",
    category: product.category || "",
    price: Number(product.price) || 0,
    original_price: product.originalPrice !== undefined ? Number(product.originalPrice) : null,
    image: product.image || null,
    images: Array.isArray(product.images) ? product.images : [],
    gallery_images: Array.isArray(product.galleryImages) ? product.galleryImages : [],
    description: product.description || null,
    short_description: product.shortDescription || null,
    long_description: product.longDescription || null,
    rating: product.rating !== undefined ? Number(product.rating) : 5,
    reviews_count: product.reviewsCount !== undefined ? Number(product.reviewsCount) : 0,
    is_best_seller: !!product.isBestSeller,
    is_new: !!product.isNew,
    is_trending: !!product.isTrending,
    is_recommended: !!product.isRecommended,
    is_featured: !!product.isFeatured,
    is_enabled: product.isEnabled !== undefined ? !!product.isEnabled : true,
    is_hidden: !!product.isHidden,
    created_at: product.createdAt || new Date().toISOString(),
    sku: product.sku || null,
    quantity: product.quantity !== undefined ? Number(product.quantity) : 1,
    low_stock_alert: product.lowStockAlert !== undefined ? Number(product.lowStockAlert) : 0,
    delivery_settings: product.deliverySettings || {},
    addons: Array.isArray(product.addons) ? product.addons : [],
    last_modified: product.lastModified || new Date().toISOString()
  };
}

// ==========================================
// BACKUP AND RESTORE ROTATION IN CLOUD DB
// ==========================================
const backupDatabase = async () => {
  try {
    // Fetch active catalog
    const { data: activeProds, error: fetchErr } = await supabase.from("products").select("*");
    if (fetchErr) throw fetchErr;

    const mappedProds = (activeProds || []).map(mapDbProductToProduct);

    // Rotate existing backups: 4 -> 5, 3 -> 4, 2 -> 3, 1 -> 2
    const { data: currentBackups, error: backupErr } = await supabase.from("backups").select("*");
    if (backupErr) throw backupErr;

    const backupsMap = new Map<number, any>();
    (currentBackups || []).forEach(b => backupsMap.set(b.id, b.products));

    for (let i = 4; i >= 1; i--) {
      const currentBackup = backupsMap.get(i);
      if (currentBackup) {
        await supabase.from("backups").upsert({
          id: i + 1,
          products: currentBackup,
          created_at: new Date().toISOString()
        });
      }
    }

    // Save as Backup #1
    await supabase.from("backups").upsert({
      id: 1,
      products: mappedProds,
      created_at: new Date().toISOString()
    });
    console.log("Cloud backups rotated successfully.");
  } catch (err) {
    console.error("Failed to create database backup:", err);
  }
};

const restoreDatabase = async (index?: number) => {
  try {
    const backupIndex = index && index >= 1 && index <= 5 ? index : 1;
    const { data, error } = await supabase
      .from("backups")
      .select("products")
      .eq("id", backupIndex)
      .single();

    if (error || !data || !Array.isArray(data.products)) {
      console.error(`Backup not found at index #${backupIndex}`);
      return false;
    }

    // Wipe active catalog and insert backup items
    const { error: deleteErr } = await supabase.from("products").delete().neq("id", "");
    if (deleteErr) throw deleteErr;

    const dbProds = data.products.map(mapProductToDbProduct);
    if (dbProds.length > 0) {
      const { error: insertErr } = await supabase.from("products").insert(dbProds);
      if (insertErr) throw insertErr;
    }
    console.log(`Database restored from Cloud Backup #${backupIndex}`);
    return true;
  } catch (err) {
    console.error("Failed to restore database from backup:", err);
  }
  return false;
};

// Heuristic similarity logic to prevent incorrect merges (needs to be above 90% weighted score)
const computeSimilarity = (p1: any, p2: any): number => {
  if (p1.category !== p2.category) return 0;
  if (p1.id && p2.id && p1.id === p2.id) return 1.0;
  if (p1.image && p2.image && p1.image === p2.image) return 1.0;

  const normalizeString = (str: string) => {
    return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  };

  if (normalizeString(p1.name) === normalizeString(p2.name)) return 1.0;
  if (normalizeString(p1.title) === normalizeString(p2.title)) return 1.0;

  const getTokens = (str: string) => {
    if (!str) return [];
    return str.toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map(t => {
        if (t.endsWith("ies")) return t.slice(0, -3) + "y";
        if (t.endsWith("es") && !t.endsWith("ees") && !t.endsWith("oes")) return t.slice(0, -2);
        if (t.endsWith("s") && !t.endsWith("ss") && !t.endsWith("us") && !t.endsWith("is")) return t.slice(0, -1);
        return t;
      });
  };

  const tokens1 = getTokens(p1.name || p1.title || "");
  const tokens2 = getTokens(p2.name || p2.title || "");
  
  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const t2Set = new Set(tokens2);
  const intersectTokens = tokens1.filter(t => t2Set.has(t));
  const unionTokens = Array.from(new Set([...tokens1, ...tokens2]));
  const nameJaccard = intersectTokens.length / unionTokens.length;

  const extractKeywords = (p: any, keywords: string[]) => {
    const text = `${p.name || ""} ${p.title || ""} ${p.description || ""} ${p.shortDescription || ""} ${p.longDescription || ""}`.toLowerCase();
    return keywords.filter(kw => text.includes(kw));
  };

  const colors = ["red", "pink", "white", "yellow", "orange", "blue", "purple", "mixed", "crimson", "peach", "gold", "golden", "sky blue", "pastel"];
  const wrapping = ["black", "mesh", "golden", "peach", "orange", "pink", "satin", "wrapping", "paper", "film", "iridescent", "craft paper", "florist sheet", "crate", "box"];
  const ribbon = ["satin", "gold-trimmed", "white and gold", "pink", "satin ribbon", "gold ribbon", "peach ribbon"];

  const getSetSimilarity = (kwSet: string[]) => {
    const attrs1 = extractKeywords(p1, kwSet);
    const attrs2 = extractKeywords(p2, kwSet);
    if (attrs1.length === 0 && attrs2.length === 0) return 1.0; 
    if (attrs1.length === 0 || attrs2.length === 0) return 0.0; 
    const intersection = attrs1.filter(a => attrs2.includes(a));
    const union = Array.from(new Set([...attrs1, ...attrs2]));
    return intersection.length / union.length;
  };

  const colorSim = getSetSimilarity(colors);
  const wrappingSim = getSetSimilarity(wrapping);
  const ribbonSim = getSetSimilarity(ribbon);

  const score = (nameJaccard * 0.4) + (colorSim * 0.2) + (wrappingSim * 0.2) + (ribbonSim * 0.2);
  return score;
};

// ==========================================
// ADMIN AUTHENTICATION & SESSION ENDPOINTS
// ==========================================

app.post("/api/admin/login", async (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const ipStr = Array.isArray(ip) ? ip[0] : ip;

  // Rate limiter check
  const attempts = loginAttempts.get(ipStr);
  if (attempts && attempts.lockUntil && attempts.lockUntil > Date.now()) {
    const remainingTime = Math.ceil((attempts.lockUntil - Date.now()) / 1000);
    return res.status(429).json({ error: `Too many login attempts. Please try again in ${remainingTime} seconds.` });
  }

  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const securePassword = process.env.ADMIN_PASSWORD;

  if (password === securePassword) {
    // Reset rate limiter on success
    loginAttempts.delete(ipStr);

    // Regenerate session identifier
    const sessionId = crypto.randomBytes(32).toString("hex");
    const csrfToken = crypto.randomBytes(32).toString("hex");
    await sessionStore.create(sessionId, csrfToken);

    const isProd = process.env.NODE_ENV === "production";
    let cookieStr = `admin_session=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;
    if (isProd) {
      cookieStr += "; Secure";
    }
    res.setHeader("Set-Cookie", cookieStr);

    return res.json({ success: true, csrfToken });
  } else {
    // Record failed attempt
    const current = attempts || { count: 0 };
    current.count += 1;
    if (current.count >= 5) {
      current.lockUntil = Date.now() + 60 * 1000; // 60 seconds lockout
    }
    loginAttempts.set(ipStr, current);

    // Return generic error message
    return res.status(401).json({ error: "Invalid credentials." });
  }
});

app.post("/api/admin/logout", async (req, res) => {
  const sessionId = getSessionFromRequest(req);
  if (sessionId) {
    await sessionStore.delete(sessionId);
  }
  // Clear cookie
  res.setHeader("Set-Cookie", "admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0");
  res.json({ success: true });
});

app.get("/api/admin/check-session", async (req, res) => {
  const sessionId = getSessionFromRequest(req);
  if (!sessionId) {
    return res.json({ authenticated: false });
  }
  const session = await sessionStore.get(sessionId);
  if (!session) {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true, csrfToken: session.csrfToken });
});

// API retrieve products
app.get("/api/products", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    const mapped = (data || []).map(mapDbProductToProduct);
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read products database", details: err?.message });
  }
});

// API retrieve CMS settings
app.get("/api/cms", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cms_settings")
      .select("settings")
      .eq("key", "default")
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is single row missing

    if (data && data.settings) {
      res.json(data.settings);
    } else {
      res.json(getDefaultCms());
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read CMS settings", details: err?.message });
  }
});

// API save CMS settings
app.post("/api/cms", requireSessionWithCsrf, async (req, res) => {
  try {
    const cmsData = req.body;
    const { error } = await supabase
      .from("cms_settings")
      .upsert({ key: "default", settings: cmsData, updated_at: new Date().toISOString() });

    if (error) throw error;
    res.json({ success: true, data: cmsData });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save CMS settings", details: err?.message });
  }
});

// CREATE / UPDATE Product
app.post("/api/products", requireSessionWithCsrf, async (req, res) => {
  await backupDatabase();
  try {
    const newProduct = req.body;
    let products: any[] = [];

    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    products = (data || []).map(mapDbProductToProduct);

    // Check if same product exists using similarity score >= 90%
    let idx = -1;
    for (let i = 0; i < products.length; i++) {
      if (computeSimilarity(products[i], newProduct) >= 0.90) {
        idx = i;
        break;
      }
    }

    let finalProduct: any;
    if (idx !== -1) {
      const existing = products[idx];
      const existingImgs = existing.images || (existing.image ? [existing.image] : []);
      const newImgs = newProduct.images || (newProduct.image ? [newProduct.image] : []);
      const mergedImgs = Array.from(new Set([...existingImgs, ...newImgs]));

      const existingGall = existing.galleryImages || (existing.image ? [existing.image] : []);
      const newGall = newProduct.galleryImages || (newProduct.image ? [newProduct.image] : []);
      const mergedGall = Array.from(new Set([...existingGall, ...newGall]));

      finalProduct = {
        ...existing,
        ...newProduct,
        id: existing.id, // KEEP original ID
        createdAt: existing.createdAt || newProduct.createdAt || new Date().toISOString(), // KEEP original createdAt
        lastModified: new Date().toISOString(), // ALWAYS update lastModified
        images: mergedImgs,
        galleryImages: mergedGall
      };
      
      if (mergedImgs.length > 0) {
        finalProduct.image = mergedImgs[0];
      }
    } else {
      if (!newProduct.id) {
        newProduct.id = "prod_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      }
      newProduct.createdAt = new Date().toISOString();
      newProduct.lastModified = new Date().toISOString();
      
      const newImgs = newProduct.images || (newProduct.image ? [newProduct.image] : []);
      const newGall = newProduct.galleryImages || (newProduct.image ? [newProduct.image] : []);
      newProduct.images = newImgs;
      newProduct.galleryImages = newGall;
      
      finalProduct = newProduct;
    }

    const dbProd = mapProductToDbProduct(finalProduct);
    const { error: upsertErr } = await supabase.from("products").upsert(dbProd);
    if (upsertErr) throw upsertErr;

    res.status(201).json(finalProduct);
  } catch (err: any) {
    await restoreDatabase();
    res.status(500).json({ error: "Failed to save product", details: err?.message });
  }
});

// Explicit backup endpoint
app.post("/api/products/backup", requireSessionWithCsrf, async (req, res) => {
  try {
    await backupDatabase();
    res.json({ success: true, message: "Backup created successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to backup database", details: err?.message });
  }
});

// Explicit restore endpoint
app.post("/api/products/restore", requireSessionWithCsrf, async (req, res) => {
  try {
    const { index } = req.body;
    if (await restoreDatabase(index)) {
      res.json({ success: true, message: `Database restored successfully from backup ${index || "latest"}.` });
    } else {
      res.status(400).json({ error: `No backup exists to restore for index: ${index || "latest"}.` });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to restore database", details: err?.message });
  }
});

// Bulk overwrite / save lists (Appends/updates only, never deletes)
app.post("/api/products/bulk", requireSessionWithCsrf, async (req, res) => {
  await backupDatabase();
  try {
    const list = req.body;
    if (!Array.isArray(list)) {
      await restoreDatabase();
      return res.status(400).json({ error: "Payload must be a JSON array of products" });
    }

    let productsList: any[] = [];
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    productsList = (data || []).map(mapDbProductToProduct);

    const modifiedOrAddedDbProducts: any[] = [];

    list.forEach((newProd: any) => {
      let idx = -1;
      for (let i = 0; i < productsList.length; i++) {
        if (computeSimilarity(productsList[i], newProd) >= 0.90) {
          idx = i;
          break;
        }
      }

      let finalProduct: any;
      if (idx !== -1) {
        const existing = productsList[idx];
        const existingImgs = existing.images || (existing.image ? [existing.image] : []);
        const newImgs = newProd.images || (newProd.image ? [newProd.image] : []);
        const mergedImgs = Array.from(new Set([...existingImgs, ...newImgs]));

        const existingGall = existing.galleryImages || (existing.image ? [existing.image] : []);
        const newGall = newProd.galleryImages || (newProd.image ? [newProd.image] : []);
        const mergedGall = Array.from(new Set([...existingGall, ...newGall]));

        finalProduct = {
          ...existing,
          ...newProd,
          id: existing.id, // KEEP original ID
          createdAt: existing.createdAt || newProd.createdAt || new Date().toISOString(), // KEEP original createdAt
          lastModified: new Date().toISOString(), // ALWAYS update lastModified
          images: mergedImgs,
          galleryImages: mergedGall
        };
        
        if (mergedImgs.length > 0) {
          finalProduct.image = mergedImgs[0];
        }

        productsList[idx] = finalProduct;
      } else {
        if (!newProd.id) {
          newProd.id = "prod_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
        }
        newProd.createdAt = new Date().toISOString();
        newProd.lastModified = new Date().toISOString();
        
        const newImgs = newProd.images || (newProd.image ? [newProd.image] : []);
        const newGall = newProd.galleryImages || (newProd.image ? [newProd.image] : []);
        newProd.images = newImgs;
        newProd.galleryImages = newGall;

        finalProduct = newProd;
        productsList.push(finalProduct);
      }

      modifiedOrAddedDbProducts.push(mapProductToDbProduct(finalProduct));
    });

    if (modifiedOrAddedDbProducts.length > 0) {
      const { error: upsertErr } = await supabase.from("products").upsert(modifiedOrAddedDbProducts);
      if (upsertErr) throw upsertErr;
    }

    res.json({ success: true, count: productsList.length });
  } catch (err: any) {
    await restoreDatabase();
    res.status(500).json({ error: "Failed to save products in bulk", details: err?.message });
  }
});

// API analyze uploaded image files using Gemini Vision AI
app.post("/api/analyze-images", requireSessionWithCsrf, async (req, res) => {
  try {
    console.log("=== API ANALYZE IMAGES REACHED ===");
    const { files } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "No files provided for analysis" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents: any[] = [
      `You are an expert florist inventory AI.
Analyze the provided images of florist products (flowers, cakes, decor, hampers, etc.).
Your first task is to group/cluster the images that depict the EXACT SAME physical product (different views, angles, close-ups, or setups of the same item).
If images are of different products, they must remain in separate product groups.

For each unique product group identify:
1. Product type category. It MUST be exactly one of:
   * Bouquets
   * Rose Bouquets
   * Anniversary Bouquets
   * Birthday Bouquets
   * Flower Baskets
   * Gift Hampers
   * Chocolate Bouquets
   * Teddy Bears
   * Cakes
   * Decorations
   * Flowers

2. A premium e-commerce name/title for the product. Do not use generic names. Make it sound beautiful and luxurious (like FNP or Ferns N Petals style).

3. An elegant short description of 15-20 words.

4. A detailed long description of 50-70 words.

5. A price matching the visual premium tier of the arrangement:
   * Small bouquet / item: ₹399–₹799
   * Medium bouquet / item: ₹799–₹1499
   * Premium bouquet / item: ₹1499–₹2999
   * Luxury bouquet / item: ₹2999+
   For Cakes, Flowers, Teddy Bouquets, Chocolate Bouquets, decorations, align pricing with their visual complexity (e.g. multi-tier cakes or large balloon decorations are Luxury, single-layer cakes are Medium/Premium).

6. An originalPrice (~30-40% higher than price) and the discountPercentage (~25-30%).

Return a JSON array where each object has:
- name: string
- title: string
- category: string
- description: string
- shortDescription: string
- longDescription: string
- price: number
- originalPrice: number
- discountPercentage: number
- originalNames: Array of strings containing the originalName values of the images belonging to this product. The first filename in this list will represent the primary cover image.

Return ONLY a pure JSON array. No markdown formatting blocks or surrounding text.`
    ];

    for (const f of files) {
      let rawBase64 = f.base64;
      let mimeType = f.mimeType || "image/jpeg";
      
      const matches = f.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        rawBase64 = matches[2];
      }
      
      contents.push(`Image original name: ${f.originalName}`);
      contents.push({
        inlineData: {
          data: rawBase64,
          mimeType: mimeType
        }
      });
    }

    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"];
    let lastError: any = null;
    let responseText = "";

    for (const modelName of modelsToTry) {
      let attempts = 3;
      while (attempts > 0) {
        try {
          console.log(`Attempting analysis with model: ${modelName} (${attempts} attempts remaining)`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              responseMimeType: "application/json"
            }
          });
          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (e: any) {
          lastError = e;
          console.warn(`Model ${modelName} failed:`, e?.message || e);
          attempts--;
          if (attempts > 0) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      }
      if (responseText) {
        break;
      }
    }

    if (!responseText) {
      throw lastError || new Error("All model attempts and retries failed");
    }

    const results = JSON.parse(responseText);
    res.json(results);
  } catch (err: any) {
    console.error("Gemini Image analysis error:", err);
    res.status(500).json({ error: "Failed to analyze images using Gemini Vision API", details: err?.message });
  }
});

// Delete Product
app.post("/api/products/delete", requireSessionWithCsrf, async (req, res) => {
  await backupDatabase();
  try {
    const { id, ids } = req.body;
    if (!id && (!ids || !Array.isArray(ids))) {
      await restoreDatabase();
      return res.status(400).json({ error: "ID or IDs array is required" });
    }

    const targetsToDelete = ids ? ids : [id];
    let productsToMove: any[] = [];

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", targetsToDelete);

    if (error) throw error;
    productsToMove = (data || []).map(mapDbProductToProduct);

    if (productsToMove.length === 0) {
      return res.json({ success: true, deletedCount: 0 });
    }

    const deletedDbRecords = productsToMove.map(p => {
      const dbProd = mapProductToDbProduct(p);
      return {
        ...dbProd,
        deleted_at: new Date().toISOString()
      };
    });

    // Upsert into deleted_products
    const { error: insertError } = await supabase.from("deleted_products").upsert(deletedDbRecords);
    if (insertError) throw insertError;

    // Delete from active products
    const { error: deleteError } = await supabase.from("products").delete().in("id", targetsToDelete);
    if (deleteError) throw deleteError;

    res.json({ success: true, deletedCount: productsToMove.length });
  } catch (err: any) {
    await restoreDatabase();
    res.status(500).json({ error: "Failed to delete product", details: err?.message });
  }
});

// Get Deleted Products
app.get("/api/products/deleted", requireSession, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("deleted_products")
      .select("*")
      .order("deleted_at", { ascending: false });

    if (error) throw error;
    const mapped = (data || []).map(mapDbProductToProduct);
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read deleted products database", details: err?.message });
  }
});

// Restore Deleted Product
app.post("/api/products/restore-deleted", requireSessionWithCsrf, async (req, res) => {
  await backupDatabase();
  try {
    const { id } = req.body;
    if (!id) {
      await restoreDatabase();
      return res.status(400).json({ error: "Product ID is required" });
    }

    let productToRestore: any = null;
    const { data, error } = await supabase
      .from("deleted_products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    productToRestore = mapDbProductToProduct(data);

    if (!productToRestore) {
      await restoreDatabase();
      return res.status(404).json({ error: "Product not found in deleted products list." });
    }

    delete productToRestore.deletedAt;

    let activeProducts: any[] = [];
    const { data: activeData, error: activeErr } = await supabase.from("products").select("*");
    if (activeErr) throw activeErr;
    activeProducts = (activeData || []).map(mapDbProductToProduct);

    let idx = -1;
    for (let i = 0; i < activeProducts.length; i++) {
      if (computeSimilarity(activeProducts[i], productToRestore) >= 0.90) {
        idx = i;
        break;
      }
    }

    let finalProduct: any;
    if (idx !== -1) {
      const existing = activeProducts[idx];
      const existingImgs = existing.images || (existing.image ? [existing.image] : []);
      const restoreImgs = productToRestore.images || (productToRestore.image ? [productToRestore.image] : []);
      const mergedImgs = Array.from(new Set([...existingImgs, ...restoreImgs]));

      const existingGall = existing.galleryImages || (existing.image ? [existing.image] : []);
      const restoreGall = productToRestore.galleryImages || (productToRestore.image ? [productToRestore.image] : []);
      const mergedGall = Array.from(new Set([...existingGall, ...restoreGall]));

      finalProduct = {
        ...existing,
        ...productToRestore,
        id: existing.id,
        images: mergedImgs,
        galleryImages: mergedGall,
        lastModified: new Date().toISOString()
      };
    } else {
      productToRestore.lastModified = new Date().toISOString();
      finalProduct = productToRestore;
    }

    // Upsert active
    const { error: activeError } = await supabase.from("products").upsert(mapProductToDbProduct(finalProduct));
    if (activeError) throw activeError;

    // Delete deleted
    const { error: delError } = await supabase.from("deleted_products").delete().eq("id", id);
    if (delError) throw delError;

    res.json({ success: true, restoredProduct: finalProduct });
  } catch (err: any) {
    await restoreDatabase();
    res.status(500).json({ error: "Failed to restore deleted product", details: err?.message });
  }
});

// Reset database
app.post("/api/products/reset", requireSessionWithCsrf, async (req, res) => {
  await backupDatabase();
  try {
    const { error } = await supabase.from("products").delete().neq("id", "");
    if (error) throw error;
    res.json({ success: true, count: 0 });
  } catch (err: any) {
    await restoreDatabase();
    res.status(500).json({ error: "Failed to reset products list", details: err?.message });
  }
});

// Endpoint to verify physical file existence inside Storage
app.get("/api/check-file", async (req, res) => {
  try {
    const relativePath = req.query.path as string;
    if (!relativePath) {
      return res.status(400).json({ exists: false, error: "Path query parameter is required" });
    }

    const filename = path.basename(relativePath);
    const { data, error } = await supabase.storage.from("products").list("", {
      search: filename
    });

    const exists = !error && data && data.some(f => f.name === filename);
    const match = exists ? data.find(f => f.name === filename) : null;

    res.json({
      exists,
      absolutePath: relativePath,
      size: match && match.metadata ? (match.metadata as any).size : 0,
      createdAt: match ? match.created_at : null
    });
  } catch (err: any) {
    res.status(500).json({ exists: false, error: err?.message });
  }
});

// Upload endpoint that accepts file details and base64
app.post("/api/upload", requireSessionWithCsrf, async (req, res) => {
  try {
    const { name, base64 } = req.body;
    if (!name || !base64) {
      return res.status(400).json({ error: "Both 'name' and 'base64' fields are required" });
    }

    // Clean base64 string
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let dataBuffer: Buffer;
    let mimeType = "image/png";
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      dataBuffer = Buffer.from(matches[2], "base64");
    } else {
      dataBuffer = Buffer.from(base64, "base64");
    }

    // Sanitize filename to prevent directory traversal or bad characters
    const ext = path.extname(name) || ".png";
    const base = path.basename(name, ext).replace(/[^a-zA-Z0-9.\-_]/g, "_").toLowerCase();
    
    // Create unique filename
    const finalName = `${base}-${Date.now()}${ext}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(finalName, dataBuffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(finalName);

    res.json({ url: publicUrlData.publicUrl, name: finalName });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to upload file", details: err?.message });
  }
});

async function startServer() {
  if (process.env.VERCEL === "1") {
    console.log("Running in Vercel Serverless environment. Not binding port listener.");
    
    // Seed default CMS settings dynamically on boot if connected to Supabase and missing
    try {
      const { data } = await supabase.from("cms_settings").select("key").eq("key", "default").single();
      if (!data) {
        await supabase.from("cms_settings").insert({
          key: "default",
          settings: getDefaultCms(),
          updated_at: new Date().toISOString()
        });
        console.log("Seeded default CMS settings in Supabase.");
      }
    } catch (err) {
      console.error("Could not seed default CMS settings in Supabase:", err);
    }
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();

export default app;
