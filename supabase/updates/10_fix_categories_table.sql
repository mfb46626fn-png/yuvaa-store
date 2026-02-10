-- ==============================================================================
-- 10. FIX CATEGORIES TABLE (Add Missing Columns)
-- ==============================================================================

-- 1. Add 'description' column if it doesn't exist
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS description text;

-- 2. Add 'image_url' column if it doesn't exist (Just in case)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url text;

-- 3. Now safely make them nullable (in case they were set to NOT NULL)
ALTER TABLE categories ALTER COLUMN image_url DROP NOT NULL;
ALTER TABLE categories ALTER COLUMN description DROP NOT NULL;

-- 4. Ensure slug is unique
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_slug_key') THEN
        ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);
    END IF;
END $$;
