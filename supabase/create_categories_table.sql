-- 1. Create categories table if not exists
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Everyone can read
DROP POLICY IF EXISTS "Public categories read access" ON public.categories;
CREATE POLICY "Public categories read access" ON public.categories FOR SELECT USING (true);

-- Only authenticated users (admins) can Insert/Update/Delete
DROP POLICY IF EXISTS "Auth categories write access" ON public.categories;
CREATE POLICY "Auth categories write access" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Populate with initial data from constants (to avoid empty state)
INSERT INTO public.categories (title, slug, image_url)
VALUES
    ('Ev Dekorasyon', 'ev-dekorasyon', 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=600&auto=format&fit=crop'),
    ('Mutfak', 'mutfak', 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=600&auto=format&fit=crop'),
    ('Banyo', 'banyo', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop'),
    ('Aydınlatma', 'aydinlatma', 'https://images.unsplash.com/photo-1513506003011-3b03c8b08d54?q=80&w=600&auto=format&fit=crop'),
    ('Tekstil', 'tekstil', 'https://images.unsplash.com/photo-1522771753035-4a5046b86fb8?q=80&w=600&auto=format&fit=crop')
ON CONFLICT (slug) DO UPDATE 
SET title = EXCLUDED.title, image_url = EXCLUDED.image_url;

-- 5. Grant permissions
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
