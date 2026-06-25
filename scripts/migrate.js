import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const rootDir = process.cwd();
const productsFile = path.join(rootDir, "products.json");
const cmsFile = path.join(rootDir, "cms.json");
const productsDir = path.join(rootDir, "public", "products");

// Mapping function: Client camelCase -> DB snake_case
function mapProductToDbProduct(product) {
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

async function runMigration() {
  console.log("=== STARTING SUPABASE MIGRATION ===");

  // 1. Upload Local Images to Supabase Storage
  console.log("\n1. Uploading local images to Supabase Storage...");
  const imageUrlMap = new Map(); // local path -> Supabase public URL

  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir);
    console.log(`Found ${files.length} images in local public/products/`);

    for (const file of files) {
      const filePath = path.join(productsDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(file).toLowerCase();
      let contentType = "image/jpeg";
      if (ext === ".png") contentType = "image/png";
      else if (ext === ".webp") contentType = "image/webp";

      const localPath = `/public/products/${file}`;

      console.log(`Uploading ${file}...`);
      const { data, error } = await supabase.storage
        .from("products")
        .upload(file, fileBuffer, {
          contentType,
          upsert: true
        });

      if (error) {
        console.warn(`Failed to upload ${file}:`, error.message);
        // If the bucket doesn't exist, prompt the user
        if (error.message.includes("does not exist") || error.message.includes("Bucket not found")) {
          console.error("\nERROR: The Storage Bucket 'products' does not exist in your Supabase project.");
          console.error("Please create a PUBLIC storage bucket named 'products' in the Supabase Dashboard and run this script again.");
          process.exit(1);
        }
      } else {
        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(file);
        
        imageUrlMap.set(localPath, urlData.publicUrl);
        imageUrlMap.set(`public/products/${file}`, urlData.publicUrl);
        imageUrlMap.set(file, urlData.publicUrl);
        console.log(`Uploaded successfully. Public URL: ${urlData.publicUrl}`);
      }
    }
  } else {
    console.log("Local public/products/ directory not found or empty. Skipping image upload.");
  }

  // Helper to map dynamic URLs
  const getMigratedUrl = (url) => {
    if (!url) return url;
    if (imageUrlMap.has(url)) return imageUrlMap.get(url);
    const basename = path.basename(url);
    if (imageUrlMap.has(basename)) return imageUrlMap.get(basename);
    return url;
  };

  // 2. Parse and seed products.json
  console.log("\n2. Migrating products.json catalog database...");
  if (fs.existsSync(productsFile)) {
    const productsData = JSON.parse(fs.readFileSync(productsFile, "utf8"));
    console.log(`Found ${productsData.length} products to migrate.`);

    const migratedProducts = productsData.map(p => {
      // Migrate cover image
      p.image = getMigratedUrl(p.image);
      // Migrate images array
      if (Array.isArray(p.images)) {
        p.images = p.images.map(getMigratedUrl);
      }
      // Migrate galleryImages array
      if (Array.isArray(p.galleryImages)) {
        p.galleryImages = p.galleryImages.map(getMigratedUrl);
      }
      return mapProductToDbProduct(p);
    });

    console.log("Upserting products into Supabase...");
    const { error: upsertErr } = await supabase
      .from("products")
      .upsert(migratedProducts);

    if (upsertErr) {
      console.error("ERROR: Failed to migrate products catalog:", upsertErr.message);
      console.error("Make sure you have executed the schema SQL in your Supabase SQL Editor first.");
      process.exit(1);
    }
    console.log("Successfully migrated products database!");
  } else {
    console.log("products.json not found. Skipping catalog migration.");
  }

  // 3. Parse and seed cms.json
  console.log("\n3. Migrating cms.json settings...");
  if (fs.existsSync(cmsFile)) {
    const cmsData = JSON.parse(fs.readFileSync(cmsFile, "utf8"));
    
    // Migrate bannerImage in cms sections if any
    if (cmsData && Array.isArray(cmsData.sections)) {
      cmsData.sections = cmsData.sections.map(sec => {
        if (sec.bannerImage) {
          sec.bannerImage = getMigratedUrl(sec.bannerImage);
        }
        return sec;
      });
    }

    const { error: cmsErr } = await supabase
      .from("cms_settings")
      .upsert({
        key: "default",
        settings: cmsData,
        updated_at: new Date().toISOString()
      });

    if (cmsErr) {
      console.error("ERROR: Failed to migrate CMS settings:", cmsErr.message);
      process.exit(1);
    }
    console.log("Successfully migrated CMS settings!");
  } else {
    console.log("cms.json not found. Skipping CMS settings migration.");
  }

  console.log("\n=== MIGRATION COMPLETE SUCCESSFULLY! ===");
}

runMigration().catch(err => {
  console.error("Migration script crashed:", err);
});
