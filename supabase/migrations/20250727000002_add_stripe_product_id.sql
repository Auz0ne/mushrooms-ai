/*
  # Add Stripe product ID mapping to products table

  This migration adds a stripe_product_id column to the products table
  to enable direct mapping between Supabase products and Stripe products.

  This will replace the complex name-based matching with direct ID matching.
*/

-- Add stripe_product_id column to products table
ALTER TABLE products ADD COLUMN stripe_product_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_stripe_product_id ON products(stripe_product_id);

-- Add comment for documentation
COMMENT ON COLUMN products.stripe_product_id IS 'Direct mapping to Stripe product ID for checkout integration'; 