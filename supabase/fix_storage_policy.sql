-- 1. Create the 'products' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid conflicts (Safe to run if they don't exist)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to products" ON storage.objects; -- Drop potential old policies

-- 3. Allow public access to view files in the 'products' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- 4. Allow authenticated users to upload files to the 'products' bucket
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'products' );

-- 5. Allow authenticated users to update files in the 'products' bucket
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'products' );

-- 6. Allow authenticated users to delete files in the 'products' bucket
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'products' );
