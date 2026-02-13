-- 1. TEMİZLİK: Users ile ilgili her şeyi KÖKÜNDEN sil (Cascade ile bağlı constraintleri de koparır)
DROP VIEW IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. TABLO OLUŞTURMA: Tertemiz bir users tablosu aç
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT
);

-- 3. GÜVENLİK AYARLARI: Tüm kilitleri kaldır
-- Users tablosu için RLS kapat
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- Products tablosu için de RLS kapat (Sorunun buradan kaynaklanmadığına emin olalım)
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

-- 5. Products tablosundaki user_id sorunlarını gider
-- user_id kolonuna varsayılan değer ata
ALTER TABLE public.products 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 6. Şema önbelleğini yenile
NOTIFY pgrst, 'reload config';
