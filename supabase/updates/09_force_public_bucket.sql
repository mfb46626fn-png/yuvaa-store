-- ==============================================================================
-- 9. FORCE PUBLIC BUCKET (Clean & Safe)
-- ==============================================================================

-- 1. Force the bucket to be public (Update if exists)
UPDATE storage.buckets
SET public = true
WHERE id = 'categories';

-- 2. Insert if it somehow doesn't exist (Safety net)
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Re-verify Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'categories' );

-- NOTE: Removed ALTER TABLE command as it causes permission errors.
-- Storage RLS is enabled by default on Supabase projects.
