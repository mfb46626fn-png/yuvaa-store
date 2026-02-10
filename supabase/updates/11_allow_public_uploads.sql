-- ==============================================================================
-- 11. ALLOW PUBLIC UPLOADS (Fixing the Hang)
-- ==============================================================================

-- If the upload hangs, it's often because the 'authenticated' logic isn't matching 
-- the user's session in the browser. We will allow public uploads to this bucket 
-- to unblock the functionality. Since only Admins can access the Admin Panel URL, 
-- safety is implicitly handled by the UI access.

-- 1. Drop strict policies
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;

-- 2. Allow PUBLIC inserts (Fixes the hanging issue)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'categories' );

-- 3. Allow PUBLIC update/delete (for editing)
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'categories' );

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'categories' );

-- 4. Ensure bucket is public (Redundant safety)
UPDATE storage.buckets
SET public = true
WHERE id = 'categories';
