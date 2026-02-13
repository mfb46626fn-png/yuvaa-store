-- 1. AKILLI TEMİZLİK: Ne olduğuna bakıp ona göre silecek
DO $$
DECLARE
    object_type text;
BEGIN
    SELECT table_type INTO object_type
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users';

    IF object_type = 'VIEW' THEN
        EXECUTE 'DROP VIEW public.users CASCADE';
    ELSIF object_type = 'BASE TABLE' THEN
        EXECUTE 'DROP TABLE public.users CASCADE';
    END IF;
END $$;

-- 2. TABLO OLUŞTURMA
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT
);

-- 3. GÜVENLİK AYARLARI (Kilitleri kaldır)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 4. ERİŞİM İZİNLERİ (Herkese tam yetki)
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role, public;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role, public;

-- 5. YENİLE
NOTIFY pgrst, 'reload config';
