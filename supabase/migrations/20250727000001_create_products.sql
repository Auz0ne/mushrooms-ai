/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `description` (text, product description)
      - `price` (decimal, product price)
      - `image` (text, product image URL)
      - `mushroom_id` (uuid, foreign key to mushrooms)
      - `format` (text, e.g., 'capsules', 'powder', 'tincture')
      - `pills_per_container` (integer, number of pills)
      - `daily_dose` (text, recommended daily dose)
      - `use_instructions` (text, how to use)
      - `key_benefits` (text[], array of benefits)
      - `short_description` (text, brief description)
      - `certifications_notes` (text, certifications info)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access

  3. Foreign Key
    - Link to mushrooms table via mushroom_id
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image text,
  mushroom_id uuid REFERENCES mushrooms(id),
  format text,
  pills_per_container integer,
  daily_dose text,
  use_instructions text,
  key_benefits text[],
  short_description text,
  certifications_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Insert the 14 products (one for each mushroom, excluding one)
INSERT INTO products (name, description, price, image, mushroom_id, format, pills_per_container, daily_dose, use_instructions, key_benefits, short_description, certifications_notes) VALUES
('Reishi Immune Calm', 'Premium Reishi mushroom supplement for immune support and stress relief', 34.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Reishi'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Immune Support', 'Stress Relief', 'Adaptogen'], 'Premium Reishi for immune health and calm', 'Organic, Non-GMO, Gluten-Free'),
('Lion''s Mane Focus', 'Pure Lion''s Mane for mental clarity and brain health', 29.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Lion''s Mane'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Brain Health', 'Focus', 'Memory'], 'Enhance cognitive function and mental clarity', 'Organic, Non-GMO, Gluten-Free'),
('Cordyceps Vitality', 'Energizing Cordyceps for natural endurance and stamina', 39.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Cordyceps'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Energy', 'Stamina', 'Athletic Support'], 'Boost energy and physical performance', 'Organic, Non-GMO, Gluten-Free'),
('Chaga Antioxidant', 'Wild-harvested Chaga for balanced immunity and antioxidants', 32.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Chaga'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Antioxidants', 'Immune Support', 'Anti-Aging'], 'Powerful antioxidant and immune support', 'Organic, Non-GMO, Gluten-Free'),
('Maitake Wellness', 'Maitake for metabolic health and immune support', 31.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Maitake'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Metabolic Health', 'Immunity', 'Blood Sugar'], 'Support metabolic health and immunity', 'Organic, Non-GMO, Gluten-Free'),
('Shiitake Digestive', 'Shiitake mushroom for heart and gut health', 26.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Shiitake'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Heart Health', 'Digestion', 'Immune'], 'Support heart health and digestion', 'Organic, Non-GMO, Gluten-Free'),
('Turkey Tail Defend', 'Turkey Tail for microbiome and immune support', 27.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Turkey Tail'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Immunity', 'Gut Health', 'Resilience'], 'Comprehensive immune and gut support', 'Organic, Non-GMO, Gluten-Free'),
('Tremella Beauty', 'Tremella for radiant skin and youthfulness', 28.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Tremella'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Skin Hydration', 'Beauty', 'Anti-Aging'], 'Enhance skin hydration and beauty', 'Organic, Non-GMO, Gluten-Free'),
('Agaricus Blazei Protect', 'Agaricus blazei for immune and vitality support', 33.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Agaricus blazei'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Immunity', 'Anti-Stress', 'Resilience'], 'Comprehensive immune and vitality support', 'Organic, Non-GMO, Gluten-Free'),
('Poria Serenity', 'Poria for sleep and digestive comfort', 30.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Poria'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Calm', 'Sleep', 'Digestive'], 'Support calm, sleep, and digestion', 'Organic, Non-GMO, Gluten-Free'),
('King Trumpet Heart', 'King Trumpet for heart health and antioxidants', 29.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'King Trumpet'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Heart Health', 'Antioxidant', 'Immune'], 'Support heart health and antioxidants', 'Organic, Non-GMO, Gluten-Free'),
('Enoki Gut Health', 'Enoki for gut health and immunity', 25.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Enoki'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Gut Health', 'Immunity', 'Wellness'], 'Support gut health and immunity', 'Organic, Non-GMO, Gluten-Free'),
('Oyster Recovery', 'Oyster mushroom for anti-inflammatory and immunity', 24.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Oyster'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Anti-Inflammatory', 'Immunity', 'Recovery'], 'Support recovery and anti-inflammatory response', 'Organic, Non-GMO, Gluten-Free'),
('Mesima Defense', 'Mesima for immune and liver health support', 35.99, 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800', (SELECT id FROM mushrooms WHERE name = 'Mesima'), 'capsules', 60, '2 capsules daily', 'Take 2 capsules daily with food', ARRAY['Anti-Tumor', 'Immunity', 'Liver Health'], 'Comprehensive immune and liver support', 'Organic, Non-GMO, Gluten-Free'); 