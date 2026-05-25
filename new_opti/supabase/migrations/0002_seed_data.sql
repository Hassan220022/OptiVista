-- ==========================================================================
-- OptiVista — Seed Data
-- Run AFTER 0001_init.sql on a fresh Supabase instance
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. Categories
-- --------------------------------------------------------------------------
insert into public.categories (id, name, slug, description, gender, sort_order) values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sunglasses',       'sunglasses',       'Protective eyewear for sunlight',             'unisex', 1),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Reading Glasses',   'reading-glasses',   'Eyewear for reading text at close range',     'unisex', 2),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Blue Light Glasses','blue-light-glasses','Protect eyes from digital screens',            'unisex', 3),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Sports Glasses',    'sports-glasses',    'Eyewear for sports activities',               'unisex', 4),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Designer Glasses',  'designer-glasses',  'High-end fashion eyewear',                    'unisex', 5);

-- --------------------------------------------------------------------------
-- 2. Products
-- --------------------------------------------------------------------------
insert into public.products (id, name, slug, category_id, brand, description, frame_type, frame_material, frame_color, lens_width_mm, bridge_width_mm, temple_length_mm, price_cents, thumbnail_url, ar_enabled, stock_quantity, avg_rating) values
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'Classic Aviator',       'classic-aviator',       'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ray-Ban',  'Classic aviator sunglasses with timeless style',       'Aviator',   'Metal',   'Gold',    140, 18, 135, 9999,  '/products/aviator.jpg',       true,  10, 4.5),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'Wayfarer',              'wayfarer',              'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ray-Ban',  'Popular style of sunglasses',                          'Wayfarer',  'Plastic',  'Tortoise', 140, 20, 140, 8999,  '/products/wayfarer.jpg',      false, 15, 4.2),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', 'Reading Glasses Model A','reading-glasses-a',     'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Generic',  'Basic reading glasses',                                 'Rectangle', 'Plastic',  'Black',    130, 18, 135, 2999,  '/products/readA.jpg',         false, 30, 3.8),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', 'Reading Glasses Model B','reading-glasses-b',     'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Generic',  'Round reading glasses',                                 'Round',     'Metal',    'Blue',     130, 20, 140, 3550,  '/products/readB.jpg',         false, 20, 4.0),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b05', 'Blue Light Blocker',   'blue-light-blocker',    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Generic',  'Protects eyes from blue light',                         'Wayfarer',  'Plastic',  'Black',    140, 20, 140, 4999,  '/products/bluelight.jpg',     true,  25, 4.3),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b06', 'Designer Luxury',       'designer-luxury',       'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Gucci',    'High-end designer glasses',                             'Cat-Eye',   'Metal',    'Rose Gold', 140, 20, 140, 19999, '/products/luxury.jpg',        false, 5,  4.8);

-- --------------------------------------------------------------------------
-- 3. AR Assets (for AR-enabled products)
-- --------------------------------------------------------------------------
insert into public.ar_assets (product_id, supabase_path_ar_model, supabase_path_texture, scale_factor, offset_y) values
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'models/aviator/aviator.glb',   'models/aviator/texture.png', 1.000, 0.050),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b05', 'models/bluelight/bluelight.glb', null,                        1.000, 0.030);

-- --------------------------------------------------------------------------
-- 4. Admin user (create via Supabase Auth, then set role)
--    IMPORTANT: You must create this user via Supabase Auth first:
--      Email: admin@optivista.com
--      Password: (set via Supabase dashboard or API)
--    Then run the UPDATE below to promote to admin.
-- --------------------------------------------------------------------------
-- After creating the auth user, uncomment and set the actual UUID:
-- update public.profiles set role = 'admin', full_name = 'Admin User'
--   where id = '<admin-user-uuid>';

-- --------------------------------------------------------------------------
-- End of seed data
-- ==========================================================================