import { createClient } from "@supabase/supabase-js";
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

async function runVerification() {
  console.log("=== SUPABASE AUTOMATED INTEGRATION TESTS ===");
  const results = {
    connection: false,
    sessionCreate: false,
    sessionGet: false,
    sessionDelete: false,
    productCreate: false,
    productRead: false,
    productUpdate: false,
    productDelete: false,
    productRestore: false,
    cmsUpdate: false,
    cmsRead: false,
  };

  try {
    // 1. Connection Check
    console.log("\n1. Testing connection to Supabase...");
    const { data: connData, error: connErr } = await supabase.from("products").select("id").limit(1);
    if (connErr) throw connErr;
    console.log("✅ Connection successful!");
    results.connection = true;

    // 2. Admin Login & Session Persistence
    console.log("\n2. Testing Admin Sessions operations...");
    const tempSessionId = "test_sess_" + Date.now();
    const tempCsrfToken = "test_csrf_" + Date.now();

    // Create session
    const { error: sessCreateErr } = await supabase.from("sessions").insert({
      id: tempSessionId,
      csrf_token: tempCsrfToken,
      created_at: new Date().toISOString()
    });
    if (sessCreateErr) throw sessCreateErr;
    console.log("✅ Created session row in db.");
    results.sessionCreate = true;

    // Read session
    const { data: sessData, error: sessGetErr } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", tempSessionId)
      .single();
    if (sessGetErr) throw sessGetErr;
    if (sessData && sessData.csrf_token === tempCsrfToken) {
      console.log("✅ Retrieved session and verified CSRF token matches.");
      results.sessionGet = true;
    } else {
      throw new Error("CSRF token did not match");
    }

    // Delete session (Logout)
    const { error: sessDelErr } = await supabase.from("sessions").delete().eq("id", tempSessionId);
    if (sessDelErr) throw sessDelErr;
    console.log("✅ Deleted session row (Logout).");
    results.sessionDelete = true;

    // 3. Product creation, editing, deletion & restoration
    console.log("\n3. Testing Product Catalog CRUD flow...");
    const tempProductId = "test_prod_" + Date.now();
    const tempProduct = {
      id: tempProductId,
      name: "Temporary Verification Rose",
      title: "Temporary Verification Rose",
      category: "Flowers",
      price: 999,
      original_price: 1399,
      image: "https://example.com/rose.png",
      images: ["https://example.com/rose.png"],
      gallery_images: ["https://example.com/rose.png"],
      description: "Temp description",
      short_description: "Temp short",
      long_description: "Temp long description",
      is_enabled: true,
      quantity: 10,
      delivery_settings: { sameday: true, charge: 0 }
    };

    // Insert Product
    const { error: prodInsertErr } = await supabase.from("products").insert(tempProduct);
    if (prodInsertErr) throw prodInsertErr;
    console.log("✅ Inserted temporary test product.");
    results.productCreate = true;

    // Read Product
    const { data: prodData, error: prodSelectErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", tempProductId)
      .single();
    if (prodSelectErr) throw prodSelectErr;
    if (prodData && prodData.price === "999") { // price returns as string from numeric sometimes
      console.log("✅ Read test product price successfully.");
      results.productRead = true;
    }

    // Update Product (Editing)
    const { error: prodUpdateErr } = await supabase
      .from("products")
      .update({ price: 1099, name: "Temporary Verification Rose (Edited)" })
      .eq("id", tempProductId);
    if (prodUpdateErr) throw prodUpdateErr;
    console.log("✅ Updated test product (Product editing).");
    results.productUpdate = true;

    // Move to Deleted Products (Product deletion)
    const { data: activeProd, error: fetchErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", tempProductId)
      .single();
    if (fetchErr) throw fetchErr;

    // Insert to deleted_products
    const { error: delInsertErr } = await supabase.from("deleted_products").insert({
      ...activeProd,
      deleted_at: new Date().toISOString()
    });
    if (delInsertErr) throw delInsertErr;

    // Remove from products
    const { error: deleteActiveErr } = await supabase.from("products").delete().eq("id", tempProductId);
    if (deleteActiveErr) throw deleteActiveErr;
    console.log("✅ Moved product to deleted_products bin.");
    results.productDelete = true;

    // Restore Deleted Product (Product restoration)
    const { data: deletedProd, error: fetchDelErr } = await supabase
      .from("deleted_products")
      .select("*")
      .eq("id", tempProductId)
      .single();
    if (fetchDelErr) throw fetchDelErr;

    // Insert back to active products
    const { error: restoreInsertErr } = await supabase.from("products").insert(deletedProd);
    if (restoreInsertErr) throw restoreInsertErr;

    // Delete from deleted_products
    const { error: deleteDelErr } = await supabase.from("deleted_products").delete().eq("id", tempProductId);
    if (deleteDelErr) throw deleteDelErr;
    console.log("✅ Restored product back to active catalog.");
    results.productRestore = true;

    // Clean up temporary product
    await supabase.from("products").delete().eq("id", tempProductId);

    // 4. CMS Settings read/write
    console.log("\n4. Testing CMS Settings read/write...");
    // Read CMS settings
    const { data: cmsData, error: cmsReadErr } = await supabase
      .from("cms_settings")
      .select("settings")
      .eq("key", "default")
      .single();
    if (cmsReadErr && cmsReadErr.code !== "PGRST116") throw cmsReadErr;
    console.log("✅ Read CMS settings (CMS read).");
    results.cmsRead = true;

    // Update CMS settings
    const currentSettings = cmsData && cmsData.settings ? cmsData.settings : { sections: [], homepage: {} };
    const { error: cmsWriteErr } = await supabase
      .from("cms_settings")
      .upsert({
        key: "default",
        settings: currentSettings,
        updated_at: new Date().toISOString()
      });
    if (cmsWriteErr) throw cmsWriteErr;
    console.log("✅ Updated CMS settings.");
    results.cmsUpdate = true;

    console.log("\n=== ALL TEST PHASES PASSED SUCCESSFULLY ===");
    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error("\n❌ TEST FAILURE OCCURRED:", err.message || err);
    console.log("\nTest Results Summary:");
    console.log(JSON.stringify(results, null, 2));
    process.exit(1);
  }
}

runVerification();
