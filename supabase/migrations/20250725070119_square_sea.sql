/*
  # Capitalize Effects Migration

  1. Updates
    - Capitalize the first letter of all effects in `expected_effects` array
    - Capitalize the first letter of all effects in `impact_on_life` array

  2. Changes
    - Uses PostgreSQL array functions to transform each element
    - Applies proper capitalization while preserving the rest of the text
*/

-- Update expected_effects to capitalize first letter of each effect
UPDATE mushrooms 
SET expected_effects = (
  SELECT array_agg(
    CASE 
      WHEN length(trim(effect)) > 0 
      THEN initcap(lower(trim(effect)))
      ELSE effect
    END
  )
  FROM unnest(expected_effects) AS effect
)
WHERE expected_effects IS NOT NULL;

-- Update impact_on_life to capitalize first letter of each effect
UPDATE mushrooms 
SET impact_on_life = (
  SELECT array_agg(
    CASE 
      WHEN length(trim(effect)) > 0 
      THEN initcap(lower(trim(effect)))
      ELSE effect
    END
  )
  FROM unnest(impact_on_life) AS effect
)
WHERE impact_on_life IS NOT NULL;