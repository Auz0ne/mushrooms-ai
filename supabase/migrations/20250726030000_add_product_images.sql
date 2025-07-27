/*
  # Add image_url column to products table

  1. Add column
    - `image_url` (text) - URL to product image in Supabase Storage

  2. Update existing products with placeholder image URLs
*/

-- Add image_url column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;

-- Update existing products with placeholder image URLs
-- You can replace these with actual Supabase Storage URLs
UPDATE products SET image_url = 'https://images.pexels.com/photos/8142034/pexels-photo-8142034.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE image_url IS NULL; 