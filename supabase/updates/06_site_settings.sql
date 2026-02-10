-- ==============================================================================
-- 6. DYNAMIC LANDING PAGE SETTINGS
-- ==============================================================================

-- 1. Create site_settings table (Singleton pattern)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id integer PRIMARY KEY DEFAULT 1, -- Only one row allowed
    hero_title text DEFAULT 'Evinizin Ruhu: Yuvaa',
    hero_description text DEFAULT 'El yapımı detaylar, doğal dokular ve bohem esintilerle yaşam alanınıza sıcaklık katın.',
    hero_button_text text DEFAULT 'Koleksiyonu Keşfet',
    hero_image_url text DEFAULT '/images/hero-bg.jpg',
    features_config jsonb DEFAULT '[]'::jsonb, -- Future proofing
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 2. Insert default row if not exists
INSERT INTO public.site_settings (id, hero_title, hero_description, hero_button_text, hero_image_url)
VALUES (
    1, 
    'Evinizin Ruhu Yuvaa''yla Yansıtın', 
    'El yapımı detaylar, doğal dokular ve bohem esintilerle yaşam alanınıza sıcaklık katın.',
    'Koleksiyonu Keşfet',
    '/images/hero-bg.jpg'
)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS Policies
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read stats
CREATE POLICY "Site Settings Public Read" ON public.site_settings
FOR SELECT USING (true);

-- Only Admins can update
CREATE POLICY "Site Settings Admin Update" ON public.site_settings
FOR UPDATE USING (public.is_admin() = true);

-- 4. Grant access
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;
