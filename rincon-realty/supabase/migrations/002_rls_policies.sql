-- ============================================================
-- Rincón Realty — Row Level Security (RLS)
-- Ejecutar después de 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- COMMUNITIES — lectura pública, escritura solo admin
-- ============================================================
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "communities_public_read" ON communities
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "communities_admin_write" ON communities
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- AGENTS — lectura pública, escritura solo admin
-- ============================================================
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agents_public_read" ON agents
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "agents_admin_write" ON agents
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- PROPERTIES — anon solo ve publicadas, admin ve todo
-- ============================================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_public_read" ON properties
  FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "properties_admin_all" ON properties
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- PROPERTY_IMAGES — lectura pública, escritura solo admin
-- ============================================================
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_images_public_read" ON property_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "property_images_admin_write" ON property_images
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- BLOG_POSTS — anon solo ve publicados, admin ve todo
-- ============================================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_public_read" ON blog_posts
  FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "blog_posts_admin_all" ON blog_posts
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- CONTACTS — solo admin puede leer/escribir
-- Los INSERT públicos se hacen via service_role en API routes
-- ============================================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_admin_all" ON contacts
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- SITE_CONFIG — lectura pública, escritura solo admin
-- ============================================================
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_config_public_read" ON site_config
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "site_config_admin_write" ON site_config
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
