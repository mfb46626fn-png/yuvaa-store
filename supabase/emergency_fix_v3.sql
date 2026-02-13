-- 1. AKILLI TEMİZLİK: 'users' ne ise (Tablo mu View mi?) ona göre sil
DO $$
DECLARE
    object_type text;
BEGIN
    -- users nesnesinin ne olduğunu bul (table, view, vb.)
    SELECT table_type INTO object_type
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users';

    -- Duruma göre silme komutunu çalıştır
    IF object_type = 'VIEW' THEN
        EXECUTE 'DROP VIEW public.users CASCADE';
    ELSIF object_type = 'BASE TABLE' THEN
        EXECUTE 'DROP TABLE public.users CASCADE';
    END IF;
END $$;

-- 2. TABLO OLUŞTURMA: Tertemiz bir users tablosu aç
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT
);

-- 3. GÜVENLİK AYARLARI: Tüm kilitleri kaldır
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 4. ERİŞİM İZİNLERİ: Herkese tam yetki saç
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;
GRANT ALL ON TABLE public.users TO public;

GRANT ALL ON TABLE public.products TO anon;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;
GRANT ALL ON TABLE public.products TO public;

-- 5. user_id varsayılan değer
ALTER TABLE public.products 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 6. Yenile
NOTIFY pgrst, 'reload config';
