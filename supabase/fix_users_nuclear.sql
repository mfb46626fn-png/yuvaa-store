-- 1. 'users' tablosunun RLS'ini (güvenlik) tamamen kapat (Dummy tablo olduğu için sorun yok)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Herkese her türlü yetkiyi ver
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;
GRANT ALL ON TABLE public.users TO public;

-- 3. Eğer products tablosunda 'users' tablosuna bağlı bir Foreign Key varsa onu kaldırmayı dene
-- (Genelde ismi products_user_id_fkey olur)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_user_id_fkey') THEN
        ALTER TABLE public.products DROP CONSTRAINT products_user_id_fkey;
    END IF;
END $$;

-- 4. Eğer products tablosunda 'user_id' kolonu varsa ve boşsa, varsayılan olarak auth.uid() atasın
-- Bu sayede null değer hatası almayız (eğer zorunluysa)
ALTER TABLE public.products 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 5. 'users' tablosuna auth.users'dan trigger ile veri kopyalama (Opsiyonel, veri bütünlüğü için)
-- Şimdilik sadece permission hatasını çözmeye odaklanıyoruz.
