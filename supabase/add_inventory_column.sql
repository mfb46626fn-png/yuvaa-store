-- Add inventory column to products table if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS inventory INTEGER DEFAULT 0;

-- Refresh the schema cache (optional, but good practice if Supabase creates issues)
NOTIFY pgrst, 'reload config';
