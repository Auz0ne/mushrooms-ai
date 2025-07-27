/*
  # Add video_url column to mushrooms table

  1. Changes
    - Add `video_url` column to `mushrooms` table
    - Column is optional (nullable) to allow existing records without videos
    - Uses text type to store video URLs from Supabase Storage

  2. Notes
    - Existing mushroom records will have NULL video_url by default
    - New records can optionally include video URLs
    - Videos should be stored in Supabase Storage and URLs referenced here
*/

-- Add video_url column to mushrooms table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mushrooms' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE mushrooms ADD COLUMN video_url text;
  END IF;
END $$;