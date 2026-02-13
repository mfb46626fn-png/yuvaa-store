-- Create order-uploads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-uploads', 'order-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can upload (since users might be guests)
-- Ideally authenticated, but for guest checkout we allow analytics/anon uploads
CREATE POLICY "Anyone can upload order files"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'order-uploads' );

-- Policy: Anyone can read (so admin can download, and user can see preview)
CREATE POLICY "Anyone can view order files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'order-uploads' );
