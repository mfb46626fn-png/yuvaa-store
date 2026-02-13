-- 1. Temizlik: 'users' adında ne varsa (tablo veya view) sil
DROP VIEW IF EXISTS public.users;
DROP TABLE IF EXISTS public.users;

-- 2. Gerçek bir tablo olarak oluştur (View değil)
-- Bu sayede Trigger veya Foreign Key bağımlılıkları varsa karşılar
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. RLS (Güvenlik) iznini aç (Bu sefer çalışacak çünkü bu bir tablo)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Herkese okuma izni ver (Hata almamak için)
CREATE POLICY "Public users access" ON public.users FOR SELECT USING (true);

-- 5. Oturumlu kullanıcılara tam yetki ver (Bu tabloyu rahatça kullanabilsinler)
CREATE POLICY "Auth users access" ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Veritabanı seviyesinde yetkileri tanımla
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;
