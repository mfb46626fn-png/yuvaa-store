-- ==============================================================================
-- 8. FIX CATEGORY STORAGE (Permission Safe)
-- ==============================================================================

-- 1. Create storage bucket for categories (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- NOTE: We removed 'ALTER TABLE storage.objects ENABLE RLS' because it requires superuser/owner permissions at a level potentially restricted in the SQL Editor. 
-- Supabase Storage usually has RLS enabled by default.

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- 3. Policy: Public Read Access (Everyone)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'categories' );

-- 4. Policy: Authenticated User Upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'categories' );

-- 5. Policy: Authenticated User Update/Delete
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'categories' );

CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'categories' );
