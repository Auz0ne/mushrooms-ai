/*
  # Create mushrooms table

  1. New Tables
    - `mushrooms`
      - `id` (uuid, primary key)
      - `name` (text, mushroom name)
      - `scientific_name` (text, scientific name)
      - `region_medicine` (text, region and traditional medicine info)
      - `expected_effects` (text[], array of expected effects/tags)
      - `story_behind_consumption` (text, historical/cultural story)
      - `impact_on_life` (text[], array of life impact tags)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `mushrooms` table
    - Add policy for public read access (since this is product data)
*/

CREATE TABLE IF NOT EXISTS mushrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  scientific_name text,
  region_medicine text,
  expected_effects text[],
  story_behind_consumption text,
  impact_on_life text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mushrooms ENABLE ROW LEVEL SECURITY;

-- Allow public read access to mushrooms data
CREATE POLICY "Anyone can read mushrooms"
  ON mushrooms
  FOR SELECT
  TO public
  USING (true);

-- Insert the mushroom data
INSERT INTO mushrooms (name, scientific_name, region_medicine, expected_effects, story_behind_consumption, impact_on_life) VALUES
('Reishi', 'Ganoderma lucidum', 'East Asia, TCM, Japan', ARRAY['Immunity', 'stress relief', 'adaptogen'], 'Known as "mushroom of immortality," revered in China and Japan for longevity; centuries-old herbal staple', ARRAY['Immunity boost', 'calm', 'vitality']),
('Lion''s Mane', 'Hericium erinaceus', 'East Asia, Western biohacking', ARRAY['Brain health', 'focus', 'gut health'], 'Used for nerve growth and cognitive health in traditional Asian medicine; popular modern nootropic', ARRAY['Better focus', 'memory', 'neuroprotection']),
('Cordyceps', 'Ophiocordyceps sinensis', 'Tibet, China, TCM', ARRAY['Stamina', 'energy', 'athletic support'], 'Sacred tonic for Chinese royalty; linked to enhanced vitality, endurance, and athletic performance', ARRAY['Endurance', 'stamina', 'energy']),
('Chaga', 'Inonotus obliquus', 'Siberia, Russia, Nordics', ARRAY['Antioxidant', 'immune', 'anti-aging'], 'Folk remedy and daily elixir in Russian and Nordic cultures; "King of Medicinal Mushrooms"', ARRAY['Antioxidant', 'resilience', 'wellness']),
('Maitake', 'Grifola frondosa', 'Japan, China, US', ARRAY['Metabolic health', 'immunity'], '"Dancing mushroom" celebrated in Japan; prized for health and in cuisine', ARRAY['Metabolism', 'immune support']),
('Shiitake', 'Lentinula edodes', 'East Asia, global', ARRAY['Immune', 'cholesterol', 'digestion'], 'Culinary mainstay and medicine in China and Japan; contains lentinan, studied in cancer therapy', ARRAY['Heart health', 'immunity', 'gut health']),
('Turkey Tail', 'Trametes versicolor', 'Asia, US, EU, TCM', ARRAY['Immunity', 'anti-cancer', 'gut health'], 'Named for shape/color; used in Japanese and Chinese medicine and as a cancer therapy adjunct', ARRAY['Cancer support', 'immunity', 'digestion']),
('Tremella', 'Tremella fuciformis', 'China, East Asia', ARRAY['Skin hydration', 'beauty', 'anti-aging'], 'Long-revered in Chinese beauty and longevity tonics; Empress Yang Guifei legend', ARRAY['Skin glow', 'youthfulness', 'hydration']),
('Agaricus blazei', 'Agaricus subrufescens', 'Brazil, Japan', ARRAY['Immunity', 'anti-tumor', 'anti-stress'], '"Mushroom of the sun," found in Brazil, adopted in Japanese wellness and cancer care', ARRAY['Wellness', 'resilience', 'anti-tumor']),
('Poria', 'Wolfiporia extensa', 'China, TCM', ARRAY['Diuretic', 'calm', 'digestion'], 'Classic ingredient in Chinese calming and digestive blends', ARRAY['Calm', 'sleep', 'digestive improvement']),
('King Trumpet', 'Pleurotus eryngii', 'Mediterranean, Asia', ARRAY['Antioxidant', 'heart health', 'immune'], 'Consumed in Mediterranean cuisine, prized for statins and antioxidants', ARRAY['Heart health', 'antioxidant', 'immune']),
('Enoki', 'Flammulina velutipes', 'East Asia, global', ARRAY['Immunity', 'gut', 'antioxidant'], 'Used in Asian soup recipes and medicine; associated with lower cancer rates in Japanese regions', ARRAY['Gut health', 'immunity', 'wellness']),
('Oyster', 'Pleurotus ostreatus', 'Global (culinary/medicinal)', ARRAY['Anti-inflammatory', 'immunity'], 'Widely cultivated for culinary use; recognized for protein and bioactive compounds', ARRAY['Nutrition', 'immunity', 'recovery']),
('Mesima', 'Phellinus linteus', 'Korea, Japan, TCM', ARRAY['Anti-tumor', 'immunity', 'liver health'], 'Esteemed in East Asian medicine for tumor and immune support', ARRAY['Cancer support', 'immune boost']),
('Polyporus', 'Polyporus umbellatus', 'China, Japan, TCM', ARRAY['Diuretic', 'immune regulation', 'detox'], 'Used for supporting fluid balance, kidney health in traditional medicine', ARRAY['Detoxification', 'calm', 'wellness']),
('Blazei Murill', 'Agaricus blazei Murill', 'Brazil, Japan', ARRAY['Immunity', 'stress', 'anti-inflammatory'], 'Discovered in Brazil, brought to Japan for cancer support', ARRAY['Mental resilience', 'immunity']);