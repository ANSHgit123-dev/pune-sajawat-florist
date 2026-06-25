-- ----------------------------------------------------
-- SUPABASE DATABASE SCHEMA INITIALIZATION SCRIPT
-- Copy and paste this script into your Supabase SQL Editor.
-- ----------------------------------------------------

-- 1. Create active products catalog table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  short_description TEXT,
  long_description TEXT,
  rating NUMERIC DEFAULT 5,
  reviews_count INTEGER DEFAULT 0,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT true,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  sku TEXT,
  quantity INTEGER DEFAULT 1,
  low_stock_alert INTEGER DEFAULT 0,
  delivery_settings JSONB DEFAULT '{}'::jsonb,
  addons JSONB DEFAULT '[]'::jsonb,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security) and configure public read access policy
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to anyone" ON products;
CREATE POLICY "Allow read access to anyone" ON products FOR SELECT USING (true);

-- 2. Create deleted products (safety bin history) table
CREATE TABLE IF NOT EXISTS deleted_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  short_description TEXT,
  long_description TEXT,
  rating NUMERIC DEFAULT 5,
  reviews_count INTEGER DEFAULT 0,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT true,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE,
  sku TEXT,
  quantity INTEGER DEFAULT 1,
  low_stock_alert INTEGER DEFAULT 0,
  delivery_settings JSONB DEFAULT '{}'::jsonb,
  addons JSONB DEFAULT '[]'::jsonb,
  last_modified TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (no public policies exist, keeping data private to service_role)
ALTER TABLE deleted_products ENABLE ROW LEVEL SECURITY;

-- 3. Create CMS settings table
CREATE TABLE IF NOT EXISTS cms_settings (
  key TEXT PRIMARY KEY,
  settings JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and configure public read access policy
ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to anyone" ON cms_settings;
CREATE POLICY "Allow read access to anyone" ON cms_settings FOR SELECT USING (true);

-- 4. Create backups table
CREATE TABLE IF NOT EXISTS backups (
  id INT PRIMARY KEY,
  products JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (no public policies exist, keeping backups private to service_role)
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- 5. Create sessions table (stateless session backend)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  csrf_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (no public policies exist, keeping admin sessions private to service_role)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 6. Grant explicit privileges to service_role (required if default schema privileges are restricted)
GRANT USAGE ON SCHEMA public TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

GRANT ALL PRIVILEGES ON TABLE products TO service_role;
GRANT ALL PRIVILEGES ON TABLE deleted_products TO service_role;
GRANT ALL PRIVILEGES ON TABLE cms_settings TO service_role;
GRANT ALL PRIVILEGES ON TABLE backups TO service_role;
GRANT ALL PRIVILEGES ON TABLE sessions TO service_role;

-- Grant SELECT privileges to public roles (anon and authenticated) for read-only tables
GRANT SELECT ON TABLE products TO anon, authenticated;
GRANT SELECT ON TABLE cms_settings TO anon, authenticated;


