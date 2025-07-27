/*
  # Create archetypes table

  1. New Tables
    - `archetypes`
      - `id` (uuid, primary key)
      - `bundle_name` (text, unique)
      - `mushrooms_included` (text array)
      - `user_objective` (text)
      - `archetype` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `archetypes` table
    - Add policy for public read access

  3. Initial Data
    - Insert the 6 archetype bundles with their mushroom combinations
*/

CREATE TABLE IF NOT EXISTS archetypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_name text UNIQUE NOT NULL,
  mushrooms_included text[] NOT NULL,
  user_objective text NOT NULL,
  archetype text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE archetypes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read archetypes"
  ON archetypes
  FOR SELECT
  TO public
  USING (true);

-- Insert the archetype data
INSERT INTO archetypes (bundle_name, mushrooms_included, user_objective, archetype) VALUES
  ('Cognitive Power & Focus', ARRAY['Lion''s Mane', 'Cordyceps', 'Reishi'], 'Students, professionals, focus, brain health, sustained mental energy', 'Mentalist'),
  ('Immunity & Wellness Protection', ARRAY['Reishi', 'Turkey Tail', 'Chaga'], 'Year-round immune defense, illness resilience, recovery support', 'Guardian'),
  ('Energy, Vitality & Fitness', ARRAY['Cordyceps', 'King Trumpet', 'Maitake'], 'Athletes, gym-goers, active individuals, physical performance', 'Athlete'),
  ('Beauty, Skin & Longevity', ARRAY['Tremella', 'Chaga', 'Shiitake'], 'Beauty, skin wellness, anti-aging support', 'Radiant'),
  ('Calm, Stress Relief & Sleep', ARRAY['Reishi', 'Poria', 'Maitake'], 'Stress management, calm, sleep quality, emotional balance', 'Zen Seeker'),
  ('Digestive & Gut Health', ARRAY['Shiitake', 'Turkey Tail', 'Enoki'], 'Gut health, digestion, microbiome balance', 'Gut Guru');