-- Migration to add filtering columns for category pages
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS orientation text,
ADD COLUMN IF NOT EXISTS tone text,
ADD COLUMN IF NOT EXISTS has_frame boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS size_category text;

-- Add comments for clarity
COMMENT ON COLUMN public.products.orientation IS 'e.g. Yatay, Dikey, Kare';
COMMENT ON COLUMN public.products.tone IS 'e.g. Açık Ton, Koyu Ton, Ahşap, Ceviz vs.';
COMMENT ON COLUMN public.products.size_category IS 'e.g. Küçük, Orta, Büyük';
