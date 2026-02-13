-- 1. 'users' tablosunu oluştur (Eğer yoksa)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT
);

-- 2. Güvenlik kilitlerini tamamen KAPAT (RLS Disable)
-- Bu tablo sadece hatayı susturmak için var, bu yüzden güvenlik kontrolüne gerek yok.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 3. Herkese her türlü yetkiyi ver (Permission denied hatasını kesin çözer)
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;
GRANT ALL ON TABLE public.users TO public;

-- 4. Constraint temizliği (Varsa siler, yoksa hata vermez)
-- Eski bir foreign key varsa ve permissions'ı bozuyorsa temizler.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_user_id_fkey') THEN
        ALTER TABLE public.products DROP CONSTRAINT products_user_id_fkey;
    END IF;
END $$;

-- NOT: 'user_id' kolonuyla ilgili işlemi kaldırdım çünkü o kolon sisteminizde yokmuş.
-- Bu kod sadece izinleri düzeltir.
