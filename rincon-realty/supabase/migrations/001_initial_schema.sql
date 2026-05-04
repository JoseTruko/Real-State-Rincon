-- ============================================================
-- Rincón Realty — Schema inicial
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE property_type     AS ENUM ('house', 'land', 'farm');
CREATE TYPE property_status   AS ENUM ('draft', 'published');
CREATE TYPE blog_status       AS ENUM ('draft', 'published');
CREATE TYPE contact_source    AS ENUM ('form', 'whatsapp', 'email_reveal');
CREATE TYPE contact_status    AS ENUM ('new', 'contacted', 'closed');
CREATE TYPE commission_status AS ENUM ('none', 'pending', 'confirmed', 'paid');

-- ============================================================
-- COMMUNITIES
-- ============================================================
CREATE TABLE communities (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           TEXT UNIQUE NOT NULL,
  name_en        TEXT NOT NULL,
  name_es        TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_es TEXT NOT NULL DEFAULT '',
  image_url      TEXT NOT NULL DEFAULT '',
  coordinates    JSONB NOT NULL DEFAULT '{"lat": 10.6, "lng": -85.4}',
  active         BOOLEAN NOT NULL DEFAULT true,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_communities_slug   ON communities(slug);
CREATE INDEX idx_communities_active ON communities(active);

-- ============================================================
-- AGENTS
-- ============================================================
CREATE TABLE agents (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT UNIQUE NOT NULL,
  full_name        TEXT NOT NULL,
  photo_url        TEXT NOT NULL DEFAULT '',
  title_en         TEXT NOT NULL DEFAULT '',
  title_es         TEXT NOT NULL DEFAULT '',
  bio_en           TEXT NOT NULL DEFAULT '',
  bio_es           TEXT NOT NULL DEFAULT '',
  email            TEXT NOT NULL,
  phone            TEXT NOT NULL DEFAULT '',
  whatsapp         TEXT NOT NULL DEFAULT '',
  languages        TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER NOT NULL DEFAULT 0,
  linkedin_url     TEXT,
  active           BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_slug   ON agents(slug);
CREATE INDEX idx_agents_active ON agents(active);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE properties (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug_en             TEXT UNIQUE NOT NULL,
  slug_es             TEXT UNIQUE NOT NULL,
  title_en            TEXT NOT NULL,
  title_es            TEXT NOT NULL,
  description_en      TEXT NOT NULL DEFAULT '',
  description_es      TEXT NOT NULL DEFAULT '',
  price_usd           NUMERIC(12,2) NOT NULL,
  type                property_type NOT NULL,
  status              property_status NOT NULL DEFAULT 'draft',
  featured            BOOLEAN NOT NULL DEFAULT false,
  community_id        UUID REFERENCES communities(id) ON DELETE SET NULL,
  agent_id            UUID REFERENCES agents(id) ON DELETE SET NULL,
  bedrooms            INTEGER,
  bathrooms           INTEGER,
  area_m2             NUMERIC(10,2) NOT NULL DEFAULT 0,
  construction_m2     NUMERIC(10,2),
  year_built          INTEGER,
  legal_status        TEXT,
  hoa_fees            NUMERIC(10,2),
  coordinates         JSONB NOT NULL DEFAULT '{"lat": 10.6, "lng": -85.4}',
  amenities           JSONB NOT NULL DEFAULT '{}',
  meta_title_en       TEXT,
  meta_title_es       TEXT,
  meta_description_en TEXT,
  meta_description_es TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_slug_en   ON properties(slug_en);
CREATE INDEX idx_properties_slug_es   ON properties(slug_es);
CREATE INDEX idx_properties_status    ON properties(status);
CREATE INDEX idx_properties_featured  ON properties(featured);
CREATE INDEX idx_properties_community ON properties(community_id);
CREATE INDEX idx_properties_agent     ON properties(agent_id);
CREATE INDEX idx_properties_type      ON properties(type);
CREATE INDEX idx_properties_price     ON properties(price_usd);
CREATE INDEX idx_properties_created   ON properties(created_at DESC);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- PROPERTY_IMAGES
-- ============================================================
CREATE TABLE property_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_images_property ON property_images(property_id, sort_order);

-- ============================================================
-- BLOG_POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug_en          TEXT UNIQUE NOT NULL,
  slug_es          TEXT UNIQUE NOT NULL,
  title_en         TEXT NOT NULL,
  title_es         TEXT NOT NULL,
  content_en       TEXT NOT NULL DEFAULT '',
  content_es       TEXT NOT NULL DEFAULT '',
  excerpt_en       TEXT NOT NULL DEFAULT '',
  excerpt_es       TEXT NOT NULL DEFAULT '',
  cover_image_url  TEXT NOT NULL DEFAULT '',
  category         TEXT NOT NULL DEFAULT '',
  author_id        UUID REFERENCES agents(id) ON DELETE SET NULL,
  meta_title       TEXT,
  meta_description TEXT,
  status           blog_status NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug_en      ON blog_posts(slug_en);
CREATE INDEX idx_blog_posts_slug_es      ON blog_posts(slug_es);
CREATE INDEX idx_blog_posts_status       ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- ============================================================
-- CONTACTS (leads)
-- ============================================================
CREATE TABLE contacts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id       UUID REFERENCES properties(id) ON DELETE SET NULL,
  agent_id          UUID REFERENCES agents(id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  message           TEXT NOT NULL DEFAULT '',
  source            contact_source NOT NULL DEFAULT 'form',
  status            contact_status NOT NULL DEFAULT 'new',
  commission_status commission_status NOT NULL DEFAULT 'none',
  commission_notes  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_status     ON contacts(status);
CREATE INDEX idx_contacts_source     ON contacts(source);
CREATE INDEX idx_contacts_agent      ON contacts(agent_id);
CREATE INDEX idx_contacts_property   ON contacts(property_id);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- ============================================================
-- SITE_CONFIG
-- ============================================================
CREATE TABLE site_config (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key   TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT 'null'
);

CREATE INDEX idx_site_config_key ON site_config(key);
