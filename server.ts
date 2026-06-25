import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

// Fail fast if ADMIN_PASSWORD is not configured
if (!process.env.ADMIN_PASSWORD) {
  console.error("FATAL CONFIGURATION ERROR: ADMIN_PASSWORD environment variable is not defined!");
  process.exit(1);
}

// Modular Session Interface & Memory Session Store (can be easily replaced with Redis or a DB store)
export interface Session {
  id: string;
  csrfToken: string;
  createdAt: number;
}

export interface SessionStore {
  create(sessionId: string, csrfToken: string): void;
  get(sessionId: string): Session | null;
  delete(sessionId: string): void;
}

class MemorySessionStore implements SessionStore {
  private sessions = new Map<string, Session>();
  private readonly sessionExpiryMs = 24 * 60 * 60 * 1000; // 24 hours

  create(sessionId: string, csrfToken: string): void {
    this.sessions.set(sessionId, {
      id: sessionId,
      csrfToken,
      createdAt: Date.now()
    });
  }

  get(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (Date.now() - session.createdAt > this.sessionExpiryMs) {
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  delete(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

const sessionStore = new MemorySessionStore();

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
const requireSession = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const sessionId = getSessionFromRequest(req);
  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized. Missing session cookie." });
  }
  const session = sessionStore.get(sessionId);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized. Invalid or expired session." });
  }
  next();
};

// Middleware to verify session & CSRF token for POST/PUT/DELETE/modify requests
const requireSessionWithCsrf = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const sessionId = getSessionFromRequest(req);
  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized. Missing session cookie." });
  }
  const session = sessionStore.get(sessionId);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized. Invalid or expired session." });
  }
  
  // CSRF verification: Check the custom request header
  const csrfToken = req.headers["x-csrf-token"];
  if (!csrfToken || csrfToken !== session.csrfToken) {
    return res.status(403).json({ error: "Forbidden. Invalid or missing CSRF token." });
  }
  
  next();
};

const app = express();
const PORT = 3000;

// Increase payload limit for Base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const productsDir = path.join(publicDir, "products");
const databaseFile = path.join(rootDir, "products.json");
const deletedDatabaseFile = path.join(rootDir, "deletedProducts.json");
const cmsFile = path.join(rootDir, "cms.json");

// Ensure physical directories exist on start
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}
if (!fs.existsSync(databaseFile)) {
  fs.writeFileSync(databaseFile, JSON.stringify([], null, 2), "utf8");
}
if (!fs.existsSync(deletedDatabaseFile)) {
  fs.writeFileSync(deletedDatabaseFile, JSON.stringify([], null, 2), "utf8");
}
if (!fs.existsSync(cmsFile)) {
  const defaultCms = {
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
  fs.writeFileSync(cmsFile, JSON.stringify(defaultCms, null, 2), "utf8");
}

// Serve public directory statically under /public
app.use("/public", express.static(publicDir));

// Keep check of static serving for /products as well just in case
app.use("/products", express.static(productsDir));

// ==========================================
// ADMIN AUTHENTICATION & SESSION ENDPOINTS
// ==========================================

app.post("/api/admin/login", (req, res) => {
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
    sessionStore.create(sessionId, csrfToken);

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

app.post("/api/admin/logout", (req, res) => {
  const sessionId = getSessionFromRequest(req);
  if (sessionId) {
    sessionStore.delete(sessionId);
  }
  // Clear cookie
  res.setHeader("Set-Cookie", "admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0");
  res.json({ success: true });
});

app.get("/api/admin/check-session", (req, res) => {
  const sessionId = getSessionFromRequest(req);
  if (!sessionId) {
    return res.json({ authenticated: false });
  }
  const session = sessionStore.get(sessionId);
  if (!session) {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true, csrfToken: session.csrfToken });
});

// API retrieve products from JSON file
app.get("/api/products", (req, res) => {
  try {
    const data = fs.readFileSync(databaseFile, "utf8");
    res.json(JSON.parse(data));
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read products database", details: err?.message });
  }
});

// API retrieve CMS settings
app.get("/api/cms", (req, res) => {
  try {
    const data = fs.readFileSync(cmsFile, "utf8");
    res.json(JSON.parse(data));
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read CMS settings", details: err?.message });
  }
});

// API save CMS settings
app.post("/api/cms", requireSessionWithCsrf, (req, res) => {
  try {
    const cmsData = req.body;
    fs.writeFileSync(cmsFile, JSON.stringify(cmsData, null, 2), "utf8");
    res.json({ success: true, data: cmsData });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save CMS settings", details: err?.message });
  }
});

// CREATE Product in JSON
// CREATE Product in JSON
const backupDatabase = () => {
  try {
    if (fs.existsSync(databaseFile)) {
      // Shift rotated backups: 4 -> 5, 3 -> 4, 2 -> 3, 1 -> 2
      for (let i = 4; i >= 1; i--) {
        const src = path.join(rootDir, `products.backup${i}.json`);
        const dest = path.join(rootDir, `products.backup${i + 1}.json`);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      }
      
      // Copy current products.json to products.backup1.json
      const backup1Path = path.join(rootDir, "products.backup1.json");
      fs.copyFileSync(databaseFile, backup1Path);

      // Keep products.backup.json as the latest backup for automatic restore logic
      const latestBackupPath = path.join(rootDir, "products.backup.json");
      fs.copyFileSync(databaseFile, latestBackupPath);
      console.log("Database backups rotated and saved.");
    }
  } catch (err) {
    console.error("Failed to create database backup:", err);
  }
};

const restoreDatabase = (index?: number) => {
  try {
    let backupPath = path.join(rootDir, "products.backup.json");
    if (index && index >= 1 && index <= 5) {
      backupPath = path.join(rootDir, `products.backup${index}.json`);
    }
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, databaseFile);
      console.log(`Database restored from backup: ${backupPath}`);
      return true;
    }
  } catch (err) {
    console.error("Failed to restore database from backup:", err);
  }
  return false;
};

// Heuristic similarity logic to prevent incorrect merges (needs to be above 90% weighted score)
const computeSimilarity = (p1: any, p2: any): number => {
  // Category check is mandatory
  if (p1.category !== p2.category) return 0;

  // Exact ID match or exact Cover Image match is 100%
  if (p1.id && p2.id && p1.id === p2.id) return 1.0;
  if (p1.image && p2.image && p1.image === p2.image) return 1.0;

  const normalizeString = (str: string) => {
    return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  };

  // Exact string match on name or title is 100%
  if (normalizeString(p1.name) === normalizeString(p2.name)) return 1.0;
  if (normalizeString(p1.title) === normalizeString(p2.title)) return 1.0;

  // Calculate token-based similarity and attribute matching
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

// CREATE Product in JSON
app.post("/api/products", requireSessionWithCsrf, (req, res) => {
  backupDatabase();
  try {
    const data = fs.readFileSync(databaseFile, "utf8");
    const products = JSON.parse(data);
    const newProduct = req.body;
    
    // Check if same product exists using similarity score >= 90%
    let idx = -1;
    for (let i = 0; i < products.length; i++) {
      if (computeSimilarity(products[i], newProduct) >= 0.90) {
        idx = i;
        break;
      }
    }
    
    if (idx !== -1) {
      const existing = products[idx];
      const existingImgs = existing.images || (existing.image ? [existing.image] : []);
      const newImgs = newProduct.images || (newProduct.image ? [newProduct.image] : []);
      const mergedImgs = Array.from(new Set([...existingImgs, ...newImgs]));

      const existingGall = existing.galleryImages || (existing.image ? [existing.image] : []);
      const newGall = newProduct.galleryImages || (newProduct.image ? [newProduct.image] : []);
      const mergedGall = Array.from(new Set([...existingGall, ...newGall]));

      products[idx] = {
        ...existing,
        ...newProduct,
        id: existing.id, // KEEP original ID
        createdAt: existing.createdAt || newProduct.createdAt || new Date().toISOString(), // NEVER modify createdAt
        lastModified: new Date().toISOString(), // ALWAYS update lastModified
        images: mergedImgs,
        galleryImages: mergedGall
      };
      
      if (mergedImgs.length > 0) {
        products[idx].image = mergedImgs[0];
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
      
      products.push(newProduct);
    }
    
    fs.writeFileSync(databaseFile, JSON.stringify(products, null, 2), "utf8");
    res.status(201).json(idx !== -1 ? products[idx] : products[products.length - 1]);
  } catch (err: any) {
    restoreDatabase();
    res.status(500).json({ error: "Failed to save product", details: err?.message });
  }
});

// Explicit backup endpoint
app.post("/api/products/backup", requireSessionWithCsrf, (req, res) => {
  try {
    backupDatabase();
    res.json({ success: true, message: "Backup created successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to backup database", details: err?.message });
  }
});

// Explicit restore endpoint
app.post("/api/products/restore", requireSessionWithCsrf, (req, res) => {
  try {
    const { index } = req.body;
    if (restoreDatabase(index)) {
      res.json({ success: true, message: `Database restored successfully from backup ${index || "latest"}.` });
    } else {
      res.status(400).json({ error: `No backup file exists to restore for index: ${index || "latest"}.` });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to restore database", details: err?.message });
  }
});

// Bulk overwrite / save lists (Appends/updates only, never deletes)
app.post("/api/products/bulk", requireSessionWithCsrf, (req, res) => {
  backupDatabase();
  try {
    const list = req.body;
    if (!Array.isArray(list)) {
      restoreDatabase();
      return res.status(400).json({ error: "Payload must be a JSON array of products" });
    }

    const currentData = fs.readFileSync(databaseFile, "utf8");
    const productsList = JSON.parse(currentData);

    list.forEach((newProd: any) => {
      // Match by similarity >= 90%
      let idx = -1;
      for (let i = 0; i < productsList.length; i++) {
        if (computeSimilarity(productsList[i], newProd) >= 0.90) {
          idx = i;
          break;
        }
      }

      if (idx !== -1) {
        const existing = productsList[idx];
        const existingImgs = existing.images || (existing.image ? [existing.image] : []);
        const newImgs = newProd.images || (newProd.image ? [newProd.image] : []);
        const mergedImgs = Array.from(new Set([...existingImgs, ...newImgs]));

        const existingGall = existing.galleryImages || (existing.image ? [existing.image] : []);
        const newGall = newProd.galleryImages || (newProd.image ? [newProd.image] : []);
        const mergedGall = Array.from(new Set([...existingGall, ...newGall]));

        productsList[idx] = {
          ...existing,
          ...newProd,
          id: existing.id, // KEEP original ID
          createdAt: existing.createdAt || newProd.createdAt || new Date().toISOString(), // KEEP original createdAt
          lastModified: new Date().toISOString(), // ALWAYS update lastModified
          images: mergedImgs,
          galleryImages: mergedGall
        };
        
        if (mergedImgs.length > 0) {
          productsList[idx].image = mergedImgs[0];
        }
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

        productsList.push(newProd);
      }
    });

    fs.writeFileSync(databaseFile, JSON.stringify(productsList, null, 2), "utf8");
    res.json({ success: true, count: productsList.length });
  } catch (err: any) {
    restoreDatabase();
    res.status(500).json({ error: "Failed to save products in bulk", details: err?.message });
  }
});

// API analyze uploaded image files using Gemini Vision AI
app.post("/api/analyze-images", requireSessionWithCsrf, async (req, res) => {
  try {
    console.log("=== API ANALYZE IMAGES REACHED ===");
    console.log("GEMINI_API_KEY from env:", process.env.GEMINI_API_KEY ? "EXISTS (length " + process.env.GEMINI_API_KEY.length + ")" : "MISSING");
    const { files } = req.body;
    console.log("Files received count:", files?.length);
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
            // Wait 1.5 seconds before retrying
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

// Delete Product (Moves deleted products to deletedProducts.json, never deletes permanently)
app.post("/api/products/delete", requireSessionWithCsrf, (req, res) => {
  backupDatabase();
  try {
    const { id, ids } = req.body;
    if (!id && (!ids || !Array.isArray(ids))) {
      restoreDatabase();
      return res.status(400).json({ error: "ID or IDs array is required" });
    }

    const data = fs.readFileSync(databaseFile, "utf8");
    let products = JSON.parse(data);

    let deletedProducts: any[] = [];
    if (fs.existsSync(deletedDatabaseFile)) {
      try {
        const delData = fs.readFileSync(deletedDatabaseFile, "utf8");
        deletedProducts = JSON.parse(delData);
      } catch (e) {
        deletedProducts = [];
      }
    }

    const targetsToDelete = ids ? ids : [id];
    const productsToMove = products.filter((p: any) => targetsToDelete.includes(p.id));

    productsToMove.forEach((p: any) => {
      const existsIdx = deletedProducts.findIndex((dp: any) => dp.id === p.id);
      if (existsIdx === -1) {
        deletedProducts.push({
          ...p,
          deletedAt: new Date().toISOString()
        });
      }
    });

    fs.writeFileSync(deletedDatabaseFile, JSON.stringify(deletedProducts, null, 2), "utf8");

    products = products.filter((p: any) => !targetsToDelete.includes(p.id));
    fs.writeFileSync(databaseFile, JSON.stringify(products, null, 2), "utf8");
    res.json({ success: true, deletedCount: productsToMove.length });
  } catch (err: any) {
    restoreDatabase();
    res.status(500).json({ error: "Failed to delete product", details: err?.message });
  }
});

// Get Deleted Products
app.get("/api/products/deleted", requireSession, (req, res) => {
  try {
    if (!fs.existsSync(deletedDatabaseFile)) {
      return res.json([]);
    }
    const data = fs.readFileSync(deletedDatabaseFile, "utf8");
    res.json(JSON.parse(data));
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read deleted products database", details: err?.message });
  }
});

// Restore Deleted Product
app.post("/api/products/restore-deleted", requireSessionWithCsrf, (req, res) => {
  backupDatabase();
  try {
    const { id } = req.body;
    if (!id) {
      restoreDatabase();
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (!fs.existsSync(deletedDatabaseFile)) {
      restoreDatabase();
      return res.status(400).json({ error: "No deleted products exist to restore." });
    }

    const delData = fs.readFileSync(deletedDatabaseFile, "utf8");
    let deletedProducts = JSON.parse(delData);

    const matchIdx = deletedProducts.findIndex((p: any) => p.id === id);
    if (matchIdx === -1) {
      restoreDatabase();
      return res.status(404).json({ error: "Product not found in deleted products list." });
    }

    const productToRestore = deletedProducts[matchIdx];
    delete productToRestore.deletedAt;

    const data = fs.readFileSync(databaseFile, "utf8");
    const products = JSON.parse(data);

    // Merge or append back into active catalog using similarity
    let idx = -1;
    for (let i = 0; i < products.length; i++) {
      if (computeSimilarity(products[i], productToRestore) >= 0.90) {
        idx = i;
        break;
      }
    }

    if (idx !== -1) {
      const existing = products[idx];
      const existingImgs = existing.images || (existing.image ? [existing.image] : []);
      const restoreImgs = productToRestore.images || (productToRestore.image ? [productToRestore.image] : []);
      const mergedImgs = Array.from(new Set([...existingImgs, ...restoreImgs]));

      const existingGall = existing.galleryImages || (existing.image ? [existing.image] : []);
      const restoreGall = productToRestore.galleryImages || (productToRestore.image ? [productToRestore.image] : []);
      const mergedGall = Array.from(new Set([...existingGall, ...restoreGall]));

      products[idx] = {
        ...existing,
        ...productToRestore,
        id: existing.id,
        images: mergedImgs,
        galleryImages: mergedGall,
        lastModified: new Date().toISOString()
      };
    } else {
      productToRestore.lastModified = new Date().toISOString();
      products.push(productToRestore);
    }

    fs.writeFileSync(databaseFile, JSON.stringify(products, null, 2), "utf8");

    deletedProducts.splice(matchIdx, 1);
    fs.writeFileSync(deletedDatabaseFile, JSON.stringify(deletedProducts, null, 2), "utf8");

    res.json({ success: true, restoredProduct: productToRestore });
  } catch (err: any) {
    restoreDatabase();
    res.status(500).json({ error: "Failed to restore deleted product", details: err?.message });
  }
});

// Reset server database (Wipe catalog - backup first just in case)
app.post("/api/products/reset", requireSessionWithCsrf, (req, res) => {
  backupDatabase();
  try {
    fs.writeFileSync(databaseFile, JSON.stringify([], null, 2), "utf8");
    res.json({ success: true, count: 0 });
  } catch (err: any) {
    restoreDatabase();
    res.status(500).json({ error: "Failed to reset products list", details: err?.message });
  }
});

// Endpoint to verify physical file existence and stats on disk for strict compliance evidence
app.get("/api/check-file", (req, res) => {
  try {
    const relativePath = req.query.path as string;
    if (!relativePath) {
      return res.status(400).json({ exists: false, error: "Path query parameter is required" });
    }
    // Only verify files under /public to protect system integrity
    const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
    const absolutePath = path.join(publicDir, normalized.replace(/^\/?public\/?/, ""));
    const exists = fs.existsSync(absolutePath);
    const stats = exists ? fs.statSync(absolutePath) : null;
    res.json({
      exists,
      absolutePath,
      size: stats ? stats.size : 0,
      createdAt: stats ? stats.mtime : null
    });
  } catch (err: any) {
    res.status(500).json({ exists: false, error: err?.message });
  }
});

// Upload endpoint that accepts file details and base64
app.post("/api/upload", requireSessionWithCsrf, (req, res) => {
  try {
    const { name, base64 } = req.body;
    if (!name || !base64) {
      return res.status(400).json({ error: "Both 'name' and 'base64' fields are required" });
    }

    // Clean base64 string
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let dataBuffer: Buffer;
    if (matches && matches.length === 3) {
      dataBuffer = Buffer.from(matches[2], "base64");
    } else {
      dataBuffer = Buffer.from(base64, "base64");
    }

    // Sanitize filename to prevent directory traversal or bad characters
    const ext = path.extname(name) || ".png";
    const base = path.basename(name, ext).replace(/[^a-zA-Z0-9.\-_]/g, "_").toLowerCase();
    
    // Create unique filename
    const finalName = `${base}-${Date.now()}${ext}`;
    const targetPath = path.join(productsDir, finalName);

    // Save image to the disk
    fs.writeFileSync(targetPath, dataBuffer);

    // Return relative URL that points to /public/products/finalName
    const publicUrl = `/public/products/${finalName}`;
    res.json({ url: publicUrl, name: finalName });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to upload file", details: err?.message });
  }
});

async function startServer() {
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
