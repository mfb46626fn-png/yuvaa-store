-- 1. Grant SELECT permission on categories to everyone
GRANT SELECT ON TABLE public.categories TO anon;
GRANT SELECT ON TABLE public.categories TO authenticated;
GRANT SELECT ON TABLE public.categories TO service_role;
GRANT SELECT ON TABLE public.categories TO public;

-- 2. Enable RLS (if not enabled) and add a public read policy
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public categories access" ON public.categories;
CREATE POLICY "Public categories access" ON public.categories FOR SELECT USING (true);

-- 3. Also ensure products is readable (just in case)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.products TO anon;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;
GRANT ALL ON TABLE public.products TO public;
