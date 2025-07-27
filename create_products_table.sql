-- Create products table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  main_ingredient text NOT NULL,
  format text NOT NULL,
  pills_per_container integer NOT NULL,
  daily_dose text NOT NULL,
  use_instructions text NOT NULL,
  key_benefits text[] NOT NULL,
  short_description text NOT NULL,
  certifications_notes text NOT NULL,
  price decimal(10,2) NOT NULL,
  mushroom_id uuid REFERENCES mushrooms(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Insert the product data with mushroom relationships
INSERT INTO products (name, main_ingredient, format, pills_per_container, daily_dose, use_instructions, key_benefits, short_description, certifications_notes, price, mushroom_id) VALUES
  ('Reishi Immune Calm', 'Reishi extract', 'Capsules', 60, '2 capsules (1,000mg)', 'Take 2 capsules at night for 30 days', ARRAY['Immunity', 'stress', 'restful sleep'], 'Premium Reishi for immunity & nighttime calm', 'Fruiting body, dual-extract, vegan, lab tested', 34.99, (SELECT id FROM mushrooms WHERE name ILIKE '%reishi%' LIMIT 1)),
  ('Lion''s Mane Focus', 'Lion''s Mane extract', 'Capsules', 60, '2 capsules (1,000mg)', 'Take 2 capsules with breakfast for 30 days', ARRAY['Focus', 'cognition', 'memory'], 'Pure Lion''s Mane for mental clarity & brain health', 'Fruiting body, organic, vegan, lab tested', 29.99, (SELECT id FROM mushrooms WHERE name ILIKE '%lion%mane%' LIMIT 1)),
  ('Cordyceps Vitality', 'Cordyceps extract', 'Capsules', 60, '2 capsules (1,200mg)', 'Take 2 capsules in the AM for 30 days', ARRAY['Energy', 'stamina', 'workout support'], 'Energizing Cordyceps for natural endurance', 'Dual-extract, no fillers, third-party tested', 39.99, (SELECT id FROM mushrooms WHERE name ILIKE '%cordyceps%' LIMIT 1)),
  ('Chaga Antioxidant', 'Chaga extract', 'Capsules', 60, '2 capsules (1,000mg)', 'Take 2 capsules with morning beverage for 30 days', ARRAY['Antioxidants', 'skin', 'immunity'], 'Wild-harvested Chaga for balanced immunity', 'Sustainably sourced, lab tested, organic', 32.99, (SELECT id FROM mushrooms WHERE name ILIKE '%chaga%' LIMIT 1)),
  ('Maitake Wellness', 'Maitake extract', 'Capsules', 60, '2 capsules (1,000mg)', '2 capsules daily with breakfast for 30 days', ARRAY['Metabolism', 'blood sugar', 'immunity'], 'Maitake for metabolic, blood sugar, and immune support', 'Fruiting body only, organic, GMP', 31.99, (SELECT id FROM mushrooms WHERE name ILIKE '%maitake%' LIMIT 1)),
  ('Shiitake Digestive', 'Shiitake extract', 'Capsules', 60, '2 capsules (1,000mg)', '2 capsules daily or add to meals for 30 days', ARRAY['Heart', 'digestion', 'immune'], 'Shiitake mushroom for heart & gut health', 'Organic, no fillers, lab verified', 26.99, (SELECT id FROM mushrooms WHERE name ILIKE '%shiitake%' LIMIT 1)),
  ('Turkey Tail Defend', 'Turkey Tail extract', 'Capsules', 60, '2 capsules (1,000mg)', '1 capsule AM & 1 PM for 30 days', ARRAY['Immunity', 'gut health', 'resilience'], 'Turkey Tail for microbiome & immune support', 'Fruiting body, organic, high beta-glucans', 27.99, (SELECT id FROM mushrooms WHERE name ILIKE '%turkey%tail%' LIMIT 1)),
  ('Tremella Beauty', 'Tremella extract', 'Capsules', 60, '2 capsules (1,000mg)', '2 capsules daily, anytime for 30 days', ARRAY['Skin hydration', 'beauty', 'anti-aging'], 'Tremella for radiant skin & youthfulness', 'Fruiting body, vegan, ISO/GMP lab tested', 28.99, (SELECT id FROM mushrooms WHERE name ILIKE '%tremella%' LIMIT 1)),
  ('Agaricus Blazei Protect', 'Agaricus blazei extract', 'Capsules', 60, '2 capsules (1,000mg)', '2 capsules AM for 30 days', ARRAY['Immunity', 'anti-stress', 'resilience'], 'Agaricus blazei for immune & vitality support', 'Fruiting body, specialist supplier', 33.99, (SELECT id FROM mushrooms WHERE name ILIKE '%agaricus%' LIMIT 1)),
  ('Poria Serenity', 'Poria extract', 'Capsules', 60, '2 capsules (1,000mg)', '2 capsules at night for 30 days', ARRAY['Calm', 'sleep', 'digestion'], 'Poria for sleep and digestive comfort', 'Sourced from TCM, lab tested, vegan', 30.99, (SELECT id FROM mushrooms WHERE name ILIKE '%poria%' LIMIT 1)),
  ('King Trumpet Boost', 'King Trumpet extract', 'Capsules', 60, '2 capsules (1,000mg)', '2 capsules daily for 30 days', ARRAY['Heart', 'antioxidant', 'circulation'], 'King Trumpet for heart and performance support', 'Fruiting body, organic, tested in EU/USA', 29.99, (SELECT id FROM mushrooms WHERE name ILIKE '%king%trumpet%' LIMIT 1)),
  ('Enoki Gut Harmony', 'Enoki extract', 'Capsules', 60, '2 capsules (1,000mg)', '2 capsules with lunch for 30 days', ARRAY['Gut', 'immunity', 'overall wellness'], 'Enoki for gut health and immune resilience', 'Whole mushroom, organic source', 25.99, (SELECT id FROM mushrooms WHERE name ILIKE '%enoki%' LIMIT 1)),
  ('Mesima Balance', 'Mesima extract', 'Capsules', 30, '1 capsule (500mg)', '1 capsule daily in AM for 30 days', ARRAY['Immune support', 'liver health'], 'Mesima mushroom extract for immune & liver balance', 'TCM specialist grade, verified purity', 35.99, (SELECT id FROM mushrooms WHERE name ILIKE '%mesima%' LIMIT 1)),
  ('Polyporus Detox', 'Polyporus extract', 'Capsules', 60, '2 capsules (1,000mg)', '2 capsules in AM with water for 30 days', ARRAY['Detox', 'fluid balance', 'kidney support'], 'Polyporus for gentle detox and kidney support', 'Fruiting body, batch-tested, TCM certified', 36.99, (SELECT id FROM mushrooms WHERE name ILIKE '%polyporus%' LIMIT 1));

-- Create indexes for better query performance
CREATE INDEX idx_products_mushroom_id ON products(mushroom_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_key_benefits ON products USING GIN(key_benefits); 