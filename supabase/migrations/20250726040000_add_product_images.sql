/*
  # Add image field to products table

  1. Add image column to products table
  2. Update existing products with appropriate images
*/

-- Add image column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS image text;

-- Update products with appropriate images
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Reishi Immune Calm';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Lion''s Mane Focus';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Cordyceps Vitality';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Chaga Antioxidant';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Maitake Wellness';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Shiitake Digestive';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Turkey Tail Defend';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Tremella Beauty';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Agaricus Blazei Protect';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Poria Serenity';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'King Trumpet Boost';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Enoki Gut Harmony';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Mesima Balance';
UPDATE products SET image = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE name = 'Polyporus Detox'; 