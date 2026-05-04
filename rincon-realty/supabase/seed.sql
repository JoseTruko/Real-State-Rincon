-- ============================================================
-- Rincón Realty — Seed de datos iniciales
-- Ejecutar después de las migraciones
-- ============================================================

-- ============================================================
-- SITE_CONFIG — configuración global del sitio
-- ============================================================
INSERT INTO site_config (key, value) VALUES
  ('site_name',           '"Rincón Realty"'),
  ('site_description_en', '"Luxury real estate in Guanacaste & Rincón de la Vieja, Costa Rica"'),
  ('site_description_es', '"Bienes raíces de lujo en Guanacaste y Rincón de la Vieja, Costa Rica"'),
  ('contact_email',       '""'),
  ('contact_phone',       '""'),
  ('whatsapp_number',     '""'),
  ('facebook_url',        '""'),
  ('instagram_url',       '""'),
  ('canonical_url',       '""'),
  ('meta_description_en', '"Find your dream property in Costa Rica — houses, land & farms for sale in Guanacaste."'),
  ('meta_description_es', '"Encuentra tu propiedad ideal en Costa Rica — casas, terrenos y fincas en venta en Guanacaste."')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- COMMUNITIES — comunidades de ejemplo
-- ============================================================
INSERT INTO communities (slug, name_en, name_es, description_en, description_es, image_url, coordinates, active, sort_order) VALUES
  (
    'guanacaste',
    'Guanacaste',
    'Guanacaste',
    'The Gold Coast of Costa Rica — known for its stunning Pacific beaches, dry tropical forests, and world-class surf. A top destination for international buyers seeking luxury homes and investment properties.',
    'La Costa de Oro de Costa Rica — conocida por sus impresionantes playas del Pacífico, bosques tropicales secos y surf de clase mundial. Un destino top para compradores internacionales.',
    '',
    '{"lat": 10.6, "lng": -85.4}',
    true,
    1
  ),
  (
    'rincon-de-la-vieja',
    'Rincón de la Vieja',
    'Rincón de la Vieja',
    'A volcanic paradise in the highlands of Guanacaste. Home to hot springs, waterfalls, and lush rainforest. Ideal for eco-farms, ranches, and those seeking a tranquil retreat close to nature.',
    'Un paraíso volcánico en las tierras altas de Guanacaste. Hogar de aguas termales, cascadas y exuberante selva tropical. Ideal para eco-fincas y quienes buscan un retiro tranquilo.',
    '',
    '{"lat": 10.83, "lng": -85.32}',
    true,
    2
  ),
  (
    'liberia',
    'Liberia',
    'Liberia',
    'The capital of Guanacaste province and gateway to the region. With its international airport, modern amenities, and proximity to beaches and national parks, Liberia is a strategic location for real estate investment.',
    'La capital de la provincia de Guanacaste y puerta de entrada a la región. Con su aeropuerto internacional y proximidad a playas y parques nacionales, Liberia es una ubicación estratégica.',
    '',
    '{"lat": 10.63, "lng": -85.44}',
    true,
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AGENTS — agente de ejemplo
-- ============================================================
INSERT INTO agents (slug, full_name, photo_url, title_en, title_es, bio_en, bio_es, email, phone, whatsapp, languages, years_experience, active) VALUES
  (
    'maria-gonzalez',
    'María González',
    '',
    'Senior Real Estate Agent',
    'Agente Inmobiliaria Senior',
    'With over 10 years of experience in the Guanacaste real estate market, María specializes in helping international buyers find their perfect property in Costa Rica. Fluent in English and Spanish.',
    'Con más de 10 años de experiencia en el mercado inmobiliario de Guanacaste, María se especializa en ayudar a compradores internacionales a encontrar su propiedad ideal en Costa Rica.',
    'maria@rinconrealty.com',
    '+506 8888-0001',
    '50688880001',
    ARRAY['English', 'Spanish'],
    10,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PROPERTIES — propiedades de ejemplo
-- (Requiere que las comunidades y agentes anteriores existan)
-- ============================================================
DO $$
DECLARE
  v_community_guanacaste UUID;
  v_community_rincon     UUID;
  v_agent_id             UUID;
BEGIN
  SELECT id INTO v_community_guanacaste FROM communities WHERE slug = 'guanacaste';
  SELECT id INTO v_community_rincon     FROM communities WHERE slug = 'rincon-de-la-vieja';
  SELECT id INTO v_agent_id             FROM agents WHERE slug = 'maria-gonzalez';

  -- Propiedad 1: Casa en Guanacaste
  INSERT INTO properties (
    slug_en, slug_es, title_en, title_es,
    description_en, description_es,
    price_usd, type, status, featured,
    community_id, agent_id,
    bedrooms, bathrooms, area_m2, construction_m2,
    coordinates, amenities
  ) VALUES (
    'ocean-view-villa-guanacaste',
    'villa-vista-al-mar-guanacaste',
    'Ocean View Villa in Guanacaste',
    'Villa con Vista al Mar en Guanacaste',
    'Stunning 3-bedroom villa with panoramic ocean views, private pool, and direct beach access. Located in a gated community with 24/7 security.',
    'Impresionante villa de 3 habitaciones con vistas panorámicas al océano, piscina privada y acceso directo a la playa. Ubicada en comunidad cerrada con seguridad 24/7.',
    450000, 'house', 'published', true,
    v_community_guanacaste, v_agent_id,
    3, 3, 1200, 280,
    '{"lat": 10.58, "lng": -85.68}',
    '{"pool": true, "ocean_view": true, "gated": true, "ac": true}'
  ) ON CONFLICT (slug_en) DO NOTHING;

  -- Propiedad 2: Terreno en Rincón de la Vieja
  INSERT INTO properties (
    slug_en, slug_es, title_en, title_es,
    description_en, description_es,
    price_usd, type, status, featured,
    community_id, agent_id,
    area_m2,
    coordinates, amenities
  ) VALUES (
    'mountain-land-rincon-de-la-vieja',
    'terreno-montaña-rincon-de-la-vieja',
    'Mountain Land in Rincón de la Vieja',
    'Terreno de Montaña en Rincón de la Vieja',
    'Beautiful 5-hectare land parcel with mountain views, natural spring, and mature trees. Perfect for an eco-lodge or private retreat.',
    'Hermosa parcela de 5 hectáreas con vistas a la montaña, manantial natural y árboles maduros. Perfecta para un eco-lodge o retiro privado.',
    180000, 'land', 'published', true,
    v_community_rincon, v_agent_id,
    50000,
    '{"lat": 10.85, "lng": -85.30}',
    '{"mountain_view": true, "water_well": true}'
  ) ON CONFLICT (slug_en) DO NOTHING;

  -- Propiedad 3: Finca en Guanacaste
  INSERT INTO properties (
    slug_en, slug_es, title_en, title_es,
    description_en, description_es,
    price_usd, type, status, featured,
    community_id, agent_id,
    bedrooms, bathrooms, area_m2, construction_m2,
    coordinates, amenities
  ) VALUES (
    'working-farm-guanacaste',
    'finca-productiva-guanacaste',
    'Working Farm in Guanacaste',
    'Finca Productiva en Guanacaste',
    'A 20-hectare working farm with cattle, fruit trees, and a comfortable 4-bedroom farmhouse. Includes water rights and road access.',
    'Finca productiva de 20 hectáreas con ganado, árboles frutales y una cómoda casa de campo de 4 habitaciones. Incluye derechos de agua y acceso por carretera.',
    320000, 'farm', 'published', false,
    v_community_guanacaste, v_agent_id,
    4, 2, 200000, 350,
    '{"lat": 10.62, "lng": -85.42}',
    '{"water_well": true, "generator": true}'
  ) ON CONFLICT (slug_en) DO NOTHING;
END $$;
